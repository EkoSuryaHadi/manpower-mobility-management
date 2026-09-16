import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Manpower Mobility", description: "Workforce mobility operations" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><nav><a href="/dashboard">Dashboard</a><a href="/workers">Workers</a><a href="/assignments">Assignments</a><a href="/approvals">Approvals</a><a href="/login">Sign in</a></nav>{children}</body></html>; }
