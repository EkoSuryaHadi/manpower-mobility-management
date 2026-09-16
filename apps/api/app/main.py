from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.routes import approvals_router, assignments_router, demobilizations_router, documents_router, mobilizations_router, requirements_router, router as worker_router

settings = get_settings()
app = FastAPI(title="Manpower Mobility Management API", version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origin_list, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(worker_router)
app.include_router(documents_router)
app.include_router(assignments_router)
app.include_router(requirements_router)
app.include_router(approvals_router)
app.include_router(mobilizations_router)
app.include_router(demobilizations_router)

@app.get("/api/v1/health", tags=["system"])
def health() -> dict[str, str]:
    return {"service": "manpower-api", "status": "ok", "environment": settings.app_env}
