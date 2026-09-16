from dataclasses import dataclass
import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.core.config import get_settings

bearer = HTTPBearer(auto_error=False)

@dataclass(frozen=True)
class Principal:
    user_id: str
    organization_id: str | None
    role: str

def get_principal(credentials: HTTPAuthorizationCredentials | None = Depends(bearer)) -> Principal:
    settings = get_settings()
    if not settings.auth_enforced and credentials is None:
        return Principal(user_id="local-development", organization_id=None, role="admin")
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Bearer token required")
    if not settings.supabase_jwt_secret:
        raise HTTPException(status_code=503, detail="Authentication is not configured")
    try:
        claims = jwt.decode(credentials.credentials, settings.supabase_jwt_secret, algorithms=["HS256"], audience=settings.supabase_jwt_audience)
    except jwt.InvalidTokenError as exc:
        raise HTTPException(status_code=401, detail="Invalid access token") from exc
    user_id = claims.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Token subject is missing")
    return Principal(user_id=user_id, organization_id=claims.get("organization_id"), role=claims.get("role", "worker"))

def require_roles(*allowed_roles: str):
    def role_guard(principal: Principal = Depends(get_principal)) -> Principal:
        if principal.role not in allowed_roles:
            raise HTTPException(status_code=403, detail="Insufficient role permissions")
        return principal
    return role_guard
