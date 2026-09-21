import React from "react";
import { prisma } from "@/lib/prisma";
import { StatusChip } from "@/components/ui/StatusChip";
import { LogOut, CheckCircle, Clock, ShieldCheck, AlertCircle } from "lucide-react";
import { DemobilizationClient } from "./DemobilizationClient";

export const dynamic = "force-dynamic";

export default async function DemobilizationPage() {
  let demobilizations: any[] = [];

  try {
    demobilizations = await prisma.demobilization.findMany({
      include: {
        assignment: {
          include: {
            worker: true,
            site: true,
            company: true,
          },
        },
        clearanceItems: true,
      },
      orderBy: { requestDate: "desc" },
    });
  } catch (e) {
    // Database initializing
  }

  const inClearanceCount = demobilizations.filter((d) => d.status === "IN_CLEARANCE").length;
  const closedCount = demobilizations.filter((d) => d.status === "CLOSED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <LogOut className="w-5 h-5 text-brand-600" />
            Demobilization & Multi-Item Clearance
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manajemen kepulangan pekerja, verifikasi serah terima aset/APD, mess camp, exit medical, dan penutupan penugasan.
          </p>
        </div>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">In Clearance Process</div>
            <div className="text-2xl font-bold text-slate-900">{inClearanceCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Demobilized & Completed</div>
            <div className="text-2xl font-bold text-slate-700">{closedCount}</div>
          </div>
        </div>
      </div>

      <DemobilizationClient demobilizations={demobilizations} />
    </div>
  );
}
