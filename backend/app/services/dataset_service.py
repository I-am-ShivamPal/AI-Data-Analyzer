import os
import uuid
from typing import List
from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session
from pathlib import Path
import duckdb

from app.db.models import Dataset, User
from app.core.config import BASE_DIR

MAX_FILE_SIZE = 1024 * 1024 * 1024  # 1 GB
STORAGE_DIR = BASE_DIR.parent / "storage" / "datasets"

# Ensure storage directory exists
STORAGE_DIR.mkdir(parents=True, exist_ok=True)

def upload_dataset(db: Session, current_user: User, file: UploadFile) -> Dataset:
    # Validate extension
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")
        
    dataset_uuid = str(uuid.uuid4())
    stored_filename = f"{dataset_uuid}.csv"
    file_path = STORAGE_DIR / stored_filename
    
    file_size = 0
    
    # Stream the file to disk and enforce 1 GB limit
    try:
        with open(file_path, "wb") as buffer:
            while chunk := file.file.read(8192):
                file_size += len(chunk)
                if file_size > MAX_FILE_SIZE:
                    break
                buffer.write(chunk)
                
        if file_size > MAX_FILE_SIZE:
            file_path.unlink(missing_ok=True)
            raise HTTPException(status_code=413, detail="File size exceeds the 1 GB limit.")
            
    finally:
        file.file.close()
        
    if file_size == 0:
        file_path.unlink(missing_ok=True)
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # Inspect CSV with DuckDB to get row count
    row_count = None
    try:
        # Use DuckDB to quickly count rows
        con = duckdb.connect(database=':memory:')
        # DuckDB read_csv can handle large files efficiently
        result = con.execute(f"SELECT COUNT(*) FROM read_csv_auto('{str(file_path)}')").fetchone()
        if result:
            row_count = result[0]
    except Exception as e:
        # If DuckDB fails, the file might be malformed
        file_path.unlink(missing_ok=True)
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV file: {str(e)}")
        
    # Save to PostgreSQL
    db_dataset = Dataset(
        id=dataset_uuid,
        user_id=current_user.id,
        original_filename=file.filename,
        stored_filename=stored_filename,
        file_size=file_size,
        file_type="csv",
        row_count=row_count,
        status="ready"
    )
    
    db.add(db_dataset)
    db.commit()
    db.refresh(db_dataset)
    
    return db_dataset

def list_datasets(db: Session, current_user: User) -> List[Dataset]:
    return db.query(Dataset).filter(Dataset.user_id == current_user.id).all()

def get_dataset(db: Session, dataset_id: str, current_user: User) -> Dataset | None:
    return db.query(Dataset).filter(
        Dataset.id == dataset_id,
        Dataset.user_id == current_user.id
    ).first()

def delete_dataset(db: Session, dataset_id: str, current_user: User) -> bool:
    dataset = get_dataset(db, dataset_id, current_user)
    if not dataset:
        return False
        
    # Delete physical file
    file_path = STORAGE_DIR / dataset.stored_filename
    file_path.unlink(missing_ok=True)
    
    # Delete from DB
    db.delete(dataset)
    db.commit()
    
    return True
