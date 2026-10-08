"""New Expense routes backed by the Team Blue Supabase project."""

import json
import logging
import re
from decimal import Decimal
from typing import Annotated, Literal
from uuid import UUID
from pathlib import Path
from urllib.parse import quote

from fastapi import APIRouter, Depends, File, Form, Header, HTTPException, Response, UploadFile
from pydantic import BaseModel, Field, ValidationError

from app.services.supabase_expenses import CATEGORIES, MAX_RECEIPT_BYTES, SupabaseExpenseGateway

logger = logging.getLogger(__name__)

class NewExpenseInput(BaseModel):
    id: UUID
    merchant: str = Field(default="", max_length=200)
    date: str = ""
    amount: Decimal = Field(default=Decimal("0"), ge=0, max_digits=15, decimal_places=2)
    category: str = ""
    report: str = Field(default="", max_length=200)
    payment_method: str = Field(default="", max_length=100)
    purpose: str = Field(default="", max_length=5000)
    attendees: list[str] = Field(default_factory=list, max_length=50)
    linked_transaction_id: UUID | None = None

    def draft_row(self):
        if self.category and self.category not in CATEGORIES:
            raise HTTPException(422, "Select a valid category")
        if self.date:
            from datetime import date
            try:
                date.fromisoformat(self.date)
            except ValueError as exc:
                raise HTTPException(422, "Enter a valid expense date") from exc
        last4 = None
        if self.payment_method and not self.payment_method.startswith("Personal"):
            match = re.search(r"(\d{4})\)?$", self.payment_method)
            last4 = match.group(1) if match else None
        return {
            "merchant": self.merchant.strip() or None,
            "expense_date": self.date or None,
            "amount": str(self.amount), "currency": "INR",
            "category": self.category or None,
            "report_name": self.report or None,
            "payment_method": self.payment_method or None,
            "card_last4": last4,
            "business_purpose": self.purpose or None,
            "attendees": self.attendees,
            "linked_transaction_id": str(self.linked_transaction_id) if self.linked_transaction_id else None,
        }


def get_gateway(authorization: Annotated[str | None, Header()] = None):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Employee session required")
    gateway = SupabaseExpenseGateway(authorization.removeprefix("Bearer ").strip())
    try:
        yield gateway
    finally:
        gateway.close()


router = APIRouter(prefix="/api/employee/new-expense", tags=["employee-new-expense-supabase"])


@router.get("/options")
def expense_options(gateway: SupabaseExpenseGateway = Depends(get_gateway)):
    owner = gateway.employee()["id"]
    transactions = gateway.request(
        "GET", "/rest/v1/employee_card_transactions",
        params={"employee_id": f"eq.{owner}", "select": "id,card_id,transaction_date,merchant,purpose,amount,currency,status",
                "status": "in.(PENDING,SETTLED)", "order": "transaction_date.desc", "limit": 100},
    ).json()
    claims = gateway.request(
        "GET", "/rest/v1/expense_claims",
        params={"employee_id": f"eq.{owner}", "select": "report_name,linked_transaction_id"},
    ).json()
    drafts = gateway.request(
        "GET", "/rest/v1/employee_expense_drafts",
        params={"employee_id": f"eq.{owner}", "select": "report_name,linked_transaction_id"},
    ).json()
    linked = {row["linked_transaction_id"] for row in claims + drafts if row.get("linked_transaction_id")}
    return {
        "categories": list(CATEGORIES),
        "reports": sorted({row["report_name"] for row in claims + drafts if row.get("report_name")}),
        "unlinked_transactions": [row for row in transactions if row["id"] not in linked],
    }


@router.get("/receipts/{expense_id}")
def download_receipt(expense_id: UUID, gateway: SupabaseExpenseGateway = Depends(get_gateway)):
    owner = gateway.employee()["id"]
    params = {"id": f"eq.{expense_id}", "employee_id": f"eq.{owner}",
              "select": "receipt_path,receipt_name,receipt_content_type"}
    claims = gateway.request("GET", "/rest/v1/expense_claims", params=params).json()
    drafts = [] if claims else gateway.request("GET", "/rest/v1/employee_expense_drafts", params=params).json()
    record = (claims or drafts or [None])[0]
    if not record or not record.get("receipt_path"):
        raise HTTPException(404, "Receipt not found")
    path = record["receipt_path"]
    if not path.startswith(f"{owner}/{expense_id}/"):
        raise HTTPException(404, "Receipt not found")
    file = gateway.request("GET", f"/storage/v1/object/authenticated/receipts/{path}")
    filename = Path(record.get("receipt_name") or "receipt").name
    return Response(
        content=file.content,
        media_type=record.get("receipt_content_type") or "application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename*=UTF-8''{quote(filename)}"},
    )


@router.patch("/claims/{expense_id}")
def complete_claim(
    expense_id: UUID,
    report: Annotated[str | None, Form()] = None,
    file: UploadFile | None = File(default=None),
    gateway: SupabaseExpenseGateway = Depends(get_gateway),
):
    """Let an Employee complete documentation while their claim awaits review."""
    employee = gateway.employee()
    if report is None and file is None:
        raise HTTPException(422, "Choose a report or receipt to update")
    rows = gateway.request(
        "GET", "/rest/v1/expense_claims",
        params={"id": f"eq.{expense_id}", "employee_id": f"eq.{employee['id']}",
                "select": "id,status,receipt_path"},
    ).json()
    if not rows:
        raise HTTPException(404, "Expense not found")
    claim = rows[0]
    previous_receipt_path = claim.get("receipt_path")
    if claim["status"] != "SUBMITTED":
        raise HTTPException(409, "Only submitted expenses awaiting review can be updated")
    patch = {}
    if report is not None:
        if not report.strip() or len(report) > 200:
            raise HTTPException(422, "Enter a valid report name")
        patch["report_name"] = report.strip()
    uploaded_path = None
    if file is not None:
        content = file.file.read(MAX_RECEIPT_BYTES + 1)
        receipt = gateway.upload(employee["id"], expense_id, file.filename or "", content)
        patch.update(receipt)
        uploaded_path = receipt["receipt_path"]
    try:
        updated = gateway.request(
            "PATCH", "/rest/v1/expense_claims",
            params={"id": f"eq.{expense_id}", "employee_id": f"eq.{employee['id']}", "status": "eq.SUBMITTED"},
            headers={"Prefer": "return=representation"}, json=patch,
        ).json()
        if not updated:
            raise HTTPException(409, "Expense changed; reload and try again")
    except Exception:
        if uploaded_path:
            try:
                gateway.remove_receipt(uploaded_path)
            except HTTPException:
                logger.warning("Could not remove receipt after claim update failed")
        raise
    if uploaded_path and previous_receipt_path:
        try:
            gateway.remove_receipt(previous_receipt_path)
        except HTTPException:
            logger.warning("Could not remove replaced receipt for claim %s", expense_id)
    return updated[0]


@router.get("/{expense_id}")
def get_draft(expense_id: UUID, gateway: SupabaseExpenseGateway = Depends(get_gateway)):
    employee = gateway.employee()
    draft = gateway.draft(expense_id)
    if not draft or draft["employee_id"] != employee["id"]:
        raise HTTPException(404, "Draft not found")
    return draft


@router.post("")
def save_expense(
    data: Annotated[str, Form()],
    action: Annotated[Literal["Draft", "Submit"], Form()],
    file: UploadFile | None = File(default=None),
    gateway: SupabaseExpenseGateway = Depends(get_gateway),
):
    try:
        expense = NewExpenseInput.model_validate(json.loads(data))
    except (ValueError, ValidationError) as exc:
        raise HTTPException(422, "Enter valid expense details") from exc
    row = expense.draft_row()
    if action == "Submit" and not (
        row["merchant"] and row["expense_date"] and row["category"] and expense.amount > 0
    ):
        raise HTTPException(422, "Merchant, date, category, and a positive amount are required")
    employee = gateway.employee()
    if expense.linked_transaction_id:
        transaction = gateway.linked_transaction(expense.linked_transaction_id, employee["id"])
        if not transaction or transaction["status"] == "DECLINED" or Decimal(str(transaction["amount"])) != expense.amount:
            raise HTTPException(422, "Linked card transaction is unavailable or its amount differs")
        if transaction["currency"] != "INR":
            raise HTTPException(422, "Linked card transaction must be in INR")
    existing = gateway.draft(expense.id)
    if existing and existing["employee_id"] != employee["id"]:
        raise HTTPException(404, "Draft not found")
    if gateway.claim(expense.id):
        raise HTTPException(409, "Expense has already been submitted")

    uploaded_path = None
    if file is not None:
        content = file.file.read(MAX_RECEIPT_BYTES + 1)
        receipt = gateway.upload(employee["id"], expense.id, file.filename or "", content)
        row.update(receipt)
        uploaded_path = receipt["receipt_path"]
    try:
        draft = gateway.save_draft(expense.id, employee["id"], row)
    except Exception:
        if uploaded_path:
            try:
                gateway.remove_receipt(uploaded_path)
            except HTTPException:
                logger.warning("Could not remove receipt after draft save failed")
        raise
    if uploaded_path and existing and existing.get("receipt_path"):
        try:
            gateway.remove_receipt(existing["receipt_path"])
        except HTTPException:
            logger.warning("Could not remove replaced receipt for draft %s", expense.id)
    if action == "Draft":
        return {"id": str(expense.id), "status": "Draft", "draft": draft}
    claim = gateway.submit(expense.id, employee, draft)
    return {"id": str(expense.id), "status": "Pending", "claim": claim}


@router.delete("/{expense_id}", status_code=204)
def discard_draft(expense_id: UUID, gateway: SupabaseExpenseGateway = Depends(get_gateway)):
    employee = gateway.employee()
    draft = gateway.draft(expense_id)
    if not draft or draft["employee_id"] != employee["id"]:
        raise HTTPException(404, "Draft not found")
    gateway.delete_draft(expense_id, employee["id"])
    if draft.get("receipt_path"):
        try:
            gateway.remove_receipt(draft["receipt_path"])
        except HTTPException:
            logger.warning("Could not remove receipt for discarded draft %s", expense_id)
