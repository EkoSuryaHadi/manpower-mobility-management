import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const { assignmentId, reason, plannedDepartureDate } = await req.json();

    const demob = await prisma.demobilization.create({
      data: {
        assignmentId,
        reason,
        plannedDepartureDate: new Date(plannedDepartureDate),
        status: "IN_CLEARANCE",
      },
    });

    // Create 4 standard clearance checklist items
    const standardItems = [
      { itemName: "Camp & Accommodation Clearance", category: "LOGISTICS" },
      { itemName: "PPE, Radios & Hand Tool Handover", category: "ASSETS" },
      { itemName: "Site RFID / Security Badge Return", category: "SECURITY" },
      { itemName: "Medical Exit Fitness & Fit-to-Fly Check", category: "HEALTH" },
    ];

    for (const item of standardItems) {
      await prisma.clearanceItem.create({
        data: {
          demobilizationId: demob.id,
          itemName: item.itemName,
          category: item.category,
          isCleared: false,
        },
      });
    }

    // Update assignment status to DEMOBILIZING
    await prisma.workerAssignment.update({
      where: { id: assignmentId },
      data: { status: "DEMOBILIZING" },
    });

    await logAuditEvent({
      action: "INITIATE_DEMOBILIZATION",
      entityType: "DEMOBILIZATION",
      entityId: demob.id,
      payloadAfter: { assignmentId, reason, plannedDepartureDate },
    });

    return NextResponse.json({ success: true, demobId: demob.id });
  } catch (error: any) {
    console.error("Demobilization initiation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
