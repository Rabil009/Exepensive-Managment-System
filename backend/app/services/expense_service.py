from typing import List
from app.services.approval_service import approval_service
from app.schemas.expense import TeamSpendSummary, CategorySpendBreakdown

class ExpenseService:
    def get_summary(self) -> TeamSpendSummary:
        claims = list(approval_service._claims_store.values())

        approved_claims = [c for c in claims if c["status"] == "Approved"]
        pending_claims = [c for c in claims if c["status"] == "Pending"]
        rejected_claims = [c for c in claims if c["status"] == "Rejected"]

        # Base 384,500 historical baseline + live approved
        total_spent = sum(c["amount"] for c in approved_claims) + 384500.0
        pending_amount = sum(c["amount"] for c in pending_claims)
        avg_amount = sum(c["amount"] for c in claims) / len(claims) if claims else 0.0

        return TeamSpendSummary(
            totalSpent=total_spent,
            pendingAmount=pending_amount,
            approvedCount=len(approved_claims),
            pendingCount=len(pending_claims),
            rejectedCount=len(rejected_claims),
            averageClaimAmount=round(avg_amount, 2),
        )

    def get_category_breakdown(self) -> List[CategorySpendBreakdown]:
        claims = list(approval_service._claims_store.values())
        totals: dict[str, float] = {}
        for c in claims:
            cat = c.get("category", "General")
            totals[cat] = totals.get(cat, 0.0) + float(c.get("amount", 0.0))

        grand_total = sum(totals.values()) or 1.0
        return [
            CategorySpendBreakdown(
                category=cat,
                amount=amt,
                percentage=round((amt / grand_total) * 100, 1),
            )
            for cat, amt in totals.items()
        ]

expense_service = ExpenseService()

