import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { StatusChip } from "@/components/ui/StatusChip";
import type { WorkerListItem } from "@/types";

interface WorkerTableRowProps {
  worker: WorkerListItem;
}

export function WorkerTableRow({ worker }: WorkerTableRowProps) {
  const currentAssignment = worker.assignments?.[0];
  const isReady = worker.overallReadinessScore === 100;

  return (
    <tr className="hover:bg-slate-50/60 transition">
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-700 border border-brand-200 font-bold flex items-center justify-center text-xs shrink-0">
            {worker.fullName.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-slate-900">{worker.fullName}</div>
            <div className="text-[11px] text-slate-400 font-mono">{worker.employeeNo}</div>
          </div>
        </div>
      </td>
      <td className="py-3.5 px-4">
        <div className="font-mono text-slate-800 font-medium">{worker.nik}</div>
        <div className="text-[11px] text-slate-400">
          {new Date(worker.birthDate).toLocaleDateString("id-ID")} &bull; {worker.gender}
        </div>
      </td>
      <td className="py-3.5 px-4">
        <div className="font-medium text-slate-800 truncate max-w-xs">{currentAssignment?.company?.name || "Unassigned"}</div>
        <div className="text-[10px] text-slate-400 uppercase">{currentAssignment?.company?.type || "-"}</div>
      </td>
      <td className="py-3.5 px-4">
        {currentAssignment ? (
          <div>
            <div className="font-semibold text-slate-800">{currentAssignment.position}</div>
            <div className="text-[11px] text-slate-500">{currentAssignment.site?.name || "-"} ({currentAssignment.discipline})</div>
          </div>
        ) : (
          <span className="text-slate-400 italic">No Active Site Assignment</span>
        )}
      </td>
      <td className="py-3.5 px-4 text-center">
        <div className="inline-flex flex-col items-center">
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${isReady ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
            {worker.overallReadinessScore}%
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5">{isReady ? "Ready" : "Blocked"}</span>
        </div>
      </td>
      <td className="py-3.5 px-4"><StatusChip status={worker.status} /></td>
      <td className="py-3.5 px-4 text-right">
        <Link href={`/workers/${worker.id}`}
          className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 rounded-md font-medium text-xs border border-slate-200 transition">
          Profile <ExternalLink className="w-3 h-3" />
        </Link>
      </td>
    </tr>
  );
}
