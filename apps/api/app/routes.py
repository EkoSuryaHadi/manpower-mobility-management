from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import Worker
from app.schemas import WorkerCreate, WorkerRead, WorkerUpdate

router = APIRouter(prefix="/api/v1/workers", tags=["workers"])

@router.get("", response_model=list[WorkerRead])
def list_workers(db: Session = Depends(get_db)):
    return list(db.scalars(select(Worker).order_by(Worker.id)).all())

@router.post("", response_model=WorkerRead, status_code=201)
def create_worker(payload: WorkerCreate, db: Session = Depends(get_db)):
    if db.scalar(select(Worker).where(Worker.employee_number == payload.employee_number)):
        raise HTTPException(status_code=409, detail="Employee number already exists")
    worker = Worker(**payload.model_dump())
    db.add(worker)
    db.commit()
    db.refresh(worker)
    return worker

@router.get("/{worker_id}", response_model=WorkerRead)
def get_worker(worker_id: int, db: Session = Depends(get_db)):
    worker = db.get(Worker, worker_id)
    if worker is None:
        raise HTTPException(status_code=404, detail="Worker not found")
    return worker

@router.patch("/{worker_id}", response_model=WorkerRead)
def update_worker(worker_id: int, payload: WorkerUpdate, db: Session = Depends(get_db)):
    worker = db.get(Worker, worker_id)
    if worker is None:
        raise HTTPException(status_code=404, detail="Worker not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(worker, field, value)
    db.commit()
    db.refresh(worker)
    return worker
