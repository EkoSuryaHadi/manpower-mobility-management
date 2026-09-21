"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  FileCheck,
  Sliders,
  ClipboardCheck,
  GitPullRequestDraft,
  Send,
  Building2,
  LogOut,
  BarChart3,
  HardHat,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Worker Master", href: "/workers", icon: Users },
  { label: "Bulk Onboarding", href: "/import", icon: FileSpreadsheet },
  { label: "Document Center", href: "/documents", icon: FileCheck },
  { label: "Requirement Rules", href: "/requirements", icon: Sliders },
  { label: "Pre-Mobilization", href: "/pre-mobilization", icon: ClipboardCheck },
  { label: "Approval Workspace", href: "/approvals", icon: GitPullRequestDraft, badge: "3" },
  { label: "Mobilization Board", href: "/mobilization", icon: Send },
  { label: "On-Site Manpower", href: "/on-site", icon: Building2 },
  { label: "Demobilization", href: "/demobilization", icon: LogOut },
  { label: "Reports & Analytics", href: "/reports", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800 bg-slate-950/60">
        <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-900/40">
          <HardHat className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
            MMS Enterprise
            <span className="text-[10px] bg-brand-500/20 text-brand-300 font-medium px-1.5 py-0.2 rounded border border-brand-500/30">MVP</span>
          </div>
          <div className="text-[11px] text-slate-400">Mobility Management</div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Core Operations
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                isActive
                  ? "bg-brand-600 text-white shadow-sm shadow-brand-900/50"
                  : "hover:bg-slate-800 hover:text-white text-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Project Scope Context Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-xs text-slate-400">
        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Active Project</div>
        <div className="font-semibold text-slate-200 truncate">Tangguh LNG Exp. Ph.2</div>
        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Offshore Rig Alpha (Rig A)
        </div>
      </div>
    </aside>
  );
}
