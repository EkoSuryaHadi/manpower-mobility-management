"use client";
import React from "react";
import { SearchInput } from "@/components/ui/SearchInput";
import { Card } from "@/components/ui/Card";
import type { OptionItem } from "@/types";

interface WorkerFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  companyFilter: string;
  onCompanyChange: (value: string) => void;
  companies: OptionItem[];
}

export function WorkerFilterBar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  companyFilter,
  onCompanyChange,
  companies,
}: WorkerFilterBarProps) {
  return (
    <Card>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <SearchInput
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search by worker name, NIK, or Employee No..."
        />
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none text-slate-700"
          >
            <option value="">All Employment Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="BLACKLISTED">Blacklisted</option>
          </select>
          <select
            value={companyFilter}
            onChange={(e) => onCompanyChange(e.target.value)}
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
    </Card>
  );
}
