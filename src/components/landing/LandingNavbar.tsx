"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HardHat, LogIn, ArrowRight, Menu, X, Terminal, Shield } from "lucide-react";
import type { SessionUser } from "../layout/types";

export function LandingNavbar({ user }: { user: SessionUser | null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "01. Realita Lapangan", href: "#realita" },
    { label: "02. Simulator Engine", href: "#simulator" },
    { label: "03. 9 Pilar Arsitektur", href: "#9-pilar" },
    { label: "04. Gate Workflow", href: "#workflow" },
    { label: "05. Kepatuhan Regulasi", href: "#kepatuhan" },
    { label: "06. Tanya Jawab Teknis", href: "#faq" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800">
      {/* Top micro-strip for industrial telemetry */}
      <div className="hidden lg:flex items-center justify-between px-6 py-1 bg-slate-950/80 border-b border-slate-900 text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            GATE SYSTEM: ACTIVE ENFORCEMENT
          </span>
          <span className="text-slate-600">|</span>
          <span>SCOPE: OIL & GAS, PETROCHEMICAL, MINING & EPC</span>
          <span className="text-slate-600">|</span>
          <span>REGULATION: UU PDP NO. 27/2022 & PTK-007</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span>LATENCY: 18ms</span>
          <span className="text-slate-600">•</span>
          <span className="text-sky-400">BUILD: v1.0.4-PROD</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Identity */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 group-hover:bg-amber-400 transition">
            <HardHat className="w-5 h-5 text-slate-950 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              <span>MMS ENTERPRISE</span>
              <span className="text-[9px] font-mono bg-slate-800 text-amber-400 font-semibold px-1.5 py-0.5 rounded border border-amber-500/30">
                INDUSTRIAL WFM
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">Manpower Mobility & Gate Control</div>
          </div>
        </Link>

        {/* Desktop Links with Technical Numbering */}
        <nav className="hidden xl:flex items-center gap-6 text-xs font-mono text-slate-300">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-amber-400 transition-colors py-1"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Direct Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold font-mono transition shadow-sm"
            >
              <span>BUKA WORKSPACE ({user.fullName.split(" ")[0].toUpperCase()})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-400" />
                <span>MASUK SISTEM</span>
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition shadow-md shadow-emerald-950/60"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>AKSES DEMO RIG</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 focus:outline-none"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-950 border-b border-slate-800 px-6 py-4 space-y-3 font-mono text-xs">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-amber-400 py-1.5 border-b border-slate-900"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="pt-3 flex flex-col gap-2">
            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold"
              >
                <span>BUKA DASHBOARD ({user.fullName})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white"
                >
                  <LogIn className="w-4 h-4 text-slate-400" />
                  <span>MASUK AKUN</span>
                </Link>
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-600 text-white font-bold"
                >
                  <Terminal className="w-4 h-4" />
                  <span>COBA DEMO LANGSUNG</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
