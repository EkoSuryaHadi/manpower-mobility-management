"use client";

import React, { useState, useMemo } from "react";
import { Play, Sparkles, CheckCircle, AlertTriangle, ShieldCheck } from "lucide-react";

interface RuleSimulatorClientProps {
  projects: any[];
  sites: any[];
  rules: any[];
}

export function RuleSimulatorClient({
  projects,
  sites,
  rules,
}: RuleSimulatorClientProps) {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || "");
  const [selectedSiteId, setSelectedSiteId] = useState(sites[0]?.id || "");
  const [selectedPosition, setSelectedPosition] = useState("Welder");

  // Filter sites belonging to the selected project
  const filteredSites = useMemo(() => {
    return sites.filter((s) => !selectedProjectId || s.projectId === selectedProjectId);
  }, [sites, selectedProjectId]);

  // Compute simulated applicable requirements
  const simulatedRequirements = useMemo(() => {
    return rules.filter((rule) => {
      if (rule.projectId && rule.projectId !== selectedProjectId) return false;
      if (rule.siteId && rule.siteId !== selectedSiteId) return false;
      if (rule.position && rule.position.toLowerCase() !== selectedPosition.toLowerCase()) {
        return false;
      }
      return true;
    });
  }, [rules, selectedProjectId, selectedSiteId, selectedPosition]);

  const blockingCount = simulatedRequirements.filter((r) => r.isBlocking).length;

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-md border border-slate-700">
      <div className="flex items-center gap-2 text-xs font-semibold text-brand-400 uppercase tracking-wider mb-2">
        <Sparkles className="w-4 h-4 text-brand-400" />
        Interactive Rule Simulator Playground
      </div>
      <h2 className="text-lg font-bold">Simulate Dynamic Document Checklist</h2>
      <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
        Pilih skenario penugasan pekerja untuk melihat langsung daftar dokumen kepatuhan yang otomatis ditagih oleh Rules Engine.
      </p>

      {/* Inputs Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Target Project</label>
          <select
            value={selectedProjectId}
            onChange={(e) => {
              setSelectedProjectId(e.target.value);
              const firstSite = sites.find((s) => s.projectId === e.target.value);
              if (firstSite) setSelectedSiteId(firstSite.id);
            }}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Deployment Site</label>
          <select
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {filteredSites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.siteType})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Pekerjaan / Jabatan</label>
          <select
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="Welder">Welder (Juru Las 6G)</option>
            <option value="Rigger">Rigger Migas Level 1</option>
            <option value="Driver">Heavy Driver / Operator</option>
            <option value="Mechanical Tech">Mechanical Technician</option>
            <option value="Safety Officer">HSE / Safety Officer</option>
            <option value="Site Admin">Site Administrator / General</option>
          </select>
        </div>
      </div>

      {/* Simulation Result Preview */}
      <div className="mt-5 pt-4 border-t border-slate-700/80">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <span>Hasil Evaluasi Dynamic Rules:</span>
            <span className="bg-brand-500 text-white px-2 py-0.5 rounded text-[11px] font-bold">
              {simulatedRequirements.length} Dokumen Wajib Ditagih
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-rose-300 font-medium flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              {blockingCount} Blocking Requirements
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {simulatedRequirements.map((req) => (
            <div
              key={req.id}
              className="bg-slate-800/90 border border-slate-700 rounded-xl p-3 flex items-start justify-between gap-2 shadow-sm"
            >
              <div>
                <div className="text-xs font-bold text-white">{req.documentType.name}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{req.documentType.code}</div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Source: {req.site ? `Site ${req.site.name}` : req.position ? `Posisi ${req.position}` : "Global"}
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                {req.isBlocking && (
                  <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded">
                    BLOCKING
                  </span>
                )}
                {req.isMandatory && (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-medium px-1.5 py-0.5 rounded">
                    Mandatory
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
