"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  AlertOctagon,
  Terminal,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  FileCheck2,
} from "lucide-react";

export function HeroSection({ isAuth }: { isAuth: boolean }) {
  // Interactive mini-terminal in the hero: visitor can test 2 workers
  const [selectedProfile, setSelectedProfile] = useState<"pass" | "blocked">("blocked");

  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-24 overflow-hidden bg-[#070b14] text-white border-b border-slate-800">
      {/* Precision grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b20_1px,transparent_1px),linear-gradient(to_bottom,#1e293b20_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none" />

      {/* Subtle industrial crosshairs */}
      <div className="absolute top-32 left-8 font-mono text-[10px] text-slate-700 hidden lg:block select-none">
        [SYS_LOC: RIG_ALPHA_OFFSHORE]
      </div>
      <div className="absolute top-32 right-8 font-mono text-[10px] text-slate-700 hidden lg:block select-none">
        [LAT_LONG: -2.3149, 133.1504]
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Industrial Problem & Authority (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Tactical Status Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-slate-300 font-semibold tracking-wider">
                MMS WORKFORCE GATE ENGINE
              </span>
              <span className="text-slate-600">/</span>
              <span className="text-amber-400">ZERO-TOLERANCE COMPLIANCE</span>
            </div>

            {/* Brutalist Real-world Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-black tracking-tight leading-[1.12] text-white">
              Satu Dokumen Expired di Gate,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">
                Rig Standby $25,000/Jam.
              </span>
            </h1>

            {/* Direct, Uncompromising Copywriting */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-2xl">
              Rekap Excel manual dan foto dokumen di grup WhatsApp adalah bom waktu operasional migas & tambang. <strong className="text-white font-semibold">MMS Enterprise</strong> mengunci gerbang mobilisasi secara otomatis: setiap pekerja yang belum lolos verifikasi PKWT legal, MCU Fit-to-Work, dan SIO K3 langsung diblokir sebelum tiket charter terbit.
            </p>

            {/* Hard Metrics Banner */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 font-mono text-xs grid grid-cols-3 gap-3">
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Audit Rejection</div>
                <div className="text-lg font-bold text-emerald-400">0% Rejection</div>
                <div className="text-[10px] text-slate-400">Saat inspeksi SKK Migas</div>
              </div>
              <div className="border-l border-slate-800 pl-3">
                <div className="text-[10px] text-slate-500 uppercase">Review Cycle</div>
                <div className="text-lg font-bold text-sky-400">4 Jam vs 7 Hari</div>
                <div className="text-[10px] text-slate-400">Siklus 3-tier approval</div>
              </div>
              <div className="border-l border-slate-800 pl-3">
                <div className="text-[10px] text-slate-500 uppercase">Local Quota</div>
                <div className="text-lg font-bold text-amber-400">100% Valid</div>
                <div className="text-[10px] text-slate-400">Ring 1–4 terverifikasi NIK</div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href={isAuth ? "/dashboard" : "/login"}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/10"
              >
                <span>{isAuth ? "Masuk ke Workspace Operasional" : "Buka Demo Sistem (Langsung Pakai)"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#simulator"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs border border-slate-800 transition"
              >
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Uji Engine Verifikasi</span>
              </a>
            </div>

            {/* Client Context Footnote */}
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Tested on Tangguh LNG Expansion & Rig Alpha Operations</span>
            </div>
          </div>

          {/* Right Column: Live Technical Gate Console Artifact (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs">
              
              {/* Terminal Window Chrome */}
              <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] text-slate-400 ml-1 font-semibold">
                    READINESS_KERNEL_V1.EXE
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">LIVE EVAL</span>
              </div>

              {/* Selector Buttons */}
              <div className="p-3 bg-slate-900/60 border-b border-slate-800 flex items-center gap-2">
                <span className="text-[10px] text-slate-500 uppercase">Test Kru:</span>
                <button
                  onClick={() => setSelectedProfile("blocked")}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
                    selectedProfile === "blocked"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                      : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  KASUS A: CRANE OPERATOR (SIO EXPIRED)
                </button>
                <button
                  onClick={() => setSelectedProfile("pass")}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
                    selectedProfile === "pass"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  KASUS B: PIPE FITTER (VALID)
                </button>
              </div>

              {/* Simulated Engine Terminal Body */}
              <div className="p-4 space-y-3 bg-[#060911] text-[11px]">
                {selectedProfile === "blocked" ? (
                  <>
                    <div className="text-slate-400">
                      <span className="text-slate-600">&gt;</span> EVALUATING ASSIGNMENT #ASN-8921...
                    </div>
                    <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 space-y-1">
                      <div className="text-slate-300 font-bold">Pekerja: Hendra Kusuma (NIK: 9171018804910002)</div>
                      <div className="text-slate-400">Posisi: Crane Operator Kelas 1 • Site: Rig Alpha</div>
                      <div className="text-slate-400">Vendor: PT Subcon Mandiri Sejahtera</div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-emerald-400">
                        <span>[OK] KTP & NIK Validated</span>
                        <span>Dukcapil Match</span>
                      </div>
                      <div className="flex items-center justify-between text-emerald-400">
                        <span>[OK] PKWT Bipartit No. 11/2026</span>
                        <span>Aktif s/d 2027</span>
                      </div>
                      <div className="flex items-center justify-between text-emerald-400">
                        <span>[OK] MCU Fit-to-Work (Offshore)</span>
                        <span>Lab Prodia Sorong</span>
                      </div>
                      <div className="flex items-center justify-between text-rose-400 bg-rose-950/30 p-1.5 rounded border border-rose-500/30">
                        <span className="font-bold">[HARD BLOCK] SIO Crane Kemenaker</span>
                        <span className="font-bold">EXPIRED 4 HARI LALU</span>
                      </div>
                    </div>

                    {/* Result Callout */}
                    <div className="mt-3 p-2.5 rounded bg-rose-500/10 border border-rose-500/40 text-rose-300">
                      <div className="font-bold flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-400" />
                        STATUS: MOBILIZATION GATE LOCKED (BLOCKED)
                      </div>
                      <div className="text-[10px] text-rose-400/90 mt-0.5">
                        Tiket penerbangan & manifest keberangkatan tidak dapat diproses hingga SIO diperpanjang.
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-slate-400">
                      <span className="text-slate-600">&gt;</span> EVALUATING ASSIGNMENT #ASN-9104...
                    </div>
                    <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 space-y-1">
                      <div className="text-slate-300 font-bold">Pekerja: Yusuf Arifin (NIK: 9171029201930004)</div>
                      <div className="text-slate-400">Posisi: Pipe Fitter 6G • Site: Tangguh Ph.2</div>
                      <div className="text-slate-400">Vendor: PT Utama Karya Konstruksi</div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-emerald-400">
                        <span>[OK] KTP & NIK Validated</span>
                        <span>Ring 1 (Desa Kokas)</span>
                      </div>
                      <div className="flex items-center justify-between text-emerald-400">
                        <span>[OK] PKWT Bipartit No. 45/2026</span>
                        <span>Aktif s/d 2027</span>
                      </div>
                      <div className="flex items-center justify-between text-emerald-400">
                        <span>[OK] MCU Fit-to-Work (Offshore)</span>
                        <span>Lab Pramita (H-180)</span>
                      </div>
                      <div className="flex items-center justify-between text-emerald-400">
                        <span>[OK] Sertifikat Welder 6G Migas</span>
                        <span>Aktif (210 Hari)</span>
                      </div>
                    </div>

                    {/* Result Callout */}
                    <div className="mt-3 p-2.5 rounded bg-emerald-500/10 border border-emerald-500/40 text-emerald-300">
                      <div className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        STATUS: READY_TO_MOBILIZE (100% COMPLIANT)
                      </div>
                      <div className="text-[10px] text-emerald-400/90 mt-0.5">
                        Approval diteruskan ke HR Kontraktor → HSE → Klien. Gate Pass siap diterbitkan.
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Terminal Footer */}
              <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                <span>ENFORCEMENT_RULE: ZERO_BLOCKER</span>
                <span className="text-emerald-400 font-bold">SYSTEM ACTIVE</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
