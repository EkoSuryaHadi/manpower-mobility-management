"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, Terminal } from "lucide-react";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Bagaimana jika sertifikat MCU atau SIO pekerja kedaluwarsa saat mereka masih berada di rig offshore?",
      a: "Sistem Watchlist MMS mendeteksi tanggal kedaluwarsa sejak H-60 dan H-30. Sebelum pekerja diberangkatkan, sistem sudah mengkalkulasi apakah durasi rotasi kerja (misal: 28 hari) akan melewati batas masa berlaku dokumen. Jika akan kedaluwarsa di tengah rotasi, pekerja otomatis ditandai untuk memperpanjang dokumen terlebih dahulu di darat sebelum jadwal penerbangan charter terbit.",
    },
    {
      q: "Bagaimana cara sistem mencegah vendor subkontraktor memalsukan dokumen atau mengedit tanggal PDF?",
      a: "MMS mengkombinasikan verifikasi visual Split-Screen Viewer dengan audit trail berjenjang. Lead HSE memeriksa langsung nomor registrasi SIO dan nama lembaga penguji MCU (misal: Lab Prodia/Pramita/Kimia Farma). Setiap berkas yang disetujui mengikat identitas digital verifikator, sehingga verifikator bertanggung jawab penuh secara hukum atas keabsahan dokumen tersebut.",
    },
    {
      q: "Apakah vendor subkontraktor bisa melihat data kuota atau daftar kru dari vendor kompetitornya?",
      a: "Sama sekali tidak bisa. MMS menerapkan isolasi multi-tenant yang ketat di level query database. Pengguna dengan akun Subcontractor hanya diizinkan membaca, mendaftarkan, dan mengunggah dokumen untuk ID perusahaannya sendiri. Tidak ada kebocoran informasi komersial antar subkontraktor.",
    },
    {
      q: "Berapa lama proses migrasi data dari rekap Excel lama kami (yang berisi 1.500+ pekerja)?",
      a: "MMS dilengkapi modul Bulk Onboarding Excel teruji. Anda cukup mengunduh template standar, mengisi NIK, nama, tanggal lahir, posisi, dan disiplin, lalu mengunggahnya. Sistem mengecek keabsahan format 16 digit NIK dan membuat master pekerja dalam hitungan detik tanpa downtime.",
    },
    {
      q: "Apakah sistem ini kompatibel dengan standar pelaporan SKK Migas (PTK-007) dan audit Ditjen Migas?",
      a: "Ya, 100% kompatibel. Format pelaporan MMS menyediakan pemisahan rasio tenaga kerja lokal Ring 1–4, rekap utilisasi kuota vendor per disiplin kerja, serta log demobilisasi lengkap yang dapat diekspor langsung ke spreadsheet atau PDF untuk diserahkan kepada pengawas SKK Migas.",
    },
    {
      q: "Apakah sistem ini bisa dihubungkan ke turnstile gate atau scanner RFID di gerbang masuk site?",
      a: "Arsitektur RESTful API MMS (Next.js App Router v1) dirancang modular. Endpoint konfirmasi kedatangan (`/api/v1/mobilizations/[id]/arrive`) dan status clearance demobilisasi siap diintegrasikan dengan RFID card reader atau sistem biometric di gate masuk proyek.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-[#090d16] text-white relative border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-900 border border-slate-800 text-amber-400 font-mono text-xs font-semibold mb-3">
            <Terminal className="w-3.5 h-3.5" />
            <span>TECHNICAL & OPERATIONAL CLARIFICATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Pertanyaan Kritis yang Sering Diajukan Project Manager
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed">
            Jawaban lugas dan teknis mengenai implementasi MMS Enterprise pada kondisi lapangan riil.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3 font-mono text-xs">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 select-none focus:outline-none hover:bg-slate-900/60 transition"
                >
                  <span className="text-sm font-bold text-white font-sans leading-snug">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-amber-400" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-2 text-slate-300 font-sans leading-relaxed border-t border-slate-800/80 text-xs">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
