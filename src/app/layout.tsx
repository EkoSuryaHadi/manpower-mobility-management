import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MMS - Manpower Mobility Management System",
  description: "Enterprise workforce compliance, dynamic requirements, multi-stage approvals, and mobilization tracking.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}
