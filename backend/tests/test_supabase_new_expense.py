import json
from io import BytesIO
from uuid import uuid4

import httpx
from fastapi.testclient import TestClient

from app.api.supabase_new_expense import get_gateway
from app.main import app
from app.services.supabase_expenses import SupabaseExpenseGateway


class FakeGateway:
    def __init__(self):
        self.drafts = {}
        self.claims = {}
        self.receipts = {}
        self.profile = {"id": str(uuid4()), "name": "Employee", "department": "Engineering", "role": "EMPLOYEE"}

    def employee(self):
        return self.profile

    def draft(self, expense_id):
        return self.drafts.get(str(expense_id))

    def claim(self, expense_id):
        return self.claims.get(str(expense_id))

    def save_draft(self, expense_id, employee_id, payload):
        row = {**self.drafts.get(str(expense_id), {}), **payload,
               "id": str(expense_id), "employee_id": employee_id}
        self.drafts[str(expense_id)] = row
        return row

    def delete_draft(self, expense_id, employee_id):
        self.drafts.pop(str(expense_id), None)

    def submit(self, expense_id, employee, draft):
        claim = {"id": str(expense_id), "employee_id": employee["id"], "status": "SUBMITTED",
                 "receipt_path": draft.get("receipt_path")}
        self.claims[str(expense_id)] = claim
        self.delete_draft(expense_id, employee["id"])
        return claim

    def upload(self, employee_id, expense_id, name, content):
        path = f"{employee_id}/{expense_id}/{name}"
        self.receipts[path] = content
        return {"receipt_path": path, "receipt_name": name,
                "receipt_content_type": "application/pdf", "receipt_size_bytes": len(content)}

    def remove_receipt(self, path):
        self.receipts.pop(path, None)


def test_new_expense_requires_session():
    with TestClient(app) as client:
        response = client.post("/api/employee/new-expense", data={"data": "{}", "action": "Draft"})
    assert response.status_code == 401


def test_supabase_draft_receipt_and_submit_flow():
    gateway = FakeGateway()
    app.dependency_overrides[get_gateway] = lambda: gateway
    expense_id = str(uuid4())
    try:
        with TestClient(app) as client:
            draft = client.post("/api/employee/new-expense", data={"data": json.dumps({"id": expense_id}), "action": "Draft"})
            assert draft.status_code == 200
            assert draft.json()["status"] == "Draft"
            assert gateway.drafts[expense_id]["employee_id"] == gateway.profile["id"]

            payload = {"id": expense_id, "merchant": "Train", "date": "2026-10-08", "amount": "499.50",
                       "category": "Travel", "payment_method": "Personal (Out-of-Pocket)",
                       "purpose": "Client visit", "attendees": ["Employee"]}
            submitted = client.post(
                "/api/employee/new-expense",
                data={"data": json.dumps(payload), "action": "Submit"},
                files={"file": ("ticket.pdf", BytesIO(b"%PDF-1.7\nreceipt"), "application/pdf")},
            )
            assert submitted.status_code == 200
            assert submitted.json()["status"] == "Pending"
            assert gateway.claims[expense_id]["status"] == "SUBMITTED"
            assert gateway.claims[expense_id]["receipt_path"] in gateway.receipts
            assert expense_id not in gateway.drafts
            assert client.post("/api/employee/new-expense", data={"data": json.dumps(payload), "action": "Submit"}).status_code == 409
    finally:
        app.dependency_overrides.clear()


def test_invalid_receipt_is_rejected_before_storage():
    gateway = SupabaseExpenseGateway("test-token")
    gateway.client.close()
    gateway.client = httpx.Client(
        base_url="https://example.supabase.co",
        transport=httpx.MockTransport(lambda request: httpx.Response(200, json={})),
    )
    try:
        from fastapi import HTTPException
        try:
            gateway.upload(str(uuid4()), uuid4(), "fake.pdf", b"not a pdf")
        except HTTPException as error:
            assert error.status_code == 422
        else:
            assert False, "Invalid receipt was accepted"
    finally:
        gateway.close()
