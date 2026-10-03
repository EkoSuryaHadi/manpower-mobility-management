import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAuditEvent, getClientIp } from "@/lib/audit";
import { requireAuth } from "@/lib/auth-guard";
import { serverErrorResponse } from "@/lib/api-utils";

const ACTION_TYPES = ["APPROVE", "RETURN_REVISION", "REJECT"] as const;
type ActionType = (typeof ACTION_TYPES)[number];

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req, ["APPROVE_HR", "APPROVE_HSE", "APPROVE_CLIENT"]);
    if (auth.error) return auth.error;
    const actor = auth.user;

    const body = await req.json().catch(() => ({}));
    const actionType = body?.actionType as ActionType;
    const comment = typeof body?.comment === "string" ? body.comment.slice(0, 2000) : null;

    if (!ACTION_TYPES.includes(actionType)) {
      return NextResponse.json({ success: false, error: "actionType tidak valid" }, { status: 422 });
    }
    if (actionType !== "APPROVE" && !comment?.trim()) {
      return NextResponse.json(
        { success: false, error: "Komentar wajib diisi untuk return/reject." },
        { status: 422 }
      );
    }

    const instance = await prisma.approvalInstance.findUnique({
      where: { id: params.id },
      include: {
        preMobilization: {
          include: { assignment: true },
        },
        workflow: {
          include: {
            steps: { orderBy: { stepOrder: "asc" } },
          },
        },
      },
    });

    if (!instance) {
      return NextResponse.json({ success: false, error: "Approval instance not found" }, { status: 404 });
    }

    if (instance.status !== "PENDING") {
      return NextResponse.json(
        { success: false, error: `Approval sudah berstatus ${instance.status}, tidak bisa diproses lagi.` },
        { status: 409 }
      );
    }

    // Only the role assigned to the current step may act on it (SYSTEM_ADMIN can override).
    const currentStep = instance.workflow.steps.find((s) => s.stepOrder === instance.currentStepOrder);
    if (!currentStep) {
      return NextResponse.json({ success: false, error: "Konfigurasi workflow tidak valid" }, { status: 500 });
    }
    if (actor.role !== "SYSTEM_ADMIN" && actor.role !== currentStep.requiredRole) {
      return NextResponse.json(
        {
          success: false,
          error: `Step "${currentStep.stepName}" hanya dapat diproses oleh role ${currentStep.requiredRole}.`,
        },
        { status: 403 }
      );
    }

    const totalSteps = instance.workflow.steps.length;

    // Execute approval transition atomically
    await prisma.$transaction(async (tx) => {
      // 1. Record immutable ApprovalAction
      await tx.approvalAction.create({
        data: {
          approvalInstanceId: instance.id,
          stepOrder: instance.currentStepOrder,
          actorId: actor.id,
          actionType,
          comments: comment || null,
        },
      });

      if (actionType === "APPROVE") {
        if (instance.currentStepOrder >= totalSteps) {
          // Final Approval reached!
          await tx.approvalInstance.update({
            where: { id: instance.id },
            data: { status: "APPROVED" },
          });

          await tx.preMobilization.update({
            where: { id: instance.preMobilizationId },
            data: { status: "APPROVED", currentStep: "COMPLETED" },
          });

          // Advance assignment to READY_TO_MOBILIZE
          await tx.workerAssignment.update({
            where: { id: instance.preMobilization.assignmentId },
            data: { status: "READY_TO_MOBILIZE" },
          });

          // Automatically initialize mobilization schedule entry (TBD details for WFM to fill)
          await tx.mobilization.create({
            data: {
              preMobilizationId: instance.preMobilizationId,
              assignmentId: instance.preMobilization.assignmentId,
              travelMethod: "FLIGHT",
              flightOrVehicleNo: "TBD (To Be Scheduled)",
              departurePoint: "Transit Hub",
              departureDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
              estimatedArrivalDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
              status: "SCHEDULED",
            },
          });
        } else {
          // Advance to next step
          const nextStepOrder = instance.currentStepOrder + 1;
          const nextStep = instance.workflow.steps.find((s) => s.stepOrder === nextStepOrder);

          await tx.approvalInstance.update({
            where: { id: instance.id },
            data: { currentStepOrder: nextStepOrder },
          });

          if (nextStep) {
            await tx.preMobilization.update({
              where: { id: instance.preMobilizationId },
              data: { currentStep: nextStep.requiredRole },
            });
          }
        }
      } else if (actionType === "RETURN_REVISION") {
        await tx.approvalInstance.update({
          where: { id: instance.id },
          data: { status: "RETURNED" },
        });
        await tx.preMobilization.update({
          where: { id: instance.preMobilizationId },
          data: { status: "REVISION_REQUIRED" },
        });
      } else if (actionType === "REJECT") {
        await tx.approvalInstance.update({
          where: { id: instance.id },
          data: { status: "REJECTED" },
        });
        await tx.preMobilization.update({
          where: { id: instance.preMobilizationId },
          data: { status: "REJECTED" },
        });
      }
    });

    await logAuditEvent({
      actorId: actor.id,
      actorName: actor.fullName,
      action: `APPROVAL_${actionType}`,
      entityType: "APPROVAL",
      entityId: instance.id,
      payloadAfter: {
        actionType,
        stepOrder: instance.currentStepOrder,
        stepRole: currentStep.requiredRole,
        actorRole: actor.role,
        comment,
      },
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return serverErrorResponse("approval-actions", error);
  }
}
