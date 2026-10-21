import { WorkerService } from "@/services";
import { uploadWorkerDocumentSchema } from "@/validators";
import { successResponse, errorResponse, serverErrorResponse, parseBody } from "@/lib/api-utils";
import { getClientIp } from "@/lib/audit";
import { requireAuth } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { calculateWorkerReadiness } from "@/lib/readiness-engine";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req, ["VIEW_ALL_WORKERS", "UPLOAD_DOCUMENTS"]);
    if (auth.error) return auth.error;

    const worker = await prisma.worker.findUnique({
      where: { id: params.id },
      include: {
        documents: {
          include: {
            documentType: true,
            versions: { orderBy: { createdAt: "desc" }, take: 1 },
          },
          orderBy: { createdAt: "desc" },
        },
        assignments: {
          include: { project: true, site: true, company: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!worker) {
      return errorResponse("Pekerja tidak ditemukan", 404);
    }

    const docTypes = await prisma.documentType.findMany({
      orderBy: { name: "asc" },
    });

    let readinessSummary = null;
    if (worker.assignments[0]) {
      try {
        readinessSummary = await calculateWorkerReadiness(worker.assignments[0].id);
      } catch (err) {
        // Calculation error handling
      }
    }

    return successResponse({
      worker,
      documents: worker.documents,
      documentTypes: docTypes,
      readinessSummary,
    });
  } catch (error: unknown) {
    return serverErrorResponse("worker-documents-get", error);
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req, ["UPLOAD_DOCUMENTS", "MANAGE_WORKERS"]);
    if (auth.error) return auth.error;
    const actor = auth.user;

    const body = await req.json().catch(() => ({}));
    const parsed = parseBody(uploadWorkerDocumentSchema, body);
    if ("error" in parsed) return parsed.error;

    const result = await WorkerService.uploadDocument(
      params.id,
      parsed.data,
      { id: actor.id, name: actor.fullName },
      getClientIp(req)
    );

    return successResponse(
      result,
      undefined,
      "Dokumen berhasil diunggah! Status dokumen kini PENDING (Menunggu Verifikasi)."
    );
  } catch (error: unknown) {
    return serverErrorResponse("worker-document-upload", error);
  }
}
