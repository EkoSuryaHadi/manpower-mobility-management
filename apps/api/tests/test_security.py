import jwt
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from app.core.config import get_settings
from app.security import Principal, get_principal, require_roles

def test_local_principal_without_auth():
    get_settings.cache_clear()
    principal = get_principal(None)
    assert principal.role == "admin"

def test_valid_supabase_style_token(monkeypatch):
    settings = get_settings()
    monkeypatch.setattr(settings, "auth_enforced", True)
    monkeypatch.setattr(settings, "supabase_jwt_secret", "test-secret")
    token = jwt.encode({"sub": "user-1", "aud": "authenticated", "organization_id": "org-a", "role": "manager"}, "test-secret", algorithm="HS256")
    principal = get_principal(HTTPAuthorizationCredentials(scheme="Bearer", credentials=token))
    assert principal.user_id == "user-1"
    assert principal.organization_id == "org-a"
    assert principal.role == "manager"

def test_invalid_token_is_rejected(monkeypatch):
    settings = get_settings()
    monkeypatch.setattr(settings, "auth_enforced", True)
    monkeypatch.setattr(settings, "supabase_jwt_secret", "test-secret")
    try:
        get_principal(HTTPAuthorizationCredentials(scheme="Bearer", credentials="bad-token"))
    except HTTPException as exc:
        assert exc.status_code == 401
    else:
        raise AssertionError("invalid token was accepted")

def test_role_guard_rejects_unapproved_role():
    guard = require_roles("admin", "hr")
    try:
        guard(Principal(user_id="u", organization_id="org-a", role="worker"))
    except HTTPException as exc:
        assert exc.status_code == 403
    else:
        raise AssertionError("worker role was accepted for write access")
