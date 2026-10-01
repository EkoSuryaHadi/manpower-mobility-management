import { WorkerService } from "@/services";
import { workerSearchSchema, createWorkerSchema } from "@/validators";
import { successResponse, errorResponse, parseBody, parseSearchParams } from "@/lib/api-utils";
import { getClientIp } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = parseSearchParams(workerSearchSchema, searchParams);
    if ("error" in parsed) return parsed.error;

    const { q, status, companyId, page, limit } = parsed.data;
    const result = await WorkerService.list({ q, status, companyId, page, limit });

    return successResponse(result.workers, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch workers";
    return errorResponse(message, 500);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = parseBody(createWorkerSchema, body);
    if ("error" in parsed) return parsed.error;

    const worker = await WorkerService.create(parsed.data, getClientIp(req));

    return successResponse(worker, undefined, "Worker berhasil didaftarkan ke Master Manpower!");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to register worker";
    const status = message.includes("sudah terdaftar") ? 400 : 500;
    return errorResponse(message, status);
  }
}
