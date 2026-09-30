"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Filter,
} from "lucide-react";
import { StatusChip } from "@/components/ui/StatusChip";
import { RegisterWorkerModal } from "@/components/workers/RegisterWorkerModal";

interface WorkerItem {
  id: string;
  fullName: string;
  nik: string;
  employeeNo: string;
  birthDate: string | Date;
  gender: string;
  status: string;
  overallReadinessScore: number;
  assignments: Array<{
    id: string;
    position: string;
    discipline: string;
    status: string;
    rotationSchedule?: string | null;
    company?: {
      name: string;
      type: string;
    } | null;
    project?: {
      name: string;
      code: string;
    } | null;
    site?: {
      name: string;
      code: string;
    } | null;
  }>;
}

interface OptionItem {
  id: string;
  name: string;
  code?: string;
  type?: string;
  projectId?: string;
}

export function WorkersClient({
  initialWorkers,
  companies,
  projects,
  sites,
}: {
  initialWorkers: WorkerItem[];
  companies: OptionItem[];
  projects: OptionItem[];
  sites: OptionItem[];
}) {
  const [workers, setWorkers] = useState<WorkerItem[]>(initialWorkers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalCount = workers.length;
  const readyCount = workers.filter((w) => w.overallReadinessScore === 100).length;
  const blockedCount = workers.filter((w) => w.overallReadinessScore < 100).length;

  const filteredWorkers = workers.filter((w) => {
    const matchesSearch =
      w.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.employeeNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.assignments[0]?.position &&
        w.assignments[0].position.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = !statusFilter || w.status === statusFilter;
    const matchesCompany =
      !companyFilter ||
      (w.assignments[0]?.company?.name &&
        w.assignments[0].company.name.toLowerCase().includes(companyFilter.toLowerCase()));

    return matchesSearch && matchesStatus && matchesCompany;
  });

  const handleWorkerRegistered = (newWorker: any) => {
    setWorkers([newWorker, ...workers]);
  };

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
            onClick={() => setIsModalOpen(true)}
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
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by worker name, NIK, or Employee No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none text-slate-700"
          >
            <option value="">All Employment Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="BLACKLISTED">Blacklisted</option>
          </select>

          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none text-slate-700"
          >
            <option value="">Semua Vendor / Perusahaan</option>
            {companies.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
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
              {filteredWorkers.length > 0 ? (
                filteredWorkers.map((w) => {
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
                              {currentAssignment.site?.name || "-"} ({currentAssignment.discipline})
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
                    Tidak ada pekerja yang ditemukan. Coba ubah kata kunci pencarian atau daftarkan pekerja baru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Worker Modal */}
      <RegisterWorkerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleWorkerRegistered}
        companies={companies}
        projects={projects}
        sites={sites}
      />
    </div>
  );
}
