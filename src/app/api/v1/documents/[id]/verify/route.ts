import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit";
import { calculateWorkerReadiness } from "@/lib/readiness-engine";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status, remarks } = await req.json();

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
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const updated = await prisma.workerDocument.update({
      where: { id: params.id },
      data: {
        verificationStatus: status, // VERIFIED, REJECTED
        verifierRemarks: remarks || null,
        verifiedAt: new Date(),
      },
    });

    // Immutable Audit Log
    await logAuditEvent({
      action: status === "VERIFIED" ? "VERIFY_DOCUMENT" : "REJECT_DOCUMENT",
      entityType: "DOCUMENT",
      entityId: params.id,
      payloadBefore: { status: existingDoc.verificationStatus },
      payloadAfter: { status, remarks },
    });

    // Recalculate worker readiness if worker has active assignment
    const activeAssignment = existingDoc.worker.assignments[0];
    if (activeAssignment) {
      await calculateWorkerReadiness(activeAssignment.id);
    }

    return NextResponse.json({ success: true, document: updated });
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
