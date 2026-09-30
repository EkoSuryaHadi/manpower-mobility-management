"use client";

import React, { useState } from "react";
import { StatusChip } from "@/components/ui/StatusChip";
import { LogOut, Calendar, Clock, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

interface OnSiteBoardClientProps {
  assignments: any[];
}

export function OnSiteBoardClient({ assignments }: OnSiteBoardClientProps) {
  const router = useRouter();
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);
  const [reason, setReason] = useState("ROTATION_LEAVE");
  const [plannedDepartureDate, setPlannedDepartureDate] = useState(
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitDemob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/demobilizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId: selectedAssignment.id,
          reason,
          plannedDepartureDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengajukan demobilisasi");

      alert(`Permohonan demobilisasi untuk ${selectedAssignment.worker.fullName} berhasil diajukan.`);
      setSelectedAssignment(null);
      router.push("/demobilization");
      router.refresh();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* On-Site Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">Active On-Site Workforce Roster</h2>
          <span className="text-xs font-semibold text-slate-500">Live Physical Headcount</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Nama Pekerja</th>
                <th className="py-3 px-4">NIK & ID</th>
                <th className="py-3 px-4">Posisi & Disiplin</th>
                <th className="py-3 px-4">Site Penugasan</th>
                <th className="py-3 px-4">Subkon / Perusahaan</th>
                <th className="py-3 px-4">Tgl Tiba di Site</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Site Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {assignments.length > 0 ? (
                assignments.map((a) => {
                  const arrivalDate = a.mobilizations[0]?.actualArrivalDate;
                  const daysOnSite = arrivalDate
                    ? Math.max(0, Math.floor((Date.now() - new Date(arrivalDate).getTime()) / (1000 * 60 * 60 * 24)))
                    : 0;

                  return (
                    <tr key={a.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{a.worker.fullName}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        <div>{a.worker.nik}</div>
                        <div className="text-[10px] text-slate-400">{a.worker.employeeNo}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{a.position}</div>
                        <div className="text-[11px] text-slate-400">{a.discipline}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                          {a.site.name}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium">{a.company.name}</td>
                      <td className="py-3.5 px-4">
                        {arrivalDate ? (
                          <div>
                            <div className="font-medium text-slate-800">
                              {new Date(arrivalDate).toLocaleDateString("id-ID")}
                            </div>
                            <div className="text-[10px] text-brand-600 font-semibold flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {daysOnSite} Hari di Site
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusChip status={a.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedAssignment(a)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold border border-rose-200 transition"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Request Demob
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Tidak ada pekerja aktif di site saat ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Demobilization Request Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <LogOut className="w-4 h-4 text-rose-600" />
                Inisiasi Demobilisasi Pekerja
              </h3>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <div>Pekerja: <strong>{selectedAssignment.worker.fullName}</strong></div>
              <div>Posisi: {selectedAssignment.position} • {selectedAssignment.site.name}</div>
            </div>

            <form onSubmit={handleSubmitDemob} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Alasan Demobilisasi</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800"
                >
                  <option value="ROTATION_LEAVE">Cuti Rotasi Kerja (Rotation Leave)</option>
                  <option value="CONTRACT_END">Selesai Kontrak Penugasan (Contract End)</option>
                  <option value="MEDICAL_EVACUATION">Evakuasi Medis / Sakit (Medevac)</option>
                  <option value="RESIGNATION">Pengunduran Diri / Resign</option>
                  <option value="DISMISSAL">Pemutusan Hubungan Kerja (Dismissal)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Rencana Tanggal Kepulangan</label>
                <input
                  type="date"
                  value={plannedDepartureDate}
                  onChange={(e) => setPlannedDepartureDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800"
                  required
                />
              </div>

              <div className="text-[11px] bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-amber-800">
                Pengajuan akan membuat checklist clearance (Akomodasi, APD/Tools, ID Badge, Medis) yang wajib diselesaikan sebelum assignment ditutup.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAssignment(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Submit Demobilization Request"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
