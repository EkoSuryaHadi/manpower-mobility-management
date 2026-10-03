import type { MMSUserRole } from "@/lib/auth";

/** Minimal, serializable user info passed from server layout to client layout components. */
export interface SessionUser {
  fullName: string;
  email: string;
  role: MMSUserRole;
  companyName: string | null;
}
