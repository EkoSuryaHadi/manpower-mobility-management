import { prisma } from "./prisma";
import { getApplicableRequirements } from "./rules-engine";

export interface ReadinessChecklistResult {
  requirementId: string;
  requirementName: string;
  documentTypeCode: string;
  documentTypeName: string;
  category: string;
  isMandatory: boolean;
  isBlocking: boolean;
  warningDays: number;
  status: "SATISFIED" | "MISSING" | "EXPIRED" | "EXPIRING_SOON" | "PENDING_REVIEW" | "REJECTED";
  documentId?: string;
  documentNumber?: string;
  expiryDate?: Date | null;
  remarks?: string;
}

export interface WorkerReadinessSummary {
  workerId: string;
  assignmentId: string;
  readinessScore: number;
  overallStatus: "READY" | "BLOCKED" | "NOT_READY";
  totalRequirements: number;
  totalMandatory: number;
  completedMandatory: number;
  missingCount: number;
  expiredCount: number;
  pendingCount: number;
  blockingIssues: string[];
  checklist: ReadinessChecklistResult[];
}

/**
 * Calculates real-time readiness for a worker on an active assignment
 * Enforces Hard-Blocker rule: Any blocking requirement missing/expired/unverified forces status to BLOCKED.
 */
export async function calculateWorkerReadiness(assignmentId: string): Promise<WorkerReadinessSummary> {
  const assignment = await prisma.workerAssignment.findUnique({
    where: { id: assignmentId },
    include: {
      worker: {
        include: {
          documents: {
            include: { documentType: true },
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  if (!assignment) {
    throw new Error(`Assignment not found: ${assignmentId}`);
  }

  const { worker } = assignment;
  const applicableRules = await getApplicableRequirements({
    projectId: assignment.projectId,
    siteId: assignment.siteId,
    companyId: assignment.companyId,
    position: assignment.position,
    discipline: assignment.discipline,
    trade: assignment.trade,
  });

  const now = new Date();
  const checklist: ReadinessChecklistResult[] = [];
  const blockingIssues: string[] = [];

  let totalMandatory = 0;
  let completedMandatory = 0;
  let missingCount = 0;
  let expiredCount = 0;
  let pendingCount = 0;

  for (const rule of applicableRules) {
    if (rule.isMandatory) totalMandatory++;

    // Find worker's latest document for this documentType
    const doc = worker.documents.find((d) => d.documentTypeId === rule.documentTypeId);

    let itemStatus: ReadinessChecklistResult["status"] = "MISSING";
    let remarks = "";

    if (!doc) {
      itemStatus = "MISSING";
      remarks = `Dokumen ${rule.documentType.name} belum diunggah`;
      missingCount++;
    } else if (doc.verificationStatus === "PENDING") {
      itemStatus = "PENDING_REVIEW";
      remarks = "Dokumen menunggu verifikasi oleh tim HR/HSE";
      pendingCount++;
    } else if (doc.verificationStatus === "REJECTED") {
      itemStatus = "REJECTED";
      remarks = doc.verifierRemarks || "Dokumen ditolak pada proses verifikasi";
    } else if (doc.verificationStatus === "EXPIRED" || (doc.expiryDate && doc.expiryDate < now)) {
      itemStatus = "EXPIRED";
      remarks = `Dokumen telah kedaluwarsa sejak ${doc.expiryDate?.toLocaleDateString("id-ID")}`;
      expiredCount++;
    } else if (doc.verificationStatus === "VERIFIED") {
      // Check if expiring soon
      if (doc.expiryDate) {
        const diffDays = Math.ceil((doc.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays <= rule.warningDays) {
          itemStatus = "EXPIRING_SOON";
          remarks = `Dokumen akan kedaluwarsa dalam ${diffDays} hari (${doc.expiryDate.toLocaleDateString("id-ID")})`;
        } else {
          itemStatus = "SATISFIED";
        }
      } else {
        itemStatus = "SATISFIED";
      }

      if (rule.isMandatory) {
        completedMandatory++;
      }
    }

    // Check blocking condition
    if (rule.isBlocking && itemStatus !== "SATISFIED" && itemStatus !== "EXPIRING_SOON") {
      blockingIssues.push(`${rule.name}: ${remarks}`);
    }

    checklist.push({
      requirementId: rule.id,
      requirementName: rule.name,
      documentTypeCode: rule.documentType.code,
      documentTypeName: rule.documentType.name,
      category: rule.documentType.category,
      isMandatory: rule.isMandatory,
      isBlocking: rule.isBlocking,
      warningDays: rule.warningDays,
      status: itemStatus,
      documentId: doc?.id,
      documentNumber: doc?.documentNumber,
      expiryDate: doc?.expiryDate,
      remarks,
    });
  }

  const score = totalMandatory > 0 ? Math.round((completedMandatory / totalMandatory) * 100) : 100;
  
  // Hard blocker evaluation
  let overallStatus: "READY" | "BLOCKED" | "NOT_READY" = "READY";
  if (blockingIssues.length > 0) {
    overallStatus = "BLOCKED";
  } else if (score < 100) {
    overallStatus = "NOT_READY";
  }

  // Update worker's cached score
  await prisma.worker.update({
    where: { id: worker.id },
    data: { overallReadinessScore: score },
  });

  return {
    workerId: worker.id,
    assignmentId: assignment.id,
    readinessScore: score,
    overallStatus,
    totalRequirements: applicableRules.length,
    totalMandatory,
    completedMandatory,
    missingCount,
    expiredCount,
    pendingCount,
    blockingIssues,
    checklist,
  };
}
