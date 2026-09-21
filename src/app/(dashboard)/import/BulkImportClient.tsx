"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  FileSpreadsheet,
  UploadCloud,
  Download,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
  RefreshCw,
  Building,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface StagingRow {
  index: number;
  fullName: string;
  nik: string;
  birthDate: string;
  gender: string;
  contactNumber: string;
  position: string;
  discipline: string;
  trade: string;
  status: "VALID" | "DUPLICATE" | "ERROR";
  errorMessages: string[];
}

interface BulkImportClientProps {
  companies: any[];
  projects: any[];
  sites: any[];
  existingNiks: string[];
}

export function BulkImportClient({
  companies,
  projects,
  sites,
  existingNiks,
}: BulkImportClientProps) {
  const router = useRouter();
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || "");
  const [selectedSiteId, setSelectedSiteId] = useState(sites[0]?.id || "");
  const [selectedCompanyId, setSelectedCompanyId] = useState(companies[0]?.id || "");

  const [stagedRows, setStagedRows] = useState<StagingRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Download Sample Template
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        "Nama Lengkap": "Eko Prasetyo",
        "NIK (16 Digit)": "3201123456780099",
        "Tanggal Lahir (YYYY-MM-DD)": "1990-05-14",
        "Jenis Kelamin (MALE/FEMALE)": "MALE",
        "Nomor HP / WA": "081299887766",
        "Posisi / Jabatan": "Welder",
        "Disiplin": "PIPING",
        "Trade / Kualifikasi": "Welder 6G SMAW",
        "Rotasi": "28/28",
      },
      {
        "Nama Lengkap": "Suryanto",
        "NIK (16 Digit)": "3201123456780098",
        "Tanggal Lahir (YYYY-MM-DD)": "1988-12-01",
        "Jenis Kelamin (MALE/FEMALE)": "MALE",
        "Nomor HP / WA": "081388776655",
        "Posisi / Jabatan": "Rigger",
        "Disiplin": "MECHANICAL",
        "Trade / Kualifikasi": "Rigger Level 1",
        "Rotasi": "28/28",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Workers_Template");
    XLSX.writeFile(workbook, "mms_worker_import_template.xlsx");
  };

  // Handle File Upload & Parse
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawData = XLSX.utils.sheet_to_json<any>(ws);

        const seenNiksInFile = new Set<string>();
        const parsed: StagingRow[] = rawData.map((row, idx) => {
          const errors: string[] = [];
          const name = String(row["Nama Lengkap"] || "").trim();
          const nik = String(row["NIK (16 Digit)"] || row["NIK"] || "").trim();
          const dob = String(row["Tanggal Lahir (YYYY-MM-DD)"] || row["Tanggal Lahir"] || "").trim();
          const gender = String(row["Jenis Kelamin (MALE/FEMALE)"] || row["Jenis Kelamin"] || "MALE").trim().toUpperCase();
          const phone = String(row["Nomor HP / WA"] || row["HP"] || "0812000000").trim();
          const pos = String(row["Posisi / Jabatan"] || row["Posisi"] || "").trim();
          const disc = String(row["Disiplin"] || "MECHANICAL").trim().toUpperCase();
          const trade = String(row["Trade / Kualifikasi"] || "").trim();

          if (!name) errors.push("Nama lengkap wajib diisi");
          if (!nik || nik.length < 10) errors.push("NIK tidak valid (minimal 10 digit)");
          if (!dob) errors.push("Tanggal lahir wajib diisi");
          if (!pos) errors.push("Posisi/Jabatan wajib diisi");

          let status: StagingRow["status"] = "VALID";
          if (errors.length > 0) {
            status = "ERROR";
          } else if (existingNiks.includes(nik) || seenNiksInFile.has(nik)) {
            status = "DUPLICATE";
            errors.push("NIK sudah terdaftar di database atau terduplikasi di file");
          }

          seenNiksInFile.add(nik);

          return {
            index: idx + 1,
            fullName: name,
            nik,
            birthDate: dob,
            gender: gender === "FEMALE" ? "FEMALE" : "MALE",
            contactNumber: phone,
            position: pos,
            discipline: disc,
            trade,
            status,
            errorMessages: errors,
          };
        });

        setStagedRows(parsed);
      } catch (err) {
        alert("Gagal membaca file spreadsheet. Pastikan format file sesuai.");
      }
    };

    reader.readAsBinaryString(file);
  };

  const validCount = stagedRows.filter((r) => r.status === "VALID").length;
  const duplicateCount = stagedRows.filter((r) => r.status === "DUPLICATE").length;
  const errorCount = stagedRows.filter((r) => r.status === "ERROR").length;

  // Handle Commit to Database
  const handleCommit = async () => {
    const validRows = stagedRows.filter((r) => r.status === "VALID");
    if (validRows.length === 0) {
      alert("Tidak ada data pekerja valid yang dapat diimpor.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/imports/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedProjectId,
          siteId: selectedSiteId,
          companyId: selectedCompanyId,
          workers: validRows,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengimpor data");

      alert(`Sukses mengimpor ${data.importedCount} pekerja ke database!`);
      router.push("/workers");
      router.refresh();
    } catch (e: any) {
      alert(`Terjadi kesalahan: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Onboarding Configuration Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Building className="w-4 h-4 text-brand-600" />
          Step 1: Target Assignment & Organization Context
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Project Tujuan</label>
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                const s = sites.find((item) => item.projectId === e.target.value);
                if (s) setSelectedSiteId(s.id);
              }}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Site Lokasi</label>
            <select
              value={selectedSiteId}
              onChange={(e) => setSelectedSiteId(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800"
            >
              {sites
                .filter((s) => !selectedProjectId || s.projectId === selectedProjectId)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.siteType})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Vendor / Subkontraktor</label>
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800"
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.type})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Upload Zone & Download Template */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Download Template Resmi</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Gunakan spreadsheet standar yang telah disesuaikan dengan skema validasi NIK, Tanggal Lahir, dan Posisi kerja.
            </p>
          </div>

          <button
            onClick={handleDownloadTemplate}
            className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition"
          >
            <Download className="w-4 h-4" />
            Download Excel Template (.xlsx)
          </button>
        </div>

        <div className="md:col-span-2 bg-white rounded-2xl border-2 border-dashed border-slate-200 hover:border-brand-500 p-8 text-center transition flex flex-col items-center justify-center relative cursor-pointer group shadow-sm">
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3 group-hover:scale-110 transition shadow-inner">
            <UploadCloud className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            {fileName ? `File Terpilih: ${fileName}` : "Tarik & Lepas File Spreadsheet di Sini"}
          </h3>
          <p className="text-xs text-slate-400 mt-1">Mendukung format .XLSX, .XLS, atau .CSV</p>
        </div>
      </div>

      {/* Staging Table & Review */}
      {stagedRows.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Step 2: Staging Review & Pre-Commit Validation</h2>
              <p className="text-xs text-slate-500">Periksa status keabsahan baris sebelum disimpan ke database</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                {validCount} Valid
              </span>
              <span className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                {duplicateCount} Duplikat
              </span>
              <span className="flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 font-semibold">
                <XCircle className="w-3.5 h-3.5" />
                {errorCount} Error
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Nama Lengkap</th>
                  <th className="py-2.5 px-3">NIK</th>
                  <th className="py-2.5 px-3">Tgl Lahir</th>
                  <th className="py-2.5 px-3">Gender</th>
                  <th className="py-2.5 px-3">Posisi</th>
                  <th className="py-2.5 px-3">Disiplin</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Validasi / Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {stagedRows.map((r) => {
                  let rowBg = "hover:bg-slate-50";
                  if (r.status === "DUPLICATE") rowBg = "bg-amber-50/40 hover:bg-amber-50/70";
                  if (r.status === "ERROR") rowBg = "bg-rose-50/40 hover:bg-rose-50/70";

                  return (
                    <tr key={r.index} className={rowBg}>
                      <td className="py-2 px-3 font-mono text-slate-400">{r.index}</td>
                      <td className="py-2 px-3 font-bold text-slate-900">{r.fullName}</td>
                      <td className="py-2 px-3 font-mono">{r.nik}</td>
                      <td className="py-2 px-3">{r.birthDate}</td>
                      <td className="py-2 px-3">{r.gender}</td>
                      <td className="py-2 px-3 font-semibold">{r.position}</td>
                      <td className="py-2 px-3">{r.discipline}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            r.status === "VALID"
                              ? "bg-emerald-100 text-emerald-800"
                              : r.status === "DUPLICATE"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-[11px] text-slate-500 max-w-xs truncate">
                        {r.errorMessages.length > 0 ? r.errorMessages.join(", ") : "Siap diimpor"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Commit Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Hanya baris dengan status <strong>VALID ({validCount} data)</strong> yang akan ditambahkan ke Worker Master.
            </div>

            <button
              onClick={handleCommit}
              disabled={isSubmitting || validCount === 0}
              className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-900/20 transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Mengimpor Data...
                </>
              ) : (
                <>
                  Commit & Import {validCount} Workers
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
