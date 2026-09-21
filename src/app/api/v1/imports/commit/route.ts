import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit";
import { calculateWorkerReadiness } from "@/lib/readiness-engine";

export async function POST(req: NextRequest) {
  try {
    const { projectId, siteId, companyId, workers } = await req.json();

    if (!projectId || !siteId || !companyId || !Array.isArray(workers)) {
      return NextResponse.json({ error: "Invalid payload parameters" }, { status: 400 });
    }

    let importedCount = 0;

    for (const w of workers) {
      const employeeNo = `EMP-${Date.now().toString().slice(-4)}-${Math.floor(100 + Math.random() * 900)}`;

      // 1. Create or connect Worker
      const createdWorker = await prisma.worker.create({
        data: {
          employeeNo,
          fullName: w.fullName,
          nik: w.nik,
          birthDate: new Date(w.birthDate),
          gender: w.gender || "MALE",
          contactNumber: w.contactNumber || "0812000000",
          status: "ACTIVE",
          overallReadinessScore: 0.0,
        },
      });

      // 2. Create Assignment
      const assignment = await prisma.workerAssignment.create({
        data: {
          workerId: createdWorker.id,
          projectId,
          siteId,
          companyId,
          position: w.position,
          discipline: w.discipline || "MECHANICAL",
          trade: w.trade || null,
          startDate: new Date(),
          status: "PRE_MOBILIZATION",
        },
      });

      // 3. Compute Initial Readiness
      try {
        await calculateWorkerReadiness(assignment.id);
      } catch (err) {
        // Continue even if calculation needs docs
      }

      importedCount++;
    }

    // 4. Log Audit Event
    await logAuditEvent({
      action: "BULK_IMPORT_WORKERS",
      entityType: "WORKER",
      entityId: `BATCH-${Date.now()}`,
      payloadAfter: { importedCount, projectId, siteId, companyId },
    });

    return NextResponse.json({ success: true, importedCount });
  } catch (error: any) {
    console.error("Bulk import commit error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
