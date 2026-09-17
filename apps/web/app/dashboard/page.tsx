"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Badge, Empty, ErrorBox } from "@/components/ui";

type Metrics = { workers: number; active_workers: number; assignments: number; pending_approvals: number; active_mobilizations: number };
type Assignment = { id: number; worker_id: number; position: string; site: string; status: string };
type Worker = { id: number; full_name: string; status: string };
const statusOrder = ["draft", "submitted", "approved", "mobilized", "active", "demobilized"];
const statusLabels: Record<string, string> = { draft: "Draft", submitted: "Submitted", approved: "Approved", mobilized: "Mobilized", active: "On Site", demobilized: "Completed" };

export default function Dashboard() {
  const [data, setData] = useState<Metrics | null>(null), [items, setItems] = useState<Assignment[]>([]), [workers, setWorkers] = useState<Worker[]>([]);
  const [error, setError] = useState(""), [loading, setLoading] = useState(true);
  async function load() { setLoading(true); setError(""); try { const [metrics, assignments, people] = await Promise.all([api<Metrics>("dashboard"), api<Assignment[]>("assignments"), api<Worker[]>("workers")]); setData(metrics); setItems(assignments); setWorkers(people); } catch (e) { setError((e as Error).message); } finally { setLoading(false); } }
  useEffect(() => { void load(); }, []);
  const siteData = useMemo(() => Object.entries(items.reduce<Record<string, number>>((acc, item) => { acc[item.site] = (acc[item.site] || 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 6), [items]);
  const maxSite = Math.max(1, ...siteData.map(([, count]) => count));
  const activity = data?.workers ? Math.round((data.active_workers / data.workers) * 100) : 0;
  const workerName = (id: number) => workers.find((worker) => worker.id === id)?.full_name || `Worker #${id}`;
  const cards = [["♟", "Total Workers", data?.workers, "Registered workforce", "blue"], ["✓", "Ready to Mobilize", data?.active_workers, "Active workers", "green"], ["⌖", "On Site", items.filter((item) => item.status === "active").length, "Active assignments", "cyan"], ["●", "Pending Approval", data?.pending_approvals, "Awaiting decision", "amber"], ["↗", "Active Movement", data?.active_mobilizations, "Planned or departed", "red"]];
  return <main className="page executive-page">
    <div className="executive-heading"><div><h1>Executive Dashboard</h1><p>Welcome back. Here&apos;s the latest overview of your workforce.</p></div><div className="dashboard-filters"><span>Current data</span><button className="secondary" onClick={load} disabled={loading}>↻ Refresh</button></div></div>
    <ErrorBox message={error} />
    <section className="kpi-grid" aria-label="Ringkasan workforce">{cards.map(([icon, label, value, note, tone]) => <article className={`kpi-card ${tone}`} key={String(label)}><span className="kpi-icon" aria-hidden="true">{icon}</span><div><small>{label}</small><strong>{loading ? "…" : value ?? 0}</strong><span>{note}</span></div></article>)}</section>
    <section className="analytics-grid">
      <article className="chart-card wide"><div className="card-title"><div><h2>Manpower by Site</h2><p>Active assignment distribution</p></div><Link href="/assignments">View assignments →</Link></div>{siteData.length ? <div className="horizontal-chart">{siteData.map(([site, count]) => <div className="bar-row" key={site}><span>{site}</span><div><i style={{ width: `${Math.max(8, count / maxSite * 100)}%` }} /></div><strong>{count}</strong></div>)}</div> : <Empty title="No site data yet" description="Create an assignment to begin monitoring site distribution." href="/assignments" label="Create assignment" />}</article>
      <article className="chart-card"><div className="card-title"><div><h2>Assignment Status</h2><p>Current workflow position</p></div></div><div className="status-chart">{statusOrder.map((status) => { const count = items.filter((item) => item.status === status).length; return <div key={status}><span>{statusLabels[status]}</span><div><i style={{ width: `${items.length ? Math.max(3, count / items.length * 100) : 0}%` }} /></div><strong>{count}</strong></div>; })}</div></article>
      <article className="chart-card compact"><div className="card-title"><div><h2>Workforce Activity</h2><p>Active worker ratio</p></div></div><div className="donut-wrap"><div className="donut" style={{ "--value": `${activity * 3.6}deg` } as React.CSSProperties}><span><strong>{activity}%</strong>Active</span></div><div className="legend"><span><i className="valid" /> Active <strong>{data?.active_workers || 0}</strong></span><span><i className="inactive" /> Inactive <strong>{(data?.workers || 0) - (data?.active_workers || 0)}</strong></span></div></div></article>
      <article className="chart-card recent-card"><div className="card-title"><div><h2>Recent Activities</h2><p>Latest workforce movements</p></div><Link href="/assignments">View all →</Link></div>{items.length ? <div className="activity-list">{items.slice(-5).reverse().map((item) => <div key={item.id}><span className={`activity-dot ${item.status}`} aria-hidden="true">{item.status === "approved" ? "✓" : "↗"}</span><div><strong>{workerName(item.worker_id)}</strong><p>{item.position} · {item.site}</p></div><Badge status={item.status} /></div>)}</div> : <Empty title="No recent activities" description="New assignments and movement updates will appear here." />}</article>
    </section>
  </main>;
}
