# Sprint 0 Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish a runnable monorepo foundation for the Manpower Mobility Management System.

**Architecture:** A Next.js TypeScript App Router frontend and FastAPI backend live under `apps/`, with PostgreSQL provided by Docker Compose. Documentation captures the MVP blueprint and initial contracts.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, FastAPI, Pydantic, SQLAlchemy, Alembic, PostgreSQL, Docker Compose.

**Spec:** The referenced conversation blueprint for Manpower Mobility Management System.

## Global Constraints

- Business rules belong in the backend, not only in the frontend.
- Worker documents use private object storage patterns; Sprint 0 stores metadata only.
- Local development must have explicit environment examples and a PostgreSQL service.
- Health checks must be available from the API and frontend.

### Task 1: Repository foundation

**Files:** root `.gitignore`, `README.md`, `.env.example`, `docker-compose.yml`, `docs/*.md`, `database/.gitkeep`.

- [ ] Add the monorepo directories and root configuration.
- [ ] Document setup, service URLs, environment variables, and Sprint 0 scope.
- [ ] Add concise PRD, UI/UX, ERD, API, architecture, and sprint backlog summaries.
- [ ] Verify the structure and compose configuration parse successfully.

### Task 2: FastAPI service

**Files:** `apps/api/pyproject.toml`, `apps/api/app/main.py`, `apps/api/app/core/config.py`, `apps/api/app/db.py`, `apps/api/alembic.ini`, `apps/api/alembic/env.py`, `apps/api/tests/test_health.py`.

- [ ] Create a typed settings object with `DATABASE_URL`, `APP_ENV`, and `CORS_ORIGINS`.
- [ ] Add `GET /api/v1/health` returning service, status, and environment.
- [ ] Add SQLAlchemy/Alembic baseline wiring without domain tables yet.
- [ ] Add a health test and run it with pytest.

### Task 3: Next.js service

**Files:** `apps/web/package.json`, `apps/web/tsconfig.json`, `apps/web/next.config.ts`, `apps/web/app/layout.tsx`, `apps/web/app/page.tsx`, `apps/web/app/globals.css`, `apps/web/components.json`, `apps/web/.env.example`.

- [ ] Create an App Router TypeScript app with Tailwind-ready styles and shadcn configuration.
- [ ] Build a useful Sprint 0 landing/status page with API health configuration.
- [ ] Add a frontend route handler at `/api/health`.
- [ ] Run the production build and local smoke checks where dependencies permit.

### Task 4: Integration and delivery

- [ ] Run backend tests, frontend build, and compose config validation.
- [ ] Review the final diff and confirm no secrets are committed.
- [ ] Commit as `feat: initialize manpower mobility monorepo`.
- [ ] Push the commit to the repository's configured default branch if authentication permits.
