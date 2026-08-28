import sys
import os
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import uuid

from app.main import app
from app.db.connection import Base, get_db
from app.core.config import settings
from app.core.security import get_password_hash
from app.db.models import User, Dataset
from app.services import dataset_service

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_dataset.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(autouse=True)
def clean_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    # Cleanup storage
    for file in dataset_service.STORAGE_DIR.glob("*.csv"):
        file.unlink()
    yield

def create_test_user(email: str = "test@example.com") -> str:
    db = TestingSessionLocal()
    user = User(
        email=email,
        name="Test User",
        password_hash=get_password_hash("password123")
    )
    db.add(user)
    db.commit()
    return user.id

def login_user(email: str = "test@example.com") -> dict:
    response = client.post(
        "/api/auth/login",
        json={"email": email, "password": "password123"}
    )
    assert response.status_code == 200, f"Login failed: {response.text}"
    return {settings.SESSION_COOKIE_NAME: response.cookies.get(settings.SESSION_COOKIE_NAME)}

def test_unauthenticated_upload():
    response = client.post("/api/datasets/upload", files={"file": ("test.csv", b"a,b\n1,2")})
    assert response.status_code == 401

def test_authenticated_upload_and_metadata():
    create_test_user()
    cookies = login_user()
    
    csv_content = b"col1,col2\nval1,val2\nval3,val4"
    response = client.post(
        "/api/datasets/upload",
        files={"file": ("data.csv", csv_content, "text/csv")},
        cookies=cookies
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["original_filename"] == "data.csv"
    assert data["file_size"] == len(csv_content)
    assert data["file_type"] == "csv"
    assert data["row_count"] == 2  # 2 data rows
    assert data["status"] == "ready"
    assert "id" in data
    
    # Verify physical file exists
    db = TestingSessionLocal()
    dataset = db.query(Dataset).filter(Dataset.id == data["id"]).first()
    file_path = dataset_service.STORAGE_DIR / dataset.stored_filename
    assert file_path.exists()
    assert file_path.read_bytes() == csv_content

def test_csv_validation():
    create_test_user()
    cookies = login_user()
    
    response = client.post(
        "/api/datasets/upload",
        files={"file": ("data.txt", b"a,b\n1,2")},
        cookies=cookies
    )
    assert response.status_code == 400
    assert "CSV files" in response.json()["detail"]

def test_file_size_limit(monkeypatch):
    # Patch the MAX_FILE_SIZE to 50 bytes
    monkeypatch.setattr(dataset_service, "MAX_FILE_SIZE", 50)
    
    create_test_user()
    cookies = login_user()
    
    # 60 bytes content
    csv_content = b"col1,col2\n" + (b"val1,val2\n" * 5)
    
    response = client.post(
        "/api/datasets/upload",
        files={"file": ("data.csv", csv_content, "text/csv")},
        cookies=cookies
    )
    
    assert response.status_code == 413
    assert "limit" in response.json()["detail"]
    
    # Verify failed upload cleanup
    assert list(dataset_service.STORAGE_DIR.glob("*.csv")) == []

def test_ownership_isolation():
    user_a_id = create_test_user("usera@example.com")
    user_b_id = create_test_user("userb@example.com")
    
    cookies_a = login_user("usera@example.com")
    cookies_b = login_user("userb@example.com")
    
    # User A uploads
    response_a = client.post(
        "/api/datasets/upload",
        files={"file": ("data_a.csv", b"a,b\n1,2")},
        cookies=cookies_a
    )
    dataset_a_id = response_a.json()["id"]
    
    # User B tries to GET User A's dataset
    response_b_get = client.get(f"/api/datasets/{dataset_a_id}", cookies=cookies_b)
    assert response_b_get.status_code == 404
    
    # User B tries to DELETE User A's dataset
    response_b_del = client.delete(f"/api/datasets/{dataset_a_id}", cookies=cookies_b)
    assert response_b_del.status_code == 404
    
    # User A can get their own
    response_a_get = client.get(f"/api/datasets/{dataset_a_id}", cookies=cookies_a)
    assert response_a_get.status_code == 200

def test_list_datasets():
    create_test_user()
    cookies = login_user()
    
    # List empty
    assert client.get("/api/datasets/", cookies=cookies).json() == []
    
    # Upload two
    client.post("/api/datasets/upload", files={"file": ("f1.csv", b"a\n1")}, cookies=cookies)
    client.post("/api/datasets/upload", files={"file": ("f2.csv", b"b\n2")}, cookies=cookies)
    
    data = client.get("/api/datasets/", cookies=cookies).json()
    assert len(data) == 2

def test_delete_dataset():
    create_test_user()
    cookies = login_user()
    
    response = client.post(
        "/api/datasets/upload",
        files={"file": ("data.csv", b"a,b\n1,2")},
        cookies=cookies
    )
    dataset_id = response.json()["id"]
    
    # Ensure physical file is there
    db = TestingSessionLocal()
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    file_path = dataset_service.STORAGE_DIR / dataset.stored_filename
    assert file_path.exists()
    
    # Delete
    del_res = client.delete(f"/api/datasets/{dataset_id}", cookies=cookies)
    assert del_res.status_code == 204
    
    # File should be gone
    assert not file_path.exists()
    
    # DB record should be gone
    assert client.get(f"/api/datasets/{dataset_id}", cookies=cookies).status_code == 404
