"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
const links = [["/dashboard","Ringkasan","01"],["/workers","Data pekerja","02"],["/assignments","Penugasan","03"],["/approvals","Persetujuan","04"],["/mobilizations","Mobilisasi","05"],["/demobilizations","Demobilisasi","06"],["/reports","Laporan","07"]];
export default function AppShell({children}:{children:React.ReactNode}) {
 const path=usePathname(); const [open,setOpen]=useState(false);
 return <div className="app"><a className="skip" href="#content">Lewati navigasi</a><aside className={open?"sidebar open":"sidebar"}><Link className="brand" href="/dashboard"><span className="brand-mark">m.</span><span>manpower<small>MOBILITY MANAGEMENT</small></span></Link><p className="nav-label">RUANG KERJA</p><nav aria-label="Menu utama">{links.map(([href,label,num])=><Link key={href} href={href} onClick={()=>setOpen(false)} aria-current={path===href?"page":undefined}><span className="nav-number">{num}</span>{label}<span className="nav-arrow">›</span></Link>)}</nav><div className="sidebar-bottom"><span className="workspace-dot"/> Operasional manpower<small>Satu tempat. Seluruh perjalanan.</small></div></aside><div className="workspace"><header className="topbar"><button className="menu-button secondary" aria-expanded={open} onClick={()=>setOpen(!open)}>Menu</button><span>Workspace <span className="crumb">/</span> <strong>{links.find(([p])=>p===path)?.[1]||"Akses akun"}</strong></span><Link className="account" href="/login"><span className="avatar">MM</span> Akses akun ↗</Link></header><div id="content" tabIndex={-1}>{children}</div><footer>Manpower Mobility <span>Operasional yang terhubung.</span></footer></div></div>;
}
