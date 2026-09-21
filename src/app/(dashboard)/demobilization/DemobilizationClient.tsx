"use client";

import React, { useState } from "react";
import { StatusChip } from "@/components/ui/StatusChip";
import {
  CheckCircle2,
  Circle,
  Clock,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface DemobilizationClientProps {
  demobilizations: any[];
}

export function DemobilizationClient({ demobilizations }: DemobilizationClientProps) {
  const router = useRouter();
  const [selectedDemobId, setSelectedDemobId] = useState<string>(
    demobilizations[0]?.id || ""
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [localDemobs, setLocalDemobs] = useState(demobilizations);

  const activeDemob = localDemobs.find((d) => d.id === selectedDemobId) || localDemobs[0];

  const handleToggleItem = async (itemId: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/v1/demobilizations/clearance/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCleared: !currentStatus }),
      });

      setLocalDemobs((prev) =>
        prev.map((d) =>
          d.id === activeDemob.id
            ? {
                ...d,
                clearanceItems: d.clearanceItems.map((item: any) =>
                  item.id === itemId ? { ...item, isCleared: !currentStatus } : item
                ),
              }
            : d
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleCloseAssignment = async () => {
    if (!activeDemob) return;

    setIsProcessing(true);
    try {
      const res = await fetch(`/api/v1/demobilizations/${activeDemob.id}/close`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyelesaikan demobilisasi");

      alert(`Clearance selesai. Assignment pekerja resmi ditutup (DEMOBILIZED).`);
      router.refresh();
      window.location.reload();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!activeDemob) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-xs text-slate-400">
        Belum ada permohonan demobilisasi pekerja aktif.
      </div>
    );
  }

  const worker = activeDemob.assignment.worker;
  const allCleared =
    activeDemob.clearanceItems.length > 0 &&
    activeDemob.clearanceItems.every((item: any) => item.isCleared);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left List (5 cols) */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3">
        <h2 className="text-xs font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center justify-between">
          <span>Daftar Permohonan Kepulangan</span>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
            {localDemobs.length} Records
          </span>
        </h2>

        <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
          {localDemobs.map((d) => {
            const isSelected = d.id === activeDemob.id;
            const clearedCount = d.clearanceItems.filter((i: any) => i.isCleared).length;

            return (
              <button
                key={d.id}
                onClick={() => setSelectedDemobId(d.id)}
                className={`w-full text-left p-3 rounded-xl border transition ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-md"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{d.assignment.worker.fullName}</span>
                  <StatusChip status={d.status} />
                </div>
                <div className={`text-[11px] mt-0.5 ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                  {d.assignment.position} • {d.assignment.site.name}
                </div>
                <div className={`mt-2 pt-2 border-t text-[10px] flex items-center justify-between ${isSelected ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"}`}>
                  <span>Alasan: {d.reason.replace(/_/g, " ")}</span>
                  <span className="font-bold">
                    {clearedCount}/{d.clearanceItems.length} Cleared
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Column: Clearance Workspace (7 cols) */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Clearance & Handover Protocol
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">{worker.fullName}</h2>
            <div className="text-xs text-slate-500 mt-0.5">
              NIK: <span className="font-mono text-slate-700">{worker.nik}</span> • Perusahaan: {activeDemob.assignment.company.name}
            </div>
          </div>
          <StatusChip status={activeDemob.status} />
        </div>

        {/* Departure Details */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Alasan Kepulangan</span>
            <span className="font-bold text-slate-800">{activeDemob.reason.replace(/_/g, " ")}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Rencana Tanggal Keberangkatan</span>
            <span className="font-bold text-slate-800">
              {new Date(activeDemob.plannedDepartureDate).toLocaleDateString("id-ID")}
            </span>
          </div>
        </div>

        {/* Clearance Checklist Items */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span>Mandatory Clearance Checklist</span>
            <span className="text-brand-600 font-bold">
              {activeDemob.clearanceItems.filter((i: any) => i.isCleared).length} / {activeDemob.clearanceItems.length} Selesai
            </span>
          </h3>

          <div className="space-y-2">
            {activeDemob.clearanceItems.map((item: any) => (
              <div
                key={item.id}
                onClick={() => activeDemob.status !== "CLOSED" && handleToggleItem(item.id, item.isCleared)}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                  item.isCleared
                    ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                } ${activeDemob.status === "CLOSED" ? "cursor-default opacity-80" : ""}`}
              >
                <div className="flex items-center gap-3">
                  {item.isCleared ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                  <div>
                    <div className="text-xs font-bold">{item.itemName}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide">
                      Category: {item.category}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    item.isCleared
                      ? "bg-emerald-200/60 text-emerald-800"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {item.isCleared ? "CLEARED" : "PENDING"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Complete Action */}
        {activeDemob.status !== "CLOSED" && (
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              {allCleared ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Seluruh 4 item clearance telah disetujui. Siap menutup penugasan.
                </span>
              ) : (
                <span className="text-amber-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Selesaikan semua checklist clearance untuk menutup assignment pekerja.
                </span>
              )}
            </div>

            <button
              onClick={handleCloseAssignment}
              disabled={!allCleared || isProcessing}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Menutup Assignment...
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4 text-rose-400" />
                  Finalize Clearance & Close Assignment
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
