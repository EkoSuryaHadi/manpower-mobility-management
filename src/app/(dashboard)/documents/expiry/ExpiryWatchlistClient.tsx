"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Search,
  Filter,
  ArrowUpRight,
  Send,
  FileCheck,
  Building2,
  User,
  ExternalLink,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

interface ExpiryDocItem {
  id: string;
  workerId: string;
  workerName: string;
  nik: string;
  employeeNo: string;
  documentType: string;
  documentCode: string;
  documentCategory: string;
  documentNumber: string;
  issueDate: string | null;
  expiryDate: string | null;
  daysRemaining: number | null;
  expiryStatus: "EXPIRED" | "URGENT" | "WARNING" | "SAFE" | "NO_EXPIRY";
  verificationStatus: string;
  companyName: string;
  projectName: string;
  siteName: string;
  position: string;
  fileUrl: string | null;
  fileName: string | null;
}

const EXPIRY_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string; icon: React.ComponentType<{ className?: string }> }
> = {
  EXPIRED: {
    label: "Sudah Kedaluwarsa",
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    icon: AlertTriangle,
  },
  URGENT: {
    label: "Kritis (<30 Hari)",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: Clock,
  },
  WARNING: {
    label: "Mendekati (<60 Hari)",
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    icon: Calendar,
  },
  SAFE: {
    label: "Masa Berlaku Aman",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: CheckCircle2,
  },
  NO_EXPIRY: {
    label: "Tanpa Masa Berlaku",
    color: "text-slate-600",
    bg: "bg-slate-100",
    border: "border-slate-200",
    icon: CheckCircle2,
  },
};

export function ExpiryWatchlistClient({
  initialDocs,
  categories,
}: {
  initialDocs: ExpiryDocItem[];
  categories: string[];
}) {
  const [docs, setDocs] = useState<ExpiryDocItem[]>(initialDocs);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [reminderSuccess, setReminderSuccess] = useState<string | null>(null);

  // Stats calculation
  const totalCount = docs.length;
  const expiredCount = docs.filter((d) => d.expiryStatus === "EXPIRED").length;
  const urgentCount = docs.filter((d) => d.expiryStatus === "URGENT").length;
  const warningCount = docs.filter((d) => d.expiryStatus === "WARNING").length;
  const safeCount = docs.filter((d) => d.expiryStatus === "SAFE").length;

  const filteredDocs = docs.filter((d) => {
    // Tab Filter
    let matchesTab = true;
    if (activeTab === "EXPIRED") matchesTab = d.expiryStatus === "EXPIRED";
    else if (activeTab === "URGENT") matchesTab = d.expiryStatus === "URGENT";
    else if (activeTab === "WARNING") matchesTab = d.expiryStatus === "WARNING";
    else if (activeTab === "EXPIRING_SOON")
      matchesTab = d.expiryStatus === "EXPIRED" || d.expiryStatus === "URGENT" || d.expiryStatus === "WARNING";
    else if (activeTab === "SAFE") matchesTab = d.expiryStatus === "SAFE";

    // Category Filter
    const matchesCategory = selectedCategory === "ALL" || d.documentCategory === selectedCategory;

    // Search Filter
    const matchesSearch =
      d.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.documentNumber.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesCategory && matchesSearch;
  });

  const handleSendReminder = (doc: ExpiryDocItem) => {
    setReminderSuccess(`Reminder perpanjangan berkas ${doc.documentType} untuk ${doc.workerName} (${doc.companyName}) berhasil dikirim!`);
    setTimeout(() => {
      setReminderSuccess(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1">
            <Clock className="w-4 h-4 text-rose-400 animate-pulse" />
            Pillar 6 • Continuous Compliance Watchlist
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Monitoring Due Date Dokumen Manpower</h1>
          <p className="text-slate-300 text-xs mt-1 max-w-2xl">
            Pusat kontrol dan peringatan dini masa berlaku PKWT, Medical Check-Up (MCU Oil & Gas), Sertifikat K3/SIO Welder, dan Paspor pekerja on-site & pre-mobilisasi.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/documents"
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium border border-slate-700 transition"
          >
            <FileCheck className="w-4 h-4 text-brand-400" />
            Document Verification Hub
          </Link>
          <Link
            href="/requirements"
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-medium shadow-md shadow-brand-900/40 transition"
          >
            Rule Simulator
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Alert toast if reminder sent */}
      {reminderSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{reminderSuccess}</span>
          </div>
          <button
            onClick={() => setReminderSuccess(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold"
          >
            ✕
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveTab("EXPIRED")}
          className={`p-5 rounded-xl border text-left transition ${
            activeTab === "EXPIRED"
              ? "bg-rose-50/80 border-rose-400 ring-2 ring-rose-400/20 shadow-sm"
              : "bg-white border-slate-200/80 hover:border-rose-300 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700">Sudah Kedaluwarsa</span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">{expiredCount}</div>
          <div className="text-[11px] text-rose-600 mt-0.5 font-medium">Memblokir mobilitas pekerja</div>
        </button>

        <button
          onClick={() => setActiveTab("URGENT")}
          className={`p-5 rounded-xl border text-left transition ${
            activeTab === "URGENT"
              ? "bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/20 shadow-sm"
              : "bg-white border-slate-200/80 hover:border-amber-300 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700">Kritis (&lt;30 Hari)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">{urgentCount}</div>
          <div className="text-[11px] text-amber-600 mt-0.5 font-medium">Perlu tindakan perpanjangan segera</div>
        </button>

        <button
          onClick={() => setActiveTab("WARNING")}
          className={`p-5 rounded-xl border text-left transition ${
            activeTab === "WARNING"
              ? "bg-yellow-50/80 border-yellow-400 ring-2 ring-yellow-400/20 shadow-sm"
              : "bg-white border-slate-200/80 hover:border-yellow-300 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-yellow-700">Mendekati (&lt;60 Hari)</span>
            <div className="w-8 h-8 rounded-lg bg-yellow-100 text-yellow-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">{warningCount}</div>
          <div className="text-[11px] text-yellow-600 mt-0.5 font-medium">Dalam jendela pemantauan WFM</div>
        </button>

        <button
          onClick={() => setActiveTab("SAFE")}
          className={`p-5 rounded-xl border text-left transition ${
            activeTab === "SAFE"
              ? "bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-400/20 shadow-sm"
              : "bg-white border-slate-200/80 hover:border-emerald-300 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700">Masa Berlaku Aman</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">{safeCount}</div>
          <div className="text-[11px] text-emerald-600 mt-0.5 font-medium">&gt; 60 hari masa aktif</div>
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Navigation Tabs & Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setActiveTab("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "ALL"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              Semua Berkas ({totalCount})
            </button>
            <button
              onClick={() => setActiveTab("EXPIRING_SOON")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === "EXPIRING_SOON"
                  ? "bg-rose-600 text-white"
                  : "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Prioritas WFM ({expiredCount + urgentCount + warningCount})
            </button>
            <button
              onClick={() => setActiveTab("EXPIRED")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "EXPIRED"
                  ? "bg-rose-700 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              Expired ({expiredCount})
            </button>
            <button
              onClick={() => setActiveTab("URGENT")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "URGENT"
                  ? "bg-amber-600 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              &lt; 30 Hari ({urgentCount})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari pekerja, NIK, jenis berkas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="ALL">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Watchlist Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/80">
              <tr>
                <th className="px-5 py-3">Nama Pekerja & NIK</th>
                <th className="px-5 py-3">Dokumen & No. Registrasi</th>
                <th className="px-5 py-3">Perusahaan & Penempatan</th>
                <th className="px-5 py-3">Tanggal Expired</th>
                <th className="px-5 py-3">Sisa Waktu</th>
                <th className="px-5 py-3 text-right">Aksi Cepat WFM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((d) => {
                  const statusConfig = EXPIRY_CONFIG[d.expiryStatus] || EXPIRY_CONFIG.NO_EXPIRY;
                  const StatusIcon = statusConfig.icon;

                  return (
                    <tr key={d.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0 border border-slate-200">
                            {d.workerName.charAt(0)}
                          </div>
                          <div>
                            <Link
                              href={`/workers/${d.workerId}`}
                              className="font-bold text-slate-900 hover:text-brand-600 transition flex items-center gap-1"
                            >
                              {d.workerName}
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </Link>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              NIK: {d.nik} • {d.position}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-800">{d.documentType}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono text-[10px]">
                            {d.documentCode}
                          </span>
                          <span>No: {d.documentNumber || "-"}</span>
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-800">{d.companyName}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {d.projectName} ({d.siteName})
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        {d.expiryDate ? (
                          <div>
                            <div className="font-semibold text-slate-800">
                              {new Date(d.expiryDate).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Terbit: {d.issueDate ? new Date(d.issueDate).toLocaleDateString("id-ID") : "-"}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Masa berlaku permanen</span>
                        )}
                      </td>

                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5 shrink-0" />
                          {d.daysRemaining !== null ? (
                            d.daysRemaining < 0 ? (
                              <span>Expired {Math.abs(d.daysRemaining)} hari lalu</span>
                            ) : (
                              <span>{d.daysRemaining} Hari Lagi</span>
                            )
                          ) : (
                            <span>Permanen</span>
                          )}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleSendReminder(d)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition"
                            title="Kirim reminder perpanjangan ke vendor"
                          >
                            <Send className="w-3 h-3 text-slate-500" />
                            Reminder
                          </button>
                          <Link
                            href={`/documents?workerId=${d.workerId}`}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-brand-50 hover:bg-brand-100 text-brand-700 flex items-center gap-1 transition"
                          >
                            <FileCheck className="w-3 h-3 text-brand-600" />
                            Verifikasi
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    Tidak ada berkas dokumen yang memerlukan perhatian dalam filter ini.
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
