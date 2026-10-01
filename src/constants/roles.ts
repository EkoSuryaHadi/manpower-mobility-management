export const USER_ROLES = {
  SYSTEM_ADMIN: "SYSTEM_ADMIN",
  WFM_OFFICER: "WFM_OFFICER",
  SUBCONTRACTOR: "SUBCONTRACTOR",
  CONTRACTOR_HR: "CONTRACTOR_HR",
  CONTRACTOR_HSE: "CONTRACTOR_HSE",
  CLIENT_APPROVER: "CLIENT_APPROVER",
  SITE_ADMIN: "SITE_ADMIN",
  MANAGEMENT_VIEWER: "MANAGEMENT_VIEWER",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ROLE_LABELS: Record<UserRole, string> = {
  SYSTEM_ADMIN: "System Administrator",
  WFM_OFFICER: "Workforce Mobility Officer",
  SUBCONTRACTOR: "Vendor / Subcontractor Admin",
  CONTRACTOR_HR: "Main Contractor HR",
  CONTRACTOR_HSE: "Main Contractor HSE & Medical",
  CLIENT_APPROVER: "Client Project Representative",
  SITE_ADMIN: "Site Administrator",
  MANAGEMENT_VIEWER: "Management Viewer",
};
