"use client";

import { useEffect, useMemo, useState } from "react";
import { api, downloadReport } from "@/lib/api";
import { Empty, ErrorBox } from "@/components/ui";

type Worker = { id: number; status: string };
type Assignment = { id: number; position: string; site: string; status: string };

export default function Reports() {
  const [workers, setWorkers] = useState<Worker[]>([]), [assignments, setAssignments] = useState<Assignment[]>([]), [error, setError] = useState(""), [busy, setBusy] = useState(false), [loading, setLoading] = useState(true);
  useEffect(() => { Promise.all([api<Worker[]>("workers"), api<Assignment[]>("assignments")]).then(([people, jobs]) => { setWorkers(people); setAssignments(jobs); }).catch((e) => setError(e.message)).finally(() => setLoading(false)); }, []);
  const group = (field: "site" | "position") => Object.entries(assignments.reduce<Record<string, number>>((acc, item) => { acc[item[field]] = (acc[item[field]] || 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const sites = useMemo(() => group("site"), [assignments]);
  const positions = useMemo(() => group("position"), [assignments]);
  const max = (items: [string, number][]) => Math.max(1, ...items.map(([, value]) => value));
  const active = workers.filter((worker) => worker.status === "active").length;
  const ratio = workers.length ? Math.round(active / workers.length * 100) : 0;
  return <main className="page">
    <div className="executive-heading"><div><h1>Workforce Demography</h1><p>Analyze workforce composition, site distribution and operational deployment.</p></div><button disabled={busy} onClick={async () => { setBusy(true); setError(""); try { await downloadReport(); } catch (e) { setError((e as Error).message); } finally { setBusy(false); } }}>{busy ? "Preparing…" : "↓ Export CSV"}</button></div>
    <ErrorBox message={error} />
    <section className="kpi-grid report-kpis"><article className="kpi-card blue"><span className="kpi-icon">♟</span><div><small>Total Workers</small><strong>{loading ? "…" : workers.length}</strong><span>Registered workforce</span></div></article><article className="kpi-card green"><span className="kpi-icon">✓</span><div><small>Active</small><strong>{active}</strong><span>Available workforce</span></div></article><article className="kpi-card red"><span className="kpi-icon">—</span><div><small>Inactive</small><strong>{workers.length - active}</strong><span>Not available</span></div></article><article className="kpi-card cyan"><span className="kpi-icon">⌖</span><div><small>Sites</small><strong>{sites.length}</strong><span>Assignment locations</span></div></article></section>
    <section className="analytics-grid report-grid"><article className="chart-card compact"><div className="card-title"><div><h2>Workforce Status</h2><p>Active and inactive workers</p></div></div><div className="donut-wrap"><div className="donut" style={{ "--value": `${ratio * 3.6}deg` } as React.CSSProperties}><span><strong>{ratio}%</strong>Active</span></div><div className="legend"><span><i className="valid" /> Active <strong>{active}</strong></span><span><i className="inactive" /> Inactive <strong>{workers.length - active}</strong></span></div></div></article><article className="chart-card"><div className="card-title"><div><h2>Manpower by Site</h2><p>Assignment distribution</p></div></div>{sites.length ? <div className="horizontal-chart">{sites.map(([label, value]) => <div className="bar-row" key={label}><span>{label}</span><div><i style={{ width: `${Math.max(8, value / max(sites) * 100)}%` }} /></div><strong>{value}</strong></div>)}</div> : <Empty title="No site data" description="Site analysis appears after assignments are created." />}</article><article className="chart-card"><div className="card-title"><div><h2>Manpower by Position</h2><p>Discipline and role distribution</p></div></div>{positions.length ? <div className="horizontal-chart">{positions.map(([label, value]) => <div className="bar-row" key={label}><span>{label}</span><div><i style={{ width: `${Math.max(8, value / max(positions) * 100)}%` }} /></div><strong>{value}</strong></div>)}</div> : <Empty title="No position data" description="Position analysis appears after assignments are created." />}</article></section>
  </main>;
}
