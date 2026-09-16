"use client";
import { FormEvent, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [message, setMessage] = useState("");
  async function submit(event: FormEvent) { event.preventDefault(); const client = getSupabaseBrowserClient(); if (!client) { setMessage("Supabase belum dikonfigurasi."); return; } const { error } = await client.auth.signInWithPassword({ email, password }); if (error) { setMessage(error.message); return; } window.location.href = "/dashboard"; }
  return <main className="shell narrow"><p className="eyebrow">SECURE ACCESS</p><h1>Sign in.</h1><form className="worker-form" onSubmit={submit}><input type="email" required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><input type="password" required placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><button type="submit">Continue</button></form>{message && <p role="alert">{message}</p>}</main>;
}
