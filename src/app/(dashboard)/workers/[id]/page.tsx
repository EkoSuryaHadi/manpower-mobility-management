import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatusChip } from "@/components/ui/StatusChip";
import {
  ArrowLeft,
  User,
  Briefcase,
  FileCheck,
  History,
  Shield,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function WorkerProfilePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { tab?: string };
}) {
  const activeTab = searchParams.tab || "overview";

  const worker = await prisma.worker.findUnique({
    where: { id: params.id },
    include: {
      assignments: {
        include: {
          project: true,
          site: true,
          company: true,
          preMobilizations: true,
        },
        orderBy: { createdAt: "desc" },
      },
      documents: {
        include: {
          documentType: true,
          versions: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!worker) {
    notFound();
  }

  const currentAssignment = worker.assignments[0];
  const isReady = worker.overallReadinessScore === 100;

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <div>
        <Link
          href="/workers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Worker Master Directory
        </Link>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-blue-500 text-white font-bold flex items-center justify-center text-2xl shadow-md shadow-brand-900/20 shrink-0">
              {worker.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-slate-900">{worker.fullName}</h1>
                <StatusChip status={worker.status} />
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                <span className="font-mono text-slate-700">NIK: {worker.nik}</span>
                <span>•</span>
                <span>Employee No: <strong className="text-slate-700">{worker.employeeNo}</strong></span>
                {worker.passportNo && (
                  <>
                    <span>•</span>
                    <span>Passport: {worker.passportNo}</span>
                  </>
                )}
              </div>
              <div className="text-xs text-slate-600 mt-2 flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {currentAssignment
                    ? `${currentAssignment.position} (${currentAssignment.discipline}) at ${currentAssignment.site.name}`
                    : "Belum memiliki penugasan aktif"}
                </span>
                {currentAssignment && (
                  <span className="text-[11px] text-brand-600 font-medium bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                    {currentAssignment.company.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Readiness Gauge Box */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/70 shrink-0">
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-500">Compliance Readiness</div>
              <div className="text-lg font-bold text-slate-900 flex items-center justify-end gap-1.5 mt-0.5">
                {isReady ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                )}
                {worker.overallReadinessScore}%
              </div>
              <div className="text-[10px] text-slate-400">
                {isReady ? "All mandatory docs verified" : "Action required for mobilization"}
              </div>
            </div>

            {currentAssignment && (
              <Link
                href={`/pre-mobilization?assignmentId=${currentAssignment.id}`}
                className="px-3.5 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-medium rounded-lg shadow-sm transition"
              >
                Evaluate Readiness
              </Link>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-t border-slate-100 mt-6 pt-4 text-xs font-semibold">
          {[
            { id: "overview", label: "Overview & Personal Info", icon: User },
            { id: "assignments", label: `Assignments (${worker.assignments.length})`, icon: Briefcase },
            { id: "documents", label: `Documents & Compliance (${worker.documents.length})`, icon: FileCheck },
            { id: "timeline", label: "Movement & Audit History", icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={`/workers/${worker.id}?tab=${tab.id}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  isCurrent
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              Personal Biodata & Identity
            </h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Nama Lengkap</span>
                <span className="font-semibold text-slate-800">{worker.fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Nomor Induk Kependudukan (NIK)</span>
                <span className="font-semibold text-slate-800 font-mono">{worker.nik}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Tanggal Lahir</span>
                <span className="font-semibold text-slate-800">
                  {new Date(worker.birthDate).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Jenis Kelamin</span>
                <span className="font-semibold text-slate-800">{worker.gender}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Kewarganegaraan</span>
                <span className="font-semibold text-slate-800">{worker.nationality}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Status Profil</span>
                <StatusChip status={worker.status} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              Kontak & Alamat Domisili
            </h2>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Nomor Handphone / WhatsApp</span>
                  <span className="font-semibold text-slate-800">{worker.contactNumber}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Alamat Email</span>
                  <span className="font-semibold text-slate-800">{worker.email || "-"}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 mt-1" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Alamat Lengkap KTP</span>
                  <span className="font-medium text-slate-700 leading-relaxed">
                    {worker.address || "Jl. Mulawarman RT 12 No. 34, Balikpapan Timur"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "assignments" && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">Assignment & Deployment History</h2>
            <button className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-medium transition">
              Assign to New Site
            </button>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Project & Site</th>
                <th className="py-3 px-4">Posisi / Jabatan</th>
                <th className="py-3 px-4">Disiplin & Trade</th>
                <th className="py-3 px-4">Perusahaan</th>
                <th className="py-3 px-4">Rotasi</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {worker.assignments.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{a.project.name}</div>
                    <div className="text-[11px] text-slate-500">{a.site.name} ({a.site.siteType})</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{a.position}</td>
                  <td className="py-3 px-4">
                    <div>{a.discipline}</div>
                    <div className="text-[11px] text-slate-400">{a.trade || "-"}</div>
                  </td>
                  <td className="py-3 px-4">{a.company.name}</td>
                  <td className="py-3 px-4 font-mono">{a.rotationSchedule || "Standard"}</td>
                  <td className="py-3 px-4">
                    <StatusChip status={a.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "documents" && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Compliance & Mandatory Documents</h2>
              <p className="text-xs text-slate-500">Daftar sertifikat, MCU, dan berkas legal pekerja</p>
            </div>
            <button className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-medium transition">
              Upload New Document
            </button>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Document Type</th>
                <th className="py-3 px-4">Document Number</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Verification Status</th>
                <th className="py-3 px-4">Remarks</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {worker.documents.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{d.documentType.name}</div>
                    <div className="text-[11px] text-slate-400">{d.documentType.category}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-800">{d.documentNumber}</td>
                  <td className="py-3 px-4">
                    {new Date(d.issueDate).toLocaleDateString("id-ID")}
                  </td>
                  <td className="py-3 px-4">
                    {d.expiryDate ? (
                      <span className="font-medium text-slate-800">
                        {new Date(d.expiryDate).toLocaleDateString("id-ID")}
                      </span>
                    ) : (
                      <span className="text-slate-400">Permanent / Seumur Hidup</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <StatusChip status={d.verificationStatus} />
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate text-slate-500">
                    {d.verifierRemarks || "-"}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/documents?docId=${d.id}`}
                      className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 font-medium"
                    >
                      Verify / View
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "timeline" && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
            Movement & Audit Log Trail
          </h2>
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            <div className="relative">
              <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white" />
              <div className="text-xs font-bold text-slate-800">Worker Registered to Master Roster</div>
              <div className="text-[11px] text-slate-500">Single worker master record created and NIK validated.</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {new Date(worker.createdAt).toLocaleString("id-ID")}
              </div>
            </div>

            {worker.assignments.map((a) => (
              <div key={a.id} className="relative">
                <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-brand-500 ring-4 ring-white" />
                <div className="text-xs font-bold text-slate-800">
                  Assigned to {a.project.name} - {a.site.name}
                </div>
                <div className="text-[11px] text-slate-500">
                  Position: {a.position} | Company: {a.company.name} | Status: {a.status}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {new Date(a.createdAt).toLocaleString("id-ID")}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
