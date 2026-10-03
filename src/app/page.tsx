import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth-guard";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { RealityVsMmsSection } from "@/components/landing/RealityVsMmsSection";
import { InteractiveSimulator } from "@/components/landing/InteractiveSimulator";
import { PillarsSection } from "@/components/landing/PillarsSection";
import { WorkflowSection } from "@/components/landing/WorkflowSection";
import { ComplianceSection } from "@/components/landing/ComplianceSection";
import { RolesSection } from "@/components/landing/RolesSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const metadata: Metadata = {
  title: "MMS Enterprise - Manpower Mobility & Compliance Management System",
  description:
    "Satu platform komprehensif untuk tata kelola kepatuhan, verifikasi dokumen K3/SIO, screening hard-blocker, multi-tier approval, dan pemantauan mobilisasi tenaga kerja proyek migas & konstruksi.",
  keywords: [
    "Workforce Mobility Management",
    "Manpower System",
    "Kepatuhan K3 Migas",
    "Pre-Mobilization Approval",
    "SKK Migas PTK-007",
    "Zero-Blocking Readiness Engine",
  ],
};

export default async function HomePage() {
  const user = await getCurrentUser();

  const sessionUser = user
    ? {
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
      }
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Sticky Header */}
      <LandingNavbar user={sessionUser} />

      {/* Main Content Sections */}
      <main className="flex-1">
        <HeroSection isAuth={!!sessionUser} />
        <RealityVsMmsSection />
        <InteractiveSimulator />
        <PillarsSection />
        <WorkflowSection />
        <ComplianceSection />
        <RolesSection />
        <FaqSection />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
