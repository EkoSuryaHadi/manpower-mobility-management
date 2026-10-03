"use client";

import React from "react";
import Link from "next/link";
import { HardHat, ArrowRight, ShieldCheck, Terminal, Cpu, CheckCircle2, Lock } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-[#050811] text-slate-400 border-t border-slate-800 text-xs">
      {/* Industrial Deployment Readiness Banner */}
      <div className="border-b border-slate-800/80 bg-gradient-to-b from-[#0a0f1d] to-[#050811] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[11px] font-semibold tracking-wider uppercase">
            <Terminal className="w-3.5 h-3.5" />
            <span>COMMISSIONING & FIELD ROLLOUT READY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Nol Kru Rejection di Gate. <br className="hidden sm:inline" />
            Nol Denda Audit Regulasi.
          </h2>

          <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
            Hentikan pertaruhan operasional miliaran rupiah di atas dokumen Excel yang rapuh. Standarisasi mobilitas kru Anda dengan engine kepatuhan K3 migas & konstruksi terintegrasi.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="flex items-center gap-2 px-6 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02]"
            >
              <span>Masuk Portal Operasional (Demo)</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </Link>
            <a
              href="#simulator"
              className="flex items-center gap-2 px-6 py-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono text-xs font-semibold tracking-wide transition"
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Coba Engine Simulator</span>
            </a>
          </div>

          {/* Telemetry Micro-Badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              UU PDP No. 27/2022 Compliant
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              SKK Migas PTK-007 Workflow
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              Append-Only Audit Trail
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Architectural Blueprint */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Col 1: Identity & Architecture */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2.5 text-white font-black text-sm tracking-wide">
            <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center text-slate-950">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <div className="leading-none text-base">MMS Enterprise</div>
              <div className="text-[10px] font-mono text-amber-400/80 font-normal">MOBILITY MANAGEMENT SYSTEM</div>
            </div>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Platform pengamanan mobilitas tenaga kerja, verifikasi dokumen K3/SIO, dan penegakan kuota Ring lokal untuk industri hulu migas, pertambangan, dan EPC berskala nasional.
          </p>
          <div className="p-3 rounded bg-slate-900/80 border border-slate-800 font-mono text-[10px] space-y-1 text-slate-400">
            <div className="text-slate-200 font-bold uppercase tracking-wider">Engine Specification:</div>
            <div>Core: Next.js 14 App Router + TypeScript</div>
            <div>DB: PostgreSQL + Prisma ORM</div>
            <div>Security: Jose JWT httpOnly + Argon2/Bcrypt</div>
          </div>
        </div>

        {/* Col 2: Field Modules */}
        <div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Modul Operasional
          </h4>
          <ul className="space-y-2 text-slate-400 font-mono text-xs">
            <li>
              <a href="#simulator" className="hover:text-amber-400 transition flex items-center justify-between">
                <span>Readiness Engine</span>
                <span className="text-[10px] text-slate-600">BLOCKER</span>
              </a>
            </li>
            <li>
              <a href="#realita" className="hover:text-amber-400 transition flex items-center justify-between">
                <span>Expiry Watchlist</span>
                <span className="text-[10px] text-slate-600">H-30/H-60</span>
              </a>
            </li>
            <li>
              <a href="#9-pilar" className="hover:text-amber-400 transition flex items-center justify-between">
                <span>Ring 1-4 Quota Enforcer</span>
                <span className="text-[10px] text-slate-600">LOCAL</span>
              </a>
            </li>
            <li>
              <a href="#workflow" className="hover:text-amber-400 transition flex items-center justify-between">
                <span>Multi-Tier Approval</span>
                <span className="text-[10px] text-slate-600">6-GATE</span>
              </a>
            </li>
            <li>
              <a href="#9-pilar" className="hover:text-amber-400 transition flex items-center justify-between">
                <span>Demob Exit Clearance</span>
                <span className="text-[10px] text-slate-600">DE-POB</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Compliance & Standards */}
        <div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Regulasi & Kepatuhan
          </h4>
          <ul className="space-y-2.5 text-slate-400 text-xs">
            <li className="leading-snug">
              <strong className="text-slate-300 block font-mono">UU No. 27/2022 (PDP)</strong>
              Enkripsi NIK Dukcapil & hak hapus data rekrutmen.
            </li>
            <li className="leading-snug">
              <strong className="text-slate-300 block font-mono">Permenaker 08/2020</strong>
              Validasi Lisensi K3 Pesawat Angkat & Angkut (SIO Crane).
            </li>
            <li className="leading-snug">
              <strong className="text-slate-300 block font-mono">Pedoman SKK Migas PTK-007</strong>
              Verifikasi kualifikasi subkontraktor dan TKDN kru.
            </li>
            <li className="leading-snug">
              <strong className="text-slate-300 block font-mono">ISO 27001 Audit Trail</strong>
              Catatan log tidak dapat dimanipulasi dengan timestamp.
            </li>
          </ul>
        </div>

        {/* Col 4: Quick Demo Access */}
        <div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            Akses Akun Simulasi
          </h4>
          <p className="text-[11px] text-slate-400 mb-3">
            Gunakan portal masuk untuk mencoba seluruh peran operasional (Password default: <code className="text-amber-400 bg-slate-900 px-1 py-0.5 rounded">password123</code>):
          </p>
          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
              <div className="text-slate-300 font-bold">WFM / HR Operations</div>
              <div className="text-slate-500 text-[10px]">wfm@petro.local</div>
            </div>
            <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
              <div className="text-slate-300 font-bold">HSE Compliance Inspector</div>
              <div className="text-slate-500 text-[10px]">hse@contractor.local</div>
            </div>
            <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
              <div className="text-slate-300 font-bold">Client Final Approver</div>
              <div className="text-slate-500 text-[10px]">approver@client.local</div>
            </div>
          </div>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-semibold hover:text-amber-300 transition"
            >
              <span>Buka Halaman Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Telemetry Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 gap-3">
        <div>
          © {new Date().getFullYear()} MMS Enterprise — Manpower Mobility & Compliance Management System.
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ENGINE GATE-READY
          </span>
          <span>•</span>
          <span>SECURE REPLICA ENVIRONMENT</span>
          <span>•</span>
          <span>INDONESIAN ENERGY WORKFORCE</span>
        </div>
      </div>
    </footer>
  );
}
