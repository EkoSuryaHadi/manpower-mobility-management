"use client";
import {useEffect,useState} from "react";
import {api} from "@/lib/api";
import {Heading,Badge,Empty,ErrorBox} from "./ui";
type Trip={id:number;assignment_id:number;status:string;departure_at?:string;arrival_at?:string;returned_at?:string;notes?:string};
export default function TravelList({returning=false}:{returning?:boolean}){
 const [items,setItems]=useState<Trip[]>([]),[error,setError]=useState(""),[loading,setLoading]=useState(true);
 const path=returning?"demobilizations":"mobilizations";
 async function load(){setLoading(true);setError("");try{setItems(await api<Trip[]>(path));}catch(e){setError((e as Error).message);}finally{setLoading(false);}}
 useEffect(()=>{void load();},[path]);
 function date(value?:string){return value?new Date(value).toLocaleString("id-ID"):"Belum dicatat";}
 return <main className="page"><Heading label="PERJALANAN TIM" title={returning?"Demobilisasi":"Mobilisasi"} description={returning?"Pantau kepulangan pekerja dari lokasi penugasan.":"Pantau jadwal keberangkatan dan kedatangan pekerja."}><button className="secondary" onClick={load}>↻ Perbarui</button></Heading><ErrorBox message={error}/><div className="panel">{loading?<p className="loading">Memuat perjalanan…</p>:items.length?<div className="table-wrap"><table><thead><tr><th>Penugasan</th><th>{returning?"Waktu kembali":"Keberangkatan"}</th>{!returning&&<th>Kedatangan</th>}<th>Status</th><th>Catatan</th></tr></thead><tbody>{items.map(t=><tr key={t.id}><td>ASN-{String(t.assignment_id).padStart(4,"0")}</td><td>{date(returning?t.returned_at:t.departure_at)}</td>{!returning&&<td>{date(t.arrival_at)}</td>}<td><Badge status={t.status}/></td><td>{t.notes||"—"}</td></tr>)}</tbody></table></div>:!error&&<Empty title="Belum ada perjalanan tercatat" description="Data perjalanan dari penugasan akan ditampilkan di sini." href="/assignments" label="Lihat penugasan"/>}</div></main>;
}
