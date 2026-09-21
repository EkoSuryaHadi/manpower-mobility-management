import React from "react";
import { prisma } from "@/lib/prisma";
import { BarChart3, FileSpreadsheet, Download, Filter } from "lucide-react";
import { ReportsClient } from "./ReportsClient";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  let workers: any[] = [];
  let assignments: any[] = [];
  let auditLogs: any[] = [];

  try {
    workers = await prisma.worker.findMany({
      include: {
        assignments: {
          include: { project: true, site: true, company: true },
          take: 1,
        },
        documents: {
          include: { documentType: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    assignments = await prisma.workerAssignment.findMany({
      include: {
        worker: true,
        project: true,
        site: true,
        company: true,
      },
      orderBy: { createdAt: "desc" },
    });

    auditLogs = await prisma.auditLog.findMany({
      orderBy: { timestamp: "desc" },
      take: 20,
    });
  } catch (e) {
    // Database initializing
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-600" />
            Operational Reports & Export Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Laporan operasional tenaga kerja, audit kepatuhan dokumen, riwayat mobilisasi, dan ekspor spreadsheet (Excel/CSV).
          </p>
        </div>
      </div>

      <ReportsClient
        workers={workers}
        assignments={assignments}
        auditLogs={auditLogs}
      />
    </div>
  );
}
