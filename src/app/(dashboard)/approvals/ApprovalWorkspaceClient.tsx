"use client";

import React, { useState } from "react";
import { StatusChip } from "@/components/ui/StatusChip";
import {
  CheckCircle,
  XCircle,
  RotateCcw,
  Clock,
  User,
  Shield,
  Send,
  MessageSquare,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

interface ApprovalWorkspaceClientProps {
  instances: any[];
  users: any[];
  initialSelectedRequestId?: string;
}

export function ApprovalWorkspaceClient({
  instances,
  users,
  initialSelectedRequestId,
}: ApprovalWorkspaceClientProps) {
  const [selectedInstanceId, setSelectedInstanceId] = useState<string>(
    instances.find((i) => i.preMobilizationId === initialSelectedRequestId)?.id ||
      instances[0]?.id ||
      ""
  );

  const [actionComment, setActionComment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [localInstances, setLocalInstances] = useState(instances);

  const activeInstance =
    localInstances.find((i) => i.id === selectedInstanceId) || localInstances[0];

  const handleAction = async (actionType: "APPROVE" | "RETURN_REVISION" | "REJECT") => {
    if ((actionType === "RETURN_REVISION" || actionType === "REJECT") && !actionComment.trim()) {
      alert("Harap masukkan catatan/komentar untuk pengembalian revisi atau penolakan.");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch(`/api/v1/approval-instances/${activeInstance.id}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actionType,
          comment: actionComment,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memproses aksi approval");

      alert(`Aksi ${actionType} berhasil dicatat.`);
      window.location.reload();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!activeInstance) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-xs text-slate-400">
        Belum ada permohonan mobilisasi dalam antrean approval saat ini.
      </div>
    );
  }

  const preMob = activeInstance.preMobilization;
  const assignment = preMob.assignment;
  const worker = assignment.worker;
  const steps = activeInstance.workflow.steps;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left List: Pending Inboxes (4 cols) */}
      <div className="lg:col-span-4 space-y-3">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
          <div className="text-xs font-bold text-slate-800 mb-3 flex items-center justify-between">
            <span>Approval Inboxes</span>
            <span className="text-[11px] bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-semibold">
              {localInstances.length} In Pipeline
            </span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {localInstances.map((inst) => {
              const isSelected = inst.id === activeInstance.id;
              const currentStep = inst.workflow.steps.find(
                (s: any) => s.stepOrder === inst.currentStepOrder
              );

              return (
                <button
                  key={inst.id}
                  onClick={() => setSelectedInstanceId(inst.id)}
                  className={`w-full text-left p-3 rounded-xl border transition ${
                    isSelected
                      ? "bg-brand-50/70 border-brand-300 shadow-sm"
                      : "bg-white hover:bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-slate-800">
                      {inst.preMobilization.requestNo}
                    </span>
                    <StatusChip status={inst.status} />
                  </div>

                  <div className="text-xs font-bold text-slate-900 mt-1">
                    {inst.preMobilization.assignment.worker.fullName}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {inst.preMobilization.assignment.position} • {inst.preMobilization.assignment.site.name}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Tahap: <strong>{currentStep?.stepName || "Finalized"}</strong></span>
                    <span className="font-bold text-brand-600">{inst.preMobilization.readinessScore}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Active Approval Detail & Stepper (8 cols) */}
      <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
        {/* Request Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Request ID: {preMob.requestNo}
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">{worker.fullName}</h2>
            <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>Posisi: <strong>{assignment.position}</strong></span>
              <span>•</span>
              <span>Site: <strong>{assignment.site.name}</strong></span>
              <span>•</span>
              <span>Perusahaan: <strong>{assignment.company.name}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] text-slate-400">Readiness Evaluation</div>
              <div className="text-lg font-bold text-slate-900">{preMob.readinessScore}%</div>
            </div>
            <StatusChip status={activeInstance.status} />
          </div>
        </div>

        {/* Multi-Step Visual Workflow Stepper */}
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
            Approval Progress Stepper
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {steps.map((step: any) => {
              const isPast = step.stepOrder < activeInstance.currentStepOrder;
              const isCurrent = step.stepOrder === activeInstance.currentStepOrder;
              const isFuture = step.stepOrder > activeInstance.currentStepOrder;

              return (
                <div
                  key={step.id}
                  className={`p-3.5 rounded-xl border transition ${
                    isCurrent
                      ? "bg-brand-50 border-brand-300 ring-2 ring-brand-500/20 shadow-sm"
                      : isPast
                      ? "bg-emerald-50/50 border-emerald-200"
                      : "bg-slate-50 border-slate-200 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Step {step.stepOrder}
                    </span>
                    {isPast ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : isCurrent ? (
                      <Clock className="w-4 h-4 text-brand-600 animate-pulse" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-300 text-[10px] flex items-center justify-center text-slate-400 font-mono">
                        {step.stepOrder}
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-slate-800">{step.stepName}</div>
                  <div className="text-[10px] text-slate-500 mt-1 font-mono">
                    Required: {step.requiredRole}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review Decision Workspace */}
        {activeInstance.status === "PENDING" && (
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-600" />
              Tindakan Peninjauan / Review Decision
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Catatan / Remarks Verifikasi
              </label>
              <textarea
                value={actionComment}
                onChange={(e) => setActionComment(e.target.value)}
                placeholder="Tuliskan alasan persetujuan, permintaan perbaikan dokumen, atau justifikasi penolakan..."
                rows={3}
                className="w-full text-xs p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => handleAction("APPROVE")}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-900/20 transition disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                Approve & Advance Step
              </button>

              <button
                onClick={() => handleAction("RETURN_REVISION")}
                disabled={isProcessing}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold rounded-xl transition disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4" />
                Return for Revision
              </button>

              <button
                onClick={() => handleAction("REJECT")}
                disabled={isProcessing}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
            </div>
          </div>
        )}

        {/* Immutable Audit & Action Trail */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-slate-400" />
            Immutable Audit Trail & Comments
          </h3>

          <div className="space-y-2">
            {activeInstance.actions.length > 0 ? (
              activeInstance.actions.map((act: any) => (
                <div
                  key={act.id}
                  className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-xs flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{act.actor.fullName}</span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                        {act.actor.role}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="font-semibold text-slate-700">{act.actionType}</span>
                    </div>
                    {act.comments && (
                      <p className="text-slate-600 mt-1 italic">"{act.comments}"</p>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-400 shrink-0">
                    {new Date(act.createdAt).toLocaleString("id-ID")}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-slate-400 text-xs italic">
                Belum ada tindakan review yang tercatat pada permohonan ini.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
