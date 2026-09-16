"use client";
import {useState} from "react";
import {downloadReport} from "@/lib/api";
import {Heading,ErrorBox} from "@/components/ui";
export default function Reports(){const [error,setError]=useState(""),[busy,setBusy]=useState(false);return <main className="page"><Heading label="DATA OPERASIONAL" title="Laporan" description="Unduh data penugasan organisasi untuk peninjauan dan koordinasi."/><ErrorBox message={error}/><div className="panel form-panel"><p className="eyebrow">EKSPOR CSV</p><h2>Daftar penugasan</h2><p className="subtitle">Mencakup ID pekerja, posisi, site, dan status penugasan.</p><div className="form-actions"><button disabled={busy} onClick={async()=>{setBusy(true);setError("");try{await downloadReport();}catch(e){setError((e as Error).message);}finally{setBusy(false);}}}>{busy?"Menyiapkan…":"↓ Unduh laporan"}</button></div></div></main>;}
