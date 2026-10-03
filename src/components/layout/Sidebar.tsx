"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  FileCheck,
  Clock,
  Sliders,
  ClipboardCheck,
  GitPullRequestDraft,
  Send,
  Building2,
  LogOut,
  BarChart3,
  HardHat,
  ShieldCheck,
  Building,
  Eye,
  Filter,
} from "lucide-react";
import { DEMO_PERSONAS } from "@/lib/auth";
import { canAccessRoute } from "@/lib/route-access";
import type { SessionUser } from "./types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

// Role visibility for each item is defined centrally in src/lib/route-access.ts
const CORE_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Worker Master", href: "/workers", icon: Users },
  { label: "Bulk Onboarding", href: "/import", icon: FileSpreadsheet },
  { label: "Document Center", href: "/documents", icon: FileCheck },
  {
    label: "Due Date Watchlist",
    href: "/documents/expiry",
    icon: Clock,
    badge: "Alert",
    badgeColor: "bg-rose-500 text-white",
  },
  { label: "Pre-Mobilization", href: "/pre-mobilization", icon: ClipboardCheck },
  {
    label: "Approval Workspace",
    href: "/approvals",
    icon: GitPullRequestDraft,
    badge: "3",
    badgeColor: "bg-amber-500 text-slate-950",
  },
  { label: "Mobilization Board", href: "/mobilization", icon: Send },
  { label: "On-Site Manpower", href: "/on-site", icon: Building2 },
  { label: "Demobilization", href: "/demobilization", icon: LogOut },
];

const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "Master Vendor & Quota", href: "/vendors", icon: Building },
  { label: "Requirement Rules", href: "/requirements", icon: Sliders },
  { label: "User & Access (RBAC)", href: "/users", icon: ShieldCheck },
  { label: "Reports & Analytics", href: "/reports", icon: BarChart3 },
];

export function Sidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const persona = DEMO_PERSONAS[user.role];

  // Filter menus based on the authenticated user's role (same rules the middleware enforces)
  const filterByRole = (items: NavItem[]) => items.filter((item) => canAccessRoute(user.role, item.href));

  const visibleCoreItems = filterByRole(CORE_NAV_ITEMS);
  const visibleAdminItems = filterByRole(ADMIN_NAV_ITEMS);

  const renderNavGroup = (items: NavItem[]) =>
    items.map((item) => {
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
          <div className="flex items-center gap-3 min-w-0">
            <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
            <span className="truncate">{item.label}</span>
          </div>
          {item.badge && (
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                item.badgeColor || "bg-amber-500 text-slate-950"
              }`}
            >
              {item.badge}
            </span>
          )}
        </Link>
      );
    });

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
            <span className="text-[10px] bg-brand-500/20 text-brand-300 font-medium px-1.5 py-0.2 rounded border border-brand-500/30">
              WFM
            </span>
          </div>
          <div className="text-[11px] text-slate-400">Mobility Management</div>
        </div>
      </div>

      {/* Active Role Persona Indicator */}
      <div className="p-3 mx-3 my-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${persona?.avatarBg ?? "bg-slate-500"}`} />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Akses Role Aktif
            </span>
          </div>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-brand-300 font-mono font-semibold">
            {visibleCoreItems.length + visibleAdminItems.length} Menu
          </span>
        </div>
        <div className="font-bold text-xs text-white truncate mt-1">{persona?.roleLabel ?? user.role}</div>
        <div className="text-[11px] text-slate-400 truncate">{user.companyName ?? "-"}</div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-2 px-3 overflow-y-auto space-y-4">
        {visibleCoreItems.length > 0 && (
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Workforce Mobility</span>
              <span className="text-[9px] text-slate-500 font-normal">({visibleCoreItems.length})</span>
            </div>
            <div className="space-y-1">{renderNavGroup(visibleCoreItems)}</div>
          </div>
        )}

        {visibleAdminItems.length > 0 && (
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Governance & Setup</span>
              <span className="text-[9px] text-slate-500 font-normal">({visibleAdminItems.length})</span>
            </div>
            <div className="space-y-1">{renderNavGroup(visibleAdminItems)}</div>
          </div>
        )}
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
