from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import Worker
from app.schemas import WorkerCreate, WorkerRead

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
