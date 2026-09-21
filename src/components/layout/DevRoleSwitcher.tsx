"use client";

import React, { useEffect, useState } from "react";
import { DEMO_PERSONAS, MMSUserRole, DemoPersona } from "@/lib/auth";
import { UserCheck, ChevronDown, ShieldCheck } from "lucide-react";

export function DevRoleSwitcher() {
  const [currentRole, setCurrentRole] = useState<MMSUserRole>("SYSTEM_ADMIN");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("mms_current_role") as MMSUserRole;
    if (saved && DEMO_PERSONAS[saved]) {
      setCurrentRole(saved);
    }
  }, []);

  const handleSelectRole = (role: MMSUserRole) => {
    setCurrentRole(role);
    localStorage.setItem("mms_current_role", role);
    setIsOpen(false);
    window.dispatchEvent(new Event("mms_role_changed"));
  };

  const persona: DemoPersona = DEMO_PERSONAS[currentRole];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-white transition border border-slate-700 shadow-sm"
        title="Quick Role Impersonator (Development Mode)"
      >
        <span className={`w-2 h-2 rounded-full ${persona.avatarBg}`} />
        <span className="font-semibold text-slate-300">Simulating:</span>
        <span className="font-medium text-white">{persona.roleLabel}</span>
        <span className="text-slate-400 text-[10px] hidden sm:inline">({persona.companyName.split(" ")[1] || persona.companyName})</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1">
          <div className="p-3 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              Role Impersonator (Dev Mode)
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Switch persona to test multi-step approval, permissions & UI views.
            </p>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-1">
            {(Object.keys(DEMO_PERSONAS) as MMSUserRole[]).map((r) => {
              const p = DEMO_PERSONAS[r];
              const isSelected = r === currentRole;

              return (
                <button
                  key={r}
                  onClick={() => handleSelectRole(r)}
                  className={`w-full text-left p-2.5 rounded-lg flex items-start gap-2.5 transition ${
                    isSelected ? "bg-brand-50/80 text-brand-900" : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5 ${p.avatarBg}`}>
                    {p.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold truncate">{p.roleLabel}</span>
                      {isSelected && <span className="text-[10px] text-brand-600 font-bold">Active</span>}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{p.name} • {p.companyName}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
