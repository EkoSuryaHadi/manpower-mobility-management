"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Users, FileSpreadsheet, Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { RegisterWorkerModal } from "@/components/workers/RegisterWorkerModal";
import { WorkerMetricsBar } from "@/components/workers/WorkerMetricsBar";
import { WorkerFilterBar } from "@/components/workers/WorkerFilterBar";
import { WorkerTable } from "@/components/workers/WorkerTable";
import type { WorkerListItem, OptionItem } from "@/types";

interface WorkersClientProps {
  initialWorkers: any[];
  companies: OptionItem[];
  projects: OptionItem[];
  sites: OptionItem[];
}

export function WorkersClient({ initialWorkers, companies, projects, sites }: WorkersClientProps) {
  const [workers, setWorkers] = useState<any[]>(initialWorkers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const readyCount = workers.filter((w) => w.overallReadinessScore === 100).length;
  const blockedCount = workers.filter((w) => w.overallReadinessScore < 100).length;

  const filteredWorkers = workers.filter((w) => {
    const matchesSearch =
      w.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.employeeNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.assignments?.[0]?.position?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !statusFilter || w.status === statusFilter;
    const matchesCompany = !companyFilter || w.assignments?.[0]?.company?.name?.toLowerCase().includes(companyFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesCompany;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-600" /> Worker Master Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Single source of truth data pekerja, riwayat penugasan, dan status kepatuhan dokumen.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link href="/import">
            <Button variant="secondary" icon={<FileSpreadsheet className="w-4 h-4 text-emerald-600" />}>Bulk Import Excel</Button>
          </Link>
          <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>Register Worker</Button>
        </div>
      </div>

      <WorkerMetricsBar totalCount={workers.length} readyCount={readyCount} blockedCount={blockedCount} />
      <WorkerFilterBar
        searchTerm={searchTerm} onSearchChange={setSearchTerm}
        statusFilter={statusFilter} onStatusChange={setStatusFilter}
        companyFilter={companyFilter} onCompanyChange={setCompanyFilter}
        companies={companies}
      />
      <WorkerTable workers={filteredWorkers as WorkerListItem[]} />

      <RegisterWorkerModal
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
        onSuccess={(newWorker: any) => setWorkers([newWorker, ...workers])}
        companies={companies} projects={projects} sites={sites}
      />
    </div>
  );
}
