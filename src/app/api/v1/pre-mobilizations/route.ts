import { NextRequest } from "next/server";
import { PreMobilizationService } from "@/services";
import { createPreMobSchema } from "@/validators";
import { successResponse, errorResponse, parseBody, serverErrorResponse } from "@/lib/api-utils";
import { getClientIp } from "@/lib/audit";
import { requireAuth } from "@/lib/auth-guard";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ["SUBMIT_PRE_MOB"]);
    if (auth.error) return auth.error;
    const actor = auth.user;

    const body = await req.json().catch(() => ({}));
    const parsed = parseBody(createPreMobSchema, body);
    if ("error" in parsed) return parsed.error;

    const result = await PreMobilizationService.submit(parsed.data.assignmentId, getClientIp(req), {
      id: actor.id,
      name: actor.fullName,
    });
    return successResponse(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Pre-mobilization submit error";
    if (message.includes("blocking") || message.includes("tidak ditemukan")) {
      return errorResponse(message, 422);
    }
    return serverErrorResponse("pre-mobilization-submit", error);
  }
}
