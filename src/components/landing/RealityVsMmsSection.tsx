"use client";

import React from "react";
import { AlertTriangle, CheckCircle, Flame, ShieldCheck, XCircle } from "lucide-react";

export function RealityVsMmsSection() {
  const comparisons = [
    {
      title: "Skrining Kelayakan Kru (Pre-Mob)",
      excelTitle: "Cara Lama (Excel & WA)",
      excelDesc:
        "Foto sertifikat dikirim miring di grup WhatsApp. Tim HSE memeriksa satu per satu di spreadsheet raksasa. Kru terbang ke Sorong, lalu ditolak di helipad karena masa berlaku MCU kurang 2 hari.",
      mmsTitle: "Standar MMS Enterprise",
      mmsDesc:
        "Sistem Zero-Tolerance Readiness Engine langsung memblokir tombol pengajuan jika ada 1 dokumen blocking yang expired. Tidak ada kru yang bisa diberangkatkan tanpa persetujuan sah.",
      badge: "Insiden Tiket & Standby",
    },
    {
      title: "Inspeksi K3 & Audit SKK Migas",
      excelTitle: "Cara Lama (Excel & WA)",
      excelDesc:
        "Saat auditor Ditjen Migas atau Kemenaker datang inspeksi mendadak, staf kelabakan mencari arsip fisik SIO Crane di kontainer kantor site. Jika kedaluwarsa, terancam Stop Work Order.",
      mmsTitle: "Standar MMS Enterprise",
      mmsDesc:
        "Watchlist otomatis mendeteksi dokumen yang mendekati expired sejak H-60 dan H-30. Notifikasi otomatis memaksa vendor memperpanjang berkas sebelum masuk masa tenggang bahaya.",
      badge: "Kepatuhan Hukum",
    },
    {
      title: "Kontrol Kuota Tenaga Kerja Lokal",
      excelTitle: "Cara Lama (Excel & WA)",
      excelDesc:
        "Vendor nakal merekrut tenaga kerja luar daerah dengan meminjam KTP warga desa setempat. Memicu demo warga lingkar tambang/migas dan penutupan gerbang operasional site.",
      mmsTitle: "Standar MMS Enterprise",
      mmsDesc:
        "Validasi NIK Dukcapil terintegrasi dengan klasifikasi demografi Ring 1 (Desa Terdekat), Ring 2 (Kecamatan), Ring 3 (Kabupaten). Kuota kuota minimum terpantau real-time per subcon.",
      badge: "Stabilitas Sosial Proyek",
    },
    {
      title: "Pencegahan Duplikasi Pekerja",
      excelTitle: "Cara Lama (Excel & WA)",
      excelDesc:
        "Satu rigger atau scaffolder terdaftar di dua vendor subkontraktor berbeda secara bersamaan karena tidak ada database lintas kontraktor utama.",
      mmsTitle: "Standar MMS Enterprise",
      mmsDesc:
        "Master Manpower terpusat berbasis NIK 16-digit. Sistem secara otomatis menolak pendaftaran pekerja jika masih memiliki assignment aktif di site atau kontraktor lain.",
      badge: "Integritas Kontrak",
    },
  ];

  return (
    <section id="realita" className="py-24 bg-[#090d16] text-white relative border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs font-semibold mb-3">
            <Flame className="w-3.5 h-3.5" />
            <span>REALITA RESIKO LAPANGAN</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Mengapa Spreadsheet Selalu Gagal Menghadapi Audit Migas & Mega Proyek
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
            Di proyek berisiko tinggi dengan 500–2.000 kru, kelalaian manusia pada file spreadsheet bukan pertanyaan "apakah akan terjadi", melainkan "kapan insiden denda atau kecelakaan terjadi".
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {comparisons.map((item) => (
            <div
              key={item.title}
              className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden font-mono text-xs shadow-lg"
            >
              {/* Card Header */}
              <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                <span className="font-bold text-white text-sm tracking-tight">{item.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {item.badge}
                </span>
              </div>

              {/* Comparison Split */}
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
                {/* Legacy Way */}
                <div className="p-4 bg-rose-950/10 space-y-2">
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold uppercase text-[11px]">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{item.excelTitle}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                    {item.excelDesc}
                  </p>
                </div>

                {/* MMS Way */}
                <div className="p-4 bg-emerald-950/10 space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase text-[11px]">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{item.mmsTitle}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                    {item.mmsDesc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Risk Cost Callout Banner */}
        <div className="mt-8 p-5 rounded-xl bg-slate-950 border border-amber-500/40 font-mono text-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white">Biaya Standby Rig Akibat Kru Rejection:</div>
              <div className="text-slate-400 text-[11px]">
                $25,000 USD / jam (~Rp 400 Juta/jam). Jangan biarkan kelalaian file Excel mengorbankan jadwal pengeboran Anda.
              </div>
            </div>
          </div>
          <div className="shrink-0">
            <span className="px-3 py-1.5 rounded bg-amber-500 text-slate-950 font-bold text-[11px] uppercase">
              100% Zero-Leak Guarantee
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
