import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const demob = await prisma.demobilization.findUnique({
      where: { id: params.id },
      include: {
        clearanceItems: true,
        assignment: true,
      },
    });

    if (!demob) {
      return NextResponse.json({ error: "Demobilization record not found" }, { status: 404 });
    }

    const uncompleted = demob.clearanceItems.filter((i) => !i.isCleared);
    if (uncompleted.length > 0) {
      return NextResponse.json(
        { error: "Semua checklist clearance wajib dipenuhi sebelum penutupan penugasan." },
        { status: 422 }
      );
    }

    const now = new Date();

    // 1. Mark Demobilization CLOSED
    await prisma.demobilization.update({
      where: { id: params.id },
      data: {
        status: "CLOSED",
        closedAt: now,
        actualDepartureDate: now,
        approvedBy: "Site Administrator",
      },
    });

    // 2. Mark WorkerAssignment DEMOBILIZED (Removes from active on-site headcount)
    await prisma.workerAssignment.update({
      where: { id: demob.assignmentId },
      data: {
        status: "DEMOBILIZED",
        endDate: now,
      },
    });

    // 3. Log Audit
    await logAuditEvent({
      action: "CLOSE_ASSIGNMENT_DEMOBILIZED",
      entityType: "DEMOBILIZATION",
      entityId: params.id,
      payloadAfter: {
        assignmentId: demob.assignmentId,
        workerId: demob.assignment.workerId,
        closedAt: now,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Close demob error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
