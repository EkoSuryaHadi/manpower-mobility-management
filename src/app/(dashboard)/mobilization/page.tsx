import React from "react";
import { prisma } from "@/lib/prisma";
import { StatusChip } from "@/components/ui/StatusChip";
import {
  Send,
  Plane,
  Ship,
  Bus,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { MobilizationActionClient } from "./MobilizationActionClient";

export const dynamic = "force-dynamic";

export default async function MobilizationPage() {
  let mobilizations: any[] = [];

  try {
    mobilizations = await prisma.mobilization.findMany({
      include: {
        assignment: {
          include: {
            worker: true,
            site: true,
            company: true,
          },
        },
      },
      orderBy: { departureDate: "desc" },
    });
  } catch (e) {
    // Database initializing
  }

  const scheduledCount = mobilizations.filter((m) => m.status === "SCHEDULED").length;
  const inTransitCount = mobilizations.filter((m) => m.status === "IN_TRANSIT").length;
  const arrivedCount = mobilizations.filter((m) => m.status === "ARRIVED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Send className="w-5 h-5 text-brand-600" />
            Mobilization & Movement Board
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Jadwal keberangkatan, manifest perjalanan (Pesawat / Speedboat), dan konfirmasi kedatangan di site.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Scheduled Departures</div>
            <div className="text-lg font-bold text-slate-900">{scheduledCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Ship className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-500">In Transit Movement</div>
            <div className="text-lg font-bold text-amber-700">{inTransitCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Confirmed Arrived On Site</div>
            <div className="text-lg font-bold text-emerald-700">{arrivedCount}</div>
          </div>
        </div>
      </div>

      {/* Mobilization Board Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">Flight & Transit Manifest</h2>
          <span className="text-xs text-slate-500 font-medium">Real-Time Travel Tracking</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Pekerja</th>
                <th className="py-3 px-4">Moda & No. Tiket/Armada</th>
                <th className="py-3 px-4">Rute Perjalanan</th>
                <th className="py-3 px-4">Jadwal Keberangkatan</th>
                <th className="py-3 px-4">Estimasi Tiba</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Site Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {mobilizations.length > 0 ? (
                mobilizations.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{m.assignment.worker.fullName}</div>
                      <div className="text-[11px] text-slate-500">
                        {m.assignment.position} • {m.assignment.company.name}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {m.travelMethod === "SPEEDBOAT" ? (
                          <Ship className="w-4 h-4 text-brand-600" />
                        ) : (
                          <Plane className="w-4 h-4 text-blue-600" />
                        )}
                        <div>
                          <div className="font-mono font-bold text-slate-800">{m.flightOrVehicleNo}</div>
                          <div className="text-[10px] text-slate-400 uppercase">{m.travelMethod}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium">{m.departurePoint}</div>
                      <div className="text-[11px] text-brand-600 font-semibold flex items-center gap-1">
                        <ArrowRight className="w-3 h-3" />
                        {m.assignment.site.name}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">
                        {new Date(m.departureDate).toLocaleDateString("id-ID")}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {new Date(m.departureDate).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">
                        {new Date(m.estimatedArrivalDate).toLocaleDateString("id-ID")}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {new Date(m.estimatedArrivalDate).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusChip status={m.status} />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <MobilizationActionClient
                        mobilizationId={m.id}
                        status={m.status}
                        workerName={m.assignment.worker.fullName}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Belum ada jadwal keberangkatan aktif.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
