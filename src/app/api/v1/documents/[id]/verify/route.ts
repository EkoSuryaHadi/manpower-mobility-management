import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAuditEvent, getClientIp } from "@/lib/audit";
import { calculateWorkerReadiness } from "@/lib/readiness-engine";
import { requireAuth } from "@/lib/auth-guard";
import { errorResponse, serverErrorResponse } from "@/lib/api-utils";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req, ["VERIFY_DOCUMENTS"]);
    if (auth.error) return auth.error;
    const actor = auth.user;

    const body = await req.json().catch(() => ({}));
    const { status, remarks } = body;

    if (status !== "VERIFIED" && status !== "REJECTED") {
      return errorResponse("Status verifikasi harus 'VERIFIED' atau 'REJECTED'.", 422);
    }

    if (status === "REJECTED" && !remarks?.trim()) {
      return errorResponse("Catatan / alasan penolakan wajib diisi.", 422);
    }

    const existingDoc = await prisma.workerDocument.findUnique({
      where: { id: params.id },
      include: {
        worker: {
          include: {
            assignments: {
              where: { status: { in: ["PLANNED", "PRE_MOBILIZATION", "READY_TO_MOBILIZE"] } },
              take: 1,
            },
          },
        },
      },
    });

    if (!existingDoc) {
      return errorResponse("Dokumen tidak ditemukan.", 404);
    }

    const updated = await prisma.workerDocument.update({
      where: { id: params.id },
      data: {
        verificationStatus: status,
        verifierRemarks: remarks ? String(remarks).slice(0, 1000) : null,
        verifierId: actor.id,
        verifiedAt: new Date(),
      },
    });

    // Immutable Audit Log
    await logAuditEvent({
      actorId: actor.id,
      actorName: actor.fullName,
      action: status === "VERIFIED" ? "VERIFY_DOCUMENT" : "REJECT_DOCUMENT",
      entityType: "DOCUMENT",
      entityId: params.id,
      payloadBefore: { status: existingDoc.verificationStatus },
      payloadAfter: { status, remarks, verifierId: actor.id },
      ipAddress: getClientIp(req),
    });

    // Recalculate worker readiness if worker has active assignment
    const activeAssignment = existingDoc.worker.assignments[0];
    if (activeAssignment) {
      try {
        await calculateWorkerReadiness(activeAssignment.id);
      } catch (err) {
        console.warn("Readiness recalculation warning:", err);
      }
    }

    return NextResponse.json({ success: true, document: updated });
  } catch (error) {
    return serverErrorResponse("document-verify", error);
  }
}
