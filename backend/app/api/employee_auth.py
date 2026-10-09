"""Employee login through Supabase Auth, with a server-side profile check."""

from typing import Annotated

import httpx
from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel, Field

from app.core.config import settings


router = APIRouter(prefix="/api/auth/employee", tags=["employee-auth"])


class Credentials(BaseModel):
    email: str = Field(min_length=3, max_length=320)
    password: str = Field(min_length=1)


def _request(client: httpx.Client, method: str, path: str, **kwargs) -> httpx.Response:
    try:
        return client.request(method, path, **kwargs)
    except httpx.RequestError as exc:
        raise HTTPException(502, "Authentication service is unavailable") from exc


def _employee(client: httpx.Client, access_token: str) -> dict:
    headers = {"Authorization": f"Bearer {access_token}"}
    user_response = _request(client, "GET", "/auth/v1/user", headers=headers)
    if user_response.status_code != 200:
        raise HTTPException(401, "Employee session expired or invalid")
    try:
        user = user_response.json()
    except ValueError:
        raise HTTPException(502, "Authentication service returned an invalid user record")
    if not isinstance(user, dict):
        raise HTTPException(502, "Authentication service returned an invalid user record")
    user_id = user.get("id")
    if not user_id:
        raise HTTPException(401, "Employee session expired or invalid")
    profile_response = _request(
        client, "GET", "/rest/v1/profiles",
        headers=headers,
        params={"id": f"eq.{user_id}", "select": "id,name,role"},
    )
    if profile_response.status_code in (401, 403):
        raise HTTPException(401, "Employee session expired or invalid")
    if profile_response.status_code != 200:
        raise HTTPException(502, "Employee profile service is unavailable")
    try:
        profiles = profile_response.json()
    except ValueError:
        raise HTTPException(502, "Employee profile service returned invalid data")
    if not isinstance(profiles, list):
        raise HTTPException(502, "Employee profile service returned invalid data")
    if not profiles:
        raise HTTPException(404, "Employee profile not found")
    profile = profiles[0]
    if not isinstance(profile, dict) or profile.get("id") != user_id:
        raise HTTPException(502, "Employee profile service returned invalid data")
    if profile.get("role") != "EMPLOYEE":
        raise HTTPException(403, "An Employee account is required")
    return {
        "user": {"id": user_id, "email": user.get("email")},
        "profile": profile,
    }


def _client() -> httpx.Client:
    return httpx.Client(
        base_url=settings.SUPABASE_URL.rstrip("/"),
        headers={"apikey": settings.SUPABASE_KEY},
        timeout=20,
    )


@router.post("/login")
def login(credentials: Credentials):
    with _client() as client:
        response = _request(
            client, "POST", "/auth/v1/token",
            params={"grant_type": "password"},
            json={"email": credentials.email.strip().lower(), "password": credentials.password},
        )
        if response.status_code in (400, 401, 422):
            raise HTTPException(401, "Invalid email or password, or email not confirmed")
        if response.status_code != 200:
            raise HTTPException(502, "Authentication service could not sign you in")
        session = response.json()
        access_token = session.get("access_token")
        refresh_token = session.get("refresh_token")
        if not access_token or not refresh_token:
            raise HTTPException(502, "Authentication service returned an incomplete session")
        account = _employee(client, access_token)
        return {"access_token": access_token, "refresh_token": refresh_token, **account}


@router.post("/signup")
def signup(credentials: Credentials):
    with _client() as client:
        response = _request(
            client, "POST", "/auth/v1/signup",
            json={"email": credentials.email.strip().lower(), "password": credentials.password},
        )
        if response.status_code in (400, 422):
            raise HTTPException(400, "Could not create account; check the email and password")
        if response.status_code not in (200, 201):
            raise HTTPException(502, "Authentication service could not create the account")
        session = response.json()
        access_token = session.get("access_token")
        refresh_token = session.get("refresh_token")
        if not access_token or not refresh_token:
            return {"confirmation_required": True}
        account = _employee(client, access_token)
        return {"confirmation_required": False, "access_token": access_token, "refresh_token": refresh_token, **account}


@router.get("/me")
def me(authorization: Annotated[str | None, Header()] = None):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Employee session required")
    token = authorization.removeprefix("Bearer ").strip()
    if not token:
        raise HTTPException(401, "Employee session required")
    with _client() as client:
        return _employee(client, token)


