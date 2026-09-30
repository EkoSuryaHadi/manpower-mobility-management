"use client";

import React, { useState } from "react";
import {
  X,
  UserPlus,
  AlertCircle,
  Building2,
  HardHat,
  MapPin,
  Calendar,
  CheckCircle2,
} from "lucide-react";

interface OptionItem {
  id: string;
  name: string;
  code?: string;
  type?: string;
  projectId?: string;
}

interface RegisterWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newWorker: any) => void;
  companies: OptionItem[];
  projects: OptionItem[];
  sites: OptionItem[];
}

export function RegisterWorkerModal({
  isOpen,
  onClose,
  onSuccess,
  companies,
  projects,
  sites,
}: RegisterWorkerModalProps) {
  const defaultProjectId = projects[0]?.id || "";
  const defaultSiteId = sites.find((s) => s.projectId === defaultProjectId)?.id || sites[0]?.id || "";

  const [formData, setFormData] = useState({
    fullName: "",
    nik: "",
    employeeNo: "",
    passportNo: "",
    birthDate: "",
    birthPlace: "",
    gender: "MALE",
    nationality: "INDONESIAN",
    contactNumber: "",
    email: "",
    address: "",
    companyId: companies[0]?.id || "",
    projectId: defaultProjectId,
    siteId: defaultSiteId,
    position: "Welder",
    discipline: "PIPING",
    trade: "Welder 6G SMAW/GTAW",
    rotationSchedule: "28/28",
    startDate: new Date().toISOString().split("T")[0],
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  // Filter sites based on selected project
  const availableSites = sites.filter(
    (s) => !formData.projectId || s.projectId === formData.projectId
  );

  // Ensure siteId is always valid from availableSites
  const effectiveSiteId = formData.siteId && availableSites.some((s) => s.id === formData.siteId)
    ? formData.siteId
    : availableSites[0]?.id || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    // Validate NIK length
    if (formData.nik.length !== 16) {
      setErrorMsg("NIK harus berjumlah 16 digit angka sesuai e-KTP.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/v1/workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          siteId: effectiveSiteId,
        }),
      });

      const result = await res.json();
      if (!result.success) {
        throw new Error(result.error || "Gagal mendaftarkan pekerja");
      }

      setSuccessMsg("Pekerja berhasil didaftarkan ke Master Manpower!");
      setTimeout(() => {
        onSuccess(result.data);
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat registrasi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-8 overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Registrasi Pekerja Baru (Worker Master)</h2>
              <p className="text-[11px] text-slate-500">
                Pendaftaran data induk identitas tenaga kerja & penempatan awal site.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          {/* Section 1: Data Identitas Diri */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <span>1. Identitas Pokok & Biodata</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap (Sesuai KTP/Paspor) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hendra Pratama"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIK (16 Digit e-KTP) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  placeholder="e.g. 3201123456780009"
                  value={formData.nik}
                  onChange={(e) =>
                    setFormData({ ...formData, nik: e.target.value.replace(/\D/g, "") })
                  }
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  No. Pegawai / Employee No
                </label>
                <input
                  type="text"
                  placeholder="Otomatis di-generate jika kosong"
                  value={formData.employeeNo}
                  onChange={(e) => setFormData({ ...formData, employeeNo: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal Lahir *
                </label>
                <input
                  type="date"
                  required
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tempat Lahir
                </label>
                <input
                  type="text"
                  placeholder="e.g. Balikpapan / Surabaya"
                  value={formData.birthPlace}
                  onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jenis Kelamin *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="MALE">Laki-laki (Male)</option>
                  <option value="FEMALE">Perempuan (Female)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  No. Paspor (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. A12345678"
                  value={formData.passportNo}
                  onChange={(e) => setFormData({ ...formData, passportNo: e.target.value })}
                  className="w-full px-3 py-2 text-xs uppercase bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Kontak & Alamat */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <span>2. Kontak & Domisili</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  No. Telepon / WhatsApp *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 081234567890"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email (Opsional)
                </label>
                <input
                  type="email"
                  placeholder="e.g. worker@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Lengkap KTP / Domisili
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jl. Mulawarman RT 12 No. 45, Balikpapan Timur"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Penugasan Awal (Assignment) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <HardHat className="w-4 h-4 text-brand-600" />
                3. Alokasi Penempatan Awal (Initial Assignment)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-brand-100 text-brand-700 font-semibold">
                Status: PLANNED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vendor / Subkontraktor *
                </label>
                <select
                  value={formData.companyId}
                  onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-medium"
                >
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Operasional *
                </label>
                <select
                  value={formData.projectId}
                  onChange={(e) => {
                    const newProjectId = e.target.value;
                    const firstSite = sites.find((s) => s.projectId === newProjectId);
                    setFormData({ ...formData, projectId: newProjectId, siteId: firstSite?.id || "" });
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-medium"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Site / Lokasi Kerja *
                </label>
                <select
                  value={effectiveSiteId}
                  onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-medium"
                >
                  {availableSites.length === 0 ? (
                    <option value="">— Tidak ada site untuk project ini —</option>
                  ) : (
                    availableSites.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))
                  )}
                </select>
                {availableSites.length === 0 && (
                  <p className="text-[10px] text-rose-500 mt-1">⚠ Tidak ada site terdaftar untuk project ini. Assignment tidak akan dibuat.</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Posisi / Jabatan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Welder / Rigger / Scaffolder"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Disiplin Kerja *
                </label>
                <select
                  value={formData.discipline}
                  onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="PIPING">PIPING</option>
                  <option value="MECHANICAL">MECHANICAL</option>
                  <option value="CIVIL">CIVIL</option>
                  <option value="ELECTRICAL">ELECTRICAL</option>
                  <option value="INSTRUMENTATION">INSTRUMENTATION</option>
                  <option value="HSE">HSE & SAFETY</option>
                  <option value="DRILLING">DRILLING</option>
                  <option value="LOGISTICS">LOGISTICS</option>
                  <option value="ADMIN">ADMIN / SUPPORT</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jadwal Rotasi
                </label>
                <select
                  value={formData.rotationSchedule}
                  onChange={(e) =>
                    setFormData({ ...formData, rotationSchedule: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="28/28">28 Hari On / 28 Hari Off (Offshore)</option>
                  <option value="14/14">14 Hari On / 14 Hari Off</option>
                  <option value="5/2">5 Hari Kerja / 2 Hari Libur (Office/Yard)</option>
                  <option value="6/1">6 Hari Kerja / 1 Hari Libur</option>
                </select>
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-medium hover:bg-brand-500 transition shadow-sm disabled:opacity-50 flex items-center gap-1.5"
            >
              {loading ? "Menyimpan Pekerja..." : "Simpan & Daftarkan Pekerja"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
