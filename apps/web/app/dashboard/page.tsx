"use client";
import { useEffect, useState } from "react";
import { authenticatedHeaders } from "@/lib/auth-headers";
type Metrics = { workers: number; active_workers: number; assignments: number; pending_approvals: number; active_mobilizations: number };
export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  useEffect(() => { authenticatedHeaders().then(headers => fetch("/api/backend/dashboard", { headers })).then(r => r.ok ? r.json() : null).then(setMetrics); }, []);
  const items = metrics ? [["Workers", metrics.workers], ["Active", metrics.active_workers], ["Assignments", metrics.assignments], ["Pending approvals", metrics.pending_approvals], ["In transit", metrics.active_mobilizations]] : [];
  return <main className="shell"><p className="eyebrow">OPERATIONS CONTROL</p><h1>Today,<br /><em>at a glance.</em></h1><div className="metric-grid">{items.map(([label, value]) => <div className="metric" key={label}><strong>{value}</strong><span>{label}</span></div>)}</div><section><a href="/workers">Worker registry →</a><a href="/api/backend/reports/assignments.csv">Download assignments CSV →</a></section></main>;
}
