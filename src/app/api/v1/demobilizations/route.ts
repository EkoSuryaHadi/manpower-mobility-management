import { NextRequest } from "next/server";
import { DemobilizationService } from "@/services";
import { createDemobSchema } from "@/validators";
import { successResponse, errorResponse, parseBody } from "@/lib/api-utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = parseBody(createDemobSchema, body);
    if ("error" in parsed) return parsed.error;

    const result = await DemobilizationService.create(parsed.data);
    return successResponse(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Demobilization initiation error";
    return errorResponse(message, 500);
  }
}
