from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.db.connection import get_db
from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import LoginRequest, ForgotPasswordRequest, VerifyOTPRequest, ResendOTPRequest, ResetPasswordRequest
from app.services import auth_service, otp_service
from app.services.rate_limit_service import check_rate_limit
from app.api.dependencies import get_current_user
from app.core.config import settings
from app.core.security import get_password_hash
from datetime import datetime
import uuid

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

@router.post("/forgot-password")
def forgot_password(request: Request, data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Initiate password reset flow."""
    # Rate limit by IP
    ip_address = request.client.host if request.client else "unknown"
    if not check_rate_limit(f"forgot_{ip_address}", max_requests=3, window_seconds=60):
        raise HTTPException(status_code=429, detail="Too many requests. Please wait and try again.")
        
    # Normalize contact
    contact = data.contact.strip().lower()
    
    # Generic response payload
    success_msg = "If an account matches the provided information, a verification code has been sent."
    
    # Try email first, then phone if applicable. (Assuming email is the primary contact for now)
    user = db.query(auth_service.User).filter(auth_service.User.email == contact).first()
    
    if not user:
        return {"message": success_msg}
        
    challenge = otp_service.create_challenge(db, user, "email", contact)
    
    return {
        "message": success_msg,
        "challenge_id": challenge.id
    }

@router.post("/verify-reset-otp")
def verify_reset_otp(request: Request, data: VerifyOTPRequest, db: Session = Depends(get_db)):
    """Verify OTP and return short-lived reset authorization."""
    ip_address = request.client.host if request.client else "unknown"
    if not check_rate_limit(f"verify_otp_{ip_address}", max_requests=10, window_seconds=300):
        raise HTTPException(status_code=429, detail="Too many requests. Please wait and try again.")
        
    challenge, error = otp_service.verify_challenge(db, data.challenge_id, data.otp)
    if error:
        raise HTTPException(status_code=400, detail=error)
        
    # Generate a short-lived reset authorization token
    # We will use an opaque token stored in the DB (for now we can just use the verified challenge ID but mapped carefully)
    # The requirement asks for a secure token. Let's create one and store it in the challenge record.
    reset_token = str(uuid.uuid4())
    challenge.reset_token_hash = otp_service.hash_otp(reset_token) # we can reuse hash_otp for generic hashing
    db.commit()
    
    return {
        "message": "OTP verified successfully.",
        "reset_token": reset_token
    }

@router.post("/resend-reset-otp")
def resend_reset_otp(request: Request, data: ResendOTPRequest, db: Session = Depends(get_db)):
    """Resend OTP code for an existing challenge."""
    ip_address = request.client.host if request.client else "unknown"
    if not check_rate_limit(f"resend_{ip_address}", max_requests=3, window_seconds=60):
        raise HTTPException(status_code=429, detail="Too many requests. Please wait and try again.")
        
    challenge, error = otp_service.resend_challenge(db, data.challenge_id)
    if error:
        raise HTTPException(status_code=400, detail=error)
        
    return {"message": "Verification code resent."}

@router.post("/reset-password")
def reset_password(request: Request, data: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Set new password using reset authorization."""
    ip_address = request.client.host if request.client else "unknown"
    if not check_rate_limit(f"reset_{ip_address}", max_requests=5, window_seconds=60):
        raise HTTPException(status_code=429, detail="Too many requests. Please wait and try again.")
        
    if data.new_password != data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")
        
    # Minimum password validation (example)
    if len(data.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long.")
        
    # Find challenge by hashing the incoming token and matching it
    token_hash = otp_service.hash_otp(data.reset_token)
    challenge = db.query(otp_service.PasswordResetChallenge).filter(
        otp_service.PasswordResetChallenge.reset_token_hash == token_hash
    ).first()
    
    if not challenge:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token.")
        
    if challenge.used_at:
        raise HTTPException(status_code=400, detail="Reset token already used.")
        
    if challenge.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Reset token expired.")
        
    if not challenge.verified_at:
        raise HTTPException(status_code=403, detail="Challenge was not verified.")
        
    user = challenge.user
    user.password_hash = get_password_hash(data.new_password)
    challenge.used_at = datetime.utcnow()
    
    # Revoke all sessions
    auth_service.revoke_all_sessions_for_user(db, user.id)
    
    db.commit()
    
    return {"message": "Password reset successfully. Please log in with your new password."}
