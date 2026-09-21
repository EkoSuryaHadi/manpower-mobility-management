# Technical Design Specification: Manpower Mobility Management System (MMS)

- **Document ID**: MMS-SPEC-001
- **Date**: 2026-09-21
- **Status**: Approved Baseline
- **Scope**: Complete MVP Architecture, Data Model, Business Engines, and Implementation Roadmap

---

## 1. Executive Summary & Objectives

The Manpower Mobility Management System (MMS) is an enterprise application designed to manage the end-to-end lifecycle of contractor and subcontractor workforces in high-compliance industries (such as Oil & Gas, Mining, Construction, and EPC). 

The system provides:
1. **Single Source of Truth**: Unified worker master profiles with multi-project assignment history.
2. **Automated Compliance & Readiness**: Dynamic requirement generation based on worker position, project, site, and discipline, with instant readiness scoring and blocking issue detection.
3. **Multi-Stage Approval Workflow**: Configurable chain of reviews across Subcontractor $\rightarrow$ Contractor HR $\rightarrow$ Contractor HSE $\rightarrow$ Client Approver.
4. **Mobility Tracking**: End-to-end journey control from pre-mobilization, travel scheduling, on-site arrival confirmation, active site headcount, to demobilization and clearance.
5. **Full Auditability**: Immutable audit trail for all verification, approval, and movement actions.

---

## 2. Architecture & Tech Stack

### 2.1 Core Stack
- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Database & ORM**: SQLite (development zero-config) with Prisma ORM; schema designed with full compatibility for seamless production deployment to PostgreSQL.
- **Styling & UI**: Tailwind CSS v3/v4 with custom enterprise theme tokens (high-contrast, clean enterprise design) and Lucide React icons.
- **State Management & Data Fetching**: React Server Components (RSC) + Server Actions + SWR/React Query for reactive client components.
- **File Storage**: Local filesystem `/public/uploads` for development with abstracted storage interface ready for S3/MinIO signed URLs.

### 2.2 Directory Structure
```
e:/Project/Man Power/
├── docs/
│   └── superpowers/specs/2026-09-21-mms-manpower-mobility-system-design.md
├── prisma/
│   ├── schema.prisma            # Canonical data model
│   └── seed.ts                  # Rich seed data (master companies, projects, sites, roles, demo users, rules, workers)
├── src/
│   ├── app/
│   │   ├── (auth)/login/        # Authentication & persona selection
│   │   ├── (dashboard)/         # Main authenticated layout
│   │   │   ├── layout.tsx       # Sidebar, topbar with Role Switcher, notifications
│   │   │   ├── page.tsx         # Executive Dashboard (KPIs, headcount, compliance radar)
│   │   │   ├── workers/         # Worker directory & Worker profile (tabs: Overview, Assignments, Docs, History)
│   │   │   ├── import/          # Bulk CSV/Excel worker onboarding with staging & validation preview
│   │   │   ├── documents/       # Document verification hub with split-screen viewer
│   │   │   ├── requirements/    # Dynamic requirement rules builder & simulator
│   │   │   ├── pre-mobilization/# Readiness checklist & submission management
│   │   │   ├── approvals/       # Multi-stage review queue & action modal (Approve, Return, Reject)
│   │   │   ├── mobilization/    # Mobilization board & travel dispatch
│   │   │   ├── on-site/         # Active site manpower tracking & departure trigger
│   │   │   ├── demobilization/  # Demobilization requests, clearance checklist, and archival
│   │   │   └── reports/         # Operational analytics, filtered reports, and Excel/PDF export
│   │   └── api/v1/              # RESTful API endpoints adhering to API-MMS-001
│   ├── components/
│   │   ├── ui/                  # Standardized UI primitives (Button, Modal, Badge, StatusChip, Card, Table)
│   │   ├── layout/              # Sidebar, Topbar, DevRoleSwitcher
│   │   ├── workers/             # ProfileHeader, AssignmentHistoryTable, DocumentUploadModal
│   │   ├── documents/           # SplitScreenViewer, VerificationForm
│   │   ├── readiness/           # ReadinessScoreGauge, ChecklistTree, BlockerAlert
│   │   └── approvals/           # ApprovalTimeline, CommentHistory, WorkflowStepper
│   └── lib/
│       ├── prisma.ts            # Global Prisma Client instance
│       ├── auth.ts              # Session, current user, role checking
│       ├── rules-engine.ts      # Dynamic document requirements evaluator
│       ├── readiness-engine.ts  # Readiness score & blocker calculator
│       └── audit.ts             # Append-only audit logger
```

---

## 3. Data Model (Prisma Schema Specification)

### 3.1 Role-Based Access Control (RBAC) & Organizations
- **User**: Authentication, email, name, phone, companyId, role, isActive.
- **Company**: Hierarchy of `CLIENT`, `MAIN_CONTRACTOR`, `SUBCONTRACTOR`, `VENDOR`.
- **Project & Site**: Multi-site management per project with operational metadata (e.g. Onshore/Offshore, Remote).

### 3.2 Worker & Assignment Model
- **Worker**: Canonical profile with `employeeNo`, `fullName`, `nik` (unique), `passportNo`, `birthDate`, `gender`, `nationality`, `contactNumber`, `address`, `status` (`ACTIVE`, `INACTIVE`, `BLACKLISTED`), `overallReadinessScore`.
- **WorkerAssignment**: Connection between worker, project, site, and employer. Fields: `position`, `discipline`, `trade`, `rotationSchedule`, `startDate`, `endDate`, `status` (`PLANNED`, `PRE_MOBILIZATION`, `READY_TO_MOBILIZE`, `MOBILIZED`, `ON_SITE`, `DEMOBILIZING`, `DEMOBILIZED`, `CANCELLED`).

### 3.3 Dynamic Requirements & Documents
- **DocumentType**: Master catalog of compliance document categories (e.g., KTP, Passport, MCU Oil & Gas, K3 Safework, SIO Welder Class 1, Defensive Driving Certificate, BPJS Ketenagakerjaan).
- **DocumentRequirement**: Configurable rules targeting `projectId`, `siteId`, `companyId`, `position`, `discipline`, `trade`, with flags: `isMandatory` (Boolean), `isBlocking` (Boolean), `warningDays` (Integer), `version` (Integer).
- **WorkerDocument & DocumentVersion**: Tracks uploaded physical files, `documentNumber`, `issueDate`, `expiryDate`, `fileUrl`, `verificationStatus` (`PENDING`, `VERIFIED`, `REJECTED`, `EXPIRED`), `verifierId`, `verifierRemarks`.

### 3.4 Pre-Mobilization, Readiness & Approvals
- **PreMobilization**: Request tracking an assignment batch or individual mobilization. Fields: `requestNumber`, `assignmentId`, `readinessScore` (Float), `blockingCount` (Integer), `status` (`DRAFT`, `SUBMITTED`, `IN_REVIEW`, `APPROVED`, `REVISION_REQUIRED`, `REJECTED`, `BLOCKED`).
- **ChecklistItem**: Itemized requirement evaluation for a given pre-mobilization request: `requirementId`, `documentId`, `isSatisfied`, `isBlocking`, `remarks`.
- **ApprovalWorkflow & ApprovalInstance**: 
  - Workflow steps: Step 1 (Subcontractor Submit) $\rightarrow$ Step 2 (Contractor HR) $\rightarrow$ Step 3 (Contractor HSE) $\rightarrow$ Step 4 (Client Approver).
  - **ApprovalAction**: Append-only log of `actionType` (`SUBMIT`, `APPROVE`, `RETURN_REVISION`, `REJECT`), `actorId`, `comment`, `timestamp`.

### 3.5 Movement & Demobilization
- **Mobilization**: Travel method, flight/vehicle details, planned travel date, actual departure date, arrival date, arrival confirmed by site admin.
- **Demobilization & ClearanceItem**: Demobilization reason, departure date, clearance checklist (Camp clearance, Equipment handover, Medical exit, Badge return), assignment closed confirmation.
- **AuditLog**: Complete record of `actorId`, `action`, `entityType`, `entityId`, `payloadBefore`, `payloadAfter`, `ipAddress`, `timestamp`.

---

## 4. Core Business Engines

### 4.1 Dynamic Rules Engine (`lib/rules-engine.ts`)
Evaluates the exact document requirements for a worker's active assignment:
$$\text{Requirements}(W) = \bigcup \text{Rules Matching}(W.\text{project}, W.\text{site}, W.\text{company}, W.\text{position}, W.\text{discipline}, W.\text{trade})$$
Rules support inheritance: Global requirements apply to all workers, site-specific rules augment the list, and trade-specific certifications are injected.

### 4.2 Readiness Calculation Engine (`lib/readiness-engine.ts`)
For any assignment or pre-mobilization request:
- Compiles checklist items.
- Evaluates each requirement against the worker's latest verified documents.
- Evaluates expiration status against `assignment.startDate + bufferDays`.
- Computes:
  $$\text{Score} = \left( \frac{\text{Completed Mandatory Requirements}}{\text{Total Mandatory Requirements}} \right) \times 100\%$$
- **Hard Blocker Rule**: If any requirement with `isBlocking == true` is missing, expired, rejected, or unverified, the final status is unconditionally **`BLOCKED`** / **`NOT READY`**, regardless of whether the percentage score is 99%.

### 4.3 Multi-Step Approval Orchestrator
Enforces state machine transitions:
- `DRAFT` $\rightarrow$ Submit by Vendor $\rightarrow$ `IN_REVIEW (Step: Contractor HR)`
- Contractor HR approves $\rightarrow$ `IN_REVIEW (Step: Contractor HSE)`
- Contractor HSE approves $\rightarrow$ `IN_REVIEW (Step: Client Approver)`
- Client Approver approves $\rightarrow$ `APPROVED` $\rightarrow$ Assignment becomes `READY_TO_MOBILIZE`
- Any stage can trigger `RETURN_REVISION` (with mandatory remarks) or `REJECT`.

---

## 5. User Interface & Experience Design

1. **Aesthetics & Theme**: High-contrast, clean enterprise styling with slate/zinc neutral tones, refined blue primary accents, status-aware badges (Green for Verified/On-Site, Amber for Warning/Expiring, Rose/Red for Blocked/Rejected), and clean tabular layouts.
2. **Role Impersonation Switcher**: Fixed development toolbar allowing immediate role swapping (Admin, Vendor, Contractor HR, Contractor HSE, Client, Site Admin) to test the complete lifecycle without friction.
3. **Split-Screen Document Verification**: Direct side-by-side inspection of worker documents with interactive zoom and immediate verification action.
4. **Rule Matrix Simulator**: Instant visual playground to preview required compliance documents for any hypothetical worker role and site.
5. **Bulk Import Staging**: 3-step wizard (Upload $\rightarrow$ Validate & Duplicate Check $\rightarrow$ Commit) with clear error indicators.

---

## 6. Implementation Phases

- **Sprint 0 & 1**: Project Initialization (Next.js 14, Tailwind, Lucide, Prisma Schema, Seed Data, Auth & Role Impersonator).
- **Sprint 2**: Master Data & Worker Management (Worker Directory, Worker Profile, Assignment Management, Bulk Import Wizard).
- **Sprint 3**: Dynamic Rules & Document Center (Rules Catalog & Simulator, Split-screen Document Verification Hub).
- **Sprint 4**: Pre-Mobilization & Approval Workflow (Readiness Engine, Checklist generation, Multi-stage Approval Inbox).
- **Sprint 5**: Movement Operations (Mobilization Board, On-Site Headcount Tracking, Demobilization & Clearance).
- **Sprint 6**: Executive Dashboard & Export Reports (Analytics charts, KPI cards, Report filters, Excel/CSV/PDF exports).

---

## 7. Verification & Acceptance Criteria
- Full coverage of business rules from 01_PRD through 05_Technical_Architecture.
- Zero-blocking loophole: Mobilization cannot proceed if a blocking requirement is unfulfilled.
- Seamless audit logging on every approval and state transition.
- Responsive, high-performance UI with smooth interactions and instant feedback.
