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

  try {
    companies = await prisma.company.findMany();
    projects = await prisma.project.findMany();
    sites = await prisma.site.findMany();
    const workers = await prisma.worker.findMany({ select: { nik: true } });
    existingNiks = workers.map((w) => w.nik);
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
      />
    </div>
  );
}
