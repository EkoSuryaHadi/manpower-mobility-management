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
    const auth = await requireAuth(req, ["CONFIRM_DEMOBILIZATION"]);
    if (auth.error) return auth.error;
    const actor = auth.user;

    const demob = await prisma.demobilization.findUnique({
      where: { id: params.id },
      include: {
        clearanceItems: true,
        assignment: true,
      },
    });

    if (!demob) {
      return errorResponse("Demobilization record not found", 404);
    }

    if (demob.status === "CLOSED") {
      return errorResponse("Demobilisasi sudah ditutup.", 409);
    }

    const uncompleted = demob.clearanceItems.filter((i) => !i.isCleared);
    if (uncompleted.length > 0) {
      return errorResponse(
        `Masih ada ${uncompleted.length} checklist clearance yang belum selesai. Semua checklist clearance wajib dipenuhi sebelum penutupan penugasan.`,
        422
      );
    }

    const now = new Date();

    // Transactionally mark Demobilization CLOSED and Assignment DEMOBILIZED
    await prisma.$transaction([
      prisma.demobilization.update({
        where: { id: params.id },
        data: {
          status: "CLOSED",
          closedAt: now,
          actualDepartureDate: now,
          approvedBy: actor.fullName,
        },
      }),
      prisma.workerAssignment.update({
        where: { id: demob.assignmentId },
        data: {
          status: "DEMOBILIZED",
          endDate: now,
        },
      }),
    ]);

    // Log Audit
    await logAuditEvent({
      actorId: actor.id,
      actorName: actor.fullName,
      action: "CLOSE_ASSIGNMENT_DEMOBILIZED",
      entityType: "DEMOBILIZATION",
      entityId: params.id,
      payloadAfter: {
        assignmentId: demob.assignmentId,
        workerId: demob.assignment.workerId,
        closedAt: now,
        closedBy: actor.fullName,
      },
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return serverErrorResponse("demobilization-close", error);
  }
}
