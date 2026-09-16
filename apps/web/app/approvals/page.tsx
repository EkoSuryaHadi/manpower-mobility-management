"use client";
import { useEffect, useState } from "react";
import { authenticatedHeaders } from "@/lib/auth-headers";
type Approval = { id: number; assignment_id: number; status: string; comment?: string };
export default function ApprovalsPage() {
  const [items, setItems] = useState<Approval[]>([]);
  async function load() { const r = await fetch("/api/backend/approvals", { headers: await authenticatedHeaders() }); if (r.ok) setItems(await r.json()); }
  useEffect(() => { void load(); }, []);
  async function decide(id: number, status: "approved" | "rejected") { await fetch(`/api/backend/approvals/${id}`, { method: "PATCH", headers: await authenticatedHeaders({ "content-type": "application/json" }), body: JSON.stringify({ status }) }); await load(); }
  return <main className="shell"><p className="eyebrow">APPROVAL QUEUE</p><h1>Decisions,<br /><em>with context.</em></h1><div className="worker-list">{items.map(item => <div className="worker-row" key={item.id}><span><strong>Assignment #{item.assignment_id}</strong><small>{item.comment || "No comment"}</small></span><span><span className="tag">{item.status}</span>{item.status === "pending" && <><button onClick={() => decide(item.id, "approved")}>Approve</button><button onClick={() => decide(item.id, "rejected")}>Reject</button></>}</span></div>)}</div></main>;
}
