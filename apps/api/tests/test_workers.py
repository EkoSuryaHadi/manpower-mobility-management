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
    created = client.post("/api/v1/workers", json={"employee_number": "EMP-001", "full_name": "Eko Surya"})
    assert created.status_code == 201
    assert created.json()["status"] == "active"
    listed = client.get("/api/v1/workers")
    assert listed.status_code == 200
    assert listed.json()[0]["employee_number"] == "EMP-001"

def test_update_and_get_worker():
    created = client.post("/api/v1/workers", json={"employee_number": "EMP-002", "full_name": "Budi"})
    worker_id = created.json()["id"]
    updated = client.patch(f"/api/v1/workers/{worker_id}", json={"status": "inactive", "full_name": "Budi Santoso"})
    assert updated.status_code == 200
    assert updated.json()["status"] == "inactive"
    assert client.get(f"/api/v1/workers/{worker_id}").json()["full_name"] == "Budi Santoso"

def test_missing_worker_returns_404():
    assert client.get("/api/v1/workers/99999").status_code == 404
