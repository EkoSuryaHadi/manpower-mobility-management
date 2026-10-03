import { WorkerService } from "@/services";
import { workerSearchSchema, createWorkerSchema } from "@/validators";
import { successResponse, errorResponse, serverErrorResponse, parseBody, parseSearchParams } from "@/lib/api-utils";
import { getClientIp } from "@/lib/audit";
import { requireAuth } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req, ["VIEW_ALL_WORKERS", "MANAGE_WORKERS"]);
    if (auth.error) return auth.error;
    const actor = auth.user;

    const { searchParams } = new URL(req.url);
    const parsed = parseSearchParams(workerSearchSchema, searchParams);
    if ("error" in parsed) return parsed.error;

    let { q, status, companyId, page, limit } = parsed.data;

    // Subcontractors are strictly scoped to their own company
    if (actor.role === "SUBCONTRACTOR" && actor.companyId) {
      companyId = actor.companyId;
    }

    const result = await WorkerService.list({ q, status, companyId, page, limit });

    return successResponse(result.workers, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    });
  } catch (error) {
    return serverErrorResponse("workers-list", error);
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req, ["MANAGE_WORKERS"]);
    if (auth.error) return auth.error;
    const actor = auth.user;

    const body = await req.json().catch(() => ({}));
    const parsed = parseBody(createWorkerSchema, body);
    if ("error" in parsed) return parsed.error;

    // Subcontractor check
    if (actor.role === "SUBCONTRACTOR" && actor.companyId && parsed.data.companyId !== actor.companyId) {
      return errorResponse("Vendor hanya dapat menambahkan pekerja untuk perusahaannya sendiri.", 403);
    }

    const worker = await WorkerService.create(parsed.data, getClientIp(req), {
      id: actor.id,
      name: actor.fullName,
    });

    return successResponse(worker, undefined, "Worker berhasil didaftarkan ke Master Manpower!");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to register worker";
    const status = message.includes("sudah terdaftar") ? 400 : 500;
    return errorResponse(message, status);
  }
}
