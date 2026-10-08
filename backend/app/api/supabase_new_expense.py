"""New Expense routes backed by the Team Blue Supabase project."""

import json
import logging
import re
from decimal import Decimal
from typing import Annotated, Literal
from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, Header, HTTPException, UploadFile
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
    linked_transaction_id: str | None = None

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
            "linked_transaction_id": self.linked_transaction_id,
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
