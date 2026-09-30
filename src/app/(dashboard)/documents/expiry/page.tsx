import React from "react";
import { prisma } from "@/lib/prisma";
import { ExpiryWatchlistClient } from "./ExpiryWatchlistClient";

export const dynamic = "force-dynamic";

export default async function DocumentExpiryPage() {
  let initialDocs: any[] = [];
  let categories: string[] = [];

  try {
    const rawDocs = await prisma.workerDocument.findMany({
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

    initialDocs = rawDocs.map((doc) => {
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
        issueDate: doc.issueDate ? doc.issueDate.toISOString() : null,
        expiryDate: doc.expiryDate ? doc.expiryDate.toISOString() : null,
        daysRemaining,
        expiryStatus,
        verificationStatus: doc.verificationStatus,
        companyName: activeAssignment?.company?.name || "Internal",
        projectName: activeAssignment?.project?.name || "-",
        siteName: activeAssignment?.site?.name || "-",
        position: activeAssignment?.position || "-",
        fileUrl: doc.versions[0]?.fileUrl || null,
        fileName: doc.versions[0]?.fileName || null,
      };
    });

    const uniqueCategories = Array.from(
      new Set(rawDocs.map((d) => d.documentType.category))
    );
    categories = uniqueCategories;
  } catch (err) {
    console.error("Error loading document expiry data:", err);
  }

  return <ExpiryWatchlistClient initialDocs={initialDocs} categories={categories} />;
}
