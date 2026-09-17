"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Badge, Empty, ErrorBox } from "@/components/ui";

type Requirement = { id: number; position: string; site: string; document_type: string; active: boolean };

export default function AdminPage() {
  const [items, setItems] = useState<Requirement[]>([]), [error, setError] = useState(""), [loading, setLoading] = useState(true), [busy, setBusy] = useState(false), [show, setShow] = useState(false);
  async function load() { setLoading(true); try { setItems(await api<Requirement[]>("requirements")); } catch (e) { setError((e as Error).message); } finally { setLoading(false); } }
  useEffect(() => { void load(); }, []);
  async function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); const form = e.currentTarget, data = new FormData(form); setBusy(true); setError(""); try { await api("requirements", { method: "POST", body: JSON.stringify({ position: data.get("position"), site: data.get("site"), document_type: data.get("document_type"), active: true }) }); form.reset(); setShow(false); await load(); } catch (e) { setError((e as Error).message); } finally { setBusy(false); } }
  return <main className="page">
    <div className="executive-heading"><div><h1>Requirement Master</h1><p>Configure document rules used by the readiness engine.</p></div><button onClick={() => setShow(!show)}>＋ Add requirement</button></div>
    <ErrorBox message={error} />
    {show && <form className="panel form-panel" onSubmit={submit}><h2>New document requirement</h2><div className="form-grid"><label>Position<input name="position" required placeholder="Example: Roustabout" /></label><label>Site<input name="site" required placeholder="Site name or *" /></label><label>Document type<input name="document_type" required placeholder="Example: Passport" /></label></div><div className="form-actions"><button type="button" className="secondary" onClick={() => setShow(false)}>Cancel</button><button disabled={busy}>{busy ? "Saving…" : "Save requirement"}</button></div></form>}
    <section className="panel"><div className="panel-head"><div><h2>Active Compliance Rules</h2><small>Requirements are matched by position and site</small></div><span className="muted">{items.length} rules</span></div>{loading ? <p className="loading">Loading requirements…</p> : items.length ? <div className="table-wrap"><table><thead><tr><th>Position</th><th>Site</th><th>Required document</th><th>Status</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><strong>{item.position}</strong></td><td>{item.site}</td><td>{item.document_type}</td><td><Badge status={item.active ? "active" : "inactive"} /></td></tr>)}</tbody></table></div> : <Empty title="No compliance rules" description="Add the first requirement to make pre-mobilization checks position-specific." />}</section>
  </main>;
}
