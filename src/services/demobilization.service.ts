import { prisma } from "@/lib/prisma";
import { logAuditEvent, getClientIp } from "@/lib/audit";
import type { CreateDemobInput } from "@/validators/demobilization.schema";

const STANDARD_CLEARANCE_ITEMS = [
  { itemName: "Camp & Accommodation Clearance", category: "LOGISTICS" },
  { itemName: "PPE, Radios & Hand Tool Handover", category: "ASSETS" },
  { itemName: "Site RFID / Security Badge Return", category: "SECURITY" },
  { itemName: "Medical Exit Fitness & Fit-to-Fly Check", category: "HEALTH" },
] as const;

export const DemobilizationService = {
  async create(input: CreateDemobInput, req?: Request, actor?: { id: string; name: string }) {
    // Atomic creation of demob, standard clearance checklist, and assignment status update
    const demob = await prisma.$transaction(async (tx) => {
      const created = await tx.demobilization.create({
        data: {
          assignmentId: input.assignmentId,
          reason: input.reason,
          plannedDepartureDate: new Date(input.plannedDepartureDate),
          status: "IN_CLEARANCE",
        },
      });

      await tx.clearanceItem.createMany({
        data: STANDARD_CLEARANCE_ITEMS.map((item) => ({
          demobilizationId: created.id,
          itemName: item.itemName,
          category: item.category,
          isCleared: false,
        })),
      });

      await tx.workerAssignment.update({
        where: { id: input.assignmentId },
        data: { status: "DEMOBILIZING" },
      });

      return created;
    });

    await logAuditEvent({
      actorId: actor?.id,
      actorName: actor?.name || "System",
      action: "INITIATE_DEMOBILIZATION",
      entityType: "DEMOBILIZATION",
      entityId: demob.id,
      payloadAfter: input,
      ipAddress: getClientIp(req),
    });

    return { demobId: demob.id };
  },
};
