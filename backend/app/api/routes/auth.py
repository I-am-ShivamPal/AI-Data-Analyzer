from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.db.connection import get_db
from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import LoginRequest
from app.services import auth_service
from app.api.dependencies import get_current_user
from app.core.config import settings

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    # Check if email exists
    db_user = db.query(auth_service.User).filter(auth_service.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    try:
        new_user = auth_service.create_user(db, user)
        return new_user
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Registration failed")

@router.post("/login")
def login(request: Request, response: Response, credentials: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user and set HttpOnly session cookie."""
    user = auth_service.authenticate_user(db, credentials.email, credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
        
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )

    # Capture request metadata
    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("User-Agent")

    # Create session
    session_id = auth_service.create_session(db, user, ip_address, user_agent)
    
    # Set HttpOnly Cookie
    response.set_cookie(
        key=settings.SESSION_COOKIE_NAME,
        value=session_id,
        httponly=True,
        secure=True, # Should be True in production (HTTPS)
        samesite="lax",
        max_age=settings.SESSION_MAX_AGE
    )
    
    return {"message": "Logged in successfully"}

@router.post("/logout")
def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    """Revoke session and clear cookie."""
    session_id = request.cookies.get(settings.SESSION_COOKIE_NAME)
    if session_id:
        auth_service.revoke_session(db, session_id)
        
    response.delete_cookie(
        key=settings.SESSION_COOKIE_NAME,
        httponly=True,
        secure=True,
        samesite="lax"
    )
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: auth_service.User = Depends(get_current_user)):
    """Get the currently authenticated user."""
    return current_user
