"""Seed a small, repeatable demo dataset for the local-org workspace."""

from datetime import datetime, timedelta, timezone

from sqlalchemy import select

from app.db import SessionLocal
from app.models import (
    Approval,
    Assignment,
    Mobilization,
    Requirement,
    Worker,
    WorkerDocument,
)


ORG = "local-org"


def seed() -> None:
    with SessionLocal() as db:
        existing = db.scalar(select(Worker.id).where(Worker.organization_id == ORG).limit(1))
        if existing is not None:
            print("Demo data already exists; nothing to seed.")
            return

        workers = [
            Worker(organization_id=ORG, employee_number="MMMS-000842", full_name="Ahmad Bin Ali", status="active"),
            Worker(organization_id=ORG, employee_number="MMMS-000843", full_name="Maria Santos", status="active"),
            Worker(organization_id=ORG, employee_number="MMMS-000844", full_name="Chen Wei", status="active"),
            Worker(organization_id=ORG, employee_number="MMMS-000845", full_name="Revi Kurniawan", status="active"),
            Worker(organization_id=ORG, employee_number="MMMS-000846", full_name="Siti Muthmainah", status="active"),
            Worker(organization_id=ORG, employee_number="MMMS-000847", full_name="James O'Connor", status="inactive"),
        ]
        db.add_all(workers)
        db.flush()

        now = datetime.now(timezone.utc)
        assignments = [
            Assignment(organization_id=ORG, worker_id=workers[0].id, position="Roustabout", site="Alpha Platform", status="approved", starts_at=now - timedelta(days=30)),
            Assignment(organization_id=ORG, worker_id=workers[1].id, position="Operations Technician", site="Bravo Platform", status="submitted", starts_at=now + timedelta(days=5)),
            Assignment(organization_id=ORG, worker_id=workers[2].id, position="Maintenance Supervisor", site="Charlie Field", status="draft", starts_at=now + timedelta(days=12)),
            Assignment(organization_id=ORG, worker_id=workers[3].id, position="HSE Officer", site="Delta Rig", status="approved", starts_at=now - timedelta(days=14)),
        ]
        db.add_all(assignments)
        db.flush()

        db.add_all([
            WorkerDocument(worker_id=workers[0].id, organization_id=ORG, document_type="passport", file_name="ahmad-passport.pdf", object_key=f"{ORG}/demo/ahmad-passport.pdf", status="uploaded", expires_at=now + timedelta(days=540)),
            WorkerDocument(worker_id=workers[0].id, organization_id=ORG, document_type="medical", file_name="ahmad-medical.pdf", object_key=f"{ORG}/demo/ahmad-medical.pdf", status="uploaded", expires_at=now + timedelta(days=180)),
            WorkerDocument(worker_id=workers[1].id, organization_id=ORG, document_type="passport", file_name="maria-passport.pdf", object_key=f"{ORG}/demo/maria-passport.pdf", status="uploaded", expires_at=now + timedelta(days=420)),
            WorkerDocument(worker_id=workers[3].id, organization_id=ORG, document_type="passport", file_name="revi-passport.pdf", object_key=f"{ORG}/demo/revi-passport.pdf", status="uploaded", expires_at=now + timedelta(days=300)),
        ])
        db.add_all([
            Requirement(organization_id=ORG, position="Roustabout", site="*", document_type="passport", active=True),
            Requirement(organization_id=ORG, position="Roustabout", site="*", document_type="medical", active=True),
            Requirement(organization_id=ORG, position="Operations Technician", site="*", document_type="passport", active=True),
            Approval(organization_id=ORG, assignment_id=assignments[0].id, status="approved", approved_by="demo.manager"),
            Approval(organization_id=ORG, assignment_id=assignments[1].id, status="pending"),
            Mobilization(organization_id=ORG, assignment_id=assignments[0].id, status="departed", departure_at=now - timedelta(days=30), arrival_at=now - timedelta(days=29), notes="Demo mobilization"),
            Mobilization(organization_id=ORG, assignment_id=assignments[1].id, status="planned", departure_at=now + timedelta(days=5), notes="Awaiting approval"),
        ])
        db.commit()
        print("Seeded 6 workers, 4 assignments, documents, requirements, approvals, and mobilizations.")


if __name__ == "__main__":
    seed()
