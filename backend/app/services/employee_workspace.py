"""Employee-owned data and summaries used across the Employee portal."""

from collections import defaultdict
from datetime import date
from decimal import Decimal

from app.services.supabase_expenses import SupabaseExpenseGateway


PENDING = {"SUBMITTED", "MANAGER_APPROVED", "FINANCE_APPROVED", "PAYMENT_PENDING"}
APPROVED = {"MANAGER_APPROVED", "FINANCE_APPROVED", "PAYMENT_PENDING"}
REIMBURSED = {"PAID", "DISBURSED", "CLOSED"}
REJECTED = {"MANAGER_REJECTED", "FINANCE_REJECTED"}
CATEGORY_NAMES = {
    "TRAVEL": "Travel", "HOTEL": "Accommodation", "MEALS": "Food",
    "SOFTWARE": "Software", "HARDWARE": "Office", "OFFICE": "Office",
    "TRAINING": "Other", "OTHER": "Other",
}


def amount(value) -> Decimal:
    return Decimal(str(value or 0))


def display_status(value: str) -> str:
    if value in REIMBURSED:
        return "Reimbursed"
    if value in REJECTED:
        return "Rejected"
    if value in APPROVED:
        return "Approved"
    if value == "DRAFT":
        return "Draft"
    return "Pending"


def claim_item(row: dict) -> dict:
    return {
        "id": row["id"],
        "date": row.get("expense_date") or (row.get("submitted_at") or "")[:10],
        "merchant": row.get("merchant") or row.get("title") or "Expense",
        "category": CATEGORY_NAMES.get(row.get("category"), "Other"),
        "amount": float(amount(row.get("amount"))),
        "status": display_status(row.get("status", "SUBMITTED")),
        "raw_status": row.get("status"),
        "description": row.get("description") or "",
        "receipt": row.get("receipt_name") if row.get("receipt_path") or row.get("receipt_name") else None,
        "currency": row.get("currency") or "INR",
        "report": row.get("report_name") or "Unassigned",
        "paymentMethod": "Corporate Card" if row.get("payment_method") == "CORPORATE_CARD" else "Personal (Out-of-Pocket)",
        "attendees": row.get("attendees") or [],
    }


def draft_item(row: dict) -> dict:
    return {
        "id": row["id"],
        "date": row.get("expense_date") or "",
        "merchant": row.get("merchant") or "Untitled draft",
        "category": row.get("category") or "Other",
        "amount": float(amount(row.get("amount"))),
        "status": "Draft",
        "raw_status": "DRAFT",
        "description": row.get("business_purpose") or "",
        "receipt": row.get("receipt_name") if row.get("receipt_path") else None,
        "currency": row.get("currency") or "INR",
        "report": row.get("report_name") or "Unassigned",
        "paymentMethod": row.get("payment_method") or "",
        "attendees": row.get("attendees") or [],
    }


class EmployeeWorkspaceGateway(SupabaseExpenseGateway):
    def rows(self, table: str, employee_id: str, select: str = "*") -> list[dict]:
        result = []
        offset = 0
        while True:
            batch = self.request(
                "GET", f"/rest/v1/{table}",
                params={"employee_id": f"eq.{employee_id}", "select": select},
                headers={"Range": f"{offset}-{offset + 499}"},
            ).json()
            result.extend(batch)
            if len(batch) < 500:
                return result
            offset += len(batch)

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


def analytics(expenses: list[dict], cards: list[dict], transactions: list[dict], month: str) -> dict:
    month_items = [row for row in expenses if row["status"] != "Draft" and row["date"].startswith(month)]
    totals = defaultdict(Decimal, {
        "total_spend": Decimal(0), "pending_approval": Decimal(0),
        "reimbursed": Decimal(0), "corporate_card_spend": Decimal(0),
    })
    categories = defaultdict(Decimal)
    daily = defaultdict(Decimal)
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
        "funding": {key: str(value) for key, value in payments.items()},
        "receipt_compliance": {"attached": attached, "total": len(month_items)},
        "largest_expense": largest,
        "cards": [{"id": row["id"], "name": row["display_name"], "last4": row.get("last4"), "limit": row["monthly_limit"]} for row in cards],
    }


def report_groups(expenses: list[dict]) -> list[dict]:
    groups: dict[str, list[dict]] = defaultdict(list)
    for row in expenses:
        groups[row["report"]].append(row)
    return [
        {
            "name": name,
            "items": items,
            "total": str(sum((amount(item["amount"]) for item in items if item["status"] != "Draft"), Decimal(0))),
            "count": len(items),
            "receipt_count": sum(bool(item.get("receipt")) for item in items),
            "statuses": sorted({item["raw_status"] for item in items}),
        }
        for name, items in sorted(groups.items())
    ]


def current_month() -> str:
    return date.today().strftime("%Y-%m")
