import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAuditEvent, getClientIp } from "@/lib/audit";
import { requireAuth } from "@/lib/auth-guard";
import { errorResponse, serverErrorResponse } from "@/lib/api-utils";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req, ["CONFIRM_MOBILIZATION"]);
    if (auth.error) return auth.error;
    const actor = auth.user;

    const mob = await prisma.mobilization.findUnique({
      where: { id: params.id },
      include: {
        assignment: { include: { worker: true } },
      },
    });

    if (!mob) {
      return errorResponse("Mobilization record not found", 404);
    }

    if (mob.status === "ARRIVED") {
      return errorResponse("Pekerja sudah berstatus tiba on-site.", 409);
    }

    const now = new Date();

    // Transactionally mark mobilization ARRIVED & assignment ON_SITE
    await prisma.$transaction([
      prisma.mobilization.update({
        where: { id: params.id },
        data: {
          status: "ARRIVED",
          actualArrivalDate: now,
          arrivalConfirmedBy: actor.fullName,
        },
      }),
      prisma.workerAssignment.update({
        where: { id: mob.assignmentId },
        data: { status: "ON_SITE" },
      }),
    ]);

    await logAuditEvent({
      actorId: actor.id,
      actorName: actor.fullName,
      action: "CONFIRM_SITE_ARRIVAL",
      entityType: "MOBILIZATION",
      entityId: params.id,
      payloadAfter: {
        workerId: mob.assignment.workerId,
        assignmentId: mob.assignmentId,
        arrivedAt: now,
        confirmedBy: actor.fullName,
      },
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return serverErrorResponse("mobilization-arrive", error);
  }
}
