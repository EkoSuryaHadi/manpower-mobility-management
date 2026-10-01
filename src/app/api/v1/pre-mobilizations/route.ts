import { NextRequest } from "next/server";
import { PreMobilizationService } from "@/services";
import { createPreMobSchema } from "@/validators";
import { successResponse, errorResponse, parseBody } from "@/lib/api-utils";
import { getClientIp } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = parseBody(createPreMobSchema, body);
    if ("error" in parsed) return parsed.error;

    const result = await PreMobilizationService.submit(parsed.data.assignmentId, getClientIp(req));
    return successResponse(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Pre-mobilization submit error";
    const status = message.includes("blocking") ? 422 : 500;
    return errorResponse(message, status);
  }
}
