import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ROLE_PERMISSIONS, type MMSPermission, type MMSUserRole } from "@/lib/auth";
import { getSessionFromCookies, getSessionFromRequest, type SessionPayload } from "@/lib/auth-session";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: MMSUserRole;
  companyId: string | null;
  companyName: string | null;
}

/**
 * Re-load the user from the database so deactivated users and role changes
 * take effect immediately, instead of trusting the token for its full lifetime.
 */
async function loadActiveUser(session: SessionPayload | null): Promise<AuthUser | null> {
  if (!session) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { company: { select: { name: true } } },
  });
  if (!user || !user.isActive || !(user.role in ROLE_PERMISSIONS)) return null;

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role as MMSUserRole,
    companyId: user.companyId,
    companyName: user.company?.name ?? null,
  };
}

export function userHasAnyPermission(user: Pick<AuthUser, "role">, permissions: MMSPermission[]): boolean {
  const granted = ROLE_PERMISSIONS[user.role] || [];
  return permissions.some((p) => granted.includes(p));
}

/** For server components / layouts. */
export async function getCurrentUser(): Promise<AuthUser | null> {
  return loadActiveUser(await getSessionFromCookies());
}

export type AuthResult = { user: AuthUser; error?: undefined } | { user?: undefined; error: NextResponse };

/**
 * Guard for API route handlers.
 * Pass `permissions` to require at least ONE of them (any-of semantics).
 *
 * Usage:
 *   const auth = await requireAuth(req, ["VERIFY_DOCUMENTS"]);
 *   if (auth.error) return auth.error;
 *   auth.user // authenticated actor
 */
export async function requireAuth(req: Request, permissions: MMSPermission[] = []): Promise<AuthResult> {
  const user = await loadActiveUser(await getSessionFromRequest(req));
  if (!user) {
    return {
      error: NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 }),
    };
  }

  if (permissions.length > 0 && !userHasAnyPermission(user, permissions)) {
    return {
      error: NextResponse.json(
        { success: false, error: "Anda tidak memiliki hak akses untuk aksi ini." },
        { status: 403 }
      ),
    };
  }

  return { user };
}
