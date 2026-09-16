# Manpower Mobility Management System

Monorepo foundation for worker readiness, assignment, approval, mobilization, and demobilization workflows.

## Structure

- `apps/web` — Next.js + TypeScript App Router frontend
- `apps/api` — FastAPI + SQLAlchemy + Alembic backend
- `docs` — product and technical summaries
- `database` — migration assets

## Local setup

Copy `.env.example` to `.env`, then run `docker compose up -d postgres`. Start the API from `apps/api` with `python -m uvicorn app.main:app --reload --port 8000`; start the web app from `apps/web` with `npm install` and `npm run dev`.

Health: `http://localhost:8000/api/v1/health` · API docs: `http://localhost:8000/docs` · Web: `http://localhost:3000`

Sprint 0 intentionally establishes only the runnable foundation; domain models and authentication follow in Sprint 1.

