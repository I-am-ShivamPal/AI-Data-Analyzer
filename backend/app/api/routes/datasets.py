from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session

from app.db.connection import get_db
from app.db.models import User
from app.api.dependencies import get_current_user
from app.schemas.dataset import DatasetResponse
from app.services import dataset_service

router = APIRouter()

@router.post("/upload", response_model=DatasetResponse, status_code=status.HTTP_201_CREATED)
def upload_dataset(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Upload a CSV dataset. Validates strict 1 GB size limit and parses metadata.
    """
    return dataset_service.upload_dataset(db, current_user, file)

@router.get("/", response_model=List[DatasetResponse])
def list_datasets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List all datasets owned by the current authenticated user.
    """
    return dataset_service.list_datasets(db, current_user)

@router.get("/{dataset_id}", response_model=DatasetResponse)
def get_dataset(
    dataset_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get details of a specific dataset. Enforces tenant ownership.
    """
    dataset = dataset_service.get_dataset(db, dataset_id, current_user)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found or you don't have access")
    return dataset

@router.delete("/{dataset_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_dataset(
    dataset_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a specific dataset from database and disk.
    """
    success = dataset_service.delete_dataset(db, dataset_id, current_user)
    if not success:
        raise HTTPException(status_code=404, detail="Dataset not found or you don't have access")
    return None
