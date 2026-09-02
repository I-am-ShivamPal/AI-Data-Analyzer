from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import re

from app.db.models import User, Session as DBSession, RoleEnum
from app.schemas.user import UserCreate
from app.core.security import get_password_hash, verify_password
from app.core.sessions import generate_session_token
from app.core.config import settings

def parse_user_agent(ua_string: str):
    """Basic device detection from User-Agent string."""
    if not ua_string:
        return {"device_type": "Unknown", "os": "Unknown", "browser": "Unknown"}
        
    ua_lower = ua_string.lower()
    
    # OS Detection
    os = "Unknown"
    if "windows" in ua_lower:
        os = "Windows"
    elif "mac os" in ua_lower or "macos" in ua_lower:
        os = "macOS"
    elif "android" in ua_lower:
        os = "Android"
    elif "iphone" in ua_lower or "ipad" in ua_lower:
        os = "iOS"
    elif "linux" in ua_lower:
        os = "Linux"
        
    # Browser Detection
    browser = "Unknown"
    if "edg" in ua_lower:
        browser = "Edge"
    elif "chrome" in ua_lower:
        browser = "Chrome"
    elif "safari" in ua_lower and "chrome" not in ua_lower:
        browser = "Safari"
    elif "firefox" in ua_lower:
        browser = "Firefox"
        
    # Device Type
    device_type = "Desktop"
    if os in ["Android", "iOS"]:
        device_type = "Mobile"
    if "ipad" in ua_lower:
        device_type = "Tablet"
        
    return {"device_type": device_type, "os": os, "browser": browser}

def create_user(db: Session, user: UserCreate, role: RoleEnum = RoleEnum.USER) -> User:
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        name=user.name,
        password_hash=hashed_password,
        role=role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user

def create_session(db: Session, user: User, ip_address: str = None, user_agent: str = None) -> str:
    session_id = generate_session_token()
    device_info = parse_user_agent(user_agent)
    
    expires_at = datetime.utcnow() + timedelta(seconds=settings.SESSION_MAX_AGE)
    
    db_session = DBSession(
        id=session_id,
        user_id=user.id,
        expires_at=expires_at,
        ip_address=ip_address,
        user_agent=user_agent,
        device_type=device_info["device_type"],
        os=device_info["os"],
        browser=device_info["browser"]
    )
    
    # Update user's last login
    user.last_login_at = datetime.utcnow()
    
    db.add(db_session)
    db.commit()
    
    return session_id

def get_session(db: Session, session_id: str) -> DBSession | None:
    return db.query(DBSession).filter(
        DBSession.id == session_id,
        DBSession.is_active == True,
        DBSession.expires_at > datetime.utcnow()
    ).first()

def revoke_session(db: Session, session_id: str):
    session = get_session(db, session_id)
    if session:
        session.is_active = False
        session.revoked_at = datetime.utcnow()
        db.commit()

def revoke_all_sessions_for_user(db: Session, user_id: str):
    """Revoke all active sessions for a specific user. Useful after password resets."""
    active_sessions = db.query(DBSession).filter(
        DBSession.user_id == user_id,
        DBSession.is_active == True,
        DBSession.expires_at > datetime.utcnow()
    ).all()
    
    for session in active_sessions:
        session.is_active = False
        session.revoked_at = datetime.utcnow()
        
    if active_sessions:
        db.commit()
