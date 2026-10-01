"use client";
import { useMemo } from "react";
import type { MMSUserRole, MMSPermission } from "@/lib/auth";
import { ROLE_PERMISSIONS } from "@/lib/auth";

export function usePermission(role: MMSUserRole) {
  return useMemo(() => ({
    hasPermission: (permission: MMSPermission) => {
      const permissions = ROLE_PERMISSIONS[role] || [];
      return permissions.includes(permission);
    },
    hasAnyPermission: (...permissions: MMSPermission[]) => {
      const rolePerms = ROLE_PERMISSIONS[role] || [];
      return permissions.some((p) => rolePerms.includes(p));
    },
    permissions: ROLE_PERMISSIONS[role] || [],
  }), [role]);
}
