import { prisma } from "./prisma";

export interface LogAuditParams {
  actorId?: string;
  actorName?: string;
  action: string;
  entityType: "WORKER" | "ASSIGNMENT" | "DOCUMENT" | "REQUIREMENT" | "PRE_MOBILIZATION" | "APPROVAL" | "MOBILIZATION" | "DEMOBILIZATION";
  entityId: string;
  payloadBefore?: any;
  payloadAfter?: any;
  ipAddress?: string;
}

/**
 * Append-only immutable audit logger
 */
export async function logAuditEvent(params: LogAuditParams) {
  try {
    return await prisma.auditLog.create({
      data: {
        actorId: params.actorId,
        actorName: params.actorName || "System",
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        payloadBefore: params.payloadBefore ? JSON.stringify(params.payloadBefore) : null,
        payloadAfter: params.payloadAfter ? JSON.stringify(params.payloadAfter) : null,
        ipAddress: params.ipAddress || "127.0.0.1",
      },
    });
  } catch (error) {
    console.error("Audit logging error:", error);
    // Audit log should never crash the main transaction, but errors should be logged
    return null;
  }
}
