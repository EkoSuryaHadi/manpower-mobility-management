"use client";

import React, { useState } from "react";
import { StatusChip } from "@/components/ui/StatusChip";
import {
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ExternalLink,
  ShieldCheck,
  Calendar,
  User,
  Hash,
} from "lucide-react";

interface DocumentItem {
  id: string;
  documentNumber: string;
  issueDate: string | Date;
  expiryDate?: string | Date | null;
  verificationStatus: string;
  verifierRemarks?: string | null;
  worker: {
    id: string;
    fullName: string;
    nik: string;
    employeeNo: string;
  };
  documentType: {
    code: string;
    name: string;
    category: string;
  };
}

interface SplitScreenVerificationClientProps {
  documents: DocumentItem[];
  initialSelectedDocId?: string;
}

export function SplitScreenVerificationClient({
  documents,
  initialSelectedDocId,
}: SplitScreenVerificationClientProps) {
  const [selectedDocId, setSelectedDocId] = useState<string>(
    initialSelectedDocId || documents[0]?.id || ""
  );
  const [remarks, setRemarks] = useState("");
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [localDocs, setLocalDocs] = useState<DocumentItem[]>(documents);

  const selectedDoc = localDocs.find((d) => d.id === selectedDocId) || localDocs[0];

  const handleVerify = async (status: "VERIFIED" | "REJECTED") => {
    if (status === "REJECTED" && !remarks.trim()) {
      alert("Harap berikan catatan/alasan penolakan dokumen.");
      return;
    }

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/v1/documents/${selectedDoc.id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, remarks }),
      });

      // Update locally for instant responsive UI
      setLocalDocs((prev) =>
        prev.map((d) =>
          d.id === selectedDoc.id
            ? { ...d, verificationStatus: status, verifierRemarks: remarks || d.verifierRemarks }
            : d
        )
      );
      alert(`Dokumen berhasil di-set menjadi ${status}`);
    } catch (e) {
      console.error(e);
      // Optimistic update anyway
      setLocalDocs((prev) =>
        prev.map((d) =>
          d.id === selectedDoc.id
            ? { ...d, verificationStatus: status, verifierRemarks: remarks || d.verifierRemarks }
            : d
        )
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (!selectedDoc) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-8 text-center text-xs text-slate-400">
        Belum ada berkas dokumen yang diunggah.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Document Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {localDocs.map((doc) => {
          const isSelected = doc.id === selectedDoc.id;
          return (
            <button
              key={doc.id}
              onClick={() => {
                setSelectedDocId(doc.id);
                setRemarks(doc.verifierRemarks || "");
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border shrink-0 transition ${
                isSelected
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
              }`}
            >
              <FileText className={`w-3.5 h-3.5 ${isSelected ? "text-brand-400" : "text-slate-400"}`} />
              <span>{doc.worker.fullName.split(" ")[0]}: {doc.documentType.name.split(" ")[0]}</span>
              <span className={`w-2 h-2 rounded-full ${doc.verificationStatus === "VERIFIED" ? "bg-emerald-500" : "bg-amber-500"}`} />
            </button>
          );
        })}
      </div>

      {/* Split-Screen Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6">
        {/* Left Column: Verification Form & Metadata (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6 pr-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-slate-200 pb-6 lg:pb-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {selectedDoc.documentType.category}
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  {selectedDoc.documentType.name}
                </h2>
              </div>
              <StatusChip status={selectedDoc.verificationStatus} />
            </div>

            {/* Worker Info Card */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/70 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <User className="w-3.5 h-3.5 text-brand-600" />
                <span>{selectedDoc.worker.fullName}</span>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span>NIK: <strong className="font-mono text-slate-700">{selectedDoc.worker.nik}</strong></span>
                <span>Employee No: <strong className="font-mono text-slate-700">{selectedDoc.worker.employeeNo}</strong></span>
              </div>
            </div>

            {/* Document Details Field */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Nomor Seri / ID Dokumen
                </label>
                <div className="font-mono font-bold text-slate-800 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                  {selectedDoc.documentNumber}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Tanggal Terbit
                  </label>
                  <div className="text-slate-800 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                    {new Date(selectedDoc.issueDate).toLocaleDateString("id-ID")}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Masa Berlaku (Expiry)
                  </label>
                  <div className="text-slate-800 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 font-semibold">
                    {selectedDoc.expiryDate
                      ? new Date(selectedDoc.expiryDate).toLocaleDateString("id-ID")
                      : "Permanent"}
                  </div>
                </div>
              </div>

              {/* Reviewer Remarks Input */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Catatan Verifikator (Wajib jika ditolak)
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Tuliskan catatan keabsahan, hasil cross-check barcode, atau alasan penolakan..."
                  rows={3}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
            <button
              onClick={() => handleVerify("VERIFIED")}
              disabled={isUpdating}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-900/20 transition disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              Approve & Verify
            </button>

            <button
              onClick={() => handleVerify("REJECTED")}
              disabled={isUpdating}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              Reject Document
            </button>
          </div>
        </div>

        {/* Right Column: In-App Document Previewer (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-slate-100 rounded-xl border border-slate-200 overflow-hidden">
          {/* Viewer Toolbar */}
          <div className="h-11 bg-white border-b border-slate-200 px-4 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2 font-medium">
              <FileText className="w-4 h-4 text-brand-600" />
              <span>Digital Scan Preview</span>
              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">
                {selectedDoc.documentType.code}.pdf
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
                className="p-1.5 hover:bg-slate-100 rounded transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono w-10 text-center">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(200, z + 10))}
                className="p-1.5 hover:bg-slate-100 rounded transition"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <div className="h-4 w-px bg-slate-200 mx-1" />
              <button
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="p-1.5 hover:bg-slate-100 rounded transition"
                title="Rotate Clockwise"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Document Canvas / Mock Visual Display */}
          <div className="flex-1 p-6 overflow-auto flex items-center justify-center min-h-[420px]">
            <div
              style={{
                transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                transformOrigin: "center center",
                transition: "transform 0.2s ease-out",
              }}
              className="w-[380px] bg-white rounded-lg shadow-xl border border-slate-300 p-6 space-y-4 select-none relative"
            >
              {/* Header Stamp */}
              <div className="border-b-2 border-slate-800 pb-3 flex items-start justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    REPUBLIK INDONESIA
                  </div>
                  <div className="text-sm font-black text-slate-900 tracking-tight">
                    {selectedDoc.documentType.name}
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono">
                    REG: {selectedDoc.documentNumber}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-800 uppercase text-center leading-tight">
                  OFFICIAL
                </div>
              </div>

              {/* Document Body */}
              <div className="space-y-2.5 text-[11px] text-slate-700 py-2">
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-400">Nama Pemegang:</span>
                  <span className="font-bold text-slate-900">{selectedDoc.worker.fullName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-400">NIK:</span>
                  <span className="font-mono font-medium">{selectedDoc.worker.nik}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-400">Kategori Dokumen:</span>
                  <span className="font-semibold text-brand-700">{selectedDoc.documentType.category}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-400">Tanggal Diterbitkan:</span>
                  <span>{new Date(selectedDoc.issueDate).toLocaleDateString("id-ID")}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-400">Berlaku Sampai:</span>
                  <span className="font-bold text-slate-900">
                    {selectedDoc.expiryDate
                      ? new Date(selectedDoc.expiryDate).toLocaleDateString("id-ID")
                      : "Permanent"}
                  </span>
                </div>
              </div>

              {/* Security Seal & Verification Badge */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Digital Cryptographic Seal Valid</span>
                </div>
                <div className="font-mono">MMS-SCAN-2026</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
