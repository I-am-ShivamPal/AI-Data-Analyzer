from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.connection import get_db
from app.db.models import User, RoleEnum
from app.services import auth_service
from app.core.config import settings

def get_session_token(request: Request) -> str | None:
    """Extract session token from HttpOnly cookie."""
    return request.cookies.get(settings.SESSION_COOKIE_NAME)

def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
) -> User:
    """Validate session and return the current user."""
    session_id = get_session_token(request)
    if not session_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
        
    db_session = auth_service.get_session(db, session_id)
    if not db_session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session invalid or expired"
        )
        
    # Update last activity
    db_session.last_activity_at = datetime.utcnow()
    db.commit()
    
    return db_session.user

def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Ensure the user has the ADMIN role."""
    if current_user.role != RoleEnum.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough privileges"
        )
    return current_user
