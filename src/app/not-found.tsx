import React from "react";
import Link from "next/link";

export default function RootNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-8 bg-slate-50">
      <div className="text-8xl font-bold text-slate-200 mb-4">404</div>
      <h1 className="text-xl font-bold text-slate-900 mb-2">Halaman Tidak Ditemukan</h1>
      <p className="text-sm text-slate-500 mb-6">URL yang Anda akses tidak tersedia.</p>
      <Link href="/" className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium transition">
        Ke Dashboard
      </Link>
    </div>
  );
}
