"""Employee-scoped New Expense persistence through Supabase's RLS APIs."""

import logging
from pathlib import Path
from uuid import UUID

import httpx
from fastapi import HTTPException

from app.core.config import settings


CATEGORIES = {
    "Travel": "TRAVEL",
    "Food": "MEALS",
    "Accommodation": "HOTEL",
    "Office": "OFFICE",
    "Software": "SOFTWARE",
    "Other": "OTHER",
}
CONTENT_TYPES = {
    ".pdf": ("application/pdf", b"%PDF-"),
    ".png": ("image/png", b"\x89PNG\r\n\x1a\n"),
    ".jpg": ("image/jpeg", b"\xff\xd8\xff"),
    ".jpeg": ("image/jpeg", b"\xff\xd8\xff"),
    ".heic": ("image/heic", None),
}
MAX_RECEIPT_BYTES = 25 * 1024 * 1024
logger = logging.getLogger(__name__)


class SupabaseExpenseGateway:
    def __init__(self, token: str):
        self.token = token
        self.client = httpx.Client(
            base_url=settings.SUPABASE_URL.rstrip("/"),
            headers={"apikey": settings.SUPABASE_KEY, "Authorization": f"Bearer {token}"},
            timeout=30,
        )

    def close(self):
        self.client.close()

    def request(self, method: str, path: str, **kwargs):
        try:
            response = self.client.request(method, path, **kwargs)
        except httpx.RequestError as exc:
            raise HTTPException(502, "Supabase is unavailable; please try again") from exc
        if response.status_code >= 400:
            if response.status_code in (401, 403):
                raise HTTPException(401, "Employee session expired or access denied")
            if response.status_code == 409:
                raise HTTPException(409, "Expense changed; reload and try again")
            if response.status_code < 500:
                raise HTTPException(422, "Supabase rejected the expense data")
            raise HTTPException(502, "Supabase could not save the expense")
        return response

    def employee(self):
        try:
            user = self.request("GET", "/auth/v1/user").json()
        except ValueError:
            raise HTTPException(502, "Authentication service returned invalid data")
        if not isinstance(user, dict):
            raise HTTPException(502, "Authentication service returned invalid data")
        user_id = user.get("id")
        if not user_id:
            raise HTTPException(401, "Employee session required")
        try:
            rows = self.request(
                "GET", "/rest/v1/profiles",
                params={"id": f"eq.{user_id}", "select": "id,name,department,role"},
            ).json()
        except ValueError:
            raise HTTPException(502, "Employee profile service returned invalid data")
        if not isinstance(rows, list):
            raise HTTPException(502, "Employee profile service returned invalid data")
        if not rows:
            raise HTTPException(404, "Employee profile not found")
        profile = rows[0]
        if not isinstance(profile, dict) or profile.get("id") != user_id:
            raise HTTPException(502, "Employee profile service returned invalid data")
        if profile.get("role") != "EMPLOYEE":
            raise HTTPException(403, "An Employee profile is required")
        return profile

    def draft(self, expense_id: UUID):
        rows = self.request(
            "GET", "/rest/v1/employee_expense_drafts",
            params={"id": f"eq.{expense_id}", "select": "*"},
        ).json()
        return rows[0] if rows else None

    def save_draft(self, expense_id: UUID, employee_id: str, payload: dict):
        existing = self.draft(expense_id)
        if existing and existing["employee_id"] != employee_id:
            raise HTTPException(404, "Draft not found")
        if existing:
            rows = self.request(
                "PATCH", "/rest/v1/employee_expense_drafts",
                params={"id": f"eq.{expense_id}", "employee_id": f"eq.{employee_id}"},
                headers={"Prefer": "return=representation"}, json=payload,
            ).json()
        else:
            rows = self.request(
                "POST", "/rest/v1/employee_expense_drafts",
                headers={"Prefer": "return=representation"},
                json={"id": str(expense_id), "employee_id": employee_id, **payload},
            ).json()
        if not rows:
            raise HTTPException(409, "Draft changed; reload and try again")
        return rows[0]

    def delete_draft(self, expense_id: UUID, employee_id: str):
        self.request(
            "DELETE", "/rest/v1/employee_expense_drafts",
            params={"id": f"eq.{expense_id}", "employee_id": f"eq.{employee_id}"},
        )

    def claim(self, expense_id: UUID):
        rows = self.request(
            "GET", "/rest/v1/expense_claims",
            params={"id": f"eq.{expense_id}", "select": "id,employee_id,status"},
        ).json()
        return rows[0] if rows else None

    def linked_transaction(self, transaction_id: UUID, employee_id: str):
        rows = self.request(
            "GET", "/rest/v1/employee_card_transactions",
            params={"id": f"eq.{transaction_id}", "employee_id": f"eq.{employee_id}",
                    "select": "id,employee_id,amount,currency,status"},
        ).json()
        return rows[0] if rows else None

    def submit(self, expense_id: UUID, employee: dict, draft: dict):
        if not (draft.get("merchant") and draft.get("expense_date") and
                draft.get("category") in CATEGORIES and float(draft.get("amount") or 0) > 0):
            raise HTTPException(422, "Merchant, date, category, and a positive amount are required")
        if self.claim(expense_id):
            raise HTTPException(409, "Expense has already been submitted")
        payment_label = draft.get("payment_method") or ""
        payment_method = "PERSONAL_OUT_OF_POCKET" if payment_label.startswith("Personal") else "CORPORATE_CARD"
        claim = {
            "id": str(expense_id), "employee_id": employee["id"],
            "employee_name": employee["name"], "employee_department": employee["department"],
            "title": draft["merchant"], "merchant": draft["merchant"],
            "description": draft.get("business_purpose") or "",
            "amount": draft["amount"], "currency": "INR",
            "category": CATEGORIES[draft["category"]], "payment_method": payment_method,
            "expense_date": draft["expense_date"], "report_name": draft.get("report_name"),
            "attendees": draft.get("attendees") or [],
            "linked_transaction_id": draft.get("linked_transaction_id"),
            "card_last4": draft.get("card_last4") if payment_method == "CORPORATE_CARD" else None,
            "receipt_path": draft.get("receipt_path"), "receipt_name": draft.get("receipt_name"),
            "receipt_content_type": draft.get("receipt_content_type"),
            "receipt_size_bytes": draft.get("receipt_size_bytes"),
            "status": "SUBMITTED",
        }
        rows = self.request(
            "POST", "/rest/v1/expense_claims",
            headers={"Prefer": "return=representation"}, json=claim,
        ).json()
        if not rows:
            raise HTTPException(502, "Supabase did not confirm the expense submission")
        try:
            self.delete_draft(expense_id, employee["id"])
        except HTTPException:
            logger.warning("Submitted claim %s still has an Employee draft", expense_id)
        return rows[0]

    def upload(self, employee_id: str, expense_id: UUID, name: str, content: bytes):
        safe_name = Path(name).name
        suffix = Path(safe_name).suffix.lower()
        if not safe_name or len(safe_name) > 200 or suffix not in CONTENT_TYPES:
            raise HTTPException(422, "Choose a PDF, PNG, JPG, or HEIC receipt")
        if not content or len(content) > MAX_RECEIPT_BYTES:
            raise HTTPException(413, "Receipt must be between 1 byte and 25 MB")
        content_type, signature = CONTENT_TYPES[suffix]
        if signature and not content.startswith(signature):
            raise HTTPException(422, "Receipt content does not match its file type")
        if suffix == ".heic" and content[4:8] != b"ftyp":
            raise HTTPException(422, "Receipt content does not match its file type")
        from uuid import uuid4
        path = f"{employee_id}/{expense_id}/{uuid4().hex}{suffix}"
        self.request(
            "POST", f"/storage/v1/object/receipts/{path}",
            headers={"Content-Type": content_type, "x-upsert": "false"}, content=content,
        )
        return {"receipt_path": path, "receipt_name": safe_name,
                "receipt_content_type": content_type, "receipt_size_bytes": len(content)}

    def remove_receipt(self, path: str):
        self.request("DELETE", "/storage/v1/object/receipts", json={"prefixes": [path]})
