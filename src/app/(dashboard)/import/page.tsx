import React from "react";
import { prisma } from "@/lib/prisma";
import { BulkImportClient } from "./BulkImportClient";
import { FileSpreadsheet, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BulkImportPage() {
  let companies: any[] = [];
  let projects: any[] = [];
  let sites: any[] = [];
  let existingNiks: string[] = [];
  let existingWorkers: any[] = [];

  try {
    companies = await prisma.company.findMany();
    projects = await prisma.project.findMany();
    sites = await prisma.site.findMany();
    const workers = await prisma.worker.findMany({
      select: {
        nik: true,
        fullName: true,
        status: true,
        assignments: {
          include: { company: true, project: true, site: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });
    existingNiks = workers.map((w) => w.nik);
    existingWorkers = workers.map((w) => ({
      nik: w.nik,
      fullName: w.fullName,
      status: w.status,
      currentAssignment: w.assignments[0]
        ? {
            companyName: w.assignments[0].company.name,
            projectName: w.assignments[0].project.name,
            siteName: w.assignments[0].site.name,
            position: w.assignments[0].position,
          }
        : null,
    }));
  } catch (e) {
    // Database initializing
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/workers"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Worker Master Directory
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-brand-600" />
            Bulk Worker Onboarding Wizard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Unggah data massal pekerja dari spreadsheet dengan validasi otomatis dan deteksi duplikasi NIK sebelum commit.
          </p>
        </div>
      </div>

      <BulkImportClient
        companies={companies}
        projects={projects}
        sites={sites}
        existingNiks={existingNiks}
        existingWorkers={existingWorkers}
      />
    </div>
  );
}
