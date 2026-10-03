"use client";

import React from "react";
import { Lock, FileCheck2, Database, ShieldAlert, Award, FileSpreadsheet, Scale, CheckCircle2 } from "lucide-react";

export function ComplianceSection() {
  const regulations = [
    {
      law: "UU RI No. 27 Tahun 2022",
      title: "Pelindungan Data Pribadi (UU PDP)",
      clause: "Pasal 34 & 35: Kewajiban Pengamanan Data Pribadi Spesifik",
      desc: "Data NIK, tanggal lahir, kontak, dan hasil pemeriksaan kesehatan (MCU Offshore) pekerja diklasifikasikan sebagai data sensitif. MMS mengunci isolasi multi-tenant antar vendor sehingga data kru tidak pernah bocor ke sesama subkontraktor.",
    },
    {
      law: "Permenaker RI No. 08 Tahun 2020",
      title: "K3 Pesawat Angkat & Pesawat Angkut",
      clause: "Pasal 140: Kewajiban Surat Ijin Operator (SIO) Aktif",
      desc: "Pekerja dengan risiko operasional tinggi (Crane Operator, Forklift Driver, Rigger) wajib memiliki SIO resmi yang terverifikasi nomor registrasinya. Sistem otomatis memblokir mobilisasi jika masa berlaku SIO tersisa <30 hari.",
    },
    {
      law: "Pedoman Tata Kerja SKK Migas PTK-007",
      title: "Pedoman Pengelolaan Rantai Suplai Kontraktor",
      clause: "Bab Komitmen Tenaga Kerja Lokal & Kualifikasi Subkon",
      desc: "Monitoring kuota persentase penyerapan tenaga kerja Ring 1 (Desa Terdekat) dan Ring 2 (Kecamatan Penyangga) secara real-time, memberikan bukti kepatuhan kuota lokal saat audit SKK Migas berkala.",
    },
    {
      law: "ISO 27001 & Anti-Repudiasi",
      title: "Immutable Digital Audit Logging",
      clause: "Audit Trail Append-Only Tanpa Izin Hapus",
      desc: "Setiap klik verifikasi berkas, pembatalan mobilisasi, komentar revisi, dan perubahan status verifikasi dicatat permanen dengan User ID, timestamp mikrodetik, dan IP address. Tidak ada aksi yang bisa disangkal di kemudian hari.",
    },
  ];

  return (
    <section id="kepatuhan" className="py-24 bg-[#090d16] text-white relative border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-teal-500/10 border border-teal-500/30 text-teal-400 font-mono text-xs font-semibold mb-3">
            <Scale className="w-3.5 h-3.5" />
            <span>DASAR HUKUM & STANDAR INDUSTRI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Kepatuhan Regulasi yang Bukan Sekadar Formalitas
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed">
            MMS Enterprise dibangun di atas pasal perundang-undangan nyata di Indonesia. Memastikan setiap penugasan memiliki legitimasi hukum kuat saat menghadapi audit Kemenaker, SKK Migas, ataupun sengketa ketenagakerjaan.
          </p>
        </div>

        {/* Regulatory Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          {regulations.map((item) => (
            <div
              key={item.law}
              className="p-6 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                    {item.law}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                </div>

                <h3 className="text-base font-bold text-white mb-1 font-sans">{item.title}</h3>
                <div className="text-[11px] text-amber-400 font-medium mb-3">{item.clause}</div>

                <p className="text-slate-400 font-sans leading-relaxed text-xs">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                <span>ENFORCEMENT: KERNEL HARD-BLOCKER</span>
                <span className="text-slate-400">PASAL TERVALIDASI</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
