import { WorkerService } from "@/services";
import { successResponse, serverErrorResponse } from "@/lib/api-utils";
import { requireAuth } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req, ["VIEW_ALL_WORKERS", "MANAGE_WORKERS"]);
    if (auth.error) return auth.error;

    const { searchParams } = new URL(req.url);
    const nik = searchParams.get("nik") || undefined;
    const fullName = searchParams.get("name") || searchParams.get("fullName") || undefined;

    const result = await WorkerService.checkDuplicate({ nik, fullName });
    return successResponse(result);
  } catch (error: unknown) {
    return serverErrorResponse("workers-check-duplicate", error);
  }
}
