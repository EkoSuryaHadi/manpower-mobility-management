"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Badge, Empty, ErrorBox } from "@/components/ui";

type Worker = { id: number; full_name: string; employee_number: string; status: string };
type Document = { id: number; document_type: string; file_name: string; expiry_date?: string; status: string };

export default function DocumentsPage() {
  const [workers, setWorkers] = useState<Worker[]>([]), [selected, setSelected] = useState(""), [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true), [error, setError] = useState("");
  useEffect(() => { api<Worker[]>("workers").then(setWorkers).catch((e) => setError(e.message)).finally(() => setLoading(false)); }, []);
  async function choose(id: string) { setSelected(id); setError(""); if (!id) { setDocuments([]); return; } setLoading(true); try { setDocuments(await api<Document[]>(`workers/${id}/documents`)); } catch (e) { setError((e as Error).message); } finally { setLoading(false); } }
  const worker = workers.find((item) => String(item.id) === selected);
  return <main className="page">
    <div className="executive-heading"><div><h1>Document Center</h1><p>Review workforce documents and compliance records.</p></div><label className="compact-select">Worker<select value={selected} onChange={(e) => void choose(e.target.value)}><option value="">Select worker</option>{workers.map((item) => <option value={item.id} key={item.id}>{item.full_name}</option>)}</select></label></div>
    <ErrorBox message={error} />
    {worker && <section className="profile-hero panel"><div className="profile-avatar">{worker.full_name.split(" ").map((word) => word[0]).slice(0, 2).join("")}</div><div className="profile-meta"><h2>{worker.full_name}</h2><p>{worker.employee_number} · Workforce document file</p><Badge status={worker.status} /></div><div className="document-total"><strong>{documents.length}</strong><span>Documents</span></div></section>}
    <section className="panel"><div className="panel-head"><div><h2>Document Register</h2><small>Private metadata scoped to the selected worker</small></div><span className="muted">PDF · JPEG · PNG</span></div>
      {!selected ? <Empty title="Select a worker" description="Choose a worker to review passport, medical, training, and contract records." /> : loading ? <p className="loading">Loading documents…</p> : documents.length ? <div className="table-wrap"><table><thead><tr><th>Document</th><th>File name</th><th>Expiry date</th><th>Status</th></tr></thead><tbody>{documents.map((item) => <tr key={item.id}><td><strong>{item.document_type}</strong></td><td>{item.file_name}</td><td>{item.expiry_date || "—"}</td><td><Badge status={item.status} /></td></tr>)}</tbody></table></div> : <Empty title="No documents found" description="This worker does not have document metadata yet." />}
    </section>
  </main>;
}
