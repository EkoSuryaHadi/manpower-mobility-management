"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Badge, Empty, ErrorBox } from "@/components/ui";

type Assignment = { id: number; worker_id: number; position: string; site: string; status: string };
type Worker = { id: number; full_name: string; employee_number: string };
type Readiness = { assignment_id: number; status: string; ready: boolean; reasons: string[]; document_count: number };

export default function PreMobPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]), [workers, setWorkers] = useState<Worker[]>([]), [readiness, setReadiness] = useState<Record<number, Readiness>>({});
  const [loading, setLoading] = useState(true), [error, setError] = useState("");
  async function load() { setLoading(true); setError(""); try { const [items, people] = await Promise.all([api<Assignment[]>("assignments"), api<Worker[]>("workers")]); setAssignments(items); setWorkers(people); const results = await Promise.all(items.map((item) => api<Readiness>(`assignments/${item.id}/readiness`))); setReadiness(Object.fromEntries(results.map((item) => [item.assignment_id, item]))); } catch (e) { setError((e as Error).message); } finally { setLoading(false); } }
  useEffect(() => { void load(); }, []);
  const readyCount = Object.values(readiness).filter((item) => item.ready).length;
  const workerName = (id: number) => workers.find((item) => item.id === id)?.full_name || `Worker #${id}`;
  const explain = (reason: string) => reason.replace("missing_document:", "Missing: ").replaceAll("_", " ");
  return <main className="page">
    <div className="executive-heading"><div><h1>Pre-Mobilization Checklist</h1><p>Ensure required documents and assignment conditions are complete before mobilization.</p></div><button className="secondary" onClick={load} disabled={loading}>↻ Refresh checks</button></div>
    <ErrorBox message={error} />
    <section className="kpi-grid pre-mob-kpis"><article className="kpi-card blue"><span className="kpi-icon">▤</span><div><small>Total Assignments</small><strong>{assignments.length}</strong><span>In workflow</span></div></article><article className="kpi-card green"><span className="kpi-icon">✓</span><div><small>Ready</small><strong>{readyCount}</strong><span>Ready to mobilize</span></div></article><article className="kpi-card amber"><span className="kpi-icon">!</span><div><small>Incomplete</small><strong>{assignments.length - readyCount}</strong><span>Needs attention</span></div></article></section>
    <section className="panel"><div className="panel-head"><div><h2>Readiness Register</h2><small>Live calculation from requirements and worker documents</small></div><Link href="/admin">Manage requirements →</Link></div>
      {loading ? <p className="loading">Checking readiness…</p> : assignments.length ? <div className="table-wrap"><table><thead><tr><th>Worker</th><th>Position / Site</th><th>Documents</th><th>Readiness</th><th>Outstanding</th></tr></thead><tbody>{assignments.map((item) => { const check = readiness[item.id]; return <tr key={item.id}><td><strong>{workerName(item.worker_id)}</strong><small>ASN-{String(item.id).padStart(4, "0")}</small></td><td>{item.position}<small>{item.site}</small></td><td>{check?.document_count ?? "—"}</td><td><Badge status={check?.ready ? "approved" : "pending"} /></td><td>{check?.reasons.length ? check.reasons.map(explain).join(", ") : "Complete"}</td></tr>; })}</tbody></table></div> : <Empty title="No assignments to check" description="Create an assignment before running the pre-mobilization checklist." href="/assignments" label="Create assignment" />}
    </section>
  </main>;
}
