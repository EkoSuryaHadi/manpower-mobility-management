export type MMSUserRole =
  | "SYSTEM_ADMIN"
  | "WFM_OFFICER"
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
  description: string;
}

export type MMSPermission =
  | "MANAGE_USERS"
  | "MANAGE_VENDORS"
  | "MANAGE_WORKERS"
  | "VIEW_ALL_WORKERS"
  | "UPLOAD_DOCUMENTS"
  | "VERIFY_DOCUMENTS"
  | "MONITOR_DOCUMENT_EXPIRY"
  | "SUBMIT_PRE_MOB"
  | "APPROVE_HR"
  | "APPROVE_HSE"
  | "APPROVE_CLIENT"
  | "CONFIRM_MOBILIZATION"
  | "CONFIRM_DEMOBILIZATION"
  | "VIEW_VENDOR_DASHBOARD"
  | "VIEW_REPORTS";

export const ROLE_PERMISSIONS: Record<MMSUserRole, MMSPermission[]> = {
  SYSTEM_ADMIN: [
    "MANAGE_USERS",
    "MANAGE_VENDORS",
    "MANAGE_WORKERS",
    "VIEW_ALL_WORKERS",
    "UPLOAD_DOCUMENTS",
    "VERIFY_DOCUMENTS",
    "MONITOR_DOCUMENT_EXPIRY",
    "SUBMIT_PRE_MOB",
    "APPROVE_HR",
    "APPROVE_HSE",
    "APPROVE_CLIENT",
    "CONFIRM_MOBILIZATION",
    "CONFIRM_DEMOBILIZATION",
    "VIEW_VENDOR_DASHBOARD",
    "VIEW_REPORTS",
  ],
  WFM_OFFICER: [
    "MANAGE_VENDORS",
    "MANAGE_WORKERS",
    "VIEW_ALL_WORKERS",
    "UPLOAD_DOCUMENTS",
    "VERIFY_DOCUMENTS",
    "MONITOR_DOCUMENT_EXPIRY",
    "SUBMIT_PRE_MOB",
    "CONFIRM_MOBILIZATION",
    "VIEW_VENDOR_DASHBOARD",
    "VIEW_REPORTS",
  ],
  SUBCONTRACTOR: [
    "UPLOAD_DOCUMENTS",
    "SUBMIT_PRE_MOB",
    "MONITOR_DOCUMENT_EXPIRY",
    "VIEW_VENDOR_DASHBOARD",
  ],
  CONTRACTOR_HR: [
    "MANAGE_WORKERS",
    "VIEW_ALL_WORKERS",
    "UPLOAD_DOCUMENTS",
    "VERIFY_DOCUMENTS",
    "MONITOR_DOCUMENT_EXPIRY",
    "SUBMIT_PRE_MOB",
    "APPROVE_HR",
    "VIEW_REPORTS",
  ],
  CONTRACTOR_HSE: [
    "VIEW_ALL_WORKERS",
    "VERIFY_DOCUMENTS",
    "MONITOR_DOCUMENT_EXPIRY",
    "APPROVE_HSE",
    "VIEW_REPORTS",
  ],
  CLIENT_APPROVER: [
    "VIEW_ALL_WORKERS",
    "APPROVE_CLIENT",
    "VIEW_VENDOR_DASHBOARD",
    "VIEW_REPORTS",
  ],
  SITE_ADMIN: [
    "VIEW_ALL_WORKERS",
    "CONFIRM_MOBILIZATION",
    "CONFIRM_DEMOBILIZATION",
    "VIEW_REPORTS",
  ],
  MANAGEMENT_VIEWER: [
    "VIEW_ALL_WORKERS",
    "VIEW_VENDOR_DASHBOARD",
    "VIEW_REPORTS",
  ],
};

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
    description: "Akses penuh konfigurasi sistem, database, hak akses & master data.",
  },
  WFM_OFFICER: {
    id: "wfm-1",
    name: "Ahmad Rizky Pratama",
    role: "WFM_OFFICER",
    roleLabel: "Workforce Mobility Officer (WFM)",
    companyName: "PT Petro Nusantara Global",
    companyType: "CLIENT",
    email: "wfm@petro.local",
    avatarBg: "bg-teal-600",
    description: "Kontrol pergerakan pekerja, kuota vendor, validasi dokumen, dan monitoring due date.",
  },
  SUBCONTRACTOR: {
    id: "subcon-1",
    name: "Hendra Wijaya",
    role: "SUBCONTRACTOR",
    roleLabel: "Vendor / Subcontractor Admin",
    companyName: "PT Subcon Mandiri Sejahtera",
    companyType: "SUBCONTRACTOR",
    email: "vendor@subcon.local",
    avatarBg: "bg-amber-600",
    description: "Registrasi pekerja vendor, upload berkas pendukung, pantau status review & kuota.",
  },
  CONTRACTOR_HR: {
    id: "hr-1",
    name: "Maya Safitri",
    role: "CONTRACTOR_HR",
    roleLabel: "Main Contractor HR",
    companyName: "PT Utama Karya Konstruksi",
    companyType: "MAIN_CONTRACTOR",
    email: "hr@contractor.local",
    avatarBg: "bg-blue-600",
    description: "Verifikasi PKWT/Identitas dan approval tahap 1 Pre-Mobilization.",
  },
  CONTRACTOR_HSE: {
    id: "hse-1",
    name: "Irwan Pratama",
    role: "CONTRACTOR_HSE",
    roleLabel: "Main Contractor HSE & Medical",
    companyName: "PT Utama Karya Konstruksi",
    companyType: "MAIN_CONTRACTOR",
    email: "hse@contractor.local",
    avatarBg: "bg-emerald-600",
    description: "Verifikasi sertifikat K3, MCU, SIO, dan approval tahap 2 safety clearance.",
  },
  CLIENT_APPROVER: {
    id: "client-1",
    name: "Bambang Soediro",
    role: "CLIENT_APPROVER",
    roleLabel: "Client Project Representative",
    companyName: "PT Petro Nusantara Global",
    companyType: "CLIENT",
    email: "approver@client.local",
    avatarBg: "bg-indigo-600",
    description: "Final approval pre-mobilisasi pekerja ke site operasional klien.",
  },
  SITE_ADMIN: {
    id: "site-1",
    name: "Deni Saputra",
    role: "SITE_ADMIN",
    roleLabel: "Site Administrator (Offshore Rig)",
    companyName: "PT Utama Karya Konstruksi",
    companyType: "MAIN_CONTRACTOR",
    email: "siteadmin@rig.local",
    avatarBg: "bg-orange-600",
    description: "Konfirmasi kedatangan on-site, status harian camp & proses clearance demobilisasi.",
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
    description: "Akses view-only untuk KPI eksekutif, laporan audit & kepatuhan mobilitas.",
  },
};

export function hasPermission(role: MMSUserRole, permission: MMSPermission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}
