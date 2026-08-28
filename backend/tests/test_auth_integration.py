import sys
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
from app.db.models import User, RoleEnum

# Using SQLite for testing to avoid touching dev database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
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
    yield

def test_register_user():
    response = client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "name": "Test User", "password": "password123"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["name"] == "Test User"
    assert data["role"] == "USER"
    assert "id" in data

def test_login_user():
    # Register first
    client.post(
        "/api/auth/register",
        json={"email": "login@example.com", "name": "Login User", "password": "password123"}
    )
    
    # Login
    response = client.post(
        "/api/auth/login",
        json={"email": "login@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    
    # Check that HttpOnly cookie was set
    cookies = response.cookies
    assert settings.SESSION_COOKIE_NAME in cookies
    
def test_get_me_unauthorized():
    response = client.get("/api/auth/me")
    assert response.status_code == 401
    
def test_get_me_authorized():
    # Register and Login
    client.post(
        "/api/auth/register",
        json={"email": "me@example.com", "name": "Me User", "password": "password123"}
    )
    login_response = client.post(
        "/api/auth/login",
        json={"email": "me@example.com", "password": "password123"}
    )
    
    # Use the session cookie for the next request
    session_cookie = login_response.cookies.get(settings.SESSION_COOKIE_NAME)
    
    # Access /me
    response = client.get(
        "/api/auth/me",
        cookies={settings.SESSION_COOKIE_NAME: session_cookie}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "me@example.com"

def test_logout():
    client.post(
        "/api/auth/register",
        json={"email": "logout@example.com", "name": "Logout User", "password": "password123"}
    )
    login_response = client.post(
        "/api/auth/login",
        json={"email": "logout@example.com", "password": "password123"}
    )
    session_cookie = login_response.cookies.get(settings.SESSION_COOKIE_NAME)
    
    # Logout
    logout_response = client.post(
        "/api/auth/logout",
        cookies={settings.SESSION_COOKIE_NAME: session_cookie}
    )
    assert logout_response.status_code == 200
    
    # Try accessing /me again
    me_response = client.get(
        "/api/auth/me",
        cookies={settings.SESSION_COOKIE_NAME: session_cookie}
    )
    assert me_response.status_code == 401
    
def test_admin_access():
    # Create an admin user manually in DB
    db = TestingSessionLocal()
    admin_user = User(
        email="admin@example.com",
        name="Admin User",
        password_hash=get_password_hash("password123"),
        role=RoleEnum.ADMIN
    )
    db.add(admin_user)
    db.commit()
    
    # Login as admin
    login_response = client.post(
        "/api/auth/login",
        json={"email": "admin@example.com", "password": "password123"}
    )
    session_cookie = login_response.cookies.get(settings.SESSION_COOKIE_NAME)
    
    # Access a fake admin endpoint by overriding the router temporarily for testing
    from fastapi import Depends
    from app.api.dependencies import require_admin
    
    @app.get("/api/auth/test_admin")
    def test_admin_endpoint(admin=Depends(require_admin)):
        return {"msg": "Welcome Admin"}
        
    response = client.get(
        "/api/auth/test_admin",
        cookies={settings.SESSION_COOKIE_NAME: session_cookie}
    )
    assert response.status_code == 200
    
    # Verify a normal user cannot access it
    client.post(
        "/api/auth/register",
        json={"email": "normal@example.com", "name": "Normal User", "password": "password123"}
    )
    login_normal = client.post(
        "/api/auth/login",
        json={"email": "normal@example.com", "password": "password123"}
    )
    session_normal = login_normal.cookies.get(settings.SESSION_COOKIE_NAME)
    
    response_forbidden = client.get(
        "/api/auth/test_admin",
        cookies={settings.SESSION_COOKIE_NAME: session_normal}
    )
    assert response_forbidden.status_code == 403
