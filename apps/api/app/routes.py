from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import Worker
from app.schemas import WorkerCreate, WorkerRead, WorkerUpdate
from app.security import Principal, get_principal, require_roles

router = APIRouter(prefix="/api/v1/workers", tags=["workers"])

def organization_scope(
    principal: Principal = Depends(get_principal),
    x_organization_id: str | None = Header(default=None),
) -> str:
    if principal.organization_id:
        if x_organization_id and x_organization_id != principal.organization_id:
            raise HTTPException(status_code=403, detail="Organization scope does not match token")
        return principal.organization_id
    if not x_organization_id:
        raise HTTPException(status_code=400, detail="X-Organization-ID header is required")
    return x_organization_id

@router.get("", response_model=list[WorkerRead])
def list_workers(organization_id: str = Depends(organization_scope), db: Session = Depends(get_db)):
    return list(db.scalars(select(Worker).where(Worker.organization_id == organization_id).order_by(Worker.id)).all())

@router.post("", response_model=WorkerRead, status_code=201)
def create_worker(payload: WorkerCreate, organization_id: str = Depends(organization_scope), principal: Principal = Depends(require_roles("admin", "hr")), db: Session = Depends(get_db)):
    if payload.organization_id != organization_id:
        raise HTTPException(status_code=403, detail="Organization scope does not match payload")
    if db.scalar(select(Worker).where(Worker.organization_id == organization_id, Worker.employee_number == payload.employee_number)):
        raise HTTPException(status_code=409, detail="Employee number already exists")
    worker = Worker(**payload.model_dump())
    db.add(worker)
    db.commit()
    db.refresh(worker)
    return worker

@router.get("/{worker_id}", response_model=WorkerRead)
def get_worker(worker_id: int, organization_id: str = Depends(organization_scope), db: Session = Depends(get_db)):
    worker = db.get(Worker, worker_id)
    if worker is None or worker.organization_id != organization_id:
        raise HTTPException(status_code=404, detail="Worker not found")
    return worker

@router.patch("/{worker_id}", response_model=WorkerRead)
def update_worker(worker_id: int, payload: WorkerUpdate, organization_id: str = Depends(organization_scope), principal: Principal = Depends(require_roles("admin", "hr")), db: Session = Depends(get_db)):
    worker = db.get(Worker, worker_id)
    if worker is None or worker.organization_id != organization_id:
        raise HTTPException(status_code=404, detail="Worker not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(worker, field, value)
    db.commit()
    db.refresh(worker)
    return worker
