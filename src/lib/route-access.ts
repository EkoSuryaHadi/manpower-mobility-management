import type { MMSUserRole } from "@/lib/auth";

/**
 * Page-level access map, keyed by route prefix.
 * Single source of truth for both the Sidebar (menu visibility) and the
 * middleware (server-side page protection). SYSTEM_ADMIN can access everything.
 */
export const ROUTE_ACCESS: Record<string, MMSUserRole[]> = {
  "/dashboard": [
    "WFM_OFFICER",
    "SUBCONTRACTOR",
    "CONTRACTOR_HR",
    "CONTRACTOR_HSE",
    "CLIENT_APPROVER",
    "SITE_ADMIN",
    "MANAGEMENT_VIEWER",
  ],
  "/workers": [
    "WFM_OFFICER",
    "CONTRACTOR_HR",
    "CONTRACTOR_HSE",
    "CLIENT_APPROVER",
    "SITE_ADMIN",
    "MANAGEMENT_VIEWER",
  ],
  "/import": ["WFM_OFFICER", "SUBCONTRACTOR", "CONTRACTOR_HR"],
  "/documents": ["WFM_OFFICER", "SUBCONTRACTOR", "CONTRACTOR_HR", "CONTRACTOR_HSE"],
  "/documents/expiry": ["WFM_OFFICER", "SUBCONTRACTOR", "CONTRACTOR_HR", "CONTRACTOR_HSE"],
  "/pre-mobilization": ["WFM_OFFICER", "SUBCONTRACTOR", "CONTRACTOR_HR", "CONTRACTOR_HSE"],
  "/approvals": ["CONTRACTOR_HR", "CONTRACTOR_HSE", "CLIENT_APPROVER"],
  "/mobilization": ["WFM_OFFICER", "SITE_ADMIN", "CONTRACTOR_HR"],
  "/on-site": ["WFM_OFFICER", "SITE_ADMIN", "CONTRACTOR_HR", "CLIENT_APPROVER", "MANAGEMENT_VIEWER"],
  "/demobilization": ["WFM_OFFICER", "SITE_ADMIN", "CONTRACTOR_HR"],
  "/vendors": [
    "WFM_OFFICER",
    "CONTRACTOR_HR",
    "CLIENT_APPROVER",
    "MANAGEMENT_VIEWER",
    "SUBCONTRACTOR",
  ],
  "/requirements": ["WFM_OFFICER", "CONTRACTOR_HSE"],
  "/users": [],
  "/reports": [
    "WFM_OFFICER",
    "CONTRACTOR_HR",
    "CONTRACTOR_HSE",
    "CLIENT_APPROVER",
    "MANAGEMENT_VIEWER",
  ],
};

/** Find the most specific configured prefix for a pathname (e.g. /documents/expiry over /documents). */
function matchRoute(pathname: string): string | null {
  let best: string | null = null;
  for (const prefix of Object.keys(ROUTE_ACCESS)) {
    const matches =
      prefix === "/" ? pathname === "/" : pathname === prefix || pathname.startsWith(`${prefix}/`);
    if (matches && (!best || prefix.length > best.length)) best = prefix;
  }
  return best;
}

export function canAccessRoute(role: MMSUserRole, pathname: string): boolean {
  if (role === "SYSTEM_ADMIN") return true;
  const prefix = matchRoute(pathname);
  // Unmapped routes (e.g. 404 pages) are allowed for any authenticated user.
  if (!prefix) return true;
  return ROUTE_ACCESS[prefix].includes(role);
}
