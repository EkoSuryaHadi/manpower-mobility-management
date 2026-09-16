"use client";
import {FormEvent,useState} from "react";
import {getSupabaseBrowserClient} from "@/lib/supabase";
import {ErrorBox} from "@/components/ui";
export default function Login(){const [error,setError]=useState(""),[busy,setBusy]=useState(false);
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setError("");const client=getSupabaseBrowserClient();if(!client){setError("Layanan masuk belum dikonfigurasi. Hubungi administrator.");return;}const d=new FormData(e.currentTarget);setBusy(true);try{const {error}=await client.auth.signInWithPassword({email:String(d.get("email")),password:String(d.get("password"))});if(error)throw error;window.location.href="/dashboard";}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
 return <main className="page"><div className="panel login-box"><p className="eyebrow">AKSES ORGANISASI</p><h1>Selamat datang kembali.</h1><p className="subtitle">Masuk untuk melanjutkan pekerjaan tim Anda.</p><form onSubmit={submit}><ErrorBox message={error}/><label>Email kerja<input name="email" type="email" autoComplete="email" required placeholder="nama@perusahaan.com"/></label><label>Kata sandi<input name="password" type="password" autoComplete="current-password" required/></label><button disabled={busy}>{busy?"Memeriksa…":"Masuk ke workspace →"}</button></form></div></main>;
}
