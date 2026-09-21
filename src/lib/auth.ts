export type MMSUserRole =
  | "SYSTEM_ADMIN"
  | "SUBCONTRACTOR"
  | "CONTRACTOR_HR"
  | "CONTRACTOR_HSE"
  | "CLIENT_APPROVER"
  | "SITE_ADMIN"
  | "MANAGEMENT_VIEWER";

export interface DemoPersona {
  id: string;
  name: string;
  role: MMSUserRole;
  roleLabel: string;
  companyName: string;
  companyType: string;
  email: string;
  avatarBg: string;
}

export const DEMO_PERSONAS: Record<MMSUserRole, DemoPersona> = {
  SYSTEM_ADMIN: {
    id: "admin-1",
    name: "Super Administrator",
    role: "SYSTEM_ADMIN",
    roleLabel: "System Administrator",
    companyName: "PT Utama Karya Konstruksi",
    companyType: "MAIN_CONTRACTOR",
    email: "admin@mms.local",
    avatarBg: "bg-purple-600",
  },
  SUBCONTRACTOR: {
    id: "subcon-1",
    name: "Hendra Wijaya",
    role: "SUBCONTRACTOR",
    roleLabel: "Vendor / Subcontractor",
    companyName: "PT Subcon Mandiri Sejahtera",
    companyType: "SUBCONTRACTOR",
    email: "vendor@subcon.local",
    avatarBg: "bg-amber-600",
  },
  CONTRACTOR_HR: {
    id: "hr-1",
    name: "Maya Safitri",
    role: "CONTRACTOR_HR",
    roleLabel: "Contractor HR Reviewer",
    companyName: "PT Utama Karya Konstruksi",
    companyType: "MAIN_CONTRACTOR",
    email: "hr@contractor.local",
    avatarBg: "bg-blue-600",
  },
  CONTRACTOR_HSE: {
    id: "hse-1",
    name: "Irwan Pratama",
    role: "CONTRACTOR_HSE",
    roleLabel: "Contractor HSE & Medical",
    companyName: "PT Utama Karya Konstruksi",
    companyType: "MAIN_CONTRACTOR",
    email: "hse@contractor.local",
    avatarBg: "bg-emerald-600",
  },
  CLIENT_APPROVER: {
    id: "client-1",
    name: "Bambang Soediro",
    role: "CLIENT_APPROVER",
    roleLabel: "Client Approver (Owner)",
    companyName: "PT Petro Nusantara Global",
    companyType: "CLIENT",
    email: "approver@client.local",
    avatarBg: "bg-indigo-600",
  },
  SITE_ADMIN: {
    id: "site-1",
    name: "Deni Saputra",
    role: "SITE_ADMIN",
    roleLabel: "Site Administrator (Rig Alpha)",
    companyName: "PT Utama Karya Konstruksi",
    companyType: "MAIN_CONTRACTOR",
    email: "siteadmin@rig.local",
    avatarBg: "bg-orange-600",
  },
  MANAGEMENT_VIEWER: {
    id: "mgmt-1",
    name: "Linda Kusuma",
    role: "MANAGEMENT_VIEWER",
    roleLabel: "Management Viewer",
    companyName: "PT Petro Nusantara Global",
    companyType: "CLIENT",
    email: "management@corp.local",
    avatarBg: "bg-slate-700",
  },
};
