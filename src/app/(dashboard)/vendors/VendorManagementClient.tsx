"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Building,
  Users,
  Plus,
  Search,
  ArrowUpRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  HardHat,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface PicInfo {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role: string;
}

interface CompanyItem {
  id: string;
  name: string;
  code: string;
  type: string;
  address?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  totalUsers: number;
  picList: PicInfo[];
  stats: {
    totalAssigned: number;
    onSiteCount: number;
    readyToMobilizeCount: number;
    preMobCount: number;
    approvedQuota: number;
    quotaUtilization: number;
    expiringDocsCount: number;
    expiredDocsCount: number;
    ringBreakdown: {
      ring1: number;
      ring2: number;
      ring3: number;
      ring4: number;
    };
  };
}

const TYPE_BADGES: Record<string, { label: string; color: string; bg: string; border: string }> = {
  CLIENT: {
    label: "Project Owner / Client",
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
  },
  MAIN_CONTRACTOR: {
    label: "Main Contractor",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  SUBCONTRACTOR: {
    label: "Subcontractor",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  VENDOR: {
    label: "Vendor / Supplier",
    color: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-200",
  },
};

export function VendorManagementClient({
  initialCompanies,
}: {
  initialCompanies: CompanyItem[];
}) {
  const [companies, setCompanies] = useState<CompanyItem[]>(initialCompanies);
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "SUBCONTRACTOR",
    address: "",
    contactEmail: "",
    contactPhone: "",
    picName: "",
    picEmail: "",
    picPhone: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const filteredCompanies = companies.filter((c) => {
    const matchesType = selectedType === "ALL" || c.type === selectedType;
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.contactEmail && c.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesType && matchesSearch;
  });

  const totalVendors = companies.length;
  const subconCount = companies.filter((c) => c.type === "SUBCONTRACTOR" || c.type === "VENDOR").length;
  const totalAssignedWorkers = companies.reduce((acc, c) => acc + c.stats.totalAssigned, 0);
  const totalOnSite = companies.reduce((acc, c) => acc + c.stats.onSiteCount, 0);

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/v1/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to create company");
      }

      // Refresh list
      window.location.reload();
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-400 uppercase tracking-wider mb-1">
            <Building className="w-4 h-4 text-brand-400" />
            Pillar 1 & 7 • Vendor Ecosystem & Quota Governance
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Master Vendor & Quota Monitoring</h1>
          <p className="text-slate-300 text-xs mt-1 max-w-2xl">
            Database seluruh kontraktor/vendor, PIC perusahaan, alokasi kuota tenaga kerja, dan pemantauan demografi pekerja Ring 1–4.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-medium shadow-md shadow-brand-900/40 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          Registrasi Vendor Baru
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Organisasi</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">{totalVendors}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Client, Main Con & Subcon</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Subkontraktor / Vendor</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">{subconCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Penyedia tenaga kerja terdaftar</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Manpower Terdaftar</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">{totalAssignedWorkers}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Pekerja terafiliasi vendor</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Actual On-Site Headcount</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <HardHat className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">{totalOnSite}</div>
          <div className="text-[11px] text-emerald-600 mt-0.5 font-medium">Aktif bertugas di site</div>
        </div>
      </div>

      {/* Filter and Cards Container */}
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama vendor, kode, email kontak..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setSelectedType("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedType === "ALL" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Semua ({companies.length})
            </button>
            {Object.keys(TYPE_BADGES).map((typeKey) => (
              <button
                key={typeKey}
                onClick={() => setSelectedType(typeKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedType === typeKey ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {TYPE_BADGES[typeKey].label}
              </button>
            ))}
          </div>
        </div>

        {/* Vendor Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCompanies.map((c) => {
            const typeBadge = TYPE_BADGES[c.type] || TYPE_BADGES.VENDOR;
            const primaryPic = c.picList[0] || null;

            return (
              <div
                key={c.id}
                className="bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold text-slate-900 text-base">{c.name}</h2>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold border border-slate-200">
                          {c.code}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border mt-1.5 ${typeBadge.bg} ${typeBadge.color} ${typeBadge.border}`}
                      >
                        {typeBadge.label}
                      </span>
                    </div>

                    <Link
                      href={`/vendors/${c.id}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-50 hover:bg-brand-100 text-brand-700 flex items-center gap-1 transition shrink-0"
                    >
                      Buka Portal
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {c.address && (
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{c.address}</span>
                    </div>
                  )}

                  {/* Quota & Headcount Progress Bar */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-600">Alokasi Kuota Manpower</span>
                      <span className="font-bold text-slate-900">
                        {c.stats.onSiteCount} / {c.stats.approvedQuota} Pekerja ({c.stats.quotaUtilization}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          c.stats.quotaUtilization > 90
                            ? "bg-rose-500"
                            : c.stats.quotaUtilization > 70
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.min(c.stats.quotaUtilization, 100)}%` }}
                      />
                    </div>

                    {/* Ring 1-4 Demographic Badges */}
                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 border-t border-slate-200/60">
                      <span>Demografi Lokal:</span>
                      <div className="flex items-center gap-1 font-semibold">
                        <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                          R1: {c.stats.ringBreakdown.ring1}
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-teal-100 text-teal-800">
                          R2: {c.stats.ringBreakdown.ring2}
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-800">
                          R3: {c.stats.ringBreakdown.ring3}
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                          R4: {c.stats.ringBreakdown.ring4}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer: PIC Contact and Expired Warning */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    {primaryPic ? (
                      <div className="text-[11px] text-slate-600">
                        <span className="font-semibold text-slate-800">PIC:</span> {primaryPic.fullName}
                        <span className="text-slate-400 ml-1">({primaryPic.email})</span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Belum ada PIC terdaftar</span>
                    )}
                  </div>

                  {c.stats.expiredDocsCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      <AlertTriangle className="w-3 h-3" />
                      {c.stats.expiredDocsCount} Dokumen Expired
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Vendor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900">Registrasi Vendor / Kontraktor Baru</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daftarkan profil perusahaan rekanan dan kontak Person In Charge (PIC).
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCompany} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Perusahaan / Vendor *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PT Borneo Mekanikal Prima"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kode *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BMP"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Perusahaan *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="SUBCONTRACTOR">Subcontractor</option>
                    <option value="VENDOR">Vendor / Supplier</option>
                    <option value="MAIN_CONTRACTOR">Main Contractor</option>
                    <option value="CLIENT">Client / Owner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">No. Telp Perusahaan</label>
                  <input
                    type="text"
                    placeholder="e.g. +62-542-777001"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Kantor</label>
                <input
                  type="text"
                  placeholder="e.g. Kawasan Industri Kariangau Blok C, Balikpapan"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-800 mb-2">Kontak Person In Charge (PIC)</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Nama PIC (e.g. Hendra Wijaya)"
                      value={formData.picName}
                      onChange={(e) => setFormData({ ...formData, picName: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email PIC (Login Vendor)"
                      value={formData.picEmail}
                      onChange={(e) => setFormData({ ...formData, picEmail: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-medium hover:bg-brand-500 transition shadow-sm disabled:opacity-50"
                >
                  {loading ? "Menyimpan..." : "Simpan Vendor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
