"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Building,
  Terminal,
  FileCheck,
  Clock,
  Sparkles,
  GitPullRequestDraft,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

export function InteractiveSimulator() {
  const [activeTab, setActiveTab] = useState<"readiness" | "approval" | "quota">("readiness");

  // State for interactive gatepass test
  const [selectedRole, setSelectedRole] = useState<"crane" | "welder" | "scaffold">("crane");
  const [docStates, setDocStates] = useState({
    ktp: true,
    pkwt: true,
    mcu: true,
    sio: false, // The hard-blocker for crane
  });

  const toggleDoc = (key: keyof typeof docStates) => {
    setDocStates((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isBlocked = !docStates.sio || !docStates.mcu || !docStates.pkwt || !docStates.ktp;

  return (
    <section id="simulator" className="py-24 bg-[#090d16] text-white relative border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold mb-3">
            <Terminal className="w-3.5 h-3.5" />
            <span>INTERACTIVE COMPLIANCE WORKBENCH</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Uji Langsung Mesin Keputusan Gerbang MMS
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed">
            Tidak perlu membayangkan. Uji logika validasi dokumen di bawah dan perhatikan bagaimana gerbang otomatis mengunci manifes jika terdeteksi syarat kritis yang tidak terpenuhi.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 mb-8 p-1.5 rounded-xl bg-slate-950 border border-slate-800 max-w-xl font-mono text-xs">
          <button
            onClick={() => setActiveTab("readiness")}
            className={`flex-1 py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
              activeTab === "readiness"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>[1] GATE EVALUATOR</span>
          </button>
          <button
            onClick={() => setActiveTab("approval")}
            className={`flex-1 py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
              activeTab === "approval"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <GitPullRequestDraft className="w-4 h-4" />
            <span>[2] 3-TIER AUDIT</span>
          </button>
          <button
            onClick={() => setActiveTab("quota")}
            className={`flex-1 py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
              activeTab === "quota"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Building className="w-4 h-4" />
            <span>[3] RING 1–4 QUOTA</span>
          </button>
        </div>

        {/* Tab 1: Gate Evaluator */}
        {activeTab === "readiness" && (
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-6 md:p-8 font-mono text-xs shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-800 gap-4">
              <div>
                <div className="text-[10px] text-amber-400 uppercase font-bold">
                  SKENARIO PENUGASAN: CRANE OPERATOR (RIG ALPHA OFFSHORE)
                </div>
                <div className="text-base font-bold text-white mt-1">
                  Kru: Bambang Sukamto (NIK: 9171018804910002) • PT Subcon Mandiri
                </div>
                <div className="text-slate-400 mt-1 text-[11px]">
                  Klik dokumen di bawah untuk menyimulasikan status kelengkapan verifikasi berkas:
                </div>
              </div>

              {/* Status Outcome */}
              <div className="flex items-center gap-3 bg-[#060911] p-3 rounded-lg border border-slate-800 shrink-0">
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase">Keputusan Engine:</div>
                  <div
                    className={`text-sm font-black ${
                      isBlocked ? "text-rose-400" : "text-emerald-400"
                    }`}
                  >
                    {isBlocked ? "GATE LOCKED (BLOCKED)" : "GATE CLEARED (READY)"}
                  </div>
                </div>
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isBlocked
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  }`}
                >
                  {isBlocked ? <XCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                </div>
              </div>
            </div>

            {/* Document Interactive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-6">
              {[
                {
                  key: "ktp",
                  title: "KTP & NIK Elektronik",
                  sub: "Cek identitas Dukcapil & duplikasi lintas vendor",
                  mandatory: "MANDATORY",
                  blocker: "HARD-BLOCKER",
                },
                {
                  key: "pkwt",
                  title: "PKWT Bipartit Disnaker",
                  sub: "Perjanjian kerja legal dengan durasi aktif",
                  mandatory: "MANDATORY",
                  blocker: "HARD-BLOCKER",
                },
                {
                  key: "mcu",
                  title: "MCU Fit-to-Work Offshore",
                  sub: "Hasil lab audiometri & spirometri < 180 hari",
                  mandatory: "MANDATORY",
                  blocker: "HARD-BLOCKER",
                },
                {
                  key: "sio",
                  title: "SIO Crane Kelas 1 (Kemenaker)",
                  sub: "Surat Ijin Operator aktif untuk alat berat rig",
                  mandatory: "MANDATORY",
                  blocker: "HARD-BLOCKER",
                },
              ].map((item) => {
                const checked = docStates[item.key as keyof typeof docStates];
                return (
                  <div
                    key={item.key}
                    onClick={() => toggleDoc(item.key as keyof typeof docStates)}
                    className={`p-4 rounded-lg border cursor-pointer select-none transition flex flex-col justify-between ${
                      checked
                        ? "bg-slate-900/60 border-emerald-500/40 hover:border-emerald-500"
                        : "bg-rose-950/20 border-rose-500/40 hover:border-rose-500"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            checked
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {checked ? "VERIFIED (LULUS)" : "MISSING / EXPIRED"}
                        </span>
                        {checked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400" />
                        )}
                      </div>
                      <div className="font-bold text-white text-xs">{item.title}</div>
                      <div className="text-[11px] text-slate-400 mt-1 font-sans leading-snug">
                        {item.sub}
                      </div>
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-800 flex items-center justify-between text-[9px] text-slate-500">
                      <span>{item.mandatory}</span>
                      <span className="text-amber-400 font-bold">{item.blocker}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tactical Explanatory Banner */}
            <div className="p-3.5 rounded-lg bg-[#060911] border border-slate-800 flex items-start gap-3">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-300 font-sans leading-relaxed">
                {isBlocked ? (
                  <>
                    <strong className="text-rose-400 font-mono font-bold">ALASAN PENOLAKAN OTOMATIS: </strong>
                    Sistem mendeteksi dokumen bersyarat <em className="text-white">Hard-Blocker</em> belum lengkap atau kedaluwarsa. Form approval dikunci secara sistemik sehingga staf HR tidak dapat meloloskan kru lewat jalan pintas.
                  </>
                ) : (
                  <>
                    <strong className="text-emerald-400 font-mono font-bold">SELURUH SYARAT DIPENUHI: </strong>
                    Readiness Score mencapai 100%. Tiket pengajuan Pre-Mobilization kini aktif dan diteruskan ke Step 1 (Contractor HR) untuk penandatanganan digital.
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: 3-Tier Multi-Stage Audit */}
        {activeTab === "approval" && (
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-6 md:p-8 font-mono text-xs shadow-2xl space-y-6">
            <div>
              <div className="text-[10px] text-sky-400 uppercase font-bold">
                AUDIT WORKFLOW: STD-MOB-V1 (3 STAGE GATEKEEPING)
              </div>
              <div className="text-base font-bold text-white mt-1">
                Alur Persetujuan Bertingkat Berbasis Peran & Hak Akses
              </div>
              <div className="text-slate-400 text-[11px] mt-1">
                Setiap persetujuan mencatat tanda tangan digital pengguna, stempel waktu ISO, dan komentar legalitas.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-slate-900 border border-emerald-500/50 space-y-2">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span>TIER 1: CONTRACTOR HR</span>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-slate-200 font-bold">Maya Safitri (Lead HR)</div>
                <div className="text-[11px] text-slate-400">Verifikasi PKWT & Keabsahan Hubungan Kerja</div>
                <div className="p-2 rounded bg-slate-950 text-[10px] text-slate-300 italic border border-slate-800">
                  "PKWT No. 82/2026 telah sesuai UMR Papua Barat & terdaftar di Disnaker Bintuni."
                </div>
                <div className="text-[10px] text-slate-500 pt-1">TIMESTAMP: 2026-10-01 09:14:22 WIT</div>
              </div>

              <div className="p-4 rounded-lg bg-slate-900 border border-amber-500/50 space-y-2">
                <div className="flex items-center justify-between text-amber-400 font-bold">
                  <span>TIER 2: CONTRACTOR HSE</span>
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-slate-200 font-bold">Irwan Pratama (HSE Rig Alpha)</div>
                <div className="text-[11px] text-slate-400">Verifikasi MCU Fit-to-Work, K3 Migas & SIO</div>
                <div className="p-2 rounded bg-slate-950 text-[10px] text-amber-300 italic border border-slate-800">
                  "Hasil tes narkotika negatif, spirometri normal. Menunggu konfirmasi nomor SIO."
                </div>
                <div className="text-[10px] text-slate-500 pt-1">STATUS: IN ACTIVE REVIEW (H-48 Jam)</div>
              </div>

              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 opacity-60 space-y-2">
                <div className="flex items-center justify-between text-slate-400 font-bold">
                  <span>TIER 3: CLIENT PROJECT REP</span>
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-slate-200 font-bold">Bambang Soediro (Company Man)</div>
                <div className="text-[11px] text-slate-400">Otorisasi Akhir Masuk Wilayah Kerja Klien</div>
                <div className="p-2 rounded bg-slate-950 text-[10px] text-slate-500 italic border border-slate-800">
                  Menunggu Tier 2 HSE selesai sebelum manifes disetujui.
                </div>
                <div className="text-[10px] text-slate-500 pt-1">STATUS: QUEUED (PENDING TIER 2)</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Ring Quota */}
        {activeTab === "quota" && (
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-6 md:p-8 font-mono text-xs shadow-2xl space-y-6">
            <div>
              <div className="text-[10px] text-teal-400 uppercase font-bold">
                LOCAL CONTENT GOVERNANCE: PTK-007 SKK MIGAS
              </div>
              <div className="text-base font-bold text-white mt-1">
                Kontrol Kuota & Sebaran Tenaga Kerja Lokal Ring 1–4
              </div>
              <div className="text-slate-400 text-[11px] mt-1">
                Menjamin komitmen persentase tenaga kerja lokal terpenuhi demi stabilitas sosial di wilayah lingkar tambang.
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-lg bg-slate-900 border border-emerald-500/40">
                <div className="text-emerald-400 font-bold">RING 1: BUFFER ZONE</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Desa Sekitar Site / Lingkar 1</div>
                <div className="text-2xl font-black text-white mt-2">45%</div>
                <div className="text-[10px] text-emerald-400 mt-1">Target Minimum: 40% (LULUS)</div>
              </div>

              <div className="p-4 rounded-lg bg-slate-900 border border-sky-500/40">
                <div className="text-sky-400 font-bold">RING 2: KECAMATAN</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Kecamatan Penyangga</div>
                <div className="text-2xl font-black text-white mt-2">25%</div>
                <div className="text-[10px] text-slate-400 mt-1">39 Pekerja Terdaftar</div>
              </div>

              <div className="p-4 rounded-lg bg-slate-900 border border-amber-500/40">
                <div className="text-amber-400 font-bold">RING 3: KABUPATEN</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Kabupaten / Provinsi</div>
                <div className="text-2xl font-black text-white mt-2">20%</div>
                <div className="text-[10px] text-slate-400 mt-1">31 Pekerja Terdaftar</div>
              </div>

              <div className="p-4 rounded-lg bg-slate-900 border border-slate-700">
                <div className="text-slate-400 font-bold">RING 4: NASIONAL</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Luar Provinsi / Ekspat</div>
                <div className="text-2xl font-black text-white mt-2">10%</div>
                <div className="text-[10px] text-slate-500 mt-1">16 Tenaga Spesialis</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
