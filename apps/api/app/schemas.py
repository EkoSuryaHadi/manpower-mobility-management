from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

class WorkerCreate(BaseModel):
    organization_id: str = Field(min_length=1, max_length=80)
    employee_number: str = Field(min_length=1, max_length=50)
    full_name: str = Field(min_length=1, max_length=160)

class WorkerRead(WorkerCreate):
    id: int
    status: str
    created_at: datetime | None = None
    model_config = ConfigDict(from_attributes=True)

class WorkerUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=1, max_length=160)
    status: str | None = Field(default=None, pattern="^(active|inactive)$")

class DocumentCreate(BaseModel):
    document_type: str = Field(min_length=1, max_length=50)
    file_name: str = Field(min_length=1, max_length=255)
    object_key: str = Field(min_length=1, max_length=500)
    expires_at: datetime | None = None

class DocumentRead(DocumentCreate):
    id: int
    worker_id: int
    organization_id: str
    status: str
    created_at: datetime | None = None
    model_config = ConfigDict(from_attributes=True)

class AssignmentCreate(BaseModel):
    worker_id: int
    position: str = Field(min_length=1, max_length=120)
    site: str = Field(min_length=1, max_length=160)
    starts_at: datetime | None = None
    ends_at: datetime | None = None

class AssignmentUpdate(BaseModel):
    status: str | None = Field(default=None, pattern="^(draft|submitted|approved|mobilized|active|completed|demobilized)$")
    site: str | None = Field(default=None, min_length=1, max_length=160)
    ends_at: datetime | None = None

class AssignmentRead(AssignmentCreate):
    id: int
    organization_id: str
    status: str
    created_at: datetime | None = None
    model_config = ConfigDict(from_attributes=True)
