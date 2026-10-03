import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";
import { errorResponse, serverErrorResponse } from "@/lib/api-utils";
import { logAuditEvent, getClientIp } from "@/lib/audit";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req, ["CONFIRM_DEMOBILIZATION"]);
    if (auth.error) return auth.error;
    const actor = auth.user;

    const body = await req.json().catch(() => ({}));
    const { isCleared } = body;

    if (typeof isCleared !== "boolean") {
      return errorResponse("Field 'isCleared' wajib berupa boolean.", 422);
    }

    const updated = await prisma.clearanceItem.update({
      where: { id: params.id },
      data: {
        isCleared,
        clearedAt: isCleared ? new Date() : null,
        clearedBy: isCleared ? actor.fullName : null,
      },
    });

    await logAuditEvent({
      actorId: actor.id,
      actorName: actor.fullName,
      action: isCleared ? "CLEAR_DEMOB_ITEM" : "UNCLEAR_DEMOB_ITEM",
      entityType: "DEMOBILIZATION",
      entityId: params.id,
      payloadAfter: { isCleared, clearedBy: actor.fullName },
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    return serverErrorResponse("clearance-item-update", error);
  }
}
