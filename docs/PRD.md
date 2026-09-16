# Product Requirements

Operations teams need one reliable place to control manpower mobility from worker selection through return. MVP users are operations/admin, HR/compliance, approvers, and workers. MVP outcomes are worker records, assignments, document metadata, requirement checks, readiness, approvals, mobilization/demobilization, notifications, and audit history.

## Delivery status

- Phase 0 foundation: complete. Next.js, FastAPI, PostgreSQL compose configuration, environment examples, health checks, SQLAlchemy, Alembic, and initial documentation are available.
- Phase 1 worker registry: in progress. Worker create, list, detail, update, status validation, and initial migration are available.
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
