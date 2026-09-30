"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Building,
  Users,
  HardHat,
  Send,
  Clock,
  AlertTriangle,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  PieChart,
  UserCheck,
  Layers,
} from "lucide-react";
import { StatusChip } from "@/components/ui/StatusChip";

interface VendorProps {
  vendor: {
    id: string;
    name: string;
    code: string;
    type: string;
    address?: string | null;
    contactEmail?: string | null;
    contactPhone?: string | null;
    users: Array<{
      id: string;
      fullName: string;
      email: string;
      phone?: string | null;
      role: string;
      isActive: boolean;
    }>;
    assignments: Array<{
      id: string;
      position: string;
      discipline: string;
      status: string;
      rotationSchedule?: string | null;
      worker: {
        id: string;
        fullName: string;
        nik: string;
        employeeNo: string;
        overallReadinessScore: number;
        status: string;
      };
      site: {
        id: string;
        name: string;
      };
      project: {
        id: string;
        name: string;
      };
    }>;
    stats: {
      totalAssigned: number;
      onSiteCount: number;
      readyToMobilizeCount: number;
      preMobCount: number;
      plannedCount: number;
      approvedQuota: number;
      quotaUtilization: number;
      expiredDocs: Array<{
        id: string;
        workerId: string;
        workerName: string;
        nik: string;
        documentType: string;
        documentCode: string;
        documentNumber: string;
        expiryDate: string;
        daysRemaining: number;
        position: string;
        siteName: string;
      }>;
      expiringSoonDocs: Array<{
        id: string;
        workerId: string;
        workerName: string;
        nik: string;
        documentType: string;
        documentCode: string;
        documentNumber: string;
        expiryDate: string;
        daysRemaining: number;
        position: string;
        siteName: string;
      }>;
      ringBreakdown: {
        ring1: number;
        ring2: number;
        ring3: number;
        ring4: number;
        ring1Percent: number;
        ring2Percent: number;
        ring3Percent: number;
        ring4Percent: number;
      };
    };
  };
}

export function VendorDashboardClient({ vendor }: VendorProps) {
  const [activeTab, setActiveTab] = useState<"MANPOWER" | "DOCS" | "PICS">("MANPOWER");
  const { stats } = vendor;

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/vendors"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Master Vendor
        </Link>
        <span className="text-xs font-semibold text-slate-400">
          Vendor Code: <span className="font-mono text-slate-800 font-bold">{vendor.code}</span>
        </span>
      </div>

      {/* Vendor Profile Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
              {vendor.type}
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {vendor.id.slice(0, 8)}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{vendor.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
            {vendor.address && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {vendor.address}
              </span>
            )}
            {vendor.contactEmail && (
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {vendor.contactEmail}
              </span>
            )}
            {vendor.contactPhone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {vendor.contactPhone}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={`/documents/expiry`}
            className="flex items-center gap-2 px-3.5 py-2 bg-rose-950/70 hover:bg-rose-900/90 text-rose-200 rounded-lg text-xs font-medium border border-rose-800 transition"
          >
            <Clock className="w-4 h-4 text-rose-400" />
            Watchlist Dokumen ({stats.expiredDocs.length + stats.expiringSoonDocs.length})
          </Link>
          <Link
            href="/import"
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-medium shadow-md shadow-brand-900/40 transition"
          >
            Bulk Onboarding Pekerja
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Kuota Terisi (Utilization)</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">
            {stats.quotaUtilization}%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {stats.onSiteCount} On-Site / {stats.approvedQuota} Kuota Approved
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Actual On-Site Headcount</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <HardHat className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">{stats.onSiteCount}</div>
          <div className="text-[11px] text-emerald-600 mt-0.5 font-medium">Aktif bertugas di lokasi project</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Ready to Mobilize</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">{stats.readyToMobilizeCount}</div>
          <div className="text-[11px] text-indigo-600 mt-0.5 font-medium">100% compliant & disetujui</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Isu Kepatuhan Dokumen</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">
            {stats.expiredDocs.length} Expired
          </div>
          <div className="text-[11px] text-amber-600 mt-0.5 font-medium">
            + {stats.expiringSoonDocs.length} Mendekati expired (&lt;60h)
          </div>
        </div>
      </div>

      {/* Quota & Ring 1-4 Analysis Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Quota vs Actual Progress */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Kontrol Kuota & Status Manpower Vendor</h2>
              <p className="text-xs text-slate-500">Perbandingan real-time alokasi kuota vs penempatan aktual</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              Total Manpower: {stats.totalAssigned}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Kapasitas Lapangan Terpakai</span>
              <span className="font-bold text-slate-900">
                {stats.onSiteCount} dari {stats.approvedQuota} Slot ({stats.quotaUtilization}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className={`h-full rounded-full transition-all ${
                  stats.quotaUtilization > 90
                    ? "bg-rose-500"
                    : stats.quotaUtilization > 70
                    ? "bg-amber-500"
                    : "bg-brand-600"
                }`}
                style={{ width: `${Math.min(stats.quotaUtilization, 100)}%` }}
              />
            </div>
          </div>

          {/* Status Breakdown Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-100">
              <div className="text-[10px] font-bold text-emerald-700 uppercase">On-Site Active</div>
              <div className="text-xl font-bold text-emerald-900 mt-1">{stats.onSiteCount}</div>
            </div>
            <div className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-100">
              <div className="text-[10px] font-bold text-indigo-700 uppercase">Ready To Mob</div>
              <div className="text-xl font-bold text-indigo-900 mt-1">{stats.readyToMobilizeCount}</div>
            </div>
            <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-100">
              <div className="text-[10px] font-bold text-amber-700 uppercase">Pre-Mob Review</div>
              <div className="text-xl font-bold text-amber-900 mt-1">{stats.preMobCount}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold text-slate-600 uppercase">Planned / Staging</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{stats.plannedCount}</div>
            </div>
          </div>
        </div>

        {/* Right Col: Ring 1-4 Demographics */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-brand-600" />
              Demografi Tenaga Kerja (Ring 1–4)
            </h2>
            <p className="text-xs text-slate-500">Komposisi penyerapan tenaga kerja lokal</p>
          </div>

          <div className="space-y-2.5">
            <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-emerald-900">Ring 1 (Desa Terdekat)</div>
                <div className="text-[10px] text-emerald-700">Buffer zone & ring terdekat site</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-emerald-900">{stats.ringBreakdown.ring1} Org</div>
                <div className="text-[10px] text-emerald-700">{stats.ringBreakdown.ring1Percent}%</div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-teal-50/80 border border-teal-200/80 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-teal-900">Ring 2 (Kecamatan)</div>
                <div className="text-[10px] text-teal-700">Wilayah kecamatan operasional</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-teal-900">{stats.ringBreakdown.ring2} Org</div>
                <div className="text-[10px] text-teal-700">{stats.ringBreakdown.ring2Percent}%</div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-blue-50/80 border border-blue-200/80 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-blue-900">Ring 3 (Kabupaten / Provinsi)</div>
                <div className="text-[10px] text-blue-700">Pekerja lokal daerah provinsi</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-blue-900">{stats.ringBreakdown.ring3} Org</div>
                <div className="text-[10px] text-blue-700">{stats.ringBreakdown.ring3Percent}%</div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-800">Ring 4 (Nasional / Luar)</div>
                <div className="text-[10px] text-slate-500">Spesialis luar daerah/nasional</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-slate-900">{stats.ringBreakdown.ring4} Org</div>
                <div className="text-[10px] text-slate-500">{stats.ringBreakdown.ring4Percent}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Manpower List vs Expired Docs vs PICs */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("MANPOWER")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === "MANPOWER"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Daftar Manpower ({vendor.assignments.length})
            </button>
            <button
              onClick={() => setActiveTab("DOCS")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "DOCS"
                  ? "bg-rose-600 text-white"
                  : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Isu Dokumen Vendor ({stats.expiredDocs.length + stats.expiringSoonDocs.length})
            </button>
            <button
              onClick={() => setActiveTab("PICS")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === "PICS"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              PIC & Pengguna Vendor ({vendor.users.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Manpower List */}
        {activeTab === "MANPOWER" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/80">
                <tr>
                  <th className="px-5 py-3">Nama Pekerja & NIK</th>
                  <th className="px-5 py-3">Posisi & Disiplin</th>
                  <th className="px-5 py-3">Penempatan Site</th>
                  <th className="px-5 py-3">Readiness Score</th>
                  <th className="px-5 py-3">Status Mobilitas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {vendor.assignments.length > 0 ? (
                  vendor.assignments.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0 border border-slate-200">
                            {a.worker.fullName.charAt(0)}
                          </div>
                          <div>
                            <Link
                              href={`/workers/${a.worker.id}`}
                              className="font-bold text-slate-900 hover:text-brand-600 transition flex items-center gap-1"
                            >
                              {a.worker.fullName}
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </Link>
                            <div className="text-[11px] text-slate-400">NIK: {a.worker.nik}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-800">{a.position}</div>
                        <div className="text-[10px] text-slate-400">{a.discipline}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-800">{a.site.name}</div>
                        <div className="text-[10px] text-slate-400">{a.project.name}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`font-bold ${
                            a.worker.overallReadinessScore === 100
                              ? "text-emerald-600"
                              : a.worker.overallReadinessScore >= 75
                              ? "text-amber-600"
                              : "text-rose-600"
                          }`}
                        >
                          {a.worker.overallReadinessScore}% Ready
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusChip status={a.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                      Belum ada pekerja yang ditugaskan di bawah vendor ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Expired & Expiring Documents */}
        {activeTab === "DOCS" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/80">
                <tr>
                  <th className="px-5 py-3">Nama Pekerja & NIK</th>
                  <th className="px-5 py-3">Jenis Dokumen</th>
                  <th className="px-5 py-3">Lokasi Penempatan</th>
                  <th className="px-5 py-3">Tanggal Expired</th>
                  <th className="px-5 py-3">Status Masa Berlaku</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {stats.expiredDocs.length === 0 && stats.expiringSoonDocs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-emerald-600 font-medium">
                      Seluruh berkas kepatuhan pekerja vendor ini dalam kondisi aktif dan valid!
                    </td>
                  </tr>
                ) : (
                  <>
                    {stats.expiredDocs.map((d) => (
                      <tr key={d.id} className="bg-rose-50/30 hover:bg-rose-50/60 transition">
                        <td className="px-5 py-3.5">
                          <Link
                            href={`/workers/${d.workerId}`}
                            className="font-bold text-slate-900 hover:text-rose-600"
                          >
                            {d.workerName}
                          </Link>
                          <div className="text-[11px] text-slate-400">NIK: {d.nik}</div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-slate-800">{d.documentType}</div>
                          <div className="text-[10px] font-mono text-slate-400">{d.documentCode}</div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-slate-800">{d.siteName}</div>
                          <div className="text-[10px] text-slate-400">{d.position}</div>
                        </td>
                        <td className="px-5 py-3.5 font-medium text-slate-800">
                          {new Date(d.expiryDate).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                            Expired {Math.abs(d.daysRemaining)} hari lalu
                          </span>
                        </td>
                      </tr>
                    ))}
                    {stats.expiringSoonDocs.map((d) => (
                      <tr key={d.id} className="bg-amber-50/30 hover:bg-amber-50/60 transition">
                        <td className="px-5 py-3.5">
                          <Link
                            href={`/workers/${d.workerId}`}
                            className="font-bold text-slate-900 hover:text-amber-600"
                          >
                            {d.workerName}
                          </Link>
                          <div className="text-[11px] text-slate-400">NIK: {d.nik}</div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-slate-800">{d.documentType}</div>
                          <div className="text-[10px] font-mono text-slate-400">{d.documentCode}</div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-slate-800">{d.siteName}</div>
                          <div className="text-[10px] text-slate-400">{d.position}</div>
                        </td>
                        <td className="px-5 py-3.5 font-medium text-slate-800">
                          {new Date(d.expiryDate).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            {d.daysRemaining} hari lagi
                          </span>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: PICs */}
        {activeTab === "PICS" && (
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {vendor.users.map((u) => (
              <div key={u.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                    {u.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{u.fullName}</div>
                    <div className="text-[10px] text-slate-500">{u.role}</div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-600 space-y-1 pt-1 border-t border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>{u.email}</span>
                  </div>
                  {u.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{u.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
