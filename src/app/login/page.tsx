import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Masuk | MMS - Manpower Mobility Management System",
  description: "Masuk ke MMS untuk mengelola kepatuhan dokumen, approval, dan mobilisasi tenaga kerja.",
};

/** Only allow same-origin relative redirects to prevent open-redirect abuse. */
function safeNext(next: string | string[] | undefined): string {
  const value = Array.isArray(next) ? next[0] : next;
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\") || value === "/") return "/dashboard";
  return value;
}

// Seeded demo accounts — shown ONLY outside production to speed up local testing.
const DEMO_ACCOUNTS = [
  { email: "admin@mms.local", label: "System Admin" },
  { email: "wfm@petro.local", label: "WFM Officer" },
  { email: "vendor@subcon.local", label: "Subcontractor" },
  { email: "hr@contractor.local", label: "Contractor HR" },
  { email: "hse@contractor.local", label: "Contractor HSE" },
  { email: "approver@client.local", label: "Client Approver" },
  { email: "siteadmin@rig.local", label: "Site Admin" },
  { email: "management@corp.local", label: "Management" },
];

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string | string[] };
}) {
  const showDemo = process.env.NODE_ENV !== "production";

  return (
    <main className="min-h-screen w-full flex bg-slate-950">
      {/* Brand panel */}
      <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-slate-900 to-slate-950" />
        <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[22rem] h-[22rem] rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-900/50">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z" />
              <path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5" />
              <path d="M4 15v-3a6 6 0 0 1 6-6" />
              <path d="M14 6a6 6 0 0 1 6 6v3" />
            </svg>
          </div>
          <div>
            <div className="font-bold tracking-tight">MMS Enterprise</div>
            <div className="text-xs text-slate-400">Manpower Mobility Management</div>
          </div>
        </div>

        <div className="relative max-w-md space-y-6">
          <h2 className="text-3xl font-bold leading-tight">
            Setiap pekerja siap, patuh, dan terlacak — dari pre-mob sampai demob.
          </h2>
          <ul className="space-y-3 text-sm text-slate-300">
            {[
              "Readiness engine dengan hard-blocker dokumen",
              "Approval bertingkat HR → HSE → Client",
              "Monitoring dokumen kedaluwarsa real-time",
              "Audit trail untuk setiap aksi",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-slate-500">© {new Date().getFullYear()} MMS Enterprise</p>
      </section>

      {/* Form panel */}
      <section className="flex-1 flex items-center justify-center p-6 bg-slate-50 lg:rounded-l-3xl">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-slate-900">Masuk ke akun Anda</h1>
          <p className="text-sm text-slate-500 mt-1 mb-8">Gunakan email kerja dan password yang terdaftar.</p>
          <LoginForm next={safeNext(searchParams.next)} demoAccounts={showDemo ? DEMO_ACCOUNTS : []} />
        </div>
      </section>
    </main>
  );
}
