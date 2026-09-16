# Manpower Mobility Management System

Monorepo foundation for worker readiness, assignment, approval, mobilization, and demobilization workflows.

## Structure

- `apps/web` — Next.js + TypeScript App Router frontend
- `apps/api` — FastAPI + SQLAlchemy + Alembic backend
- `docs` — product and technical summaries
- `database` — migration assets

## Local setup

Requires Node.js 22+ and Python 3.11+. Copy root `.env.example` to `.env`, then run `docker compose up -d postgres` (or `podman compose up -d postgres`).

From `apps/api`, create a virtual environment with `python -m venv .venv`, activate it, and run `python -m pip install -e ".[dev]"`. Start the API with `python -m uvicorn app.main:app --reload --port 8000`. API settings read the root `.env`; environment variables take precedence.

From `apps/web`, copy `.env.example` to `.env.local`, run `npm ci`, then `npm run dev`.

Verify with `python -m pytest -q` from `apps/api` and `npm run build` from `apps/web`. Run `python -m alembic upgrade head` from `apps/api` for database migrations. There are no domain migrations yet; the initial baseline intentionally contains no tables. Health endpoints report process liveness, not database availability.

Health: `http://localhost:8000/api/v1/health` · API docs: `http://localhost:8000/docs` · Web: `http://localhost:3000`

Supabase variables are included as empty placeholders in the examples. Authentication is the next Phase 1 task and is not enabled yet.

Worker Registry UI: `http://localhost:3000/workers`

Operational UI: `/dashboard`, `/assignments`, `/approvals`, and `/login`. GitHub Actions runs backend tests and the frontend production build on pushes and pull requests.

Before production, set Supabase, JWT, and private storage variables and run the Alembic migrations against PostgreSQL.

Sprint 0 intentionally establishes only the runnable foundation; domain models and authentication follow in Sprint 1.
