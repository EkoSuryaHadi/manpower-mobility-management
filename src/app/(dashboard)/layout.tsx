import React from "react";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { getCurrentUser } from "@/lib/auth-guard";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware already blocks unauthenticated requests; this also catches
  // users that were deactivated after their token was issued.
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const sessionUser = {
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    companyName: user.companyName,
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      <Sidebar user={sessionUser} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar user={sessionUser} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
