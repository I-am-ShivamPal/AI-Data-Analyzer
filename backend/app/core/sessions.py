import secrets
import string

def generate_session_token(length: int = 48) -> str:
    """
    Generate a cryptographically random session token.
    Uses URL-safe characters for easier cookie storage.
    """
    alphabet = string.ascii_letters + string.digits + "-_"
    return "".join(secrets.choice(alphabet) for _ in range(length))
