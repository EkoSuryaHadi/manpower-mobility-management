# Architecture

Next.js owns presentation and interaction. FastAPI owns business rules, authorization, lifecycle state, readiness, approvals, file access authorization, audit trail, and reports. PostgreSQL stores relational metadata; private object storage stores documents accessed through permission-checked signed URLs.

