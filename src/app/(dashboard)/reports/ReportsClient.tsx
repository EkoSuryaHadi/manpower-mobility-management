"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  FileSpreadsheet,
  Download,
  Filter,
  BarChart3,
  ShieldCheck,
  Building,
  History,
  FileText,
} from "lucide-react";

interface ReportsClientProps {
  workers: any[];
  assignments: any[];
  auditLogs: any[];
}

export function ReportsClient({
  workers,
  assignments,
  auditLogs,
}: ReportsClientProps) {
  const [reportType, setReportType] = useState<"ROSTER" | "COMPLIANCE" | "MOVEMENTS" | "AUDIT">("ROSTER");
  const [searchTerm, setSearchTerm] = useState("");

  // Prepare exportable data based on active report type
  const handleExportExcel = () => {
    let exportData: any[] = [];
    let fileName = `MMS_Report_${reportType}_${Date.now()}.xlsx`;

    if (reportType === "ROSTER") {
      exportData = workers.map((w, idx) => ({
        No: idx + 1,
        "Employee No": w.employeeNo,
        "Nama Lengkap": w.fullName,
        NIK: w.nik,
        "Tanggal Lahir": new Date(w.birthDate).toLocaleDateString("id-ID"),
        Gender: w.gender,
        "Nomor HP": w.contactNumber,
        Perusahaan: w.assignments[0]?.company?.name || "-",
        Posisi: w.assignments[0]?.position || "-",
        Site: w.assignments[0]?.site?.name || "-",
        Status: w.status,
        "Readiness Score (%)": w.overallReadinessScore,
      }));
    } else if (reportType === "COMPLIANCE") {
      exportData = workers.flatMap((w) =>
        w.documents.map((d: any) => ({
          "Nama Pekerja": w.fullName,
          NIK: w.nik,
          "Tipe Dokumen": d.documentType.name,
          Kategori: d.documentType.category,
          "Nomor Dokumen": d.documentNumber,
          "Tgl Terbit": new Date(d.issueDate).toLocaleDateString("id-ID"),
          "Tgl Kedaluwarsa": d.expiryDate ? new Date(d.expiryDate).toLocaleDateString("id-ID") : "Permanent",
          Status: d.verificationStatus,
          "Catatan Verifikator": d.verifierRemarks || "-",
        }))
      );
    } else if (reportType === "MOVEMENTS") {
      exportData = assignments.map((a, idx) => ({
        No: idx + 1,
        "Nama Pekerja": a.worker.fullName,
        NIK: a.worker.nik,
        Posisi: a.position,
        Disiplin: a.discipline,
        Project: a.project.name,
        Site: a.site.name,
        Perusahaan: a.company.name,
        "Tanggal Mulai": new Date(a.startDate).toLocaleDateString("id-ID"),
        "Status Penugasan": a.status,
      }));
    } else {
      exportData = auditLogs.map((log, idx) => ({
        No: idx + 1,
        Aktor: log.actorName,
        Aksi: log.action,
        Entitas: log.entityType,
        "Entity ID": log.entityId,
        Waktu: new Date(log.timestamp).toLocaleString("id-ID"),
      }));
    }

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, reportType);
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="space-y-6">
      {/* Category Pills & Export Button */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: "ROSTER", label: "Workforce Master Roster", icon: BarChart3 },
            { id: "COMPLIANCE", label: "Compliance & Expiry Audit", icon: ShieldCheck },
            { id: "MOVEMENTS", label: "Site Assignments & Movement", icon: Building },
            { id: "AUDIT", label: "System Audit Logs", icon: History },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = reportType === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setReportType(cat.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition ${
                  isSelected
                    ? "bg-brand-600 text-white shadow-sm"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleExportExcel}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/20 transition shrink-0"
        >
          <Download className="w-4 h-4" />
          Export to Excel (.xlsx)
        </button>
      </div>

      {/* Report Preview Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Report Data Preview ({reportType})
            </h2>
            <p className="text-xs text-slate-500">
              Menampilkan data live sesuai filter laporan terpilih
            </p>
          </div>
        </div>

        {/* Dynamic Table Preview */}
        <div className="overflow-x-auto">
          {reportType === "ROSTER" && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Employee No</th>
                  <th className="py-2.5 px-3">Nama Lengkap</th>
                  <th className="py-2.5 px-3">NIK</th>
                  <th className="py-2.5 px-3">Perusahaan</th>
                  <th className="py-2.5 px-3">Posisi & Site</th>
                  <th className="py-2.5 px-3">Readiness</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {workers.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono">{w.employeeNo}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{w.fullName}</td>
                    <td className="py-2.5 px-3 font-mono">{w.nik}</td>
                    <td className="py-2.5 px-3">{w.assignments[0]?.company?.name || "-"}</td>
                    <td className="py-2.5 px-3">
                      {w.assignments[0] ? `${w.assignments[0].position} • ${w.assignments[0].site.name}` : "-"}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-brand-600">
                      {w.overallReadinessScore}%
                    </td>
                    <td className="py-2.5 px-3">{w.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === "COMPLIANCE" && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Pekerja</th>
                  <th className="py-2.5 px-3">Dokumen</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3">No. Dokumen</th>
                  <th className="py-2.5 px-3">Masa Berlaku</th>
                  <th className="py-2.5 px-3">Status Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {workers.flatMap((w) =>
                  w.documents.map((d: any) => (
                    <tr key={d.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold">{w.fullName}</td>
                      <td className="py-2.5 px-3">{d.documentType.name}</td>
                      <td className="py-2.5 px-3">{d.documentType.category}</td>
                      <td className="py-2.5 px-3 font-mono">{d.documentNumber}</td>
                      <td className="py-2.5 px-3">
                        {d.expiryDate ? new Date(d.expiryDate).toLocaleDateString("id-ID") : "Permanent"}
                      </td>
                      <td className="py-2.5 px-3 font-semibold">{d.verificationStatus}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {reportType === "MOVEMENTS" && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Pekerja</th>
                  <th className="py-2.5 px-3">Posisi</th>
                  <th className="py-2.5 px-3">Disiplin</th>
                  <th className="py-2.5 px-3">Project & Site</th>
                  <th className="py-2.5 px-3">Perusahaan</th>
                  <th className="py-2.5 px-3">Status Penugasan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {assignments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold">{a.worker.fullName}</td>
                    <td className="py-2.5 px-3 font-semibold">{a.position}</td>
                    <td className="py-2.5 px-3">{a.discipline}</td>
                    <td className="py-2.5 px-3">{a.project.name} • {a.site.name}</td>
                    <td className="py-2.5 px-3">{a.company.name}</td>
                    <td className="py-2.5 px-3 font-bold">{a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === "AUDIT" && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Waktu</th>
                  <th className="py-2.5 px-3">Aktor</th>
                  <th className="py-2.5 px-3">Aksi</th>
                  <th className="py-2.5 px-3">Entitas</th>
                  <th className="py-2.5 px-3">Entity ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono text-slate-500">
                      {new Date(log.timestamp).toLocaleString("id-ID")}
                    </td>
                    <td className="py-2.5 px-3 font-bold">{log.actorName}</td>
                    <td className="py-2.5 px-3 font-mono text-brand-700">{log.action}</td>
                    <td className="py-2.5 px-3 font-semibold">{log.entityType}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{log.entityId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
