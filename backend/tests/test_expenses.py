from io import BytesIO

from fastapi.testclient import TestClient

from app.api.expenses import get_expense_store
from app.core.config import settings
from app.main import app
from app.services.expense_service import ExpenseStore


def make_client(tmp_path):
    store = ExpenseStore(tmp_path / "expenses.sqlite3", tmp_path / "receipts")
    app.dependency_overrides[get_expense_store] = lambda: store
    return TestClient(app)


def test_new_expense_draft_receipt_and_submission(tmp_path, monkeypatch):
    monkeypatch.setattr(settings, "ENVIRONMENT", "development")
    monkeypatch.setattr(settings, "EMPLOYEE_DEMO_API_ENABLED", True)
    with make_client(tmp_path) as client:
        created = client.post("/api/employee/expenses/drafts", json={})
        assert created.status_code == 201
        expense_id = created.json()["id"]
        assert created.json()["status"] == "Draft"

        incomplete = client.post(f"/api/employee/expenses/{expense_id}/submit")
        assert incomplete.status_code == 422

        updated = client.put(
            f"/api/employee/expenses/{expense_id}",
            json={
                "date": "2026-10-08",
                "merchant": "Rail ticket",
                "category": "Travel",
                "amount": "499.50",
                "description": "Client visit",
            },
        )
        assert updated.status_code == 200
        assert updated.json()["amount"] == "499.50"

        uploaded = client.post(
            f"/api/employee/expenses/{expense_id}/receipt",
            files={"file": ("ticket.pdf", BytesIO(b"%PDF-1.7\nreceipt"), "application/pdf")},
        )
        assert uploaded.status_code == 200
        assert uploaded.json()["receipt_name"] == "ticket.pdf"
        receipt = client.get(f"/api/employee/expenses/{expense_id}/receipt")
        assert receipt.status_code == 200
        assert receipt.content == b"%PDF-1.7\nreceipt"

        submitted = client.post(f"/api/employee/expenses/{expense_id}/submit")
        assert submitted.status_code == 200
        assert submitted.json()["status"] == "Pending"
        assert submitted.json()["submitted_at"] is not None
        assert client.get("/api/employee/expenses", params={"status": "Pending"}).json()[0]["id"] == expense_id
        assert client.put(f"/api/employee/expenses/{expense_id}", json={}).status_code == 409
        assert client.delete(f"/api/employee/expenses/{expense_id}").status_code == 409


def test_receipt_validation_and_draft_discard(tmp_path, monkeypatch):
    monkeypatch.setattr(settings, "ENVIRONMENT", "development")
    monkeypatch.setattr(settings, "EMPLOYEE_DEMO_API_ENABLED", True)
    with make_client(tmp_path) as client:
        expense_id = client.post("/api/employee/expenses/drafts", json={}).json()["id"]
        invalid = client.post(
            f"/api/employee/expenses/{expense_id}/receipt",
            files={"file": ("fake.pdf", b"not a PDF", "application/pdf")},
        )
        assert invalid.status_code == 422
        assert list((tmp_path / "receipts").iterdir()) == []
        assert client.delete(f"/api/employee/expenses/{expense_id}").status_code == 204
        assert client.get(f"/api/employee/expenses/{expense_id}").status_code == 404


def test_employee_api_disabled_outside_local_development(tmp_path, monkeypatch):
    monkeypatch.setattr(settings, "ENVIRONMENT", "production")
    monkeypatch.setattr(settings, "EMPLOYEE_DEMO_API_ENABLED", True)
    with make_client(tmp_path) as client:
        response = client.post("/api/employee/expenses/drafts", json={})
        assert response.status_code == 503
        assert client.get("/api/employee/expenses").status_code == 503

    monkeypatch.setattr(settings, "ENVIRONMENT", "development")
    monkeypatch.setattr(settings, "EMPLOYEE_DEMO_API_ENABLED", False)
    with make_client(tmp_path) as client:
        assert client.get("/api/employee/expenses").status_code == 503
