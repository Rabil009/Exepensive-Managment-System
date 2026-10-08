from pathlib import Path
from typing import Literal

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from fastapi.responses import FileResponse

from app.core.config import settings
from app.schemas.expense import ExpenseInput, ExpenseRecord
from app.services.expense_service import ExpenseStore


MAX_RECEIPT_BYTES = 25 * 1024 * 1024
RECEIPT_TYPES = {
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".heic": "image/heic",
}


def require_development() -> None:
    # Employee authentication will be added in a later phase. Until then, these
    # local demo endpoints must never be served in a deployed environment.
    if settings.ENVIRONMENT.lower() != "development" or not settings.EMPLOYEE_DEMO_API_ENABLED:
        raise HTTPException(status_code=503, detail="Employee API requires authentication before deployment")


def get_expense_store() -> ExpenseStore:
    return ExpenseStore()


router = APIRouter(
    prefix="/api/employee/expenses",
    tags=["employee-new-expense"],
    dependencies=[Depends(require_development)],
)


def require_draft(store: ExpenseStore, expense_id: str) -> ExpenseRecord:
    expense = store.get(expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    if expense.status != "Draft":
        raise HTTPException(status_code=409, detail="Only draft expenses can be changed")
    return expense


@router.post("/drafts", response_model=ExpenseRecord, status_code=201)
def create_draft(expense: ExpenseInput, store: ExpenseStore = Depends(get_expense_store)):
    return store.create_draft(expense)


@router.get("", response_model=list[ExpenseRecord])
def list_expenses(
    status: Literal["Draft", "Pending"] | None = None,
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    store: ExpenseStore = Depends(get_expense_store),
):
    return store.list(status, limit, offset)


@router.get("/{expense_id}", response_model=ExpenseRecord)
def get_expense(expense_id: str, store: ExpenseStore = Depends(get_expense_store)):
    expense = store.get(expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense


@router.put("/{expense_id}", response_model=ExpenseRecord)
def update_draft(
    expense_id: str, expense: ExpenseInput, store: ExpenseStore = Depends(get_expense_store)
):
    require_draft(store, expense_id)
    updated = store.update_draft(expense_id, expense)
    if not updated:
        raise HTTPException(status_code=409, detail="Draft changed; reload and try again")
    return updated


@router.post("/{expense_id}/submit", response_model=ExpenseRecord)
def submit_expense(expense_id: str, store: ExpenseStore = Depends(get_expense_store)):
    expense = require_draft(store, expense_id)
    if not (expense.merchant.strip() and expense.date and expense.category.strip() and expense.amount > 0):
        raise HTTPException(
            status_code=422,
            detail="Merchant, date, category, and a positive amount are required",
        )
    submitted = store.submit(expense_id)
    if not submitted:
        raise HTTPException(status_code=409, detail="Draft changed; reload and try again")
    return submitted


@router.delete("/{expense_id}", status_code=204)
def delete_draft(expense_id: str, store: ExpenseStore = Depends(get_expense_store)):
    require_draft(store, expense_id)
    if not store.delete_draft(expense_id):
        raise HTTPException(status_code=409, detail="Draft changed; reload and try again")


@router.post("/{expense_id}/receipt", response_model=ExpenseRecord)
async def upload_receipt(
    expense_id: str,
    file: UploadFile = File(...),
    store: ExpenseStore = Depends(get_expense_store),
):
    require_draft(store, expense_id)
    name = Path(file.filename or "").name
    suffix = Path(name).suffix.lower()
    if not name or len(name) > 200 or suffix not in RECEIPT_TYPES:
        raise HTTPException(status_code=422, detail="Choose a PDF, PNG, JPG, or HEIC receipt")
    content = await file.read(MAX_RECEIPT_BYTES + 1)
    if not content or len(content) > MAX_RECEIPT_BYTES:
        raise HTTPException(status_code=413, detail="Receipt must be between 1 byte and 25 MB")
    if not (
        (suffix == ".pdf" and content.startswith(b"%PDF-"))
        or (suffix == ".png" and content.startswith(b"\x89PNG\r\n\x1a\n"))
        or (suffix in {".jpg", ".jpeg"} and content.startswith(b"\xff\xd8\xff"))
        or (suffix == ".heic" and content[4:8] == b"ftyp")
    ):
        raise HTTPException(status_code=422, detail="Receipt content does not match its file type")
    updated = store.attach_receipt(expense_id, name, content, suffix)
    if not updated:
        raise HTTPException(status_code=409, detail="Draft changed; reload and try again")
    return updated


@router.get("/{expense_id}/receipt")
def download_receipt(expense_id: str, store: ExpenseStore = Depends(get_expense_store)):
    receipt = store.receipt(expense_id)
    if not receipt:
        raise HTTPException(status_code=404, detail="Receipt not found")
    path, name = receipt
    return FileResponse(path, filename=name, media_type=RECEIPT_TYPES[path.suffix.lower()])
