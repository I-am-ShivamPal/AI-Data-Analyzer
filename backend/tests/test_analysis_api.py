import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import pytest
import json
import uuid
from fastapi.testclient import TestClient
from unittest.mock import patch
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.db.connection import Base, get_db
from app.core.config import settings
from app.core.security import get_password_hash
from app.db.models import User, Dataset
from app.services import dataset_service

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_analysis.db"
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
    assert response.status_code == 200
    return {settings.SESSION_COOKIE_NAME: response.cookies.get(settings.SESSION_COOKIE_NAME)}

def upload_test_dataset(cookies: dict) -> str:
    # A small CSV that fulfills: product, price, quantity, location, channel, date
    csv_content = b"""product_name,price,quantity,location,channel,date
Laptop,1000,5,Virginia,Online,2023-03-01
Phone,500,10,Virginia,Retail,2023-03-02
Tablet,300,20,Texas,Online,2023-03-03
Laptop,1000,2,Texas,Retail,2023-03-04"""
    
    response = client.post(
        "/api/datasets/upload",
        files={"file": ("test_sales.csv", csv_content, "text/csv")},
        cookies=cookies
    )
    assert response.status_code == 201
    return response.json()["id"]

# --- MOCKING QWEN ---

def mock_qwen_generate(prompt: str, *args, **kwargs) -> str:
    # QuestionParser uses <intent>...</intent>
    # AnswerGenerator just takes prompt
    if "intent parser" in prompt:
        # It's a QuestionParser prompt
        user_question = prompt.split("USER QUESTION:")[-1].lower()
        if "highest revenue" in user_question:
            intent = {
                "operation": "group",
                "entity": "product",
                "metric": "revenue",
                "limit": 1
            }
            if "virginia" in user_question:
                intent["filters"] = {"location": "Virginia"}
        elif "total revenue" in user_question and "virginia" in user_question:
            intent = {
                "operation": "total",
                "entity": "dataset",
                "metric": "revenue",
                "filters": {"location": "Virginia"}
            }
        elif "revenue by product and location" in user_question:
            intent = {
                "operation": "group",
                "entity": "product",
                "group_by": ["product", "location"],
                "metric": "revenue"
            }
        elif "total revenue in march" in user_question:
            intent = {
                "operation": "total",
                "entity": "dataset",
                "metric": "revenue",
                "filters": {"date": "March"}
            }
        elif "invalid dimension" in user_question:
            intent = {
                "operation": "group",
                "entity": "product",
                "group_by": ["magic_beans"],
                "metric": "revenue"
            }
        else:
            intent = {"operation": "overview"}
        
        return f"<intent>\n{json.dumps(intent)}\n</intent>"
    else:
        # It's an AnswerGenerator prompt
        return "This is a mocked natural language answer."

@pytest.fixture
def mock_qwen():
    with patch("app.ai.qwen_model.QwenModel.load") as mock_load, \
         patch("app.ai.qwen_model.QwenModel.generate", side_effect=mock_qwen_generate) as mock_generate:
        yield mock_load, mock_generate

# --- TESTS ---

def test_unauthenticated_analysis():
    response = client.post("/api/analyze", json={
        "dataset_id": str(uuid.uuid4()),
        "question": "What is the total revenue?"
    })
    assert response.status_code == 401

def test_missing_dataset(mock_qwen):
    create_test_user()
    cookies = login_user()
    response = client.post("/api/analyze", json={
        "dataset_id": str(uuid.uuid4()),
        "question": "What is the total revenue?"
    }, cookies=cookies)
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()

def test_another_users_dataset(mock_qwen):
    user_a = create_test_user("user_a@example.com")
    user_b = create_test_user("user_b@example.com")
    cookies_a = login_user("user_a@example.com")
    cookies_b = login_user("user_b@example.com")
    
    ds_id = upload_test_dataset(cookies_a)
    
    # User B tries to analyze User A's dataset
    response = client.post("/api/analyze", json={
        "dataset_id": ds_id,
        "question": "What is the total revenue?"
    }, cookies=cookies_b)
    
    assert response.status_code == 404

def test_non_ready_dataset(mock_qwen):
    create_test_user()
    cookies = login_user()
    ds_id = upload_test_dataset(cookies)
    
    # Manually set to processing
    db = TestingSessionLocal()
    ds = db.query(Dataset).filter(Dataset.id == ds_id).first()
    ds.status = "processing"
    db.commit()
    db.close()
    
    response = client.post("/api/analyze", json={
        "dataset_id": ds_id,
        "question": "What is the total revenue?"
    }, cookies=cookies)
    assert response.status_code == 400
    assert "not ready" in response.json()["detail"].lower()

def test_missing_physical_file(mock_qwen):
    create_test_user()
    cookies = login_user()
    ds_id = upload_test_dataset(cookies)
    
    # Delete the physical file
    for f in dataset_service.STORAGE_DIR.glob("*.csv"):
        f.unlink()
        
    response = client.post("/api/analyze", json={
        "dataset_id": ds_id,
        "question": "What is the total revenue?"
    }, cookies=cookies)
    assert response.status_code == 404
    assert "physical dataset file" in response.json()["detail"].lower()

def test_valid_analysis_dynamic_schema(mock_qwen):
    create_test_user()
    cookies = login_user()
    ds_id = upload_test_dataset(cookies)
    
    # Question: "Which product generated the highest revenue in Virginia?"
    response = client.post("/api/analyze", json={
        "dataset_id": ds_id,
        "question": "Which product generated the highest revenue in Virginia?"
    }, cookies=cookies)
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["dataset"]["id"] == ds_id
    assert data["dataset"]["filename"] == "test_sales.csv"
    assert data["intent"]["operation"] == "group"
    assert data["intent"]["filters"]["location"] == "Virginia"
    assert data["answer"] == "This is a mocked natural language answer."
    
    # The result should be evaluated by DuckDB based on the test CSV
    # Laptop: 1000*5 = 5000 in VA
    # Phone: 500*10 = 5000 in VA
    # So top 1 is either Laptop or Phone with 5000.
    result = data["result"]
    assert len(result) > 0
    assert result[0]["revenue"] == 5000.0

def test_group_by_multiple_dimensions(mock_qwen):
    create_test_user()
    cookies = login_user()
    ds_id = upload_test_dataset(cookies)
    
    response = client.post("/api/analyze", json={
        "dataset_id": ds_id,
        "question": "Show revenue by product and location"
    }, cookies=cookies)
    
    assert response.status_code == 200
    data = response.json()
    assert data["intent"]["operation"] == "group"
    assert "product" in data["result"][0]
    assert "location" in data["result"][0]
    assert "revenue" in data["result"][0]

def test_invalid_dimension(mock_qwen):
    create_test_user()
    cookies = login_user()
    ds_id = upload_test_dataset(cookies)
    
    response = client.post("/api/analyze", json={
        "dataset_id": ds_id,
        "question": "invalid dimension"
    }, cookies=cookies)
    
    assert response.status_code == 400, f"Expected 400, got {response.status_code}: {response.json()}"
    assert "unsupported grouping dimension" in response.json()["detail"].lower()

def test_response_schema(mock_qwen):
    create_test_user()
    cookies = login_user()
    ds_id = upload_test_dataset(cookies)
    
    response = client.post("/api/analyze", json={
        "dataset_id": ds_id,
        "question": "overview"
    }, cookies=cookies)
    
    assert response.status_code == 200
    data = response.json()
    assert "dataset" in data
    assert "question" in data
    assert "intent" in data
    assert "result" in data
    assert "resolved_context" in data
    assert "answer" in data
