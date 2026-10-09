import httpx
from fastapi.testclient import TestClient

from app.api import employee_auth
from app.main import app


def test_employee_login_verifies_profile_before_returning_tokens(monkeypatch):
    calls = []

    def respond(request):
        calls.append(request.url.path)
        if request.url.path == "/auth/v1/token":
            return httpx.Response(200, json={"access_token": "access", "refresh_token": "refresh"})
        if request.url.path == "/auth/v1/user":
            assert request.headers["Authorization"] == "Bearer access"
            return httpx.Response(200, json={"id": "user-1", "email": "e@example.com"})
        if request.url.path == "/rest/v1/profiles":
            return httpx.Response(200, json=[{"id": "user-1", "name": "E", "role": "EMPLOYEE"}])
        raise AssertionError(request.url)

    monkeypatch.setattr(employee_auth, "_client", lambda: httpx.Client(transport=httpx.MockTransport(respond), base_url="https://test.supabase.co"))
    response = TestClient(app).post("/api/auth/employee/login", json={"email": "e@example.com", "password": "secret"})
    assert response.status_code == 200
    assert response.json()["profile"]["role"] == "EMPLOYEE"
    assert response.json()["access_token"] == "access"
    assert calls == ["/auth/v1/token", "/auth/v1/user", "/rest/v1/profiles"]


def test_nonemployee_login_never_returns_session(monkeypatch):
    def respond(request):
        if request.url.path == "/auth/v1/token":
            return httpx.Response(200, json={"access_token": "access", "refresh_token": "refresh"})
        if request.url.path == "/auth/v1/user":
            return httpx.Response(200, json={"id": "user-1", "email": "f@example.com"})
        return httpx.Response(200, json=[{"id": "user-1", "name": "F", "role": "FINANCE"}])

    monkeypatch.setattr(employee_auth, "_client", lambda: httpx.Client(transport=httpx.MockTransport(respond), base_url="https://test.supabase.co"))
    response = TestClient(app).post("/api/auth/employee/login", json={"email": "f@example.com", "password": "secret"})
    assert response.status_code == 403
    assert "access_token" not in response.text


def test_me_requires_session():
    response = TestClient(app).get("/api/auth/employee/me")
    assert response.status_code == 401


def test_login_with_missing_profile_returns_structured_error_without_tokens(monkeypatch):
    def respond(request):
        if request.url.path == "/auth/v1/token":
            return httpx.Response(200, json={"access_token": "access", "refresh_token": "refresh"})
        if request.url.path == "/auth/v1/user":
            return httpx.Response(200, json={"id": "user-1", "email": "e@example.com"})
        return httpx.Response(200, json=[])

    monkeypatch.setattr(employee_auth, "_client", lambda: httpx.Client(transport=httpx.MockTransport(respond), base_url="https://test.supabase.co"))
    response = TestClient(app).post("/api/auth/employee/login", json={"email": "e@example.com", "password": "secret"})
    assert response.status_code == 404
    assert response.json() == {"detail": "Employee profile not found"}
    assert "access_token" not in response.text
