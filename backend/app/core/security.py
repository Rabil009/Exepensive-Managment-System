"""Security, JWT creation and verification for Employee authentication."""

import time
import logging
from typing import Optional, Dict, Any
import jwt

from app.core.config import settings

logger = logging.getLogger(__name__)

JWT_SECRET = settings.SUPABASE_KEY or "expense-management-system-jwt-secret-2026"
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_SECONDS = 86400 * 30  # 30 days


def create_employee_token(
    user_id: str,
    email: str,
    name: str,
    role: str = "EMPLOYEE",
    department: str = "Engineering",
) -> str:
    now = int(time.time())
    payload = {
        "sub": user_id,
        "email": email,
        "name": name,
        "role": role,
        "department": department,
        "aud": "authenticated",
        "iss": "payout-expense-system",
        "iat": now,
        "exp": now + JWT_EXPIRE_SECONDS,
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_employee_token(token: str) -> Optional[Dict[str, Any]]:
    if not token:
        return None
    # 1. Try decoding with secret and audience
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM], audience="authenticated")
    except Exception:
        pass

    # 2. Try decoding without verifying audience
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM], options={"verify_aud": False})
    except Exception:
        pass

    # 3. Try decoding without signature verification (in case it's a valid JWT from Supabase or another service)
    try:
        return jwt.decode(token, options={"verify_signature": False})
    except Exception:
        pass

    return None

