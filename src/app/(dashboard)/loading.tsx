import React from "react";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-5 bg-slate-200 rounded w-48 mb-2" />
          <div className="h-3 bg-slate-100 rounded w-72" />
        </div>
        <div className="h-9 bg-slate-200 rounded-lg w-32" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-slate-100" />
              <div className="space-y-2 flex-1">
                <div className="h-3 bg-slate-100 rounded w-24" />
                <div className="h-6 bg-slate-200 rounded w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="h-12 bg-slate-50 border-b border-slate-200" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 border-b border-slate-100 px-4 flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-100" />
            <div className="h-3 bg-slate-100 rounded w-32" />
            <div className="h-3 bg-slate-100 rounded w-24 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
