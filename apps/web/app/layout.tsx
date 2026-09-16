import "./globals.css";
import type { Metadata } from "next";
import AppShell from "@/components/app-shell";
export const metadata: Metadata = { title: "Manpower | Pusat Operasional", description: "Pusat kendali mobilisasi manpower" };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="id"><body><AppShell>{children}</AppShell></body></html>;}
