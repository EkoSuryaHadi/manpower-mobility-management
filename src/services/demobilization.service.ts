import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit";
import type { CreateDemobInput } from "@/validators/demobilization.schema";

const STANDARD_CLEARANCE_ITEMS = [
  { itemName: "Camp & Accommodation Clearance", category: "LOGISTICS" },
  { itemName: "PPE, Radios & Hand Tool Handover", category: "ASSETS" },
  { itemName: "Site RFID / Security Badge Return", category: "SECURITY" },
  { itemName: "Medical Exit Fitness & Fit-to-Fly Check", category: "HEALTH" },
] as const;

export const DemobilizationService = {
  async create(input: CreateDemobInput) {
    const demob = await prisma.demobilization.create({
      data: {
        assignmentId: input.assignmentId,
        reason: input.reason,
        plannedDepartureDate: new Date(input.plannedDepartureDate),
        status: "IN_CLEARANCE",
      },
    });

    // Batch create clearance items (more efficient than individual creates in a loop)
    await prisma.clearanceItem.createMany({
      data: STANDARD_CLEARANCE_ITEMS.map((item) => ({
        demobilizationId: demob.id,
        itemName: item.itemName,
        category: item.category,
        isCleared: false,
      })),
    });

    await prisma.workerAssignment.update({
      where: { id: input.assignmentId },
      data: { status: "DEMOBILIZING" },
    });

    await logAuditEvent({
      action: "INITIATE_DEMOBILIZATION",
      entityType: "DEMOBILIZATION",
      entityId: demob.id,
      payloadAfter: input,
    });

    return { demobId: demob.id };
  },
};
