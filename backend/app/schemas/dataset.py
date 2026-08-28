from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DatasetResponse(BaseModel):
    id: str
    original_filename: str
    file_size: int
    file_type: str
    row_count: Optional[int] = None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
