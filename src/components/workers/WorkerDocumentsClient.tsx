"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileCheck,
  AlertTriangle,
  Clock,
  ShieldAlert,
  ExternalLink,
  Plus,
  CheckCircle2,
  FileX2,
  RefreshCw,
} from "lucide-react";
import { StatusChip } from "@/components/ui/StatusChip";
import { UploadWorkerDocumentModal } from "./UploadWorkerDocumentModal";

interface DocumentTypeItem {
  id: string;
  code: string;
  name: string;
  category: string;
  defaultValidityDays?: number | null;
}

interface WorkerDocumentItem {
  id: string;
  documentTypeId: string;
  documentType: {
    id: string;
    code: string;
    name: string;
    category: string;
  };
  documentNumber: string;
  issueDate: string | Date;
  expiryDate?: string | Date | null;
  verificationStatus: string;
  verifierRemarks?: string | null;
}

interface ReadinessChecklistItem {
  requirementId: string;
  requirementName: string;
  documentTypeCode: string;
  documentTypeName: string;
  category: string;
  isMandatory: boolean;
  isBlocking: boolean;
  status: "SATISFIED" | "MISSING" | "EXPIRED" | "EXPIRING_SOON" | "PENDING_REVIEW" | "REJECTED";
  documentId?: string;
  documentNumber?: string;
  expiryDate?: string | Date | null;
  remarks?: string;
}

interface WorkerDocumentsClientProps {
  workerId: string;
  workerName: string;
  documents: WorkerDocumentItem[];
  documentTypes: DocumentTypeItem[];
  readinessChecklist?: ReadinessChecklistItem[];
  readinessScore: number;
}

export function WorkerDocumentsClient({
  workerId,
  workerName,
  documents: initialDocuments,
  documentTypes,
  readinessChecklist = [],
  readinessScore: initialScore,
}: WorkerDocumentsClientProps) {
  const router = useRouter();
  const [documents, setDocuments] = useState<WorkerDocumentItem[]>(initialDocuments);
  const [readinessScore, setReadinessScore] = useState(initialScore);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preselectedTypeId, setPreselectedTypeId] = useState<string | undefined>(undefined);
  const [filterTab, setFilterTab] = useState<"ALL" | "MISSING" | "UPLOADED">("ALL");

  // Determine which document types are already uploaded vs missing
  const uploadedDocTypeIds = new Set(documents.map((d) => d.documentTypeId));

  // Build unified items from checklist and uploaded documents
  const missingItems = readinessChecklist.filter(
    (item) => item.status === "MISSING" || !uploadedDocTypeIds.has(
      documentTypes.find((dt) => dt.code === item.documentTypeCode)?.id || ""
    )
  );

  const pendingCount = documents.filter((d) => d.verificationStatus === "PENDING").length;
  const verifiedCount = documents.filter((d) => d.verificationStatus === "VERIFIED").length;

  const handleOpenUpload = (docTypeId?: string) => {
    setPreselectedTypeId(docTypeId);
    setIsModalOpen(true);
  };

  const handleUploadSuccess = () => {
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {/* Overview Metric Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="text-[11px] font-semibold uppercase text-slate-400">Total Wajib</div>
          <div className="text-xl font-bold text-slate-800 mt-1">
            {readinessChecklist.length > 0 ? readinessChecklist.length : documentTypes.length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Dokumen kepatuhan site</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="text-[11px] font-semibold uppercase text-rose-500 flex items-center gap-1">
            <FileX2 className="w-3.5 h-3.5" />
            Belum Diunggah
          </div>
          <div className="text-xl font-bold text-rose-600 mt-1">
            {missingItems.length}
          </div>
          <div className="text-[10px] text-rose-600/80 mt-0.5">Perlu segera diunggah</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="text-[11px] font-semibold uppercase text-amber-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Menunggu Verifikasi
          </div>
          <div className="text-xl font-bold text-amber-600 mt-1">{pendingCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Dalam antrean HR/HSE</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="text-[11px] font-semibold uppercase text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Terverifikasi
          </div>
          <div className="text-xl font-bold text-emerald-600 mt-1">{verifiedCount}</div>
          <div className="text-[10px] text-emerald-600/80 mt-0.5">Kesiapan: {readinessScore}%</div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Table Header Action Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              Compliance & Mandatory Documents
              {missingItems.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-700">
                  {missingItems.length} Belum Lengkap
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500">
              Daftar kelengkapan sertifikat, MCU, dan berkas legal sesuai persyaratan penugasan site.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Tabs */}
            <div className="flex items-center bg-slate-200/70 p-0.5 rounded-lg text-xs font-medium text-slate-600">
              <button
                onClick={() => setFilterTab("ALL")}
                className={`px-2.5 py-1 rounded-md transition ${
                  filterTab === "ALL" ? "bg-white text-slate-900 shadow-sm font-semibold" : "hover:text-slate-900"
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilterTab("MISSING")}
                className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                  filterTab === "MISSING" ? "bg-white text-rose-700 shadow-sm font-semibold" : "hover:text-slate-900"
                }`}
              >
                Belum Diunggah
                {missingItems.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-bold">
                    {missingItems.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setFilterTab("UPLOADED")}
                className={`px-2.5 py-1 rounded-md transition ${
                  filterTab === "UPLOADED" ? "bg-white text-slate-900 shadow-sm font-semibold" : "hover:text-slate-900"
                }`}
              >
                Sudah Diunggah ({documents.length})
              </button>
            </div>

            <button
              onClick={() => handleOpenUpload()}
              className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-medium transition shadow-sm flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Upload New Document
            </button>
          </div>
        </div>

        {/* Missing Documents Alert Box if filter is ALL or MISSING */}
        {(filterTab === "ALL" || filterTab === "MISSING") && missingItems.length > 0 && (
          <div className="p-3 bg-amber-50/80 border-b border-amber-200/80 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Pekerja ini memiliki <strong>{missingItems.length} dokumen wajib</strong> yang belum diunggah. Lengkapi dokumen untuk mencapai 100% kesiapan mobilisasi.
              </span>
            </div>
          </div>
        )}

        {/* Documents Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Document Type</th>
                <th className="py-3 px-4">Document Number</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Status Kepatuhan</th>
                <th className="py-3 px-4">Remarks</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {/* 1. Missing Items (if filter allows) */}
              {(filterTab === "ALL" || filterTab === "MISSING") &&
                missingItems.map((item) => {
                  const targetDocType = documentTypes.find(
                    (dt) => dt.code === item.documentTypeCode
                  );
                  return (
                    <tr key={`missing-${item.requirementId}`} className="bg-rose-50/30 hover:bg-rose-50/60 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{item.documentTypeName}</span>
                          {item.isBlocking && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-700 border border-rose-200">
                              Blocking
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {item.category} &bull; Kode: {item.documentTypeCode}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-400 italic">Belum ada nomor</td>
                      <td className="py-3 px-4 text-slate-400">-</td>
                      <td className="py-3 px-4 text-slate-400">-</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                          <FileX2 className="w-3 h-3 text-rose-600" />
                          Belum Diunggah
                        </span>
                      </td>
                      <td className="py-3 px-4 text-rose-600 text-[11px] font-medium">
                        {item.remarks || "Wajib dipenuhi sebelum keberangkatan"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenUpload(targetDocType?.id)}
                          className="px-2.5 py-1 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-[11px] font-medium transition shadow-sm inline-flex items-center gap-1"
                        >
                          <UploadCloud className="w-3 h-3" />
                          Unggah Dokumen
                        </button>
                      </td>
                    </tr>
                  );
                })}

              {/* 2. Uploaded Documents (if filter allows) */}
              {(filterTab === "ALL" || filterTab === "UPLOADED") &&
                documents.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{d.documentType.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {d.documentType.category} &bull; {d.documentType.code}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-800 font-medium">
                      {d.documentNumber}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(d.issueDate).toLocaleDateString("id-ID")}
                    </td>
                    <td className="py-3 px-4">
                      {d.expiryDate ? (
                        <span className="font-medium text-slate-800">
                          {new Date(d.expiryDate).toLocaleDateString("id-ID")}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">Permanent / Seumur Hidup</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusChip status={d.verificationStatus} />
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-500 text-[11px]">
                      {d.verifierRemarks || "-"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenUpload(d.documentTypeId)}
                          className="text-[11px] text-slate-600 hover:text-brand-600 font-medium hover:underline inline-flex items-center gap-0.5"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Re-upload
                        </button>
                        <Link
                          href={`/documents?docId=${d.id}`}
                          className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 font-medium text-[11px]"
                        >
                          Verify
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}

              {documents.length === 0 && missingItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                    Tidak ada data dokumen terdaftar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Document Modal */}
      <UploadWorkerDocumentModal
        isOpen={isModalOpen}
        workerId={workerId}
        workerName={workerName}
        documentTypes={documentTypes}
        preselectedDocTypeId={preselectedTypeId}
        onClose={() => {
          setIsModalOpen(false);
          setPreselectedTypeId(undefined);
        }}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
}
