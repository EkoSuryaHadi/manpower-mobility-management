import React from "react";
import { prisma } from "@/lib/prisma";
import { StatusChip } from "@/components/ui/StatusChip";
import {
  Sliders,
  Plus,
  Play,
  ShieldCheck,
  Building,
  HardHat,
  Briefcase,
  AlertTriangle,
  Info,
} from "lucide-react";
import { RuleSimulatorClient } from "./RuleSimulatorClient";

export const dynamic = "force-dynamic";

export default async function RequirementsPage() {
  let rules: any[] = [];
  let projects: any[] = [];
  let sites: any[] = [];
  let docTypes: any[] = [];

  try {
    rules = await prisma.documentRequirement.findMany({
      include: {
        documentType: true,
        project: true,
        site: true,
      },
      orderBy: { createdAt: "desc" },
    });

    projects = await prisma.project.findMany();
    sites = await prisma.site.findMany();
    docTypes = await prisma.documentType.findMany();
  } catch (e) {
    // Database initializing
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-brand-600" />
            Dynamic Requirement Rules & Simulator
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Konfigurasi aturan kepatuhan dokumen berbasis Project, Site, Disiplin, dan Posisi tanpa hardcoding.
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-medium shadow-sm transition">
          <Plus className="w-4 h-4" />
          Create New Rule
        </button>
      </div>

      {/* Interactive Simulator Section */}
      <RuleSimulatorClient
        projects={projects}
        sites={sites}
        rules={rules}
      />

      {/* Active Rules Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Master Requirement Rules Catalog</h2>
            <p className="text-xs text-slate-500">Daftar seluruh aturan aktif yang dievaluasi oleh sistem</p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-full">
            {rules.length} Active Rules
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Rule Name</th>
                <th className="py-3 px-4">Required Document</th>
                <th className="py-3 px-4">Target Scope</th>
                <th className="py-3 px-4 text-center">Mandatory</th>
                <th className="py-3 px-4 text-center">Blocking</th>
                <th className="py-3 px-4">Warning Period</th>
                <th className="py-3 px-4">Version</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {rules.length > 0 ? (
                rules.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{r.name}</div>
                      <div className="text-[10px] text-slate-400">ID: {r.id.slice(0, 8)}...</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{r.documentType.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{r.documentType.code}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {r.site && (
                          <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.5 rounded text-[10px] font-medium">
                            Site: {r.site.name}
                          </span>
                        )}
                        {r.project && !r.site && (
                          <span className="bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded text-[10px] font-medium">
                            Project: {r.project.name}
                          </span>
                        )}
                        {r.position && (
                          <span className="bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded text-[10px] font-medium">
                            Position: {r.position}
                          </span>
                        )}
                        {!r.project && !r.site && !r.position && !r.discipline && (
                          <span className="bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded text-[10px] font-medium">
                            Global (All Workers)
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {r.isMandatory ? (
                        <span className="text-emerald-700 font-bold">YES</span>
                      ) : (
                        <span className="text-slate-400">Optional</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {r.isBlocking ? (
                        <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded text-[10px] font-bold">
                          BLOCKING
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">Non-blocking</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono font-medium">{r.warningDays} Days</span>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-500">v{r.version}.0</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Memuat aturan persyaratan dinamis...
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
