import secrets
import hashlib
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.db.models import User, PasswordResetChallenge
import logging

logger = logging.getLogger(__name__)

# Development only notification
def send_dev_notification(contact_value: str, otp: str):
    logger.warning(f"DEV ONLY: Sending OTP {otp} to {contact_value}")
    print(f"=====================================")
    print(f"DEV ONLY: OTP for {contact_value}")
    print(f"Code: {otp}")
    print(f"=====================================")

def generate_otp() -> str:
    """Generate a cryptographically secure 6-digit OTP."""
    return f"{secrets.randbelow(1000000):06d}"

def hash_otp(otp: str) -> str:
    """Hash the OTP using SHA-256 for secure storage."""
    # We use a simple SHA-256 here since it's short-lived and already cryptographically random
    return hashlib.sha256(otp.encode("utf-8")).hexdigest()

def verify_otp_hash(entered_otp: str, stored_hash: str) -> bool:
    """Securely compare the entered OTP against the stored hash."""
    entered_hash = hash_otp(entered_otp)
    return secrets.compare_digest(entered_hash, stored_hash)

def invalidate_existing_challenges(db: Session, user_id: str):
    """Invalidate any existing active challenges for the user."""
    active_challenges = db.query(PasswordResetChallenge).filter(
        PasswordResetChallenge.user_id == user_id,
        PasswordResetChallenge.used_at == None,
        PasswordResetChallenge.verified_at == None,
        PasswordResetChallenge.expires_at > datetime.utcnow()
    ).all()
    
    for challenge in active_challenges:
        challenge.expires_at = datetime.utcnow() # expire them immediately
    db.commit()

def create_challenge(db: Session, user: User, contact_type: str, contact_value: str) -> PasswordResetChallenge:
    """Create a new OTP challenge and 'send' the OTP."""
    invalidate_existing_challenges(db, user.id)
    
    otp = generate_otp()
    otp_hash = hash_otp(otp)
    
    challenge = PasswordResetChallenge(
        user_id=user.id,
        contact_type=contact_type,
        contact_value=contact_value,
        otp_hash=otp_hash,
        expires_at=datetime.utcnow() + timedelta(minutes=5),
        max_attempts=5,
        attempt_count=0,
        resend_count=0
    )
    
    db.add(challenge)
    db.commit()
    db.refresh(challenge)
    
    # Trigger delivery (In a real app, this would use SNS/SES based on config)
    send_dev_notification(contact_value, otp)
    
    return challenge

def resend_challenge(db: Session, challenge_id: str) -> tuple[PasswordResetChallenge | None, str | None]:
    """Resend OTP if limits and cooldown allow."""
    challenge = db.query(PasswordResetChallenge).filter(PasswordResetChallenge.id == challenge_id).first()
    
    if not challenge:
        return None, "Challenge not found"
        
    if challenge.used_at or challenge.verified_at:
        return None, "Challenge already processed"
        
    if challenge.attempt_count >= challenge.max_attempts:
        return None, "Challenge locked due to too many attempts"
        
    if challenge.expires_at < datetime.utcnow():
        return None, "Challenge expired"
        
    if challenge.resend_count >= 3:
        return None, "Maximum resend limit reached"
        
    # Check cooldown (60 seconds)
    if challenge.last_sent_at and (datetime.utcnow() - challenge.last_sent_at).total_seconds() < 60:
        return None, "Please wait before requesting another code"
        
    # Generate new OTP
    otp = generate_otp()
    challenge.otp_hash = hash_otp(otp)
    challenge.expires_at = datetime.utcnow() + timedelta(minutes=5)
    challenge.last_sent_at = datetime.utcnow()
    challenge.resend_count += 1
    
    db.commit()
    db.refresh(challenge)
    
    send_dev_notification(challenge.contact_value, otp)
    
    return challenge, None

def verify_challenge(db: Session, challenge_id: str, entered_otp: str) -> tuple[PasswordResetChallenge | None, str | None]:
    """Verify an OTP attempt against a challenge."""
    challenge = db.query(PasswordResetChallenge).filter(PasswordResetChallenge.id == challenge_id).first()
    
    if not challenge:
        return None, "Challenge not found"
        
    if challenge.used_at:
        return None, "Challenge already processed"
        
    if challenge.verified_at:
        return challenge, None # Already verified
        
    if challenge.attempt_count >= challenge.max_attempts:
        return None, "Too many attempts. Please request a new code."
        
    if challenge.expires_at < datetime.utcnow():
        return None, "That code has expired. Please request a new code."
        
    # Verify OTP
    if not verify_otp_hash(entered_otp, challenge.otp_hash):
        challenge.attempt_count += 1
        db.commit()
        return None, "That verification code is invalid. Please try again."
        
    # Success
    challenge.verified_at = datetime.utcnow()
    db.commit()
    db.refresh(challenge)
    
    return challenge, None
