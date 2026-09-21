"use client";

import React, { useState } from "react";
import { Send, AlertCircle, RefreshCw, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface PreMobilizationActionClientProps {
  assignmentId: string;
  isBlocked: boolean;
  workerName: string;
}

export function PreMobilizationActionClient({
  assignmentId,
  isBlocked,
  workerName,
}: PreMobilizationActionClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isBlocked) {
      alert("Pekerja berstatus BLOCKED karena dokumen blocking belum terpenuhi. Tidak dapat diajukan ke approval.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/pre-mobilizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengajukan mobilisasi");

      alert(`Permohonan mobilisasi ${data.requestNo} untuk ${workerName} berhasil diajukan ke Contractor HR!`);
      router.push("/approvals");
      router.refresh();
    } catch (e: any) {
      alert(`Terjadi kesalahan: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="text-xs text-slate-500">
        {isBlocked ? (
          <span className="text-rose-600 font-semibold flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            Pengajuan diblokir sampai seluruh dokumen mandatory & blocking diverifikasi.
          </span>
        ) : (
          <span className="text-emerald-700 font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Seluruh persyaratan terpenuhi. Siap diajukan ke Contractor HR Review.
          </span>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isBlocked || isSubmitting}
        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-900/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Mengirim Permohonan...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Submit Mobilization Request to Contractor HR
          </>
        )}
      </button>
    </div>
  );
}
