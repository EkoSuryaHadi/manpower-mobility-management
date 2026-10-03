"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Loader2 } from "lucide-react";
import { DEMO_PERSONAS } from "@/lib/auth";
import type { SessionUser } from "./types";

export function UserMenu({ user }: { user: SessionUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const persona = DEMO_PERSONAS[user.role];

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
    } finally {
      window.location.assign("/login");
    }
  };

  const initials = user.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

  return (
    <div className="relative" ref={ref}>
      <button
        id="user-menu-button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-lg hover:bg-slate-100 transition"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
            persona?.avatarBg ?? "bg-slate-600"
          }`}
        >
          {initials}
        </span>
        <span className="hidden md:flex flex-col items-start leading-tight">
          <span className="text-xs font-semibold text-slate-800 max-w-[10rem] truncate">{user.fullName}</span>
          <span className="text-[10px] text-slate-500 max-w-[10rem] truncate">
            {persona?.roleLabel ?? user.role}
          </span>
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden"
        >
          <div className="p-3 bg-slate-50 border-b border-slate-100">
            <div className="text-xs font-semibold text-slate-800 truncate">{user.fullName}</div>
            <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
            <div className="text-[11px] text-slate-500 truncate mt-0.5">{user.companyName ?? "-"}</div>
          </div>
          <button
            id="user-menu-logout"
            role="menuitem"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition disabled:opacity-60"
          >
            {loggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
            Keluar
          </button>
        </div>
      )}
    </div>
  );
}
