"use client";

import React, { useState } from "react";
import {
  Users,
  Shield,
  UserPlus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Building2,
  Mail,
  Phone,
  KeyRound,
  ShieldCheck,
  ChevronRight,
  Info,
} from "lucide-react";
import { DEMO_PERSONAS, MMSUserRole, ROLE_PERMISSIONS, MMSPermission } from "@/lib/auth";

interface CompanyOption {
  id: string;
  name: string;
  code: string;
  type: string;
}

interface UserItem {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  role: string;
  isActive: boolean;
  companyId?: string | null;
  company?: CompanyOption | null;
  createdAt: string | Date;
}

const ROLE_BADGES: Record<string, { label: string; color: string; bg: string; border: string }> = {
  SYSTEM_ADMIN: {
    label: "System Admin",
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  WFM_OFFICER: {
    label: "WFM Officer",
    color: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-200",
  },
  SUBCONTRACTOR: {
    label: "Subcontractor / Vendor",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  CONTRACTOR_HR: {
    label: "Contractor HR",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  CONTRACTOR_HSE: {
    label: "Contractor HSE",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  CLIENT_APPROVER: {
    label: "Client Approver",
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
  },
  SITE_ADMIN: {
    label: "Site Admin",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  MANAGEMENT_VIEWER: {
    label: "Management Viewer",
    color: "text-slate-700",
    bg: "bg-slate-100",
    border: "border-slate-200",
  },
};

export function UserManagementClient({
  initialUsers,
  companies,
}: {
  initialUsers: UserItem[];
  companies: CompanyOption[];
}) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("ALL");
  const [selectedCompany, setSelectedCompany] = useState<string>("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMatrixModal, setShowMatrixModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "WFM_OFFICER",
    companyId: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.company?.name && u.company.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = selectedRole === "ALL" || u.role === selectedRole;
    const matchesCompany = selectedCompany === "ALL" || u.companyId === selectedCompany;

    return matchesSearch && matchesRole && matchesCompany;
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to create user");
      }

      setUsers([result.data, ...users]);
      setShowAddModal(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        role: "WFM_OFFICER",
        companyId: "",
      });
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-400 uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4 text-brand-400" />
            Pillar 9 • Security & Access Control
          </div>
          <h1 className="text-2xl font-bold tracking-tight">User & Group Access System</h1>
          <p className="text-slate-300 text-xs mt-1 max-w-2xl">
            Manajemen akun pengguna, hak akses Role-Based Access Control (RBAC) untuk WFM Officer, Main Contractor HR/HSE, Subcontractor, dan Client Approver.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowMatrixModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium border border-slate-700 transition shadow-sm"
          >
            <KeyRound className="w-4 h-4 text-brand-400" />
            Role Permission Matrix
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-medium shadow-md shadow-brand-900/40 transition"
          >
            <UserPlus className="w-4 h-4" />
            Tambah Pengguna
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Users</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">{users.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Terdaftar di database</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active WFM & Reviewers</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">
            {users.filter((u) => ["WFM_OFFICER", "CONTRACTOR_HR", "CONTRACTOR_HSE", "CLIENT_APPROVER"].includes(u.role)).length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Memiliki hak verifikasi & approval</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Vendor / Subcontractor</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">
            {users.filter((u) => u.role === "SUBCONTRACTOR").length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Akses upload & submission</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">System Roles</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">
            {Object.keys(ROLE_PERMISSIONS).length} Roles
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Konfigurasi hak akses modular</div>
        </div>
      </div>

      {/* Filters & Search Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, email, atau perusahaan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="ALL">Semua Role</option>
              {Object.keys(ROLE_BADGES).map((r) => (
                <option key={r} value={r}>
                  {ROLE_BADGES[r].label}
                </option>
              ))}
            </select>

            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="ALL">Semua Perusahaan</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/80">
              <tr>
                <th className="px-5 py-3">Nama & Email</th>
                <th className="px-5 py-3">Role & Akses</th>
                <th className="px-5 py-3">Perusahaan / Afiliasi</th>
                <th className="px-5 py-3">Kontak</th>
                <th className="px-5 py-3">Status Akun</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  const roleBadge = ROLE_BADGES[u.role] || {
                    label: u.role,
                    color: "text-slate-700",
                    bg: "bg-slate-100",
                    border: "border-slate-200",
                  };

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0 border border-slate-200">
                            {u.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{u.fullName}</div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-slate-400" />
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${roleBadge.bg} ${roleBadge.color} ${roleBadge.border}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {roleBadge.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {u.company ? (
                          <div>
                            <div className="font-semibold text-slate-800">{u.company.name}</div>
                            <div className="text-[10px] text-slate-400">
                              {u.company.type} • {u.company.code}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Internal System</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        {u.phone ? (
                          <div className="flex items-center gap-1 text-slate-600">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {u.phone}
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        {u.isActive ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-500 font-medium">
                            <XCircle className="w-3.5 h-3.5" />
                            Non-aktif
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                    Tidak ada data pengguna yang sesuai dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permission Matrix Modal */}
      {showMatrixModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-brand-600" />
                  Role & Group Permission Matrix
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Standar pemisahan tugas (Separation of Duties) berdasarkan 9 Poin WFM.
                </p>
              </div>
              <button
                onClick={() => setShowMatrixModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(Object.keys(ROLE_PERMISSIONS) as MMSUserRole[]).map((r) => {
                  const permissions = ROLE_PERMISSIONS[r];
                  const persona = DEMO_PERSONAS[r];
                  const badge = ROLE_BADGES[r];

                  return (
                    <div
                      key={r}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.bg} ${badge.color} ${badge.border}`}
                        >
                          {badge.label}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">
                          {permissions.length} Hak Akses
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {persona?.description || "Standar deskripsi peran."}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {permissions.map((p) => (
                          <span
                            key={p}
                            className="px-2 py-0.5 rounded text-[10px] font-medium bg-white text-slate-600 border border-slate-200"
                          >
                            {p.toLowerCase().replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowMatrixModal(false)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-medium hover:bg-slate-700 transition"
              >
                Tutup Matrix
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900">Tambah Akun Pengguna Baru</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daftarkan staf WFM, Kontraktor, atau Client Approver.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <XCircle className="w-4 h-4 shrink-0" />
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ahmad Rizky Pratama"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Email (Login ID) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. user@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hak Akses / Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    {Object.keys(ROLE_BADGES).map((r) => (
                      <option key={r} value={r}>
                        {ROLE_BADGES[r].label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    No. Telepon / WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +62 812-3456-7890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Perusahaan / Kontraktor Afiliasi
                </label>
                <select
                  value={formData.companyId}
                  onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="">-- Internal System / Non-Vendor --</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.type})
                    </option>
                  ))}
                </select>
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
                  {loading ? "Menyimpan..." : "Simpan Pengguna"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
