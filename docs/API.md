# API Contract

Base path: `/api/v1`. Sprint 0: `GET /health` returns service, status, and environment. Planned groups: `/workers`, `/assignments`, `/requirements`, `/readiness`, `/approvals`, `/mobilizations`, and `/reports`.

Worker endpoints currently require `X-Organization-ID`. This temporary scope boundary will be populated from the authenticated user's organization after Supabase Auth is enabled.
