# API Contract

Base path: `/api/v1`. Sprint 0: `GET /health` returns service, status, and environment. Planned groups: `/workers`, `/assignments`, `/requirements`, `/readiness`, `/approvals`, `/mobilizations`, and `/reports`.

Worker endpoints use the authenticated token's organization claim when auth is enabled. During local development, or before a token organization is available, they require `X-Organization-ID`. If both are supplied, they must match.

Worker permissions: `admin` and `hr` may create and update workers; `admin`, `hr`, `manager`, and `worker` may read workers within their organization. The local development principal uses the `admin` role.

Document metadata endpoints: `GET/POST /api/v1/workers/{worker_id}/documents`. The API stores a private `object_key`; signed URL generation and actual object upload depend on the configured private storage provider.

Download endpoint: `GET /api/v1/workers/{worker_id}/documents/{document_id}/download`. It returns a five-minute presigned URL after organization checks. Configure the S3-compatible bucket variables before using it.

Upload endpoint: `POST /api/v1/workers/{worker_id}/documents/upload` with multipart `file` and `document_type`. It accepts PDF, JPEG, and PNG files and stores them under an organization-scoped object key.

Assignment endpoints: `GET/POST /api/v1/assignments` and `PATCH /api/v1/assignments/{assignment_id}`. Only active workers can receive assignments; admin, HR, and manager roles can create or update them.

Readiness endpoint: `GET /api/v1/assignments/{assignment_id}/readiness`. The first readiness pass reports `ready` or `incomplete` using worker activity, assignment status, and document presence.

Requirement endpoints: `GET/POST /api/v1/requirements`. Rules are scoped by organization, position, site, and required document type; admin and HR can create rules.

Approval endpoints: `GET/POST /api/v1/approvals` and `PATCH /api/v1/approvals/{approval_id}`. Admin and manager can create and decide approvals; every decision records the principal user ID.

Mobilization endpoints: `GET/POST /api/v1/mobilizations` and `PATCH /api/v1/mobilizations/{mobilization_id}`. Statuses are `planned`, `departed`, `arrived`, and `cancelled`.

Demobilization endpoints: `GET/POST /api/v1/demobilizations` and `PATCH /api/v1/demobilizations/{demobilization_id}`. Statuses are `planned`, `returned`, and `cancelled`; returning an item closes its assignment as `demobilized`.

Operations endpoints: `GET /api/v1/dashboard`, `GET /api/v1/audit-events`, and `GET /api/v1/reports/assignments.csv`.
