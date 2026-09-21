import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const mob = await prisma.mobilization.findUnique({
      where: { id: params.id },
      include: {
        assignment: { include: { worker: true } },
      },
    });

    if (!mob) {
      return NextResponse.json({ error: "Mobilization record not found" }, { status: 404 });
    }

    const now = new Date();

    // 1. Mark Mobilization as ARRIVED
    await prisma.mobilization.update({
      where: { id: params.id },
      data: {
        status: "ARRIVED",
        actualArrivalDate: now,
        arrivalConfirmedBy: "Site Administrator",
      },
    });

    // 2. Update Assignment status to ON_SITE
    await prisma.workerAssignment.update({
      where: { id: mob.assignmentId },
      data: { status: "ON_SITE" },
    });

    // 3. Log Audit
    await logAuditEvent({
      action: "CONFIRM_SITE_ARRIVAL",
      entityType: "MOBILIZATION",
      entityId: params.id,
      payloadAfter: {
        workerId: mob.assignment.workerId,
        assignmentId: mob.assignmentId,
        arrivedAt: now,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Arrival confirmation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
