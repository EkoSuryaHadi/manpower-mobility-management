# Technical Design Specification & PRD: Manpower Mobility & WFM System (MMS Enterprise)

- **Document ID**: MMS-SPEC-002 (Updated from MMS-SPEC-001)
- **Date**: 2026-09-30
- **Status**: Active Baseline & Enhancement Roadmap
- **Scope**: Complete WFM & Manpower Mobility Architecture, 9 Core WFM Requirements, Data Model, RBAC, Due Date Monitoring, and Vendor Quota Dashboards

---

## 1. Executive Summary & 9 Core WFM Pillars

The Manpower Mobility Management System (MMS Enterprise) is a workforce management (WFM) and compliance tracking platform designed for high-risk, high-compliance industries (Oil & Gas, Mining, EPC, Construction). 

The platform implements the **9 Core WFM Pillars**:

| No | Poin Sistem | Status | Fungsi Utama untuk WFM |
|----|-------------|--------|------------------------|
| 1 | **Master Vendor** | ✅ Implemented | Database seluruh kontraktor/vendor, subkontraktor, dan PIC perusahaan |
| 2 | **Manpower Master** | ✅ Implemented | Database induk seluruh pekerja dengan NIK unik, biodata, dan histori assignment |
| 3 | **Dokumen Pendukung Manpower** | ✅ Implemented | Penyimpanan & versioning PKWT, KTP, ijazah, sertifikat K3/SIO, MCU, paspor, dsb. |
| 4 | **Validasi & Approval Manpower** | ✅ Implemented | Screening pre-mobilization, checklist kesiapan, zero-blocking enforcement, approval 3-tier |
| 5 | **Monitoring Manpower Project** | 🚀 Phase 1 Enhancement | Kontrol perbandingan real-time: **Actual vs Approved vs Quota** per site/discipline |
| 6 | **Monitoring Due Date Dokumen** | 🚀 Phase 1 Priority (P0) | Watchlist & matrix dokumen mendekati expired (PKWT, MCU, Sertifikat K3) |
| 7 | **Dashboard Tiap Vendor** | 🚀 Phase 2 Enhancement | Portal vendor khusus: Kuota, Actual Headcount, Klasifikasi Ring 1–4, Expired Docs |
| 8 | **Notifikasi Due Date Dokumen** | 🚀 Phase 2 Enhancement | In-app alert bell & reminder otomatis untuk dokumen <30, <60, <90 hari |
| 9 | **User & Group Access System** | 🚀 Phase 1 Priority (P0) | Autentikasi, Persona/Role switcher, RBAC (WFM, Contractor, HR, HSE, Admin, Client) |

---

## 2. Architecture & Tech Stack

### 2.1 Core Stack
- **Framework**: Next.js 14+ (App Router, React Server Components, TypeScript)
- **Database & ORM**: SQLite (development) with Prisma ORM (seamless PostgreSQL migration compatibility)
- **Styling & UI**: Tailwind CSS with enterprise color palettes, Lucide React icons, and accessible components
- **Auth & RBAC**: Session-based / Persona Context with Role-Based Access Control (RBAC) and granular permission guards
- **State & Communication**: React Server Actions, SWR/React Query for real-time reactivity

### 2.2 Directory Structure
```
e:/Project/Man Power/
├── docs/
│   └── superpowers/specs/2026-09-21-mms-manpower-mobility-system-design.md
├── prisma/
│   ├── schema.prisma            # Canonical data model (Worker, Vendor, Quota, Documents, RBAC, Notifications)
│   └── seed.ts                  # Seed data (Vendors, Projects, Ring 1-4 workers, Roles, Due dates)
├── src/
│   ├── app/
│   │   ├── (auth)/login/        # Login page & quick persona authentication
│   │   ├── (dashboard)/         # Main dashboard layout with Topbar, Sidebar & Auth Context
│   │   │   ├── page.tsx         # Executive / WFM Command Center Dashboard
│   │   │   ├── workers/         # Worker Master directory & detail profiles
│   │   │   ├── import/          # Bulk CSV/Excel worker onboarding
│   │   │   ├── documents/       # Split-screen verification & Document Center
│   │   │   │   └── expiry/      # [NEW] Due Date & Expiry Monitoring Matrix
│   │   │   ├── vendors/         # [NEW] Master Vendor & Per-Vendor Analytics Portal
│   │   │   ├── requirements/    # Dynamic requirement rules builder & simulator
│   │   │   ├── pre-mobilization/# Readiness checklist & submission management
│   │   │   ├── approvals/       # Multi-stage review queue & action modal
│   │   │   ├── mobilization/    # Mobilization board & travel dispatch
│   │   │   ├── on-site/         # Active site headcount & project quota monitoring
│   │   │   ├── demobilization/  # Demobilization requests & clearance checklist
│   │   │   ├── users/           # [NEW] User & Group Access Management (RBAC)
│   │   │   └── reports/         # Analytics, filtered reports, and Excel export
│   │   └── api/v1/              # RESTful API endpoints
│   ├── components/
│   │   ├── layout/              # Sidebar, Topbar, RoleSwitcher, NotificationDropdown
│   │   ├── documents/           # ExpiryWatchlistTable, SplitScreenViewer, DocumentStatusBadge
│   │   ├── vendors/             # VendorQuotaCard, RingBreakdownChart, VendorDetailModal
│   │   ├── users/               # UserTable, RoleBadge, PermissionMatrix
│   │   └── ui/                  # Standardized UI primitives
│   └── lib/
│       ├── prisma.ts            # Global Prisma Client
│       ├── auth.ts              # RBAC & Persona session engine
│       ├── rules-engine.ts      # Document requirement evaluator
│       ├── readiness-engine.ts  # Readiness & zero-blocker calculator
│       └── notifications.ts     # In-app alert & notification dispatcher
```

---

## 3. Data Model Enhancements (Prisma Schema)

### 3.1 Role-Based Access Control (RBAC)
- **User Roles**: `SYSTEM_ADMIN`, `WFM_OFFICER`, `CONTRACTOR_HR`, `CONTRACTOR_HSE`, `SUBCONTRACTOR_VENDOR`, `CLIENT_APPROVER`, `SITE_ADMIN`, `MANAGEMENT_VIEWER`.
- **Permissions**: Granular capability mapping (e.g. `MANAGE_USERS`, `APPROVE_PRE_MOB`, `VERIFY_DOCS`, `VIEW_VENDOR_DASHBOARD`).

### 3.2 Ring Classification (Local Content / Ring 1–4)
- **Worker**: Add `ringCategory` field:
  - `RING_1`: Ring 1 (Desa Terdekat / Buffer Zone Ring 1)
  - `RING_2`: Ring 2 (Kecamatan / Area Ring 2)
  - `RING_3`: Ring 3 (Kabupaten / Provinsi Ring 3)
  - `RING_4`: Ring 4 (Nasional / Luar Provinsi Ring 4)

### 3.3 Project Quota & Capacity Model
- **ProjectQuota / SiteQuota**:
  - `projectId`, `siteId`, `companyId` (Vendor), `discipline`, `quotaApproved` (Int), `targetHeadcount` (Int), `startDate`, `endDate`.
  - Enables instant computation of:
    $$\text{Utilization \%} = \frac{\text{Actual On-Site Headcount}}{\text{Approved Quota}} \times 100\%$$

### 3.4 In-App Notifications Model
- **Notification**:
  - `id`, `userId`, `title`, `message`, `type` (`DOCUMENT_EXPIRY`, `APPROVAL_PENDING`, `QUOTA_EXCEEDED`, `BLOCKED_WORKER`), `linkUrl`, `isRead` (Boolean), `createdAt`.

---

## 4. Phase-by-Phase Implementation Roadmap

### 🎯 Phase 1 (P0 Immediate Priority)
1. **User & Group Access System (Pillar 9)**:
   - Dynamic Persona Switcher in Topbar (Quick live demo role switching).
   - Dedicated User Management page (`/users`) with role filtering and status toggle.
   - Role-based navigation guards & action button permissions.
2. **Monitoring Due Date Dokumen (Pillar 6)**:
   - Dedicated Expiry & Due Date Watchlist page (`/documents/expiry`).
   - Dynamic threshold filters: *Expired*, *Urgent (< 30 Hari)*, *Approaching (< 60 Hari)*, *Safe (> 60 Hari)*.
   - Matrix breakdown for PKWT, MCU, K3 Safework, SIO Welder, and Driver licenses.
   - Quick action: Trigger renewal reminder / Re-upload document.

### 🎯 Phase 2 (P1 High Priority)
3. **Master Vendor CRUD & Detail View (Pillar 1)**:
   - Dedicated Vendor Management page (`/vendors`) with PIC contacts and contracts.
4. **Dashboard Tiap Vendor & Quota Monitoring (Pillars 5 & 7)**:
   - Vendor-specific analytics dashboard with Quota vs Actual headcount tracker.
   - Ring 1–4 local worker demographic distribution visualizer.
   - Filterable view for Subcontractor vendors to view only their assigned workforce.

### 🎯 Phase 3 (P2 Quality & Automation)
5. **Notifikasi Due Date & Alert Center (Pillar 8)**:
   - Topbar Notification Bell with real-time unread badge.
   - Automated rule engine that generates alert notifications when documents enter the <30 day warning window.
