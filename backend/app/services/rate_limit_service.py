from datetime import datetime, timedelta

# In-memory store for development. MUST be replaced by Redis in production.
_rate_limits = {}

def check_rate_limit(key: str, max_requests: int = 5, window_seconds: int = 60) -> bool:
    """
    Check if a key has exceeded its rate limit.
    Returns True if allowed, False if rate limited.
    """
    now = datetime.utcnow()
    
    # Cleanup old entries to prevent memory leak in dev
    global _rate_limits
    _rate_limits = {k: v for k, v in _rate_limits.items() if v['reset_at'] > now}
    
    if key not in _rate_limits:
        _rate_limits[key] = {
            'count': 1,
            'reset_at': now + timedelta(seconds=window_seconds)
        }
        return True
        
    entry = _rate_limits[key]
    if entry['count'] >= max_requests:
        return False
        
    entry['count'] += 1
    return True
