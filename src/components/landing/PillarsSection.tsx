"use client";

import React, { useState } from "react";
import {
  Building2,
  Users2,
  FileCheck2,
  ShieldCheck,
  Activity,
  Clock,
  LayoutGrid,
  BellRing,
  Lock,
  ArrowRight,
  Database,
  Terminal,
} from "lucide-react";

export function PillarsSection() {
  const [selectedPillar, setSelectedPillar] = useState(0);

  const pillars = [
    {
      id: "P-01",
      name: "Master Vendor & Quota Control",
      category: "KONTRAKTOR & KAPASITAS",
      icon: Building2,
      input: "Data Legalitas PT, NPWP, Surat Izin Usaha, PIC Perusahaan",
      logic: "Enforce batasan kuota approved headcount & batas maksimum pekerja on-site.",
      output: "Vendor Quota Card, Real-time Headcount Utilization Ratio.",
      detail:
        "Sentralisasi seluruh kontraktor, subkontraktor, dan PIC perusahaan dalam satu direktori terpusat. Mengunci kapasitas kuota per site agar tidak melebihi daya tampung fasilitas akomodasi/camp offshore.",
    },
    {
      id: "P-02",
      name: "Manpower Master (NIK Validated)",
      category: "IDENTITAS TUNGGAL",
      icon: Users2,
      input: "NIK 16 Digit, Nama KTP, Paspor, Ring Demografi 1–4",
      logic: "Anti-duplikasi penugasan lintas vendor dan pengecekan rekam jejak pekerja.",
      output: "Single Worker ID (EMP-YYYY-XXX), Master Riwayat Penugasan.",
      detail:
        "Database induk seluruh pekerja dengan validasi NIK unik Dukcapil, mencegah pekerja yang sama didaftarkan oleh 2 subkontraktor berbeda secara bersamaan.",
    },
    {
      id: "P-03",
      name: "Dokumen Pendukung & Versioning",
      icon: FileCheck2,
      input: "PDF PKWT, Hasil MCU, SIO Kemenaker, Sertifikat K3, Paspor",
      logic: "Audit riwayat revisi berkas tanpa menghapus riwayat verifikasi sebelumnya.",
      output: "Split-Screen Verification Viewer, Status VERIFIED / REJECTED.",
      detail:
        "Setiap perpanjangan dokumen menghasilkan versi baru dengan pencatatan nama pengunggah dan tanggal. Verifikator membandingkan berkas fisik langsung berdampingan dengan form input data.",
    },
    {
      id: "P-04",
      name: "Zero-Blocker Readiness Engine",
      category: "GERBANG MOBILISASI",
      icon: ShieldCheck,
      input: "Kombinasi Syarat Wajib Posisi, Disiplin, dan Karakteristik Site",
      logic: "Hard-Blocker check: jika ada 1 dokumen wajib yang missing/expired, status = BLOCKED.",
      output: "Readiness Score (0–100%), Blocking Issues List, Gate Lockout.",
      detail:
        "Mesin aturan dinamis yang menghitung kesiapan mobilisasi secara otomatis. Menjamin tidak ada pekerja yang dapat diajukan ke approval workflow sebelum semua syarat mandatori terpenuhi 100%.",
    },
    {
      id: "P-05",
      name: "Monitoring Manpower On-Site",
      category: "OPERASIONAL SITE",
      icon: Activity,
      input: "Scan Kedatangan Site Admin, Log Rotasi 28/28 atau 14/14",
      logic: "Penghitungan riil Actual On-Site vs Approved Headcount vs Quota.",
      output: "Daily Headcount Board, POB (Personnel on Board) Rig Manifest.",
      detail:
        "Memantau seluruh pekerja yang sedang aktif berada di area rig, camp, atau platform. Menjamin manifest POB selalu akurat saat terjadi keadaan darurat (Muster Station / Evakuasi).",
    },
    {
      id: "P-06",
      name: "Watchlist Due Date Dokumen",
      category: "PREVENSI RISIKO",
      icon: Clock,
      input: "Tanggal Kedaluwarsa MCU, SIO, PKWT, Paspor",
      logic: "Kategorisasi otomatis: Urgent (H-30), Warning (H-60), Safe (>60 hari).",
      output: "Expiry Watchlist Matrix, Auto Lockout saat Expired.",
      detail:
        "Mendeteksi secara dini masa kedaluwarsa sertifikasi pekerja sebelum tanggal jatuh tempo. Pekerja yang dokumennya kedaluwarsa saat masih di site otomatis masuk daftar prioritas demobilisasi atau perpanjangan.",
    },
    {
      id: "P-07",
      name: "Portal Mandiri Tiap Vendor",
      category: "ISOLASI VENDOR",
      icon: LayoutGrid,
      input: "Akses Subcontractor User, Company ID Scoping",
      logic: "Data scoping ketat: Vendor A tidak bisa melihat dokumen Vendor B.",
      output: "Vendor Analytics Dashboard, Self-Service Onboarding Kru.",
      detail:
        "Memberikan ruang kerja mandiri bagi masing-masing subkontraktor untuk mendaftarkan kru, mengunggah berkas, dan memantau status persetujuan secara transparan tanpa perlu bolak-balik email.",
    },
    {
      id: "P-08",
      name: "Notifikasi & Alert Kepatuhan",
      category: "KOMUNIKASI OTOMATIS",
      icon: BellRing,
      input: "Event Trigger: Pengajuan Pre-Mob, Dokumen Rejected, H-30 Expired",
      logic: "Diseminasi in-app notification & alert audit ke stakeholder relevan.",
      output: "In-App Bell Dropdown, Alert Badge di Navigasi Utama.",
      detail:
        "Notifikasi real-time yang langsung mengarahkan verifikator ke dokumen yang membutuhkan tindakan segera, memangkas bottleneck koordinasi.",
    },
    {
      id: "P-09",
      name: "Enterprise RBAC & Audit Trail",
      category: "TATA KELOLA HUKUM",
      icon: Lock,
      input: "7 Persona Role, IP Address, HTTP Method, Parameter Aksi",
      logic: "Append-only immutable event log, validasi otorisasi server-side.",
      output: "Immutable Audit Log Table, UU PDP No. 27/2022 Compliance.",
      detail:
        "Setiap aksi persetujuan, penolakan, perubahan status verifikasi, dan kedatangan dicatat dengan nama pengguna, timestamp mikrodetik, dan IP address. Tidak dapat dimanipulasi dari frontend.",
    },
  ];

  const current = pillars[selectedPillar];

  return (
    <section id="9-pilar" className="py-24 bg-[#070b14] text-white relative border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-900 border border-slate-800 text-sky-400 font-mono text-xs font-semibold mb-3">
            <Database className="w-3.5 h-3.5" />
            <span>ARSITEKTUR INTI SISTEM WFM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            9 Pilar Arsitektur MMS Enterprise
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed">
            Spesifikasi arsitektural terstandarisasi untuk memastikan kepatuhan mobilitas tenaga kerja proyek berjalan tanpa celah.
          </p>
        </div>

        {/* Blueprint Layout: 9-Selector Column + Deep Detail Inspector Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Pillar Selector List (5 Cols) */}
          <div className="lg:col-span-5 space-y-2 font-mono text-xs">
            {pillars.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = selectedPillar === idx;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedPillar(idx)}
                  className={`w-full text-left p-3 rounded-lg border transition flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-slate-900 border-amber-500 text-white shadow-lg shadow-amber-500/5"
                      : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`font-bold shrink-0 ${isSelected ? "text-amber-400" : "text-slate-600"}`}>
                      {item.id}
                    </span>
                    <span className="font-semibold truncate">{item.name}</span>
                  </div>
                  <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-amber-400" : "text-slate-600"}`} />
                </button>
              );
            })}
          </div>

          {/* Deep Architectural Inspector (7 Cols) */}
          <div className="lg:col-span-7 rounded-xl bg-slate-950 border border-slate-800 p-6 md:p-8 font-mono text-xs shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                  {current.id}
                </span>
                <span className="text-slate-400 uppercase text-[10px]">{current.category}</span>
              </div>
              <span className="text-emerald-400 flex items-center gap-1.5 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                ACTIVE KERNEL MODULE
              </span>
            </div>

            <div className="py-6 space-y-5">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight font-sans">
                  {current.name}
                </h3>
                <p className="text-xs text-slate-300 font-sans mt-2 leading-relaxed">
                  {current.detail}
                </p>
              </div>

              {/* Data Flow Blueprint */}
              <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 space-y-3">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    [1] Input Artifacts (Data Masukan):
                  </div>
                  <div className="text-slate-300 mt-1 font-sans">{current.input}</div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <div className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">
                    [2] Engine Processing Logic (Logika Validasi):
                  </div>
                  <div className="text-slate-300 mt-1 font-sans">{current.logic}</div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <div className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">
                    [3] Enforced Output / Artifact:
                  </div>
                  <div className="text-slate-300 mt-1 font-sans">{current.output}</div>
                </div>
              </div>
            </div>

            {/* Blueprint Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>SPECIFICATION_CODE: MMS-WFM-STD</span>
              <span className="text-slate-400">STATUS: AUDITED FOR PROD</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
