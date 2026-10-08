"""Authenticated Employee data for Overview, Cards, Analytics, and Reports."""

from decimal import Decimal
from typing import Annotated, Literal
from uuid import UUID

from fastapi import APIRouter, Depends, Header, HTTPException, Query
from pydantic import BaseModel, Field

from app.services.employee_workspace import EmployeeWorkspaceGateway, analytics, card_usage, current_month, report_groups


router = APIRouter(prefix="/api/employee", tags=["employee-workspace"])


def workspace(authorization: Annotated[str | None, Header()] = None):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Employee session required")
    token = authorization.removeprefix("Bearer ").strip()
    if not token:
        raise HTTPException(401, "Employee session required")
    gateway = EmployeeWorkspaceGateway(token)
    try:
        yield gateway
    finally:
        gateway.close()


def employee_id(gateway: EmployeeWorkspaceGateway) -> str:
    return gateway.employee()["id"]


@router.get("/overview")
def overview(gateway: EmployeeWorkspaceGateway = Depends(workspace)):
    owner = employee_id(gateway)
    expenses = gateway.expenses(owner)
    cards = gateway.cards(owner)
    transactions = gateway.card_transactions(owner)
    month = current_month()
    card_spend = sum(
        Decimal(str(row["amount"]))
        for row in transactions
        if row["transaction_date"].startswith(month) and row["status"] == "SETTLED"
    )
    card_limit = sum(Decimal(str(row["monthly_limit"])) for row in cards if row["active"])
    ready = sum(Decimal(str(row["amount"])) for row in expenses if row["status"] == "Approved")
    pending = sum(Decimal(str(row["amount"])) for row in expenses if row["status"] == "Pending")
    return {
        "expenses": expenses,
        "summary": {
            "ready_for_reimbursement": str(ready),
            "pending_approval": str(pending),
            "card_spending_mtd": str(card_spend),
            "card_limit": str(card_limit),
            "card_limit_remaining": str(max(Decimal(0), card_limit - card_spend)),
            "approved_count": sum(row["status"] == "Approved" for row in expenses),
            "pending_count": sum(row["status"] == "Pending" for row in expenses),
        },
    }


@router.get("/analytics")
def employee_analytics(
    month: str = Query(default_factory=current_month, pattern=r"^\d{4}-(0[1-9]|1[0-2])$"),
    gateway: EmployeeWorkspaceGateway = Depends(workspace),
):
    owner = employee_id(gateway)
    return analytics(gateway.expenses(owner), gateway.cards(owner), gateway.card_transactions(owner), month)


@router.get("/reports")
def reports(gateway: EmployeeWorkspaceGateway = Depends(workspace)):
    return {"reports": report_groups(gateway.expenses(employee_id(gateway)))}


class ReportAction(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    action: Literal["withdraw", "submit"]


@router.post("/reports/action")
def change_report(data: ReportAction, gateway: EmployeeWorkspaceGateway = Depends(workspace)):
    employee_id(gateway)
    response = gateway.request(
        "POST", "/rest/v1/rpc/employee_change_report_status",
        json={"p_report_name": data.name, "p_action": data.action},
    )
    return {"changed": response.json()}


@router.get("/cards")
def cards(gateway: EmployeeWorkspaceGateway = Depends(workspace)):
    owner = employee_id(gateway)
    assigned = gateway.cards(owner)
    transactions = gateway.card_transactions(owner)
    return {
        "cards": assigned,
        "transactions": transactions,
        "requests": gateway.card_requests(owner),
        "usage": card_usage(assigned, transactions, gateway.category_limits(owner), current_month()),
    }


class CardControls(BaseModel):
    active: bool | None = None
    frozen: bool | None = None
    wallet_enabled: bool | None = None
    travel_limits_enabled: bool | None = None
    online_verification_enabled: bool | None = None
    atm_lock_enabled: bool | None = None


@router.patch("/cards/{card_id}")
def update_card(card_id: UUID, data: CardControls, gateway: EmployeeWorkspaceGateway = Depends(workspace)):
    owner = employee_id(gateway)
    patch = data.model_dump(exclude_unset=True)
    if not patch or any(value is None for value in patch.values()):
        raise HTTPException(422, "Select at least one card control")
    cards = gateway.request(
        "PATCH", "/rest/v1/employee_cards",
        params={"id": f"eq.{card_id}", "employee_id": f"eq.{owner}"},
        headers={"Prefer": "return=representation"}, json=patch,
    ).json()
    if not cards:
        raise HTTPException(404, "Card not found")
    return cards[0]


class CardRequest(BaseModel):
    request_type: Literal["LIMIT_INCREASE", "VIRTUAL_CARD"]
    requested_limit: Decimal = Field(gt=0, max_digits=15, decimal_places=2)
    card_id: UUID | None = None
    card_name: str | None = Field(default=None, min_length=1, max_length=100)


@router.post("/cards/requests", status_code=201)
def create_card_request(data: CardRequest, gateway: EmployeeWorkspaceGateway = Depends(workspace)):
    owner = employee_id(gateway)
    if data.request_type == "LIMIT_INCREASE":
        card = next((row for row in gateway.cards(owner) if row["id"] == str(data.card_id)), None)
        if not card:
            raise HTTPException(404, "Card not found")
        if data.requested_limit <= Decimal(str(card["monthly_limit"])):
            raise HTTPException(422, "Requested limit must exceed the current limit")
        if data.card_name is not None:
            raise HTTPException(422, "Card name is only for virtual card requests")
    elif data.card_id is not None or not data.card_name or not data.card_name.strip():
        raise HTTPException(422, "Enter a name for the virtual card request")
    created = gateway.request(
        "POST", "/rest/v1/employee_card_requests",
        headers={"Prefer": "return=representation"},
        json={
            "employee_id": owner,
            "request_type": data.request_type,
            "requested_limit": str(data.requested_limit),
            "card_id": str(data.card_id) if data.card_id else None,
            "card_name": data.card_name.strip() if data.card_name else None,
        },
    ).json()
    return created[0]
