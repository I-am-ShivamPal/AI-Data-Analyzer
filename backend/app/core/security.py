from passlib.context import CryptContext

# Use argon2 for password hashing, as recommended
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Generate an Argon2 hash from a plain password."""
    return pwd_context.hash(password)
