import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "ALL"; // ALL, EXPIRED, URGENT, WARNING, SAFE
    const category = searchParams.get("category") || "ALL"; // IDENTITY, MEDICAL, HSE, COMPETENCY, LEGAL, INSURANCE
    const companyId = searchParams.get("companyId") || "ALL";

    const documents = await prisma.workerDocument.findMany({
      include: {
        worker: {
          select: {
            id: true,
            fullName: true,
            nik: true,
            employeeNo: true,
            status: true,
            assignments: {
              where: {
                status: {
                  in: ["PLANNED", "PRE_MOBILIZATION", "READY_TO_MOBILIZE", "MOBILIZED", "ON_SITE"],
                },
              },
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
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch document expiry list" },
      { status: 500 }
    );
  }
}
