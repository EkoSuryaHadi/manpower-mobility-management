"use client";

import React from "react";
import { DevRoleSwitcher } from "./DevRoleSwitcher";
import { NotificationDropdown } from "./NotificationDropdown";
import { Search, HelpCircle } from "lucide-react";

export function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-sm z-10">
      {/* Global Search */}
      <div className="flex items-center gap-4 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search workers by NIK, Name, Passport, or Assignment..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition text-slate-800 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Utilities & Role Switcher */}
      <div className="flex items-center gap-3">
        {/* Help & Documentation button */}
        <button
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition text-xs flex items-center gap-1.5"
          title="MMS Standard Documentation Package v1.0"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="hidden md:inline font-medium text-slate-600">SOP & Rules</span>
        </button>

        {/* Real-time Compliance & Due Date Notification Dropdown */}
        <NotificationDropdown />

        <div className="h-6 w-px bg-slate-200 mx-1" />

        {/* Development Persona Impersonator */}
        {process.env.NODE_ENV === "development" && <DevRoleSwitcher />}
      </div>
    </header>
  );
}
