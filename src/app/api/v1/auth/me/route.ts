import { requireAuth } from "@/lib/auth-guard";
import { successResponse } from "@/lib/api-utils";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = await requireAuth(req);
  if (auth.error) return auth.error;
  return successResponse(auth.user);
}
