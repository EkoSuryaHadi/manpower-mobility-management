"use client";

import React, { useState, useEffect } from "react";
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
import { DEMO_PERSONAS, MMSUserRole, DemoPersona } from "@/lib/auth";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
  roles?: MMSUserRole[];
}

const CORE_NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    roles: [
      "SYSTEM_ADMIN",
      "WFM_OFFICER",
      "SUBCONTRACTOR",
      "CONTRACTOR_HR",
      "CONTRACTOR_HSE",
      "CLIENT_APPROVER",
      "SITE_ADMIN",
      "MANAGEMENT_VIEWER",
    ],
  },
  {
    label: "Worker Master",
    href: "/workers",
    icon: Users,
    roles: [
      "SYSTEM_ADMIN",
      "WFM_OFFICER",
      "CONTRACTOR_HR",
      "CONTRACTOR_HSE",
      "CLIENT_APPROVER",
      "SITE_ADMIN",
      "MANAGEMENT_VIEWER",
    ],
  },
  {
    label: "Bulk Onboarding",
    href: "/import",
    icon: FileSpreadsheet,
    roles: ["SYSTEM_ADMIN", "WFM_OFFICER", "SUBCONTRACTOR", "CONTRACTOR_HR"],
  },
  {
    label: "Document Center",
    href: "/documents",
    icon: FileCheck,
    roles: [
      "SYSTEM_ADMIN",
      "WFM_OFFICER",
      "SUBCONTRACTOR",
      "CONTRACTOR_HR",
      "CONTRACTOR_HSE",
    ],
  },
  {
    label: "Due Date Watchlist",
    href: "/documents/expiry",
    icon: Clock,
    badge: "Alert",
    badgeColor: "bg-rose-500 text-white",
    roles: [
      "SYSTEM_ADMIN",
      "WFM_OFFICER",
      "SUBCONTRACTOR",
      "CONTRACTOR_HR",
      "CONTRACTOR_HSE",
    ],
  },
  {
    label: "Pre-Mobilization",
    href: "/pre-mobilization",
    icon: ClipboardCheck,
    roles: [
      "SYSTEM_ADMIN",
      "WFM_OFFICER",
      "SUBCONTRACTOR",
      "CONTRACTOR_HR",
      "CONTRACTOR_HSE",
    ],
  },
  {
    label: "Approval Workspace",
    href: "/approvals",
    icon: GitPullRequestDraft,
    badge: "3",
    badgeColor: "bg-amber-500 text-slate-950",
    roles: ["SYSTEM_ADMIN", "CONTRACTOR_HR", "CONTRACTOR_HSE", "CLIENT_APPROVER"],
  },
  {
    label: "Mobilization Board",
    href: "/mobilization",
    icon: Send,
    roles: ["SYSTEM_ADMIN", "WFM_OFFICER", "SITE_ADMIN", "CONTRACTOR_HR"],
  },
  {
    label: "On-Site Manpower",
    href: "/on-site",
    icon: Building2,
    roles: [
      "SYSTEM_ADMIN",
      "WFM_OFFICER",
      "SITE_ADMIN",
      "CONTRACTOR_HR",
      "CLIENT_APPROVER",
      "MANAGEMENT_VIEWER",
    ],
  },
  {
    label: "Demobilization",
    href: "/demobilization",
    icon: LogOut,
    roles: ["SYSTEM_ADMIN", "WFM_OFFICER", "SITE_ADMIN", "CONTRACTOR_HR"],
  },
];

const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    label: "Master Vendor & Quota",
    href: "/vendors",
    icon: Building,
    roles: [
      "SYSTEM_ADMIN",
      "WFM_OFFICER",
      "CONTRACTOR_HR",
      "CLIENT_APPROVER",
      "MANAGEMENT_VIEWER",
      "SUBCONTRACTOR",
    ],
  },
  {
    label: "Requirement Rules",
    href: "/requirements",
    icon: Sliders,
    roles: ["SYSTEM_ADMIN", "WFM_OFFICER", "CONTRACTOR_HSE"],
  },
  {
    label: "User & Access (RBAC)",
    href: "/users",
    icon: ShieldCheck,
    roles: ["SYSTEM_ADMIN"],
  },
  {
    label: "Reports & Analytics",
    href: "/reports",
    icon: BarChart3,
    roles: [
      "SYSTEM_ADMIN",
      "WFM_OFFICER",
      "CONTRACTOR_HR",
      "CONTRACTOR_HSE",
      "CLIENT_APPROVER",
      "MANAGEMENT_VIEWER",
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [currentRole, setCurrentRole] = useState<MMSUserRole>("SYSTEM_ADMIN");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const updateRole = () => {
      const saved = localStorage.getItem("mms_current_role") as MMSUserRole;
      if (saved && DEMO_PERSONAS[saved]) {
        setCurrentRole(saved);
      }
    };

    updateRole();
    window.addEventListener("mms_role_changed", updateRole);
    return () => window.removeEventListener("mms_role_changed", updateRole);
  }, []);

  const persona: DemoPersona = DEMO_PERSONAS[currentRole] || DEMO_PERSONAS.SYSTEM_ADMIN;

  // Filter menus based on active role
  const filterByRole = (items: NavItem[]) => {
    if (!isClient) return items; // Server-side render baseline
    if (currentRole === "SYSTEM_ADMIN") return items; // Admin sees all
    return items.filter((item) => !item.roles || item.roles.includes(currentRole));
  };

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
            <span className={`w-2 h-2 rounded-full ${persona.avatarBg}`} />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Akses Role Aktif
            </span>
          </div>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-brand-300 font-mono font-semibold">
            {visibleCoreItems.length + visibleAdminItems.length} Menu
          </span>
        </div>
        <div className="font-bold text-xs text-white truncate mt-1">{persona.roleLabel}</div>
        <div className="text-[11px] text-slate-400 truncate">{persona.companyName}</div>
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
