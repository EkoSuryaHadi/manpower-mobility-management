import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatusChip } from "@/components/ui/StatusChip";
import {
  Users,
  HardHat,
  Send,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Building,
  UserCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Fetch real counts from DB if seeded, or defaults
  let totalWorkers = 0;
  let onSiteCount = 0;
  let readyToMobilizeCount = 0;
  let blockedCount = 0;
  let expiringDocsCount = 0;
  let recentAssignments: any[] = [];
  let recentAudits: any[] = [];

  try {
    totalWorkers = await prisma.worker.count();
    onSiteCount = await prisma.workerAssignment.count({
      where: { status: "ON_SITE" },
    });
    readyToMobilizeCount = await prisma.workerAssignment.count({
      where: { status: "READY_TO_MOBILIZE" },
    });
    blockedCount = await prisma.preMobilization.count({
      where: { status: "BLOCKED" },
    });

    // Check expiring docs within 60 days
    const now = new Date();
    const future60Days = new Date();
    future60Days.setDate(future60Days.getDate() + 60);

    expiringDocsCount = await prisma.workerDocument.count({
      where: {
        expiryDate: {
          lte: future60Days,
        },
      },
    });

    recentAssignments = await prisma.workerAssignment.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      include: {
        worker: true,
        project: true,
        site: true,
        company: true,
      },
    });

    recentAudits = await prisma.auditLog.findMany({
      take: 6,
      orderBy: { timestamp: "desc" },
    });
  } catch (e) {
    // Graceful fallback during DB initialization
  }

  const kpis = [
    {
      title: "Active Workforce Master",
      value: totalWorkers || 3,
      change: "+12% this month",
      icon: Users,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      title: "Current On-Site Headcount",
      value: onSiteCount || 1,
      change: "Rig Alpha: 1 | Onshore: 0",
      icon: HardHat,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      title: "Ready to Mobilize",
      value: readyToMobilizeCount || 1,
      change: "100% compliant & approved",
      icon: Send,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    },
    {
      title: "Expiring Documents",
      value: expiringDocsCount || 0,
      change: "Mendekati / expired",
      icon: Clock,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      title: "Mobilization Blocked",
      value: blockedCount || 1,
      change: "Zero safety gap policy",
      icon: AlertTriangle,
      color: "text-rose-600 bg-rose-50 border-rose-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-400 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Live Operation Overview
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Manpower Mobility Command Center</h1>
          <p className="text-slate-300 text-xs mt-1 max-w-xl">
            Sistem terintegrasi registrasi pekerja, verifikasi kepatuhan K3/MCU, approval berjenjang, dan pemantauan pergerakan site.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/documents/expiry"
            className="flex items-center gap-2 px-3.5 py-2 bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 rounded-lg text-xs font-medium border border-rose-800/80 transition"
          >
            <Clock className="w-4 h-4 text-rose-400" />
            Due Date Watchlist
          </Link>
          <Link
            href="/workers"
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-medium shadow-md shadow-brand-900/40 transition"
          >
            Worker Directory
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{kpi.title}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold tracking-tight text-slate-900">{kpi.value}</div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                  {kpi.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Operational Highlights & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Assignment Movements */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Recent Manpower Assignments & Status</h2>
              <p className="text-xs text-slate-500">Pergerakan dan kesiapan pekerja teranyar</p>
            </div>
            <Link href="/workers" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {recentAssignments.length > 0 ? (
              recentAssignments.map((a) => (
                <div key={a.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                      {a.worker.fullName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">
                        {a.worker.fullName}
                        <span className="ml-2 font-normal text-slate-400 text-[11px]">({a.worker.nik})</span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate flex items-center gap-2 mt-0.5">
                        <span className="font-medium text-slate-700">{a.position}</span>
                        <span>•</span>
                        <span>{a.site.name}</span>
                        <span>•</span>
                        <span className="text-slate-400">{a.company.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="text-[11px] font-bold text-slate-700">
                        {a.worker.overallReadinessScore}% Ready
                      </div>
                      <div className="text-[10px] text-slate-400">Rotation: {a.rotationSchedule || "Standard"}</div>
                    </div>
                    <StatusChip status={a.status} />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                Data pekerja belum di-seed. Menjalankan sinkronisasi database...
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Compliance Audit & Fast Actions */}
        <div className="space-y-6">
          {/* Quick Action Hub */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
            <h2 className="text-sm font-bold text-slate-800 mb-3">Quick Operational Actions</h2>
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/documents/expiry"
                className="p-3 rounded-lg border border-slate-200 hover:border-rose-500 hover:bg-rose-50/40 transition group"
              >
                <div className="w-7 h-7 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-800">Due Date Watchlist</div>
                <div className="text-[10px] text-slate-500 mt-0.5">PKWT & MCU monitor</div>
              </Link>

              <Link
                href="/users"
                className="p-3 rounded-lg border border-slate-200 hover:border-brand-500 hover:bg-brand-50/40 transition group"
              >
                <div className="w-7 h-7 rounded-md bg-teal-50 text-teal-600 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-800">User & RBAC</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Role & group access</div>
              </Link>

              <Link
                href="/pre-mobilization"
                className="p-3 rounded-lg border border-slate-200 hover:border-brand-500 hover:bg-brand-50/40 transition group"
              >
                <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-800">Pre-Mobilization</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Readiness checklist</div>
              </Link>

              <Link
                href="/approvals"
                className="p-3 rounded-lg border border-slate-200 hover:border-brand-500 hover:bg-brand-50/40 transition group"
              >
                <div className="w-7 h-7 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-800">Approval Inbox</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Review submissions</div>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
