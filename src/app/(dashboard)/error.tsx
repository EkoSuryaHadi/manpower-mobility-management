"use client";
import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h2 className="text-lg font-bold text-slate-900 mb-2">Terjadi Kesalahan</h2>
      <p className="text-sm text-slate-500 max-w-md mb-6">
        {error.message || "Terjadi kesalahan yang tidak terduga. Silakan coba lagi."}
      </p>
      <button
        onClick={reset}
        className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm font-medium shadow-sm transition"
      >
        <RotateCcw className="w-4 h-4" />
        Coba Lagi
      </button>
      {error.digest && (
        <p className="text-[10px] text-slate-300 mt-4 font-mono">Error ID: {error.digest}</p>
      )}
    </div>
  );
}
