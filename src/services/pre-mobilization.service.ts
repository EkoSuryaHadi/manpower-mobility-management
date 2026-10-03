import { prisma } from "@/lib/prisma";
import { calculateWorkerReadiness } from "@/lib/readiness-engine";
import { logAuditEvent } from "@/lib/audit";

export const PreMobilizationService = {
  async submit(assignmentId: string, ipAddress?: string, actor?: { id: string; name: string }) {
    const evaluation = await calculateWorkerReadiness(assignmentId);
    if (evaluation.overallStatus === "BLOCKED") {
      throw new Error("Pekerja memiliki dokumen blocking yang belum terpenuhi. Pengajuan ditolak.");
    }

    const workflow = await prisma.approvalWorkflow.findFirst({
      where: { code: "STD-MOB-V1" },
    });

    if (!workflow) {
      throw new Error("Workflow approval standar (STD-MOB-V1) tidak ditemukan.");
    }

    const year = new Date().getFullYear();
    const requestNo = `PM-${year}-${Date.now().toString().slice(-6)}`;

    // Atomic transaction for pre-mobilization submission
    const result = await prisma.$transaction(async (tx) => {
      const preMob = await tx.preMobilization.create({
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

      await tx.approvalInstance.create({
        data: {
          preMobilizationId: preMob.id,
          workflowId: workflow.id,
          currentStepOrder: 1,
          status: "PENDING",
        },
      });

      await tx.workerAssignment.update({
        where: { id: assignmentId },
        data: { status: "PRE_MOBILIZATION" },
      });

      return preMob;
    });

    await logAuditEvent({
      actorId: actor?.id,
      actorName: actor?.name || "System",
      action: "SUBMIT_PRE_MOBILIZATION",
      entityType: "PRE_MOBILIZATION",
      entityId: result.id,
      payloadAfter: { requestNo, assignmentId, score: evaluation.readinessScore },
      ipAddress,
    });

    return { requestNo, preMobId: result.id };
  },
};
