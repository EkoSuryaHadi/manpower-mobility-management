import React from "react";
import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function DashboardNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h2 className="text-lg font-bold text-slate-900 mb-2">Halaman Tidak Ditemukan</h2>
      <p className="text-sm text-slate-500 max-w-md mb-6">
        Halaman yang Anda cari tidak ditemukan atau telah dipindahkan.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm font-medium shadow-sm transition"
      >
        Kembali ke Dashboard
      </Link>
    </div>
  );
}
