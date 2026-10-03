import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth-session";
import { canAccessRoute } from "@/lib/route-access";

const PUBLIC_PATHS = ["/", "/login", "/api/v1/auth/login", "/api/v1/auth/logout"];

// Identity headers are only ever set by this middleware; strip any client-supplied copies.
const IDENTITY_HEADERS = ["x-user-id", "x-user-role", "x-user-name"];

function isPublicPath(pathname: string) {
  if (pathname === "/") return true;
  return PUBLIC_PATHS.some((p) => p !== "/" && (pathname === p || pathname.startsWith(`${p}/`)));
}

function unauthorized(request: NextRequest, message: string, clearCookie = false) {
  const { pathname, search } = request.nextUrl;
  const response = pathname.startsWith("/api/")
    ? NextResponse.json({ success: false, error: message }, { status: 401 })
    : (() => {
        const loginUrl = new URL("/login", request.url);
        if (pathname !== "/dashboard") loginUrl.searchParams.set("next", `${pathname}${search}`);
        return NextResponse.redirect(loginUrl);
      })();
  if (clearCookie) response.cookies.delete(SESSION_COOKIE);
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static assets in /public (never applies to API routes, which are always checked)
  if (!pathname.startsWith("/api/") && /\.[a-zA-Z0-9]+$/.test(pathname)) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  IDENTITY_HEADERS.forEach((h) => requestHeaders.delete(h));

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;

  if (isPublicPath(pathname)) {
    // Already logged in users don't need the login page
    if (pathname === "/login" && session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (!token) return unauthorized(request, "Authentication required");
  if (!session) return unauthorized(request, "Invalid or expired session", true);

  // Page-level RBAC (API routes enforce their own permissions via requireAuth)
  if (!pathname.startsWith("/api/") && !canAccessRoute(session.role, pathname)) {
    return NextResponse.redirect(new URL("/dashboard?denied=1", request.url));
  }

  requestHeaders.set("x-user-id", session.userId);
  requestHeaders.set("x-user-role", session.role);
  requestHeaders.set("x-user-name", encodeURIComponent(session.fullName));

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
