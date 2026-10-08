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

    def linked_transaction(self, transaction_id, employee_id):
        return {"id": str(transaction_id), "employee_id": employee_id,
                "status": "SETTLED", "amount": "10.00", "currency": "INR"}


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


def test_linked_transaction_amount_must_match():
    gateway = FakeGateway()
    app.dependency_overrides[get_gateway] = lambda: gateway
    try:
        with TestClient(app) as client:
            response = client.post(
                "/api/employee/new-expense",
                data={"action": "Submit", "data": json.dumps({
                    "id": str(uuid4()), "merchant": "Hotel", "date": "2026-10-08",
                    "amount": "20.00", "category": "Accommodation",
                    "linked_transaction_id": str(uuid4()),
                })},
            )
            assert response.status_code == 422
            assert not gateway.claims
    finally:
        app.dependency_overrides.clear()


def test_receipt_download_checks_owner_and_private_path():
    gateway = FakeGateway()
    expense_id = uuid4()
    path = f"{gateway.profile['id']}/{expense_id}/receipt.pdf"
    requested = []

    class Response:
        def __init__(self, rows=None, content=b""):
            self.rows = rows
            self.content = content

        def json(self):
            return self.rows

    def request(method, url, **kwargs):
        requested.append(url)
        if url == "/rest/v1/expense_claims":
            assert kwargs["params"]["employee_id"] == f"eq.{gateway.profile['id']}"
            return Response([{"receipt_path": path, "receipt_name": "receipt.pdf", "receipt_content_type": "application/pdf"}])
        if url == f"/storage/v1/object/authenticated/receipts/{path}":
            return Response(content=b"%PDF-1.7\nreceipt")
        raise AssertionError(url)

    gateway.request = request
    app.dependency_overrides[get_gateway] = lambda: gateway
    try:
        with TestClient(app) as client:
            response = client.get(f"/api/employee/new-expense/receipts/{expense_id}")
            assert response.status_code == 200
            assert response.content.startswith(b"%PDF")
            assert response.headers["content-type"] == "application/pdf"
            assert requested[-1].startswith("/storage/v1/object/authenticated/receipts/")
    finally:
        app.dependency_overrides.clear()


def test_receipt_download_rejects_foreign_storage_path():
    gateway = FakeGateway()
    gateway.request = lambda method, url, **kwargs: type("Response", (), {
        "json": lambda self: [{"receipt_path": f"{uuid4()}/{uuid4()}/other.pdf", "receipt_name": "other.pdf"}],
    })()
    app.dependency_overrides[get_gateway] = lambda: gateway
    try:
        with TestClient(app) as client:
            assert client.get(f"/api/employee/new-expense/receipts/{uuid4()}").status_code == 404
    finally:
        app.dependency_overrides.clear()


def test_supabase_gateway_sends_receipt_and_claim_with_employee_token():
    requests = []

    def respond(request):
        requests.append(request)
        if request.url.path.startswith("/storage/v1/object/receipts/"):
            return httpx.Response(200, json={"Key": request.url.path})
        if request.url.path == "/rest/v1/expense_claims" and request.method == "GET":
            return httpx.Response(200, json=[])
        if request.url.path == "/rest/v1/expense_claims" and request.method == "POST":
            return httpx.Response(201, json=[json.loads(request.content)])
        if request.url.path == "/rest/v1/employee_expense_drafts" and request.method == "DELETE":
            return httpx.Response(204)
        raise AssertionError(f"Unexpected Supabase request: {request.method} {request.url}")

    gateway = SupabaseExpenseGateway("employee-token")
    gateway.client.close()
    gateway.client = httpx.Client(
        base_url="https://example.supabase.co",
        headers={"Authorization": "Bearer employee-token"},
        transport=httpx.MockTransport(respond),
    )
    employee = {"id": str(uuid4()), "name": "Employee", "department": "Engineering"}
    expense_id = uuid4()
    try:
        receipt = gateway.upload(employee["id"], expense_id, "ticket.pdf", b"%PDF-1.7\nreceipt")
        draft = {"merchant": "Train", "expense_date": "2026-10-08", "category": "Travel",
                 "amount": "499.50", "payment_method": "Personal (Out-of-Pocket)",
                 "business_purpose": "Client visit", "attendees": ["Employee"], **receipt}
        claim = gateway.submit(expense_id, employee, draft)
        assert claim["category"] == "TRAVEL"
        assert claim["payment_method"] == "PERSONAL_OUT_OF_POCKET"
        assert claim["receipt_path"] == receipt["receipt_path"]
        assert claim["status"] == "SUBMITTED"
        assert all(request.headers["Authorization"] == "Bearer employee-token" for request in requests)
        assert any(request.url.path.endswith(receipt["receipt_path"]) for request in requests)
    finally:
        gateway.close()
