from fastapi import APIRouter, Depends, File, Form, Header, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import Assignment, Requirement, Worker, WorkerDocument
from app.schemas import AssignmentCreate, AssignmentRead, AssignmentUpdate, DocumentCreate, DocumentRead, ReadinessRead, RequirementCreate, RequirementRead, WorkerCreate, WorkerRead, WorkerUpdate
from app.security import Principal, get_principal, require_roles
from app.storage import create_download_url, upload_file

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

documents_router = APIRouter(prefix="/api/v1/workers/{worker_id}/documents", tags=["worker-documents"])

@documents_router.get("", response_model=list[DocumentRead])
def list_documents(worker_id: int, organization_id: str = Depends(organization_scope), db: Session = Depends(get_db)):
    if db.scalar(select(Worker).where(Worker.id == worker_id, Worker.organization_id == organization_id)) is None:
        raise HTTPException(status_code=404, detail="Worker not found")
    return list(db.scalars(select(WorkerDocument).where(WorkerDocument.worker_id == worker_id, WorkerDocument.organization_id == organization_id).order_by(WorkerDocument.id)).all())

@documents_router.post("", response_model=DocumentRead, status_code=201)
def create_document(worker_id: int, payload: DocumentCreate, organization_id: str = Depends(organization_scope), principal: Principal = Depends(require_roles("admin", "hr")), db: Session = Depends(get_db)):
    if db.scalar(select(Worker).where(Worker.id == worker_id, Worker.organization_id == organization_id)) is None:
        raise HTTPException(status_code=404, detail="Worker not found")
    document = WorkerDocument(worker_id=worker_id, organization_id=organization_id, **payload.model_dump())
    db.add(document)
    db.commit()
    db.refresh(document)
    return document

@documents_router.get("/{document_id}/download")
def download_document(worker_id: int, document_id: int, organization_id: str = Depends(organization_scope), db: Session = Depends(get_db)):
    document = db.scalar(select(WorkerDocument).where(WorkerDocument.id == document_id, WorkerDocument.worker_id == worker_id, WorkerDocument.organization_id == organization_id))
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"url": create_download_url(document.object_key), "expires_in": 300}

@documents_router.post("/upload", response_model=DocumentRead, status_code=201)
def upload_document(worker_id: int, document_type: str = Form(...), file: UploadFile = File(...), organization_id: str = Depends(organization_scope), principal: Principal = Depends(require_roles("admin", "hr")), db: Session = Depends(get_db)):
    if db.scalar(select(Worker).where(Worker.id == worker_id, Worker.organization_id == organization_id)) is None:
        raise HTTPException(status_code=404, detail="Worker not found")
    allowed_types = {"application/pdf", "image/jpeg", "image/png"}
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=415, detail="Only PDF, JPEG, and PNG files are supported")
    object_key = f"{organization_id}/workers/{worker_id}/documents/{file.filename}"
    upload_file(file.file, object_key, file.content_type)
    document = WorkerDocument(worker_id=worker_id, organization_id=organization_id, document_type=document_type, file_name=file.filename or "upload", object_key=object_key, status="uploaded")
    db.add(document)
    db.commit()
    db.refresh(document)
    return document

app_router = router

assignments_router = APIRouter(prefix="/api/v1/assignments", tags=["assignments"])

@assignments_router.get("", response_model=list[AssignmentRead])
def list_assignments(organization_id: str = Depends(organization_scope), db: Session = Depends(get_db)):
    return list(db.scalars(select(Assignment).where(Assignment.organization_id == organization_id).order_by(Assignment.id)).all())

@assignments_router.post("", response_model=AssignmentRead, status_code=201)
def create_assignment(payload: AssignmentCreate, organization_id: str = Depends(organization_scope), principal: Principal = Depends(require_roles("admin", "hr", "manager")), db: Session = Depends(get_db)):
    worker = db.scalar(select(Worker).where(Worker.id == payload.worker_id, Worker.organization_id == organization_id, Worker.status == "active"))
    if worker is None:
        raise HTTPException(status_code=404, detail="Active worker not found")
    assignment = Assignment(organization_id=organization_id, **payload.model_dump())
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment

@assignments_router.patch("/{assignment_id}", response_model=AssignmentRead)
def update_assignment(assignment_id: int, payload: AssignmentUpdate, organization_id: str = Depends(organization_scope), principal: Principal = Depends(require_roles("admin", "hr", "manager")), db: Session = Depends(get_db)):
    assignment = db.scalar(select(Assignment).where(Assignment.id == assignment_id, Assignment.organization_id == organization_id))
    if assignment is None:
        raise HTTPException(status_code=404, detail="Assignment not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(assignment, field, value)
    db.commit()
    db.refresh(assignment)
    return assignment

@assignments_router.get("/{assignment_id}/readiness", response_model=ReadinessRead)
def assignment_readiness(assignment_id: int, organization_id: str = Depends(organization_scope), db: Session = Depends(get_db)):
    assignment = db.scalar(select(Assignment).where(Assignment.id == assignment_id, Assignment.organization_id == organization_id))
    if assignment is None:
        raise HTTPException(status_code=404, detail="Assignment not found")
    worker = db.get(Worker, assignment.worker_id)
    documents = list(db.scalars(select(WorkerDocument).where(WorkerDocument.worker_id == assignment.worker_id, WorkerDocument.organization_id == organization_id, WorkerDocument.status == "uploaded")).all())
    requirements = list(db.scalars(select(Requirement).where(Requirement.organization_id == organization_id, Requirement.position == assignment.position, Requirement.active.is_(True), Requirement.site.in_([assignment.site, "*"]))).all())
    reasons: list[str] = []
    if worker is None or worker.status != "active":
        reasons.append("worker_inactive")
    if assignment.status not in {"draft", "submitted", "approved"}:
        reasons.append("assignment_not_ready_for_precheck")
    document_types = {document.document_type for document in documents}
    missing = [requirement.document_type for requirement in requirements if requirement.document_type not in document_types]
    if missing:
        reasons.extend([f"missing_document:{document_type}" for document_type in sorted(set(missing))])
    elif not requirements and not documents:
        reasons.append("no_documents")
    return {"assignment_id": assignment.id, "status": "ready" if not reasons else "incomplete", "ready": not reasons, "reasons": reasons, "document_count": len(documents)}

requirements_router = APIRouter(prefix="/api/v1/requirements", tags=["requirements"])

@requirements_router.get("", response_model=list[RequirementRead])
def list_requirements(organization_id: str = Depends(organization_scope), db: Session = Depends(get_db)):
    return list(db.scalars(select(Requirement).where(Requirement.organization_id == organization_id).order_by(Requirement.id)).all())

@requirements_router.post("", response_model=RequirementRead, status_code=201)
def create_requirement(payload: RequirementCreate, organization_id: str = Depends(organization_scope), principal: Principal = Depends(require_roles("admin", "hr")), db: Session = Depends(get_db)):
    requirement = Requirement(organization_id=organization_id, **payload.model_dump())
    db.add(requirement)
    db.commit()
    db.refresh(requirement)
    return requirement
