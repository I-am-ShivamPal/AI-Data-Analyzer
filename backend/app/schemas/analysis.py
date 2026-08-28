from typing import List, Dict, Any, Optional, Union
from pydantic import BaseModel

class AnalysisRequest(BaseModel):
    dataset_id: str
    question: str

class DatasetInfo(BaseModel):
    id: str
    filename: str
    rows_analyzed: int

class IntentInfo(BaseModel):
    operation: Optional[str] = None
    entity: Optional[str] = None
    group_by: Optional[List[str]] = None
    metric: Optional[str] = None
    limit: Optional[int] = None
    sort_order: Optional[str] = None
    filters: Optional[Dict[str, Any]] = None

class AnalysisResponse(BaseModel):
    dataset: DatasetInfo
    question: str
    intent: IntentInfo
    result: Union[List[Dict[str, Any]], Dict[str, Any]]
    resolved_context: Dict[str, Any]
    answer: str
