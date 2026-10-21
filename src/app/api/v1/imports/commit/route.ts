import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAuditEvent, getClientIp } from "@/lib/audit";
import { calculateWorkerReadiness } from "@/lib/readiness-engine";
import { requireAuth } from "@/lib/auth-guard";
import { errorResponse, serverErrorResponse } from "@/lib/api-utils";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ["MANAGE_WORKERS", "UPLOAD_DOCUMENTS"]);
    if (auth.error) return auth.error;
    const actor = auth.user;

    const body = await req.json().catch(() => ({}));
    const { projectId, siteId, companyId, workers } = body;

    if (!projectId || !siteId || !companyId || !Array.isArray(workers) || workers.length === 0) {
      return errorResponse("Payload tidak lengkap. Project, Site, Company, dan daftar pekerja wajib diisi.", 400);
    }

    if (workers.length > 500) {
      return errorResponse("Maksimal 500 pekerja per batch import.", 422);
    }

    // Role check: SUBCONTRACTOR can only import workers into their own company
    if (actor.role === "SUBCONTRACTOR" && actor.companyId && actor.companyId !== companyId) {
      return errorResponse("Vendor hanya dapat mengimpor pekerja untuk perusahaannya sendiri.", 403);
    }

    // Verify company, project, site exist
    const [companyExists, projectExists, siteExists] = await Promise.all([
      prisma.company.findUnique({ where: { id: companyId } }),
      prisma.project.findUnique({ where: { id: projectId } }),
      prisma.site.findUnique({ where: { id: siteId } }),
    ]);

    if (!companyExists || !projectExists || !siteExists) {
      return errorResponse("Data Master Company, Project, atau Site tidak valid.", 404);
    }

    let importedCount = 0;
    const errors: { row: number; nik?: string; error: string }[] = [];
    const year = new Date().getFullYear();
    const batchTimestamp = Date.now().toString().slice(-6);

    for (let i = 0; i < workers.length; i++) {
      const w = workers[i];
      const rowNum = i + 1;

      if (!w.fullName || !w.nik || !w.birthDate || !w.position) {
        errors.push({ row: rowNum, nik: w.nik, error: "Nama lengkap, NIK, tanggal lahir, dan posisi wajib diisi." });
        continue;
      }

      const cleanNik = String(w.nik).replace(/\D/g, "");
      if (cleanNik.length !== 16) {
        errors.push({ row: rowNum, nik: w.nik, error: "Format NIK harus 16 digit angka." });
        continue;
      }

      try {
        const seqStr = String(rowNum).padStart(4, "0");
        const employeeNo =
          w.employeeNo?.trim() ||
          `EMP-${year}-${batchTimestamp}-${seqStr}`;

        // Check if existing worker is already active in an assignment
        let workerRecord = await prisma.worker.findUnique({
          where: { nik: cleanNik },
          include: {
            assignments: {
              where: {
                status: {
                  in: ["PLANNED", "PRE_MOBILIZATION", "READY_TO_MOBILIZE", "MOBILIZED", "ON_SITE"],
                },
              },
              include: { project: true, site: true },
              take: 1,
            },
          },
        });

        if (workerRecord && workerRecord.status === "ACTIVE" && workerRecord.assignments.length > 0) {
          const cur = workerRecord.assignments[0];
          errors.push({
            row: rowNum,
            nik: cleanNik,
            error: `Pekerja (${workerRecord.fullName}) masih aktif bekerja di Proyek ${cur.project.name} (${cur.site.name}).`,
          });
          continue;
        }

        let workerId: string;
        if (!workerRecord) {
          const newWorker = await prisma.worker.create({
            data: {
              employeeNo,
              fullName: String(w.fullName).trim(),
              nik: cleanNik,
              birthDate: new Date(w.birthDate),
              gender: w.gender === "FEMALE" ? "FEMALE" : "MALE",
              contactNumber: w.contactNumber ? String(w.contactNumber).trim() : "0812000000",
              status: "ACTIVE",
              overallReadinessScore: 0.0,
            },
          });
          workerId = newWorker.id;
        } else {
          workerId = workerRecord.id;
        }

        // Create Assignment
        const assignment = await prisma.workerAssignment.create({
          data: {
            workerId,
            projectId,
            siteId,
            companyId,
            position: String(w.position).trim(),
            discipline: w.discipline ? String(w.discipline).trim() : "MECHANICAL",
            trade: w.trade ? String(w.trade).trim() : null,
            startDate: new Date(),
            status: "PRE_MOBILIZATION",
          },
        });

        // Compute Initial Readiness
        try {
          await calculateWorkerReadiness(assignment.id);
        } catch {
          // ignore calculation warning during raw import
        }

        importedCount++;
      } catch (err: any) {
        errors.push({ row: rowNum, nik: cleanNik, error: err.message || "Gagal menyimpan data baris." });
      }
    }

    // Audit log with real actor
    await logAuditEvent({
      actorId: actor.id,
      actorName: actor.fullName,
      action: "BULK_IMPORT_WORKERS",
      entityType: "WORKER",
      entityId: `BATCH-${Date.now()}`,
      payloadAfter: { importedCount, errorCount: errors.length, projectId, siteId, companyId },
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({
      success: true,
      importedCount,
      totalSubmitted: workers.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    return serverErrorResponse("bulk-import-commit", error);
  }
}
