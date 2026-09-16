from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.db import Base, get_db
from app.main import app

engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
TestingSession = sessionmaker(bind=engine)
Base.metadata.create_all(engine)

def override_db():
    with TestingSession() as session:
        yield session

app.dependency_overrides[get_db] = override_db
client = TestClient(app)

def test_create_and_list_worker():
    created = client.post("/api/v1/workers", headers={"X-Organization-ID": "org-a"}, json={"organization_id": "org-a", "employee_number": "EMP-001", "full_name": "Eko Surya"})
    assert created.status_code == 201
    assert created.json()["status"] == "active"
    listed = client.get("/api/v1/workers", headers={"X-Organization-ID": "org-a"})
    assert listed.status_code == 200
    assert listed.json()[0]["employee_number"] == "EMP-001"

def test_update_and_get_worker():
    created = client.post("/api/v1/workers", headers={"X-Organization-ID": "org-a"}, json={"organization_id": "org-a", "employee_number": "EMP-002", "full_name": "Budi"})
    worker_id = created.json()["id"]
    updated = client.patch(f"/api/v1/workers/{worker_id}", headers={"X-Organization-ID": "org-a"}, json={"status": "inactive", "full_name": "Budi Santoso"})
    assert updated.status_code == 200
    assert updated.json()["status"] == "inactive"
    assert client.get(f"/api/v1/workers/{worker_id}", headers={"X-Organization-ID": "org-a"}).json()["full_name"] == "Budi Santoso"

def test_missing_worker_returns_404():
    assert client.get("/api/v1/workers/99999", headers={"X-Organization-ID": "org-a"}).status_code == 404

def test_workers_are_isolated_by_organization():
    created = client.post("/api/v1/workers", headers={"X-Organization-ID": "org-b"}, json={"organization_id": "org-b", "employee_number": "EMP-003", "full_name": "Sari"})
    worker_id = created.json()["id"]
    assert client.get(f"/api/v1/workers/{worker_id}", headers={"X-Organization-ID": "org-a"}).status_code == 404

def test_organization_header_is_required_in_local_mode():
    assert client.get("/api/v1/workers").status_code == 400

def test_worker_document_metadata_is_scoped():
    worker = client.post("/api/v1/workers", headers={"X-Organization-ID": "org-doc"}, json={"organization_id": "org-doc", "employee_number": "EMP-DOC", "full_name": "Dewi"}).json()
    response = client.post(f"/api/v1/workers/{worker['id']}/documents", headers={"X-Organization-ID": "org-doc"}, json={"document_type": "passport", "file_name": "passport.pdf", "object_key": "org-doc/workers/1/passport.pdf"})
    assert response.status_code == 201
    assert client.get(f"/api/v1/workers/{worker['id']}/documents", headers={"X-Organization-ID": "org-doc"}).json()[0]["document_type"] == "passport"

def test_download_requires_private_storage_configuration():
    worker = client.post("/api/v1/workers", headers={"X-Organization-ID": "org-download"}, json={"organization_id": "org-download", "employee_number": "EMP-DL", "full_name": "Rina"}).json()
    document = client.post(f"/api/v1/workers/{worker['id']}/documents", headers={"X-Organization-ID": "org-download"}, json={"document_type": "id", "file_name": "id.pdf", "object_key": "org-download/id.pdf"}).json()
    response = client.get(f"/api/v1/workers/{worker['id']}/documents/{document['id']}/download", headers={"X-Organization-ID": "org-download"})
    assert response.status_code == 503

def test_upload_rejects_unsupported_file_type():
    worker = client.post("/api/v1/workers", headers={"X-Organization-ID": "org-upload"}, json={"organization_id": "org-upload", "employee_number": "EMP-UP", "full_name": "Tono"}).json()
    response = client.post(f"/api/v1/workers/{worker['id']}/documents/upload", headers={"X-Organization-ID": "org-upload"}, data={"document_type": "id"}, files={"file": ("script.exe", b"bad", "application/octet-stream")})
    assert response.status_code == 415

def test_assignment_lifecycle_starts_with_active_worker():
    worker = client.post("/api/v1/workers", headers={"X-Organization-ID": "org-assignment"}, json={"organization_id": "org-assignment", "employee_number": "EMP-AS", "full_name": "Andi"}).json()
    response = client.post("/api/v1/assignments", headers={"X-Organization-ID": "org-assignment"}, json={"worker_id": worker["id"], "position": "Rigger", "site": "Site A"})
    assert response.status_code == 201
    assignment_id = response.json()["id"]
    updated = client.patch(f"/api/v1/assignments/{assignment_id}", headers={"X-Organization-ID": "org-assignment"}, json={"status": "approved"})
    assert updated.status_code == 200
    assert updated.json()["status"] == "approved"

def test_assignment_readiness_reports_missing_documents():
    worker = client.post("/api/v1/workers", headers={"X-Organization-ID": "org-ready"}, json={"organization_id": "org-ready", "employee_number": "EMP-READY", "full_name": "Lina"}).json()
    assignment = client.post("/api/v1/assignments", headers={"X-Organization-ID": "org-ready"}, json={"worker_id": worker["id"], "position": "Operator", "site": "Site B"}).json()
    response = client.get(f"/api/v1/assignments/{assignment['id']}/readiness", headers={"X-Organization-ID": "org-ready"})
    assert response.status_code == 200
    assert response.json()["status"] == "incomplete"
    assert "no_documents" in response.json()["reasons"]

def test_requirement_rule_is_used_by_readiness():
    worker = client.post("/api/v1/workers", headers={"X-Organization-ID": "org-rule"}, json={"organization_id": "org-rule", "employee_number": "EMP-RULE", "full_name": "Maya"}).json()
    requirement = client.post("/api/v1/requirements", headers={"X-Organization-ID": "org-rule"}, json={"position": "Welder", "site": "Site C", "document_type": "certificate"})
    assert requirement.status_code == 201
    assignment = client.post("/api/v1/assignments", headers={"X-Organization-ID": "org-rule"}, json={"worker_id": worker["id"], "position": "Welder", "site": "Site C"}).json()
    response = client.get(f"/api/v1/assignments/{assignment['id']}/readiness", headers={"X-Organization-ID": "org-rule"})
    assert response.json()["reasons"] == ["missing_document:certificate"]
