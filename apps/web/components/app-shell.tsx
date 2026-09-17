"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  ["/dashboard", "Dashboard", "⌂"], ["/workers", "Workers", "♟"],
  ["/documents", "Documents", "▤"], ["/pre-mob", "Pre-Mob", "☑"],
  ["/approvals", "Approvals", "✓"], ["/mobilizations", "Mobilization", "↗"],
  ["/demobilizations", "Demobilization", "↙"], ["/reports", "Reports", "▥"],
  ["/admin", "Admin", "⚙"],
] as const;

export default function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const current = links.find(([href]) => path === href || path.startsWith(`${href}/`));
  return <div className="app">
    <a className="skip" href="#content">Lewati navigasi</a>
    <aside className={open ? "sidebar open" : "sidebar"}>
      <Link className="brand" href="/dashboard" onClick={() => setOpen(false)}><span className="brand-rig" aria-hidden="true">▥</span><span>MMMS<small>MANPOWER MOBILITY</small></span></Link>
      <nav aria-label="Menu utama">{links.map(([href, label, icon]) => <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={current?.[0] === href ? "page" : undefined}><span className="nav-icon" aria-hidden="true">{icon}</span><span>{label}</span></Link>)}</nav>
      <div className="sidebar-bottom"><strong>Building<br />a Safer, Stronger<br />Workforce Together</strong><span>PEOPLE · PROJECTS · PROGRESS</span></div>
    </aside>
    <div className="workspace">
      <header className="topbar">
        <button className="menu-button" aria-expanded={open} onClick={() => setOpen(!open)}>☰</button>
        <label className="global-search"><span aria-hidden="true">⌕</span><input aria-label="Pencarian global" placeholder="Search workers, documents, sites..." /></label>
        <div className="topbar-actions"><button className="notification" aria-label="Notifikasi">♟<span /></button><Link className="account" href="/login"><span className="avatar">LA</span><span><strong>Local Admin</strong><small>{current?.[1] || "Account"}</small></span><span aria-hidden="true">⌄</span></Link></div>
      </header>
      <div id="content" tabIndex={-1}>{children}</div>
    </div>
  </div>;
}
