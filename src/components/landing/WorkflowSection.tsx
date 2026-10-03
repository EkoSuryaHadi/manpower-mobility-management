"use client";

import React from "react";
import {
  FileSpreadsheet,
  Cpu,
  GitPullRequestDraft,
  Send,
  Building2,
  LogOut,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export function WorkflowSection() {
  const gates = [
    {
      code: "GATE-01",
      title: "Self-Service Onboarding & OCR",
      actor: "SUBCONTRACTOR VENDOR",
      badge: "INPUT LAYER",
      desc: "Vendor mendaftarkan kru via portal mandiri. Upload berkas identitas KTP, PKWT, SIO, dan MCU tanpa jalur email atau chat WhatsApp.",
      checkpoint: "Pengecekan NIK 16 digit anti-duplikasi & validasi tanggal masa berlaku dokumen.",
    },
    {
      code: "GATE-02",
      title: "Hard-Blocker Kernel Evaluation",
      actor: "MMS AUTOMATED ENGINE",
      badge: "DECISION LAYER",
      desc: "Mesin membandingkan berkas dengan syarat wajib disiplin kerja (misal: Welder 6G butuh sertifikasi migas aktif).",
      checkpoint: "Satu dokumen blocking kurang = tombol ajukan pre-mobilisasi terkunci mati.",
    },
    {
      code: "GATE-03",
      title: "3-Tier Sequential Signoff",
      actor: "HR → HSE → CLIENT REP",
      badge: "GOVERNANCE LAYER",
      desc: "Review bertahap: HR validasi legalitas kontrak kerja, HSE validasi kelaikan medis & keselamatan, Klien otorisasi izin masuk site.",
      checkpoint: "Tanda tangan digital tercatat permanen di audit trail beserta komentar kepatuhan.",
    },
    {
      code: "GATE-04",
      title: "Travel Dispatch & Manifest",
      actor: "WFM MOBILITY OFFICER",
      badge: "LOGISTICS LAYER",
      desc: "Pekerja yang telah lolos approval Tier 3 dijadwalkan tiket penerbangan charter ATR-72 atau speedboat rig transfer.",
      checkpoint: "Manifes resmi diterbitkan dengan nomor penerbangan dan estimasi ketibaan.",
    },
    {
      code: "GATE-05",
      title: "Rig Check-in & POB Accounting",
      actor: "SITE RIG ADMINISTRATOR",
      badge: "FIELD SITE LAYER",
      desc: "Konfirmasi ketibaan fisik pekerja di lokasi proyek. Sistem otomatis memasukkan pekerja ke daftar aktif POB (Personnel on Board).",
      checkpoint: "Kapasitas akomodasi camp dan perbandingan Actual vs Quota terbarui real-time.",
    },
    {
      code: "GATE-06",
      title: "Four-Point Demob Clearance",
      actor: "SITE ADMIN & LOGISTIK",
      badge: "EXIT CLEARANCE",
      desc: "Penutupan penugasan mengunci 4 checklist: serah terima akomodasi camp, pengembalian APD/hand tools, pengembalian RFID badge, dan Fit-to-Fly medical.",
      checkpoint: "Kru tidak dapat dikeluarkan dari status aktif tanpa verifikasi clearance 100%.",
    },
  ];

  return (
    <section id="workflow" className="py-24 bg-[#070b14] text-white relative border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-900 border border-slate-800 text-amber-400 font-mono text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SIKLUS MOBILITAS KONTRAKTOR TERSTRUKTUR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            6 Gerbang Mobilitas Tanpa Celah Kompromi
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed">
            Dari pendaftaran kru di Jakarta hingga kepulangan dari offshore rig di Papua, setiap pergerakan manusia diawasi dengan protokol kepatuhan berstandar tinggi.
          </p>
        </div>

        {/* Gate Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
          {gates.map((item, idx) => (
            <div
              key={item.code}
              className="p-6 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between shadow-lg relative"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                    {item.code}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase">{item.badge}</span>
                </div>

                <h3 className="text-sm font-bold text-white mb-1 font-sans">{item.title}</h3>
                <div className="text-[11px] text-sky-400 font-semibold mb-3">AKTOR: {item.actor}</div>

                <p className="text-slate-400 font-sans leading-relaxed text-[11px] mb-4">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <div className="text-[10px] text-emerald-400 flex items-start gap-1.5 font-sans">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Kriteria Lolos:</strong> {item.checkpoint}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
