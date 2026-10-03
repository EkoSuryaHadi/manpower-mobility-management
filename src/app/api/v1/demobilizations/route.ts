import { NextRequest } from "next/server";
import { DemobilizationService } from "@/services";
import { createDemobSchema } from "@/validators";
import { successResponse, errorResponse, parseBody, serverErrorResponse } from "@/lib/api-utils";
import { requireAuth } from "@/lib/auth-guard";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ["CONFIRM_DEMOBILIZATION"]);
    if (auth.error) return auth.error;
    const actor = auth.user;

    const body = await req.json().catch(() => ({}));
    const parsed = parseBody(createDemobSchema, body);
    if ("error" in parsed) return parsed.error;

    const result = await DemobilizationService.create(parsed.data, req, {
      id: actor.id,
      name: actor.fullName,
    });
    return successResponse(result);
  } catch (error: unknown) {
    return serverErrorResponse("demobilization-create", error);
  }
}
