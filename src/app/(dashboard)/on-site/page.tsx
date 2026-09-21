import React from "react";
import { prisma } from "@/lib/prisma";
import { StatusChip } from "@/components/ui/StatusChip";
import {
  Building2,
  HardHat,
  Users,
  Search,
  Filter,
  LogOut,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { OnSiteBoardClient } from "./OnSiteBoardClient";

export const dynamic = "force-dynamic";

export default async function OnSitePage() {
  let onSiteAssignments: any[] = [];
  let rigCount = 0;
  let onshoreCount = 0;

  try {
    onSiteAssignments = await prisma.workerAssignment.findMany({
      where: { status: "ON_SITE" },
      include: {
        worker: true,
        project: true,
        site: true,
        company: true,
        mobilizations: {
          orderBy: { actualArrivalDate: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    rigCount = onSiteAssignments.filter((a) => a.site.siteType === "OFFSHORE").length;
    onshoreCount = onSiteAssignments.filter((a) => a.site.siteType === "ONSHORE").length;
  } catch (e) {
    // Database initializing
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-600" />
            Live On-Site Manpower Board
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar absensi dan kehadiran fisik tenaga kerja aktif di fasilitas project & site operasional.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <HardHat className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Total Active On-Site Headcount</div>
            <div className="text-2xl font-bold text-slate-900">{onSiteAssignments.length}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Offshore Platform (Rig Alpha)</div>
            <div className="text-2xl font-bold text-blue-700">{rigCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Onshore Terminal</div>
            <div className="text-2xl font-bold text-purple-700">{onshoreCount}</div>
          </div>
        </div>
      </div>

      <OnSiteBoardClient assignments={onSiteAssignments} />
    </div>
  );
}
