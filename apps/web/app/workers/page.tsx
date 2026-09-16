"use client";
import { FormEvent, useEffect, useState } from "react";
type Worker = { id: number; employee_number: string; full_name: string; status: string };
export default function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([]); const [name, setName] = useState(""); const [employeeNumber, setEmployeeNumber] = useState(""); const [error, setError] = useState("");
  async function loadWorkers() { const r = await fetch("/api/workers", { headers: { "X-Organization-ID": "local-org" } }); if (r.ok) setWorkers(await r.json()); }
  useEffect(() => { void loadWorkers(); }, []);
  async function submit(event: FormEvent) { event.preventDefault(); setError(""); const r = await fetch("/api/workers", { method: "POST", headers: { "content-type": "application/json", "X-Organization-ID": "local-org" }, body: JSON.stringify({ organization_id: "local-org", employee_number: employeeNumber, full_name: name }) }); if (!r.ok) { setError("Worker belum berhasil ditambahkan."); return; } setName(""); setEmployeeNumber(""); await loadWorkers(); }
  return <main className="shell"><p className="eyebrow">WORKER REGISTRY</p><h1>People ready<br /><em>to move.</em></h1><form onSubmit={submit} className="worker-form"><input required placeholder="Employee number" value={employeeNumber} onChange={e => setEmployeeNumber(e.target.value)} /><input required placeholder="Full name" value={name} onChange={e => setName(e.target.value)} /><button type="submit">Add worker</button></form>{error && <p role="alert">{error}</p>}<div className="worker-list">{workers.map(w => <div className="worker-row" key={w.id}><span><strong>{w.full_name}</strong><small>{w.employee_number}</small></span><span className="tag">{w.status}</span></div>)}{workers.length === 0 && <p className="intro">No workers yet. Add the first person above.</p>}</div></main>;
}
