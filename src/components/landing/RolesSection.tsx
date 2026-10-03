"use client";

import React from "react";
import { DEMO_PERSONAS, MMSUserRole } from "@/lib/auth";
import { Quote, UserCheck } from "lucide-react";

export function RolesSection() {
  const personas = [
    {
      role: "WFM_OFFICER",
      title: "Workforce Mobility Officer",
      persona: "Ahmad Rizky Pratama",
      org: "PT Petro Nusantara Global (Client)",
      quote:
        "Dulu saya habiskan 4 jam sehari cuma untuk mencocokkan tanggal MCU di Excel dengan jadwal penerbangan charter. Sekarang manifes otomatis sinkron dan zero-mistake.",
      responsibility: "Alokasi kuota kontraktor, monitoring due date H-60/H-30, otorisasi manifes penerbangan/boat.",
    },
    {
      role: "CONTRACTOR_HSE",
      title: "Lead Safety & Medical Inspector",
      persona: "Irwan Pratama",
      org: "PT Utama Karya Konstruksi (Main Con)",
      quote:
        "Saya tidak perlu khawatir auditor Kemenaker datang mendadak. Jika ada SIO Crane atau Rigger yang expired 1 hari saja, sistem langsung mengunci gerbang mobilisasi.",
      responsibility: "Verifikasi sertifikat K3 Migas, hasil MCU Fit-to-Work, SIO alat berat, clearance approval Tier 2.",
    },
    {
      role: "SUBCONTRACTOR",
      title: "Vendor / Subcon PIC",
      persona: "Hendra Wijaya",
      org: "PT Subcon Mandiri Sejahtera",
      quote:
        "Dulu berkas kru kami sering hilang di inbox email atau WhatsApp. Lewat portal MMS, kami tahu persis berkas mana yang direvisi dan utilisasi kuota kami aman.",
      responsibility: "Registrasi kru mandiri, unggah berkas KTP/PKWT/MCU, pantau status review dan kuota approved.",
    },
    {
      role: "CLIENT_APPROVER",
      title: "Client Project Representative",
      persona: "Bambang Soediro",
      org: "PT Petro Nusantara Global",
      quote:
        "Saat audit SKK Migas berkala, saya tinggal ekspor audit trail. Semua tanda tangan digital dan riwayat persetujuan terekam sah tanpa rekayasa.",
      responsibility: "Otorisasi akhir kru masuk site klien, evaluasi kepatuhan naker lokal Ring 1–4, sign-off pre-mob.",
    },
    {
      role: "CONTRACTOR_HR",
      title: "Main Contractor HR Lead",
      persona: "Maya Safitri",
      org: "PT Utama Karya Konstruksi",
      quote:
        "Validasi PKWT Bipartit kini 100% patuh regulasi ketenagakerjaan daerah. Tidak ada lagi risiko tuntutan sengketa kerja dari naker subkon.",
      responsibility: "Verifikasi kontrak kerja legal PKWT, kepatuhan UMR regional, sign-off approval Tier 1.",
    },
    {
      role: "SITE_ADMIN",
      title: "Offshore Rig Administrator",
      persona: "Deni Saputra",
      org: "Rig Alpha (Offshore Camp)",
      quote:
        "Manifes POB (Personnel on Board) selalu real-time. Kapasitas tempat tidur camp tidak pernah overload dan clearance demobilisasi tertib.",
      responsibility: "Konfirmasi kedatangan on-site, daily POB headcount, 4-point exit clearance demobilisasi.",
    },
  ];

  return (
    <section className="py-24 bg-[#070b14] text-white relative border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-900 border border-slate-800 text-sky-400 font-mono text-xs font-semibold mb-3">
            <UserCheck className="w-3.5 h-3.5" />
            <span>PERSPEKTIF OPERASIONAL LAPANGAN</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Solusi yang Divalidasi oleh Para Praktisi di Rig & Site
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed">
            MMS Enterprise tidak dirancang di ruang rapat berpendingin udara yang steril, melainkan lahir dari kompleksitas nyata koordinasi ratusan subkontraktor migas.
          </p>
        </div>

        {/* Personas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
          {personas.map((item) => (
            <div
              key={item.role}
              className="p-6 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between shadow-lg relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-amber-400 font-bold border border-slate-800">
                    {item.role}
                  </span>
                  <Quote className="w-4 h-4 text-slate-600" />
                </div>

                <p className="text-slate-300 font-sans italic text-xs leading-relaxed mb-4">
                  "{item.quote}"
                </p>

                <div className="pt-3 border-t border-slate-800 space-y-1">
                  <div className="font-bold text-white text-xs">{item.persona}</div>
                  <div className="text-[11px] text-slate-400">{item.title}</div>
                  <div className="text-[10px] text-slate-500">{item.org}</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 font-sans">
                <strong className="text-slate-300 font-mono">Tugas Utama:</strong> {item.responsibility}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
