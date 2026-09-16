# API Contract

Base path: `/api/v1`. Sprint 0: `GET /health` returns service, status, and environment. Planned groups: `/workers`, `/assignments`, `/requirements`, `/readiness`, `/approvals`, `/mobilizations`, and `/reports`.

Worker endpoints use the authenticated token's organization claim when auth is enabled. During local development, or before a token organization is available, they require `X-Organization-ID`. If both are supplied, they must match.
