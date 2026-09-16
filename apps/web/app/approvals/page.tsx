"use client";
import {useEffect,useState} from "react";
import {api} from "@/lib/api";
import {Heading,Badge,Empty,ErrorBox} from "@/components/ui";
type Approval={id:number;assignment_id:number;status:string;comment?:string};
export default function Approvals(){
 const [items,setItems]=useState<Approval[]>([]),[error,setError]=useState(""),[loading,setLoading]=useState(true),[busy,setBusy]=useState<number|null>(null);
 async function load(){setError("");setLoading(true);try{setItems(await api<Approval[]>("approvals"));}catch(e){setError((e as Error).message);}finally{setLoading(false);}}
 useEffect(()=>{void load();},[]);
 async function decide(id:number,status:string){setBusy(id);try{await api("approvals/"+id,{method:"PATCH",body:JSON.stringify({status})});await load();}catch(e){setError((e as Error).message);}finally{setBusy(null);}}
 return <main className="page"><Heading label="TINJAUAN OPERASIONAL" title="Persetujuan" description="Tinjau pengajuan penugasan dan catat keputusan tim."><button className="secondary" onClick={load}>↻ Perbarui</button></Heading><ErrorBox message={error}/><div className="panel"><div className="panel-head"><h2>Antrean pengajuan</h2><span className="badge pending">{items.filter(a=>a.status==="pending").length} menunggu</span></div>{loading?<p className="loading">Memuat persetujuan…</p>:items.length?<div className="table-wrap"><table><thead><tr><th>Penugasan</th><th>Catatan pengajuan</th><th>Status</th><th>Keputusan</th></tr></thead><tbody>{items.map(a=><tr key={a.id}><td><strong>ASN-{String(a.assignment_id).padStart(4,"0")}</strong></td><td>{a.comment||"Tidak ada catatan"}</td><td><Badge status={a.status}/></td><td>{a.status==="pending"?<div className="heading-actions"><button disabled={busy===a.id} onClick={()=>decide(a.id,"approved")}>Setujui</button><button className="danger" disabled={busy===a.id} onClick={()=>decide(a.id,"rejected")}>Tolak</button></div>:"Keputusan tercatat"}</td></tr>)}</tbody></table></div>:!error&&<Empty title="Antrean masih kosong" description="Pengajuan penugasan yang masuk akan ditampilkan di sini untuk ditinjau." href="/assignments" label="Lihat penugasan"/>}</div></main>;
}
