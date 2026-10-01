import { prisma } from "@/lib/prisma";
import { calculateWorkerReadiness } from "@/lib/readiness-engine";
import { logAuditEvent } from "@/lib/audit";

export const PreMobilizationService = {
  async submit(assignmentId: string, ipAddress?: string) {
    const evaluation = await calculateWorkerReadiness(assignmentId);
    if (evaluation.overallStatus === "BLOCKED") {
      throw new Error("Pekerja memiliki dokumen blocking yang belum terpenuhi. Pengajuan ditolak.");
    }

    const workflow = await prisma.approvalWorkflow.findFirst({
      where: { code: "STD-MOB-V1" },
    });

    const year = new Date().getFullYear();
    const requestNo = `PM-${year}-${Date.now().toString().slice(-4)}${Math.floor(1000 + Math.random() * 9000)}`;

    const preMob = await prisma.preMobilization.create({
      data: {
        requestNo,
        assignmentId,
        plannedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        readinessScore: evaluation.readinessScore,
        blockingCount: evaluation.blockingIssues.length,
        status: "SUBMITTED",
        currentStep: "CONTRACTOR_HR",
        submittedAt: new Date(),
      },
    });

    if (workflow) {
      await prisma.approvalInstance.create({
        data: {
          preMobilizationId: preMob.id,
          workflowId: workflow.id,
          currentStepOrder: 1,
          status: "PENDING",
        },
      });
    }

    await prisma.workerAssignment.update({
      where: { id: assignmentId },
      data: { status: "PRE_MOBILIZATION" },
    });

    await logAuditEvent({
      action: "SUBMIT_PRE_MOBILIZATION",
      entityType: "PRE_MOBILIZATION",
      entityId: preMob.id,
      payloadAfter: { requestNo, assignmentId, score: evaluation.readinessScore },
      ipAddress,
    });

    return { requestNo, preMobId: preMob.id };
  },
};
