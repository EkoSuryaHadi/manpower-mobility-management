import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";
import { serverErrorResponse, successResponse } from "@/lib/api-utils";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req, ["MONITOR_DOCUMENT_EXPIRY"]);
    if (auth.error) return auth.error;
    const actor = auth.user;

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "ALL"; // ALL, EXPIRED, URGENT, WARNING, SAFE
    const category = searchParams.get("category") || "ALL"; // IDENTITY, MEDICAL, HSE, COMPETENCY, LEGAL, INSURANCE
    let companyId = searchParams.get("companyId") || "ALL";

    // Subcontractors are strictly scoped to their own company
    if (actor.role === "SUBCONTRACTOR" && actor.companyId) {
      companyId = actor.companyId;
    }

    const whereAssignment: any = {
      status: {
        in: ["PLANNED", "PRE_MOBILIZATION", "READY_TO_MOBILIZE", "MOBILIZED", "ON_SITE"],
      },
    };

    if (companyId !== "ALL") {
      whereAssignment.companyId = companyId;
    }

    const documents = await prisma.workerDocument.findMany({
      where: {
        worker: {
          assignments: {
            some: whereAssignment,
          },
        },
      },
      include: {
        worker: {
          select: {
            id: true,
            fullName: true,
            nik: true,
            employeeNo: true,
            status: true,
            assignments: {
              where: whereAssignment,
              take: 1,
              include: {
                company: true,
                project: true,
                site: true,
              },
            },
          },
        },
        documentType: true,
        verifier: {
          select: {
            id: true,
            fullName: true,
            role: true,
          },
        },
        versions: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: [
        { expiryDate: "asc" },
        { createdAt: "desc" },
      ],
    });

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const formattedDocs = documents.map((doc) => {
      let daysRemaining: number | null = null;
      let expiryStatus = "NO_EXPIRY";

      if (doc.expiryDate) {
        const exp = new Date(doc.expiryDate);
        exp.setHours(0, 0, 0, 0);
        const diffTime = exp.getTime() - now.getTime();
        daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (daysRemaining < 0) {
          expiryStatus = "EXPIRED";
        } else if (daysRemaining <= 30) {
          expiryStatus = "URGENT";
        } else if (daysRemaining <= 60) {
          expiryStatus = "WARNING";
        } else {
          expiryStatus = "SAFE";
        }
      }

      const activeAssignment = doc.worker.assignments[0] || null;

      return {
        id: doc.id,
        workerId: doc.worker.id,
        workerName: doc.worker.fullName,
        nik: doc.worker.nik,
        employeeNo: doc.worker.employeeNo,
        documentType: doc.documentType.name,
        documentCode: doc.documentType.code,
        documentCategory: doc.documentType.category,
        documentNumber: doc.documentNumber,
        issueDate: doc.issueDate,
        expiryDate: doc.expiryDate,
        daysRemaining,
        expiryStatus,
        verificationStatus: doc.verificationStatus,
        companyName: activeAssignment?.company?.name || "Unassigned",
        projectName: activeAssignment?.project?.name || "-",
        siteName: activeAssignment?.site?.name || "-",
        position: activeAssignment?.position || "-",
        fileUrl: doc.versions[0]?.fileUrl || null,
        fileName: doc.versions[0]?.fileName || null,
      };
    });

    // Filtering
    let results = formattedDocs;

    if (filter === "EXPIRED") {
      results = results.filter((d) => d.expiryStatus === "EXPIRED");
    } else if (filter === "URGENT") {
      results = results.filter((d) => d.expiryStatus === "URGENT");
    } else if (filter === "WARNING") {
      results = results.filter((d) => d.expiryStatus === "WARNING");
    } else if (filter === "EXPIRING_SOON") {
      results = results.filter((d) => d.expiryStatus === "EXPIRED" || d.expiryStatus === "URGENT" || d.expiryStatus === "WARNING");
    } else if (filter === "SAFE") {
      results = results.filter((d) => d.expiryStatus === "SAFE");
    }

    if (category !== "ALL") {
      results = results.filter((d) => d.documentCategory === category);
    }

    // Stats
    const stats = {
      total: formattedDocs.length,
      expired: formattedDocs.filter((d) => d.expiryStatus === "EXPIRED").length,
      urgent: formattedDocs.filter((d) => d.expiryStatus === "URGENT").length,
      warning: formattedDocs.filter((d) => d.expiryStatus === "WARNING").length,
      safe: formattedDocs.filter((d) => d.expiryStatus === "SAFE").length,
      noExpiry: formattedDocs.filter((d) => d.expiryStatus === "NO_EXPIRY").length,
    };

    return NextResponse.json({
      success: true,
      stats,
      data: results,
    });
  } catch (error) {
    return serverErrorResponse("document-expiry", error);
  }
}
