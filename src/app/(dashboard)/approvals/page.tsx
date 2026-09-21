import React from "react";
import { prisma } from "@/lib/prisma";
import { StatusChip } from "@/components/ui/StatusChip";
import {
  GitPullRequestDraft,
  CheckCircle,
  XCircle,
  RotateCcw,
  Clock,
  User,
  Shield,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { ApprovalWorkspaceClient } from "./ApprovalWorkspaceClient";

export const dynamic = "force-dynamic";

export default async function ApprovalsPage({
  searchParams,
}: {
  searchParams: { step?: string; requestId?: string };
}) {
  let approvalInstances: any[] = [];
  let currentUsers: any[] = [];

  try {
    approvalInstances = await prisma.approvalInstance.findMany({
      include: {
        preMobilization: {
          include: {
            assignment: {
              include: {
                worker: true,
                project: true,
                site: true,
                company: true,
              },
            },
          },
        },
        workflow: {
          include: {
            steps: {
              orderBy: { stepOrder: "asc" },
            },
          },
        },
        actions: {
          include: { actor: true },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    currentUsers = await prisma.user.findMany();
  } catch (e) {
    // Database initializing
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <GitPullRequestDraft className="w-5 h-5 text-brand-600" />
            Multi-Stage Approval Workspace
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Antrean verifikasi berjenjang: Subcontractor $\rightarrow$ Contractor HR $\rightarrow$ Contractor HSE $\rightarrow$ Client Approver.
          </p>
        </div>
      </div>

      <ApprovalWorkspaceClient
        instances={approvalInstances}
        users={currentUsers}
        initialSelectedRequestId={searchParams.requestId}
      />
    </div>
  );
}
