from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from app.schemas.finance import (
    ClaimVerifyRequest,
    ClaimHoldRequest,
    DisbursePaymentRequest,
    BudgetCreateUpdateRequest,
)
from app.services.shared_store import shared_data_store

class FinanceService:
    @staticmethod
    def get_overview_metrics() -> Dict[str, Any]:
        """Calculates headline metrics for Finance Admin Dashboard from unified shared store."""
        try:
            claims = shared_data_store.get_all_claims()

            awaiting_verification = [
                c for c in claims
                if c.get("status") == "MANAGER_APPROVED" and not c.get("is_hold")
            ]
            awaiting_high_priority = [
                c for c in awaiting_verification
                if float(c.get("amount", 0)) > 10000 or c.get("policy_violation")
            ]

            finance_approved = [
                c for c in claims
                if c.get("status") in ("FINANCE_APPROVED", "PAYMENT_PENDING")
            ]
            approved_amount_total = sum(float(c.get("amount", 0)) for c in finance_approved)

            # Reimbursements pending (personal payment methods)
            reimb_pending = [
                c for c in finance_approved
                if c.get("payment_method") != "CORPORATE_CARD"
            ]
            reimb_pending_count = len(reimb_pending)
            reimb_pending_amount = sum(float(c.get("amount", 0)) for c in reimb_pending)

            # Payments pending (corporate cards or awaiting disbursement)
            payments_pending = [
                c for c in claims
                if c.get("status") in ("FINANCE_APPROVED", "PAYMENT_PENDING")
            ]
            payments_pending_count = len(payments_pending)
            payments_pending_amount = sum(float(c.get("amount", 0)) for c in payments_pending)

            # Exceptions count
            exceptions_count = len([
                c for c in claims
                if c.get("is_hold") or c.get("policy_violation") or c.get("is_duplicate_warning")
            ])

            return {
                "awaitingVerificationCount": len(awaiting_verification),
                "awaitingHighPriorityCount": len(awaiting_high_priority),
                "approvedAmountTotal": round(approved_amount_total, 2),
                "reimbursementsPendingCount": reimb_pending_count,
                "reimbursementsPendingAmount": round(reimb_pending_amount, 2),
                "paymentsPendingCount": payments_pending_count,
                "paymentsPendingAmount": round(payments_pending_amount, 2),
                "totalExceptions": exceptions_count,
            }
        except Exception as e:
            print(f"[FinanceService] Error calculating metrics: {e}")
            return {
                "error": str(e),
                "awaitingVerificationCount": 0,
                "awaitingHighPriorityCount": 0,
                "approvedAmountTotal": 0.0,
                "reimbursementsPendingCount": 0,
                "reimbursementsPendingAmount": 0.0,
                "paymentsPendingCount": 0,
                "paymentsPendingAmount": 0.0,
                "totalExceptions": 0,
            }

    @staticmethod
    def get_claims(
        status: Optional[str] = None,
        department: Optional[str] = None,
        category: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Fetch expense claims from shared store with optional filtering."""
        return shared_data_store.get_all_claims(
            status=status,
            department=department,
            category=category,
        )

    @staticmethod
    def get_claim_by_id(claim_id: str) -> Optional[Dict[str, Any]]:
        """Fetch a single claim with its audit trail."""
        claim = shared_data_store.get_claim(claim_id)
        if not claim:
            return None
        claim_copy = dict(claim)
        claim_copy["audit_trail"] = shared_data_store.get_audit_trail(claim_id)
        return claim_copy

    @staticmethod
    def verify_claim(claim_id: str, req: ClaimVerifyRequest) -> Dict[str, Any]:
        """Verify, approve, reject or send back a claim by Finance Admin."""
        claim = shared_data_store.get_claim(claim_id)
        if not claim:
            raise ValueError(f"Claim {claim_id} not found")

        actor_name = req.actor_name or "Finance Treasury"
        if req.action == "approve":
            updated = shared_data_store.update_claim_status(
                claim_id=claim_id,
                new_status="FINANCE_APPROVED",
                actor_name=actor_name,
                remark=req.remark or "Approved by Finance Treasury",
            )
        elif req.action == "reject":
            updated = shared_data_store.update_claim_status(
                claim_id=claim_id,
                new_status="FINANCE_REJECTED",
                actor_name=actor_name,
                remark=req.reason or "Rejected by Finance Treasury",
            )
        elif req.action == "send_back":
            updated = shared_data_store.update_claim_status(
                claim_id=claim_id,
                new_status="SUBMITTED",
                actor_name=actor_name,
                remark=f"Sent back for revision: {req.reason or ''}",
            )
        else:
            raise ValueError(f"Invalid verification action: {req.action}")

        return updated or {}

    @staticmethod
    def hold_claim(claim_id: str, req: ClaimHoldRequest) -> Dict[str, Any]:
        """Place or release hold on a claim."""
        is_place_hold = req.action == "place_hold"
        updated = shared_data_store.hold_claim(
            claim_id=claim_id,
            place_hold=is_place_hold,
            reason=req.reason or ("Finance review hold" if is_place_hold else None),
        )
        if not updated:
            raise ValueError(f"Claim {claim_id} not found")
        return updated

    @staticmethod
    def disburse_payment(req: DisbursePaymentRequest) -> Dict[str, Any]:
        """Execute payment disbursement, update claim & reimbursement records, and update budget spend."""
        claim = shared_data_store.get_claim(req.claim_id)
        if not claim:
            raise ValueError(f"Claim {req.claim_id} not found")

        updated = shared_data_store.disburse_claim(
            claim_id=req.claim_id,
            payment_reference=req.payment_reference,
            payment_channel=req.payment_channel or "Bank Transfer (NEFT)",
            notes=req.notes,
            actor_name=req.actor_name or "Finance Treasury",
        )
        return updated or {}

    @staticmethod
    def get_budgets() -> List[Dict[str, Any]]:
        """Fetch all department budgets from shared store."""
        return shared_data_store.get_budgets()

    @staticmethod
    def get_reimbursements() -> List[Dict[str, Any]]:
        """Fetch all reimbursement records from shared store."""
        return shared_data_store.get_reimbursements()

    @staticmethod
    def get_exceptions() -> List[Dict[str, Any]]:
        """Fetch all policy violation exceptions or held claims."""
        claims = shared_data_store.get_all_claims()
        return [
            c for c in claims
            if c.get("is_hold") or c.get("policy_violation") or c.get("is_duplicate_warning")
        ]
