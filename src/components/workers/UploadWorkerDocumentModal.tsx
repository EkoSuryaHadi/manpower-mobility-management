"use client";

import React, { useState } from "react";
import {
  X,
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle2,
  Calendar,
  FileCheck,
  ShieldAlert,
} from "lucide-react";

interface DocumentTypeItem {
  id: string;
  code: string;
  name: string;
  category: string;
  defaultValidityDays?: number | null;
}

interface UploadWorkerDocumentModalProps {
  isOpen: boolean;
  workerId: string;
  workerName: string;
  documentTypes: DocumentTypeItem[];
  preselectedDocTypeId?: string;
  onClose: () => void;
  onSuccess: (updatedData: any) => void;
}

export function UploadWorkerDocumentModal({
  isOpen,
  workerId,
  workerName,
  documentTypes,
  preselectedDocTypeId,
  onClose,
  onSuccess,
}: UploadWorkerDocumentModalProps) {
  const [selectedTypeId, setSelectedTypeId] = useState(
    preselectedDocTypeId || documentTypes[0]?.id || ""
  );
  const [documentNumber, setDocumentNumber] = useState("");
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isPermanent, setIsPermanent] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Update selected type if preselected changes
  React.useEffect(() => {
    const typeId = preselectedDocTypeId || (documentTypes.length > 0 ? documentTypes[0].id : "");
    if (typeId) {
      setSelectedTypeId(typeId);
      const dt = documentTypes.find((item) => item.id === typeId);
      if (dt?.code === "DOC-ID-KTP") {
        setIsPermanent(true);
      }
    }
  }, [preselectedDocTypeId, documentTypes]);

  if (!isOpen) return null;

  const currentDocType = documentTypes.find((dt) => dt.id === selectedTypeId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(file.size);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (!selectedTypeId) {
      setErrorMsg("Pilih tipe dokumen terlebih dahulu.");
      setLoading(false);
      return;
    }

    if (!documentNumber.trim()) {
      setErrorMsg("Nomor dokumen wajib diisi.");
      setLoading(false);
      return;
    }

    if (!isPermanent && !expiryDate) {
      setErrorMsg("Tanggal kedaluwarsa wajib diisi, atau centang dokumen berlaku seumur hidup.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        documentTypeId: selectedTypeId,
        documentNumber: documentNumber.trim(),
        issueDate,
        expiryDate: isPermanent ? null : expiryDate || null,
        fileName: fileName || `${currentDocType?.code.toLowerCase() || "doc"}_scan.pdf`,
        fileUrl: `/uploads/${fileName || "scan.pdf"}`,
        fileSize: fileSize || 240000,
        mimeType: fileName.endsWith(".png")
          ? "image/png"
          : fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")
          ? "image/jpeg"
          : "application/pdf",
      };

      const res = await fetch(`/api/v1/workers/${workerId}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || "Gagal mengunggah berkas dokumen");
      }

      setSuccessMsg("Dokumen berhasil diunggah! Status: PENDING (Menunggu verifikasi).");
      setTimeout(() => {
        onSuccess(json.data);
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat mengunggah dokumen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full my-8 overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Unggah Dokumen Kepatuhan</h2>
              <p className="text-[11px] text-slate-500">
                Pekerja: <strong className="text-slate-800">{workerName}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          {/* Document Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Jenis Dokumen / Sertifikat *
            </label>
            <select
              required
              value={selectedTypeId}
              onChange={(e) => {
                setSelectedTypeId(e.target.value);
                const dt = documentTypes.find((item) => item.id === e.target.value);
                if (dt?.code === "DOC-ID-KTP") {
                  setIsPermanent(true);
                }
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-medium"
            >
              {documentTypes.map((dt) => (
                <option key={dt.id} value={dt.id}>
                  [{dt.category}] {dt.name} ({dt.code})
                </option>
              ))}
            </select>
          </div>

          {/* Document Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nomor Dokumen / Sertifikat / Lisensi *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 6472012345670001 atau NO-WELD-2026-88"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          {/* Issue & Expiry Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal Terbit *
              </label>
              <input
                type="date"
                required
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal Kedaluwarsa
              </label>
              <input
                type="date"
                disabled={isPermanent}
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-40 disabled:bg-slate-100"
              />
            </div>
          </div>

          {/* Permanent Checkbox */}
          <div className="flex items-center gap-2 pt-0.5">
            <input
              type="checkbox"
              id="permanentDoc"
              checked={isPermanent}
              onChange={(e) => {
                setIsPermanent(e.target.checked);
                if (e.target.checked) setExpiryDate("");
              }}
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-3.5 h-3.5 cursor-pointer"
            />
            <label htmlFor="permanentDoc" className="text-xs text-slate-600 cursor-pointer select-none">
              Dokumen ini berlaku permanen / seumur hidup (tanpa tanggal kedaluwarsa)
            </label>
          </div>

          {/* File Upload Zone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Berkas Scan / Dokumen Pendukung (PDF, JPG, PNG)
            </label>
            <div className="mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-slate-200 border-dashed rounded-xl bg-slate-50/50 hover:bg-slate-50 transition">
              <div className="space-y-1 text-center">
                <FileText className="mx-auto h-8 w-8 text-slate-400" />
                <div className="flex text-xs text-slate-600 justify-center">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-semibold text-brand-600 hover:text-brand-500 focus-within:outline-none"
                  >
                    <span>Pilih Berkas</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">atau drag & drop berkas ke sini</p>
                </div>
                <p className="text-[10px] text-slate-400">PDF, JPG, PNG sampai dengan 10MB</p>
                {fileName && (
                  <div className="mt-2 text-xs font-semibold text-emerald-600 bg-emerald-50 py-1 px-2 rounded-md inline-flex items-center gap-1.5 border border-emerald-200">
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>{fileName} ({(fileSize / 1024).toFixed(1)} KB)</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Batal
            </button>
            <button
              type="submit"
              id="btn-submit-upload-doc"
              disabled={loading}
              className="px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-medium hover:bg-brand-500 transition shadow-sm disabled:opacity-50 flex items-center gap-1.5"
            >
              {loading ? "Mengunggah Dokumen..." : "Simpan & Unggah Dokumen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
