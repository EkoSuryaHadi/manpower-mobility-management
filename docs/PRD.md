# Product Requirements

Operations teams need one reliable place to control manpower mobility from worker selection through return. MVP users are operations/admin, HR/compliance, approvers, and workers. MVP outcomes are worker records, assignments, document metadata, requirement checks, readiness, approvals, mobilization/demobilization, notifications, and audit history.

## Delivery status

- Phase 0 foundation: complete. Next.js, FastAPI, PostgreSQL compose configuration, environment examples, health checks, SQLAlchemy, Alembic, and initial documentation are available.
- Phase 1 worker registry: UI/API foundation available. Worker create, list, detail, update, status validation, and initial migration are available; the redesigned screen currently exposes create, filter, status, and basic profile detail.
- Phase 1 identity boundary: configuration prepared for Supabase Auth. Authentication enforcement, roles, and organization membership are the next implementation step.

## Current API behavior

Worker records currently expose employee_number, full_name, status, and created_at. The API is intentionally unauthenticated during the foundation stage so local development and contract testing remain possible. Before production use, every worker and assignment request must be scoped to the authenticated user's organization and checked against their role.

## Decisions recorded

- Supabase Auth is the planned identity provider.
- FastAPI remains the authority for authorization and business rules.
- Worker documents will use private object storage and signed URLs after permission checks.
- Worker status supports active and inactive; inactive workers cannot be selected for new assignments.
- Worker endpoints require an `X-Organization-ID` scope header during the current transition to authenticated Supabase users. The payload organization must match the request scope.
- Supabase JWT validation is now scaffolded with audience and role claims; enforcement is enabled by setting `AUTH_ENFORCED=true` and providing `SUPABASE_JWT_SECRET`. When enabled, the token organization claim is authoritative for Worker Registry access.
- Worker Registry write permissions are restricted to `admin` and `hr`; read permissions are available to all four planned roles within organization scope.
- Worker Registry now has a first frontend screen with local organization scope, list loading, and worker creation form.
- Worker document metadata endpoints now store document type, name, private object key, expiry, and status under the worker organization scope.
- Private document download now has a presigned URL boundary with a five-minute expiry; storage credentials remain server-side.
- Private document upload now validates PDF/JPEG/PNG content types and creates organization-scoped object keys before metadata persistence.
- Assignment Management now supports organization-scoped creation for active workers and lifecycle updates from draft through demobilized.
- Readiness Engine v1 now reports missing documents and invalid worker/assignment state for an assignment.
- Requirement Master v1 now stores active document rules per organization, position, and site; readiness reports missing required document types.
- Approval Workflow v1 now supports pending, approved, and rejected decisions linked to assignments with comments and approver identity.
- Mobilization v1 now records assignment departure, arrival, notes, and operational status.
- Demobilization v1 now records worker return and closes the related assignment when status becomes returned.
- Operations dashboard, assignment CSV export, and organization-scoped audit events are now available.
- Frontend now includes Supabase email/password sign-in, operational dashboard metrics, worker navigation, and assignment report download.
- Authenticated frontend requests now forward the Supabase access token and organization metadata; local development falls back to `local-org` when Supabase is not configured.
- Frontend now exposes assignment creation/listing and approval decision queues in addition to Worker Registry and dashboard.
- Sprint 0 UI refresh now establishes an operations control-center shell: navy navigation, light workspace canvas, compact headings, real-data metric cards, pipeline overview, scan-friendly tables, responsive mobile navigation, explicit loading/error/empty states, and Indonesian operational copy.
- Frontend now includes assignment creation with active-worker selection, approval decision actions with comments, mobilization/demobilization status lists, and authenticated CSV report download.
- Production baseline now includes API/web container images, CI tests/builds, database readiness checks, and mandatory authentication validation in production.
- Frontend dependency audit is clean on Next.js 16.3.5; production deployment still requires real Supabase and private storage credentials.

## Scope boundary after UI refresh

The redesign is a functional operational surface over the existing APIs, not a claim that every planned workflow is complete. Worker document/history tabs, requirement authoring, richer readiness detail, and end-to-end travel forms remain follow-on work. Production rollout still requires enforced authentication, real organization membership, private storage credentials, and seeded operational data.
