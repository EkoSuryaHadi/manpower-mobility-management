import React from "react";
import { Users, CheckCircle, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface WorkerMetricsBarProps {
  totalCount: number;
  readyCount: number;
  blockedCount: number;
}

export function WorkerMetricsBar({ totalCount, readyCount, blockedCount }: WorkerMetricsBarProps) {
  const metrics = [
    { label: "Total Registered Workers", value: totalCount, icon: <Users className="w-5 h-5" />, bgClass: "bg-blue-50", textClass: "text-blue-600", valueClass: "text-slate-900" },
    { label: "100% Fully Compliant", value: readyCount, icon: <CheckCircle className="w-5 h-5" />, bgClass: "bg-emerald-50", textClass: "text-emerald-600", valueClass: "text-emerald-700" },
    { label: "Compliance Deficient / Blocked", value: blockedCount, icon: <AlertCircle className="w-5 h-5" />, bgClass: "bg-rose-50", textClass: "text-rose-600", valueClass: "text-rose-700" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {metrics.map((m) => (
        <Card key={m.label}>
          <div className="flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-lg ${m.bgClass} ${m.textClass} flex items-center justify-center font-bold`}>
              {m.icon}
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">{m.label}</div>
              <div className={`text-xl font-bold ${m.valueClass}`}>{m.value}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
