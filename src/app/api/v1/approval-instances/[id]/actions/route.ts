import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { actionType, comment } = await req.json();

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
      return NextResponse.json({ error: "Approval instance not found" }, { status: 404 });
    }

    // Default to admin or first user for demo action
    const actor = (await prisma.user.findFirst({ where: { role: "SYSTEM_ADMIN" } })) ||
      (await prisma.user.findFirst());

    // Record immutable ApprovalAction
    await prisma.approvalAction.create({
      data: {
        approvalInstanceId: instance.id,
        stepOrder: instance.currentStepOrder,
        actorId: actor?.id || "system",
        actionType,
        comments: comment || null,
      },
    });

    const totalSteps = instance.workflow.steps.length;

    if (actionType === "APPROVE") {
      if (instance.currentStepOrder >= totalSteps) {
        // Final Approval reached!
        await prisma.approvalInstance.update({
          where: { id: instance.id },
          data: { status: "APPROVED" },
        });

        await prisma.preMobilization.update({
          where: { id: instance.preMobilizationId },
          data: { status: "APPROVED", currentStep: "COMPLETED" },
        });

        // Advance assignment to READY_TO_MOBILIZE
        await prisma.workerAssignment.update({
          where: { id: instance.preMobilization.assignmentId },
          data: { status: "READY_TO_MOBILIZE" },
        });

        // Automatically initialize mobilization entry
        await prisma.mobilization.create({
          data: {
            preMobilizationId: instance.preMobilizationId,
            assignmentId: instance.preMobilization.assignmentId,
            travelMethod: "FLIGHT",
            flightOrVehicleNo: `GA-${Math.floor(100 + Math.random() * 900)}`,
            departurePoint: "Jakarta Soekarno-Hatta (CGK)",
            departureDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            estimatedArrivalDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
            status: "SCHEDULED",
          },
        });
      } else {
        // Advance to next step
        const nextStepOrder = instance.currentStepOrder + 1;
        const nextStep = instance.workflow.steps.find((s) => s.stepOrder === nextStepOrder);

        await prisma.approvalInstance.update({
          where: { id: instance.id },
          data: { currentStepOrder: nextStepOrder },
        });

        if (nextStep) {
          await prisma.preMobilization.update({
            where: { id: instance.preMobilizationId },
            data: { currentStep: nextStep.requiredRole },
          });
        }
      }
    } else if (actionType === "RETURN_REVISION") {
      await prisma.approvalInstance.update({
        where: { id: instance.id },
        data: { status: "RETURNED" },
      });
      await prisma.preMobilization.update({
        where: { id: instance.preMobilizationId },
        data: { status: "REVISION_REQUIRED" },
      });
    } else if (actionType === "REJECT") {
      await prisma.approvalInstance.update({
        where: { id: instance.id },
        data: { status: "REJECTED" },
      });
      await prisma.preMobilization.update({
        where: { id: instance.preMobilizationId },
        data: { status: "REJECTED" },
      });
    }

    await logAuditEvent({
      action: `APPROVAL_${actionType}`,
      entityType: "APPROVAL",
      entityId: instance.id,
      payloadAfter: { actionType, stepOrder: instance.currentStepOrder, comment },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Approval action error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
