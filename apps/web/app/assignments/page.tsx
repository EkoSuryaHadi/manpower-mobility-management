"use client";
import { FormEvent, useEffect, useState } from "react";
import { authenticatedHeaders } from "@/lib/auth-headers";
type Assignment = { id: number; worker_id: number; position: string; site: string; status: string };
export default function AssignmentsPage() {
  const [items, setItems] = useState<Assignment[]>([]); const [workerId, setWorkerId] = useState(""); const [position, setPosition] = useState(""); const [site, setSite] = useState("");
  async function load() { const r = await fetch("/api/backend/assignments", { headers: await authenticatedHeaders() }); if (r.ok) setItems(await r.json()); }
  useEffect(() => { void load(); }, []);
  async function submit(event: FormEvent) { event.preventDefault(); await fetch("/api/backend/assignments", { method: "POST", headers: await authenticatedHeaders({ "content-type": "application/json" }), body: JSON.stringify({ worker_id: Number(workerId), position, site }) }); setWorkerId(""); setPosition(""); setSite(""); await load(); }
  return <main className="shell"><p className="eyebrow">ASSIGNMENTS</p><h1>Movement,<br /><em>planned.</em></h1><form className="worker-form" onSubmit={submit}><input required type="number" placeholder="Worker ID" value={workerId} onChange={e => setWorkerId(e.target.value)} /><input required placeholder="Position" value={position} onChange={e => setPosition(e.target.value)} /><input required placeholder="Site" value={site} onChange={e => setSite(e.target.value)} /><button>Add assignment</button></form><div className="worker-list">{items.map(item => <div className="worker-row" key={item.id}><span><strong>{item.position}</strong><small>Worker #{item.worker_id} · {item.site}</small></span><span className="tag">{item.status}</span></div>)}</div></main>;
}
