"use client";
import React from "react";
import { AlertTriangle } from "lucide-react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body className="antialiased bg-slate-50">
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
          <div className="w-20 h-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Terjadi Kesalahan Sistem</h1>
          <p className="text-sm text-slate-500 max-w-md mb-6">{error.message}</p>
          <button onClick={reset} className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium transition">
            Muat Ulang
          </button>
        </div>
      </body>
    </html>
  );
}
