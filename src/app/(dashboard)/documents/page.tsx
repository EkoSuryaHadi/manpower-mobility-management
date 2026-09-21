import React from "react";
import { prisma } from "@/lib/prisma";
import { StatusChip } from "@/components/ui/StatusChip";
import {
  FileCheck,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
} from "lucide-react";
import { SplitScreenVerificationClient } from "./SplitScreenVerificationClient";

export const dynamic = "force-dynamic";

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: { status?: string; category?: string; docId?: string };
}) {
  let documents: any[] = [];
  let pendingCount = 0;
  let verifiedCount = 0;
  let rejectedCount = 0;
  let expiredCount = 0;

  try {
    documents = await prisma.workerDocument.findMany({
      include: {
        worker: true,
        documentType: true,
        versions: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    pendingCount = await prisma.workerDocument.count({ where: { verificationStatus: "PENDING" } });
    verifiedCount = await prisma.workerDocument.count({ where: { verificationStatus: "VERIFIED" } });
    rejectedCount = await prisma.workerDocument.count({ where: { verificationStatus: "REJECTED" } });
    expiredCount = await prisma.workerDocument.count({ where: { verificationStatus: "EXPIRED" } });
  } catch (e) {
    // Database initializing
  }

  // Filter if status requested
  const filteredDocs = searchParams.status
    ? documents.filter((d) => d.verificationStatus === searchParams.status)
    : documents;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-brand-600" />
            Document Verification Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pusat audit dan verifikasi berkas kepatuhan pekerja (HR, HSE, Medis, & Sertifikasi) dengan Split-Screen Viewer.
          </p>
        </div>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Pending Review</div>
            <div className="text-lg font-bold text-slate-900">{pendingCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Verified & Active</div>
            <div className="text-lg font-bold text-emerald-700">{verifiedCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <XCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Rejected / Revision</div>
            <div className="text-lg font-bold text-rose-700">{rejectedCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Expired Documents</div>
            <div className="text-lg font-bold text-amber-700">{expiredCount}</div>
          </div>
        </div>
      </div>

      {/* Split-Screen Verification Component */}
      <SplitScreenVerificationClient
        documents={filteredDocs}
        initialSelectedDocId={searchParams.docId}
      />
    </div>
  );
}
