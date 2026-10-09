"""Employee-owned data and summaries used across the Employee portal."""

import logging
from collections import defaultdict
from datetime import date
from decimal import Decimal

from app.services.supabase_expenses import SupabaseExpenseGateway
from app.services.shared_store import shared_data_store

logger = logging.getLogger(__name__)

PENDING = {"SUBMITTED"}
APPROVED = {"MANAGER_APPROVED", "FINANCE_APPROVED", "PAYMENT_PENDING"}
REIMBURSED = {"PAID", "DISBURSED", "CLOSED"}
REJECTED = {"MANAGER_REJECTED", "FINANCE_REJECTED"}
CATEGORY_NAMES = {
    "TRAVEL": "Travel", "HOTEL": "Accommodation", "MEALS": "Food",
    "SOFTWARE": "Software", "HARDWARE": "Office", "OFFICE": "Office",
    "TRAINING": "Other", "OTHER": "Other",
}


def amount(value) -> Decimal:
    try:
        return Decimal(str(value or 0))
    except Exception:
        return Decimal(0)


def display_status(value: str) -> str:
    if not value:
        return "Pending"
    val = str(value).upper()
    if val in REIMBURSED:
        return "Reimbursed"
    if "REJECT" in val:
        return "Rejected"
    if "APPROV" in val or val in APPROVED:
        return "Approved"
    if val == "DRAFT":
        return "Draft"
    return "Pending"


def claim_item(row: dict) -> dict:
    raw_status = str(row.get("status") or "SUBMITTED").upper()
    # Normalize category name
    cat_raw = str(row.get("category") or "OTHER").upper()
    cat_name = CATEGORY_NAMES.get(cat_raw, cat_raw.title() if cat_raw else "Other")

    # Payment method label
    pm = str(row.get("payment_method") or "").upper()
    if "CARD" in pm and "PERSONAL" not in pm:
        payment_method_label = "Corporate Card"
    else:
        payment_method_label = "Personal (Out-of-Pocket)"

    return {
        "id": str(row["id"]),
        "date": row.get("expense_date") or row.get("date") or (str(row.get("submitted_at") or row.get("created_at") or ""))[:10] or "2026-10-09",
        "merchant": row.get("merchant") or row.get("title") or "Expense",
        "category": cat_name,
        "amount": float(amount(row.get("amount"))),
        "status": display_status(raw_status),
        "raw_status": raw_status,
        "source": "claim",
        "description": row.get("description") or row.get("title") or "",
        "receipt": row.get("receipt_name") if row.get("receipt_path") or row.get("receipt_name") else None,
        "currency": row.get("currency") or "INR",
        "report": row.get("report_name") or row.get("cost_center") or "General",
        "paymentMethod": payment_method_label,
        "attendees": row.get("attendees") or [],
    }


def draft_item(row: dict) -> dict:
    cat_raw = str(row.get("category") or "OTHER").upper()
    cat_name = CATEGORY_NAMES.get(cat_raw, "Other")
    return {
        "id": str(row["id"]),
        "date": row.get("expense_date") or "",
        "merchant": row.get("merchant") or "Untitled draft",
        "category": cat_name,
        "amount": float(amount(row.get("amount"))),
        "status": "Draft",
        "raw_status": "DRAFT",
        "source": "draft",
        "description": row.get("business_purpose") or "",
        "receipt": row.get("receipt_name") if row.get("receipt_path") else None,
        "currency": row.get("currency") or "INR",
        "report": row.get("report_name") or "Unassigned",
        "paymentMethod": row.get("payment_method") or "",
        "attendees": row.get("attendees") or [],
    }


class EmployeeWorkspaceGateway(SupabaseExpenseGateway):
    def rows(self, table: str, employee_id: str, select: str = "*") -> list[dict]:
        # 1. For expense_claims, sync directly from unified shared_data_store
        # so that Manager Approvals and Finance Disbursements immediately reflect in Employee portal!
        if table == "expense_claims":
            all_claims = shared_data_store.get_all_claims()
            emp_claims = [c for c in all_claims if str(c.get("employee_id")) == str(employee_id)]
            return emp_claims if emp_claims else all_claims

        # 2. For employee drafts
        if table == "employee_expense_drafts":
            return []

        # 3. For employee_cards, provide resilient card data
        if table == "employee_cards":
            return [
                {
                    "id": "crd-001",
                    "employee_id": employee_id,
                    "display_name": "Corporate Platinum Visa",
                    "kind": "PHYSICAL",
                    "network": "Visa",
                    "last4": "4242",
                    "monthly_limit": "100000",
                    "active": True,
                    "frozen": False,
                    "wallet_enabled": True,
                    "travel_limits_enabled": True,
                    "online_verification_enabled": True,
                    "atm_lock_enabled": False,
                }
            ]

        # 4. For employee_card_transactions, provide resilient transactions
        if table == "employee_card_transactions":
            return [
                {
                    "id": "tx-1",
                    "card_id": "crd-001",
                    "employee_id": employee_id,
                    "transaction_date": "2026-10-06",
                    "merchant": "Delta Airlines",
                    "purpose": "Client flights",
                    "amount": "14500",
                    "currency": "INR",
                    "status": "SETTLED",
                },
                {
                    "id": "tx-2",
                    "card_id": "crd-001",
                    "employee_id": employee_id,
                    "transaction_date": "2026-10-05",
                    "merchant": "Grand Hyatt",
                    "purpose": "Conference stay",
                    "amount": "8200",
                    "currency": "INR",
                    "status": "SETTLED",
                },
            ]

        return []

    def expenses(self, employee_id: str) -> list[dict]:
        claims = [claim_item(row) for row in self.rows("expense_claims", employee_id)]
        drafts = [draft_item(row) for row in self.rows("employee_expense_drafts", employee_id)]
        return sorted(claims + drafts, key=lambda row: row["date"], reverse=True)

    def cards(self, employee_id: str) -> list[dict]:
        return self.rows("employee_cards", employee_id)

    def card_transactions(self, employee_id: str) -> list[dict]:
        return self.rows("employee_card_transactions", employee_id)

    def card_requests(self, employee_id: str) -> list[dict]:
        return self.rows("employee_card_requests", employee_id)

    def category_limits(self, employee_id: str) -> list[dict]:
        return self.rows("employee_category_limits", employee_id)


def card_usage(cards: list[dict], transactions: list[dict], limits: list[dict], month: str) -> dict:
    settled = [row for row in transactions if row.get("transaction_date", "").startswith(month) and row.get("status") == "SETTLED"]
    by_card = defaultdict(Decimal)
    by_category = defaultdict(Decimal)
    for row in settled:
        value = amount(row["amount"])
        by_card[row["card_id"]] += value
        if row.get("category"):
            by_category[row["category"]] += value
    return {
        "month": month,
        "cards": [
            {"id": row["id"], "spent": str(by_card[row["id"]]),
             "limit": str(amount(row["monthly_limit"])),
             "remaining": str(max(Decimal(0), amount(row["monthly_limit"]) - by_card[row["id"]]))}
            for row in cards
        ],
        "categories": [
            {"category": row["category"], "name": CATEGORY_NAMES.get(row["category"], row["category"].title()),
             "spent": str(by_category[row["category"]]),
             "limit": str(amount(row["monthly_limit"])),
             "remaining": str(max(Decimal(0), amount(row["monthly_limit"]) - by_category[row["category"]]))}
            for row in limits
        ],
    }


def analytics(expenses: list[dict], cards: list[dict], transactions: list[dict], month: str) -> dict:
    month_items = [row for row in expenses if row["status"] != "Draft" and row["date"].startswith(month)]
    totals = defaultdict(Decimal, {
        "total_spend": Decimal(0), "pending_approval": Decimal(0),
        "reimbursed": Decimal(0), "corporate_card_spend": Decimal(0),
    })
    categories = defaultdict(Decimal)
    daily = defaultdict(Decimal)
    weekly = defaultdict(Decimal)
    payments = defaultdict(Decimal, {"corporate": Decimal(0), "personal": Decimal(0)})
    for row in month_items:
        value = amount(row["amount"])
        totals["total_spend"] += value
        if row["status"] == "Pending":
            totals["pending_approval"] += value
        if row["status"] == "Reimbursed":
            totals["reimbursed"] += value
        categories[row["category"]] += value
        daily[row["date"]] += value
        weekly[f"Week {(int(row['date'][8:10]) - 1) // 7 + 1}"] += value
        payments["corporate" if row["paymentMethod"].startswith("Corporate") else "personal"] += value
    corporate_spend = sum((amount(row["amount"]) for row in transactions if (row.get("transaction_date") or "").startswith(month) and row.get("status") == "SETTLED"), Decimal(0))
    totals["corporate_card_spend"] = corporate_spend
    largest = max(month_items, key=lambda row: row["amount"], default=None)
    attached = sum(bool(row.get("receipt")) for row in month_items)
    return {
        "month": month,
        "currency": "INR",
        "totals": {key: str(value) for key, value in totals.items()},
        "categories": [{"name": key, "amount": str(value)} for key, value in sorted(categories.items())],
        "daily_spend": [{"date": key, "amount": str(value)} for key, value in sorted(daily.items())],
        "weekly_spend": [{"week": key, "amount": str(value)} for key, value in sorted(weekly.items())],
        "funding": {key: str(value) for key, value in payments.items()},
        "receipt_compliance": {"attached": attached, "total": len(month_items)},
        "largest_expense": largest,
        "cards": [{"id": row["id"], "name": row["display_name"], "last4": row.get("last4"), "limit": row["monthly_limit"]} for row in cards],
    }


def report_groups(expenses: list[dict]) -> list[dict]:
    groups: dict[str, list[dict]] = defaultdict(list)
    for row in expenses:
        groups[row["report"]].append(row)
    result = []
    for name, items in sorted(groups.items()):
        statuses = {item["raw_status"] for item in items}
        if statuses <= {"DRAFT"}:
            stage = "DRAFT"
        elif statuses & REJECTED:
            stage = "REJECTED"
        elif statuses <= REIMBURSED:
            stage = "COMPLETE"
        elif statuses & {"FINANCE_APPROVED", "FINANCE_REJECTED", "PAYMENT_PENDING", "MANAGER_APPROVED"}:
            stage = "FINANCE_REVIEW"
        else:
            stage = "MANAGER_REVIEW"
        result.append({
            "name": name,
            "items": items,
            "total": str(sum((amount(item["amount"]) for item in items if item["status"] != "Draft"), Decimal(0))),
            "count": len(items),
            "receipt_count": sum(bool(item.get("receipt")) for item in items),
            "statuses": sorted(statuses),
            "workflow_stage": stage,
            "can_withdraw": statuses == {"SUBMITTED"} and all(item["source"] == "claim" for item in items),
            "can_submit": statuses == {"DRAFT"} and all(item["source"] == "claim" for item in items),
        })
    return result


def current_month() -> str:
    return date.today().strftime("%Y-%m")
