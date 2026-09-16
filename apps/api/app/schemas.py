from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

class WorkerCreate(BaseModel):
    employee_number: str = Field(min_length=1, max_length=50)
    full_name: str = Field(min_length=1, max_length=160)

class WorkerRead(WorkerCreate):
    id: int
    status: str
    created_at: datetime | None = None
    model_config = ConfigDict(from_attributes=True)
