import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import uuid
from datetime import datetime, timedelta

from app.main import app
from app.db.connection import Base, get_db
from app.core.config import settings
from app.core.security import get_password_hash, verify_password
from app.db.models import User, RoleEnum, PasswordResetChallenge, Session as DBSession

# Using SQLite for testing
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

from app.services import rate_limit_service

@pytest.fixture(autouse=True)
def clean_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    rate_limit_service._rate_limits.clear()
    yield

def create_test_user(db, email="reset@example.com", password="password123"):
    user = User(
        email=email,
        name="Test User",
        password_hash=get_password_hash(password),
        role=RoleEnum.USER
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def test_forgot_password_generic_response_non_existent():
    # Should not reveal if email exists or not
    response = client.post(
        "/api/auth/forgot-password",
        json={"contact": "nobody@example.com"}
    )
    assert response.status_code == 200
    assert "If an account matches" in response.json()["message"]
    # No challenge ID should be returned if user doesn't exist
    assert "challenge_id" not in response.json()

def test_forgot_password_existing_user():
    db = TestingSessionLocal()
    create_test_user(db)
    
    response = client.post(
        "/api/auth/forgot-password",
        json={"contact": "reset@example.com"}
    )
    assert response.status_code == 200
    assert "If an account matches" in response.json()["message"]
    assert "challenge_id" in response.json()
    
    # Check DB
    challenge = db.query(PasswordResetChallenge).first()
    assert challenge is not None
    assert challenge.contact_value == "reset@example.com"
    
def test_verify_otp_invalid():
    db = TestingSessionLocal()
    user = create_test_user(db)
    
    response = client.post(
        "/api/auth/forgot-password",
        json={"contact": "reset@example.com"}
    )
    challenge_id = response.json()["challenge_id"]
    
    # Send bad OTP
    verify_resp = client.post(
        "/api/auth/verify-reset-otp",
        json={"challenge_id": challenge_id, "otp": "000000"}
    )
    assert verify_resp.status_code == 400
    assert "invalid" in verify_resp.json()["detail"].lower()
    
    # Check attempt count
    challenge = db.query(PasswordResetChallenge).filter_by(id=challenge_id).first()
    assert challenge.attempt_count == 1

def test_verify_otp_max_attempts():
    db = TestingSessionLocal()
    user = create_test_user(db)
    
    # We will manually set the attempt count to max
    response = client.post(
        "/api/auth/forgot-password",
        json={"contact": "reset@example.com"}
    )
    challenge_id = response.json()["challenge_id"]
    
    challenge = db.query(PasswordResetChallenge).filter_by(id=challenge_id).first()
    challenge.attempt_count = 5
    db.commit()
    
    verify_resp = client.post(
        "/api/auth/verify-reset-otp",
        json={"challenge_id": challenge_id, "otp": "000000"}
    )
    assert verify_resp.status_code == 400
    assert "too many attempts" in verify_resp.json()["detail"].lower()

def test_full_reset_flow():
    db = TestingSessionLocal()
    user = create_test_user(db)
    
    # Create a session to test revocation
    session_id = "test_session_id"
    test_session = DBSession(
        id=session_id,
        user_id=user.id,
        expires_at=datetime.utcnow() + timedelta(days=1),
        is_active=True
    )
    db.add(test_session)
    db.commit()
    
    # 1. Forgot password
    response = client.post(
        "/api/auth/forgot-password",
        json={"contact": "reset@example.com"}
    )
    challenge_id = response.json()["challenge_id"]
    
    # We must hack the OTP for testing since we can't read console from test
    # We'll just generate a known OTP and overwrite the hash
    from app.services import otp_service
    known_otp = "123456"
    challenge = db.query(PasswordResetChallenge).filter_by(id=challenge_id).first()
    challenge.otp_hash = otp_service.hash_otp(known_otp)
    db.commit()
    
    # 2. Verify OTP
    verify_resp = client.post(
        "/api/auth/verify-reset-otp",
        json={"challenge_id": challenge_id, "otp": known_otp}
    )
    assert verify_resp.status_code == 200
    reset_token = verify_resp.json()["reset_token"]
    
    # 3. Reset Password
    reset_resp = client.post(
        "/api/auth/reset-password",
        json={"reset_token": reset_token, "new_password": "newpassword123!", "confirm_password": "newpassword123!"}
    )
    assert reset_resp.status_code == 200
    
    # Check that password was updated
    db.refresh(user)
    assert verify_password("newpassword123!", user.password_hash)
    
    # Check that session was revoked
    db.refresh(test_session)
    assert test_session.is_active == False
    assert test_session.revoked_at is not None
