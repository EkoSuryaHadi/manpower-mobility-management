import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatusChip } from "@/components/ui/StatusChip";
import { calculateWorkerReadiness } from "@/lib/readiness-engine";
import {
  ClipboardCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Send,
  Plus,
  ShieldAlert,
} from "lucide-react";
import { PreMobilizationActionClient } from "./PreMobilizationActionClient";

export const dynamic = "force-dynamic";

export default async function PreMobilizationPage({
  searchParams,
}: {
  searchParams: { assignmentId?: string };
}) {
  let preMobs: any[] = [];
  let eligibleAssignments: any[] = [];
  let selectedEvaluation: any = null;

  try {
    preMobs = await prisma.preMobilization.findMany({
      include: {
        assignment: {
          include: {
            worker: true,
            site: true,
            company: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    eligibleAssignments = await prisma.workerAssignment.findMany({
      where: {
        status: { in: ["PLANNED", "PRE_MOBILIZATION", "READY_TO_MOBILIZE"] },
      },
      include: {
        worker: true,
        site: true,
        company: true,
      },
    });

    // If an assignment was specified, calculate real-time readiness
    const targetAssignmentId = searchParams.assignmentId || eligibleAssignments[0]?.id;
    if (targetAssignmentId) {
      selectedEvaluation = await calculateWorkerReadiness(targetAssignmentId);
    }
  } catch (e) {
    // Database initializing
  }

  const selectedAssignment = eligibleAssignments.find(
    (a) => a.id === (searchParams.assignmentId || eligibleAssignments[0]?.id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-brand-600" />
            Pre-Mobilization & Readiness Evaluation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit kesiapan kepatuhan pekerja, evaluasi hard-blocker, dan pengajuan mobilisasi ke alur approval.
          </p>
        </div>
      </div>

      {/* Real-Time Readiness Evaluation Workspace */}
      {selectedEvaluation && selectedAssignment && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Evaluating Active Assignment
              </span>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                {selectedAssignment.worker.fullName}
                <span className="text-xs font-normal text-slate-500">
                  ({selectedAssignment.position} • {selectedAssignment.site.name})
                </span>
              </h2>
              <div className="text-xs text-slate-500 mt-0.5">
                Employer: <strong>{selectedAssignment.company.name}</strong> • NIK: <span className="font-mono">{selectedAssignment.worker.nik}</span>
              </div>
            </div>

            {/* Score & Status Display */}
            <div className="flex items-center gap-4 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200">
              <div className="text-right">
                <div className="text-xs font-semibold text-slate-500">Readiness Score</div>
                <div className="text-2xl font-black text-slate-900">
                  {selectedEvaluation.readinessScore}%
                </div>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <StatusChip status={selectedEvaluation.overallStatus} />
                <div className="text-[10px] text-slate-400 mt-1">
                  {selectedEvaluation.blockingIssues.length} Blocking Issues
                </div>
              </div>
            </div>
          </div>

          {/* Hard Blocker Alert (PRD Compliance Rule) */}
          {selectedEvaluation.blockingIssues.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3 text-xs text-rose-800">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-rose-900">Mobilization Blocked (Zero-Tolerance Policy)</div>
                <p className="mt-0.5 text-rose-700">
                  Pekerja tidak dapat diajukan ke tahap approval karena memiliki dokumen blocking yang belum memenuhi syarat:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 font-medium">
                  {selectedEvaluation.blockingIssues.map((issue: string, idx: number) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Dynamic Checklist Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Persyaratan Kepatuhan</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">No. Dokumen Terlampir</th>
                  <th className="py-3 px-4">Masa Berlaku</th>
                  <th className="py-3 px-4">Catatan Evaluator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {selectedEvaluation.checklist.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.requirementName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.documentTypeCode}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <StatusChip status={item.status} />
                    </td>

                    <td className="py-3 px-4 font-mono">
                      {item.documentNumber || <span className="text-slate-400 italic">Belum diunggah</span>}
                    </td>

                    <td className="py-3 px-4">
                      {item.expiryDate ? (
                        new Date(item.expiryDate).toLocaleDateString("id-ID")
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-[11px] text-slate-500 max-w-xs">
                      {item.remarks || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Submission Action Bar */}
          <PreMobilizationActionClient
            assignmentId={selectedAssignment.id}
            isBlocked={selectedEvaluation.overallStatus === "BLOCKED"}
            workerName={selectedAssignment.worker.fullName}
          />
        </div>
      )}

      {/* Pre-Mobilization Requests Pipeline Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Mobilization Request Pipeline</h2>
            <p className="text-xs text-slate-500">Permohonan mobilisasi aktif dalam antrean approval</p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-full">
            {preMobs.length} Requests Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Request No</th>
                <th className="py-3 px-4">Worker Info</th>
                <th className="py-3 px-4">Project & Site</th>
                <th className="py-3 px-4 text-center">Readiness</th>
                <th className="py-3 px-4">Workflow Step</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {preMobs.length > 0 ? (
                preMobs.map((pm) => (
                  <tr key={pm.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{pm.requestNo}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{pm.assignment.worker.fullName}</div>
                      <div className="text-[11px] text-slate-400">{pm.assignment.position}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{pm.assignment.site.name}</div>
                      <div className="text-[11px] text-slate-400">{pm.assignment.company.name}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-slate-800">{pm.readinessScore}%</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-semibold">
                        {pm.currentStep}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusChip status={pm.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/approvals?requestId=${pm.id}`}
                        className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 font-semibold"
                      >
                        Review Queue <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Belum ada pengajuan mobilisasi. Pilih pekerja di atas untuk melakukan evaluasi readiness.
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
