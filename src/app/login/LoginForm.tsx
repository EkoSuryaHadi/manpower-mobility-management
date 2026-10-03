"use client";

import React, { useState } from "react";
import { Loader2, LogIn, Eye, EyeOff, AlertCircle } from "lucide-react";

interface DemoAccount {
  email: string;
  label: string;
}

export function LoginForm({ next, demoAccounts }: { next: string; demoAccounts: DemoAccount[] }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await res.json().catch(() => ({}));

      if (!res.ok || !result.success) {
        setError(result.error || "Login gagal. Silakan coba lagi.");
        return;
      }

      // Full navigation so server components re-render with the new session cookie
      window.location.assign(next);
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label htmlFor="login-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@perusahaan.com"
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition text-slate-900 placeholder:text-slate-400"
          />
        </div>

        <div>
          <label htmlFor="login-password" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 pr-10 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition text-slate-900 placeholder:text-slate-400"
            />
            <button
              type="button"
              id="login-toggle-password"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition"
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          id="login-submit"
          type="submit"
          disabled={loading || !email || !password}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-md shadow-brand-900/20 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>

      {demoAccounts.length > 0 && (
        <div className="pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Akun Demo (dev only)
            </span>
            <span className="text-[11px] text-slate-400 font-mono">password123</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                id={`login-demo-${acc.email.split("@")[0]}`}
                onClick={() => {
                  setEmail(acc.email);
                  setPassword("password123");
                  setError("");
                }}
                className="text-left px-2.5 py-2 rounded-lg border border-slate-200 bg-white hover:border-brand-500 hover:bg-brand-50 transition"
              >
                <div className="text-xs font-semibold text-slate-800 truncate">{acc.label}</div>
                <div className="text-[10px] text-slate-500 truncate">{acc.email}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
