import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatusChip } from "@/components/ui/StatusChip";
import {
  Users,
  Search,
  Plus,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Shield,
  Filter,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function WorkersPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string; company?: string };
}) {
  const query = searchParams?.q?.toLowerCase() || "";
  const statusFilter = searchParams?.status || "";

  let workers: any[] = [];
  let totalCount = 0;
  let readyCount = 0;
  let blockedCount = 0;

  try {
    workers = await prisma.worker.findMany({
      where: {
        AND: [
          query
            ? {
                OR: [
                  { fullName: { contains: query } },
                  { nik: { contains: query } },
                  { employeeNo: { contains: query } },
                ],
              }
            : {},
          statusFilter ? { status: statusFilter } : {},
        ],
      },
      include: {
        assignments: {
          include: {
            project: true,
            site: true,
            company: true,
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        documents: {
          include: { documentType: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    totalCount = await prisma.worker.count();
    readyCount = await prisma.worker.count({
      where: { overallReadinessScore: 100 },
    });
    blockedCount = await prisma.worker.count({
      where: { overallReadinessScore: { lt: 100 } },
    });
  } catch (e) {
    // Database might not be migrated yet
  }

  return (
    <div className="space-y-6">
      {/* Header & Page Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-600" />
            Worker Master Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Single source of truth data pekerja, riwayat penugasan, dan status kepatuhan dokumen.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/import"
            className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 shadow-sm transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Bulk Import Excel
          </Link>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-medium shadow-sm transition"
            title="Tambah pekerja baru secara individual"
          >
            <Plus className="w-4 h-4" />
            Register Worker
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Total Registered Workers</div>
            <div className="text-xl font-bold text-slate-900">{totalCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">100% Fully Compliant</div>
            <div className="text-xl font-bold text-emerald-700">{readyCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Compliance Deficient / Blocked</div>
            <div className="text-xl font-bold text-rose-700">{blockedCount}</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <form method="GET" className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search by worker name, NIK, or Employee No..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition text-slate-800"
          />
        </form>

        <div className="flex items-center gap-2">
          <select
            name="status"
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none text-slate-700"
          >
            <option value="">All Employment Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="BLACKLISTED">Blacklisted</option>
          </select>
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition">
            <Filter className="w-3.5 h-3.5" />
            Apply Filters
          </button>
        </div>
      </div>

      {/* Workers Data Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Worker Info</th>
                <th className="py-3.5 px-4">NIK / Identitas</th>
                <th className="py-3.5 px-4">Perusahaan / Subcon</th>
                <th className="py-3.5 px-4">Active Assignment</th>
                <th className="py-3.5 px-4 text-center">Readiness</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {workers.length > 0 ? (
                workers.map((w) => {
                  const currentAssignment = w.assignments[0];
                  const isReady = w.overallReadinessScore === 100;

                  return (
                    <tr key={w.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-700 border border-brand-200 font-bold flex items-center justify-center text-xs shrink-0">
                            {w.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{w.fullName}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{w.employeeNo}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono text-slate-800 font-medium">{w.nik}</div>
                        <div className="text-[11px] text-slate-400">
                          {new Date(w.birthDate).toLocaleDateString("id-ID")} • {w.gender}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800 truncate max-w-xs">
                          {currentAssignment?.company?.name || "Unassigned"}
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase">
                          {currentAssignment?.company?.type || "-"}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {currentAssignment ? (
                          <div>
                            <div className="font-semibold text-slate-800">{currentAssignment.position}</div>
                            <div className="text-[11px] text-slate-500">
                              {currentAssignment.site.name} ({currentAssignment.discipline})
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No Active Site Assignment</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              isReady
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {w.overallReadinessScore}%
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            {isReady ? "Ready" : "Blocked"}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusChip status={w.status} />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/workers/${w.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 rounded-md font-medium text-xs border border-slate-200 transition"
                        >
                          Profile
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada pekerja yang ditemukan. Coba ubah kata kunci pencarian atau import data baru.
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
