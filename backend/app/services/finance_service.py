from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from app.supabase import supabase
from app.schemas.finance import ClaimVerifyRequest, ClaimHoldRequest, DisbursePaymentRequest, BudgetCreateUpdateRequest

class FinanceService:
    @staticmethod
    def get_overview_metrics() -> Dict[str, Any]:
        """Calculates headline metrics for Finance Admin Dashboard."""
        try:
            # Fetch all claims
            res = supabase.table("expense_claims").select("*").execute()
            claims = res.data or []

            awaiting_verification = [c for c in claims if c.get("status") == "MANAGER_APPROVED" and not c.get("is_hold")]
            awaiting_high_priority = [c for c in awaiting_verification if (c.get("amount") or 0) > 10000 or c.get("policy_violation")]
            
            finance_approved = [c for c in claims if c.get("status") == "FINANCE_APPROVED"]
            approved_amount_total = sum(c.get("amount", 0) for c in finance_approved)

            # Reimbursements pending (personal payment methods)
            reimb_pending = [c for c in finance_approved if c.get("payment_method") != "CORPORATE_CARD"]
            reimb_pending_count = len(reimb_pending)
            reimb_pending_amount = sum(c.get("amount", 0) for c in reimb_pending)

            # Payments pending (corporate cards or awaiting disbursement)
            payments_pending = [c for c in claims if c.get("status") in ("FINANCE_APPROVED", "PAYMENT_PENDING")]
            payments_pending_count = len(payments_pending)
            payments_pending_amount = sum(c.get("amount", 0) for c in payments_pending)

            # Exceptions count
            exceptions_count = len([c for c in claims if c.get("is_hold") or c.get("policy_violation") or c.get("is_duplicate_warning")])

            return {
                "awaitingVerificationCount": len(awaiting_verification),
                "awaitingHighPriorityCount": len(awaiting_high_priority),
                "approvedAmountTotal": round(approved_amount_total, 2),
                "reimbursementsPendingCount": reimb_pending_count,
                "reimbursementsPendingAmount": round(reimb_pending_amount, 2),
                "paymentsPendingCount": payments_pending_count,
                "paymentsPendingAmount": round(payments_pending_amount, 2),
                "totalExceptions": exceptions_count
            }
        except Exception as e:
            return {
                "error": str(e),
                "awaitingVerificationCount": 0,
                "awaitingHighPriorityCount": 0,
                "approvedAmountTotal": 0.0,
                "reimbursementsPendingCount": 0,
                "reimbursementsPendingAmount": 0.0,
                "paymentsPendingCount": 0,
                "paymentsPendingAmount": 0.0,
                "totalExceptions": 0
            }

    @staticmethod
    def get_claims(status: Optional[str] = None, department: Optional[str] = None, category: Optional[str] = None) -> List[Dict[str, Any]]:
        """Fetch expense claims with optional filtering."""
        query = supabase.table("expense_claims").select("*").order("created_at", desc=True)
        if status:
            query = query.eq("status", status)
        if department:
            query = query.eq("employee_department", department)
        if category:
            query = query.eq("category", category)
        res = query.execute()
        return res.data or []

    @staticmethod
    def get_claim_by_id(claim_id: str) -> Optional[Dict[str, Any]]:
        """Fetch a single claim with its audit log history."""
        res = supabase.table("expense_claims").select("*").eq("id", claim_id).execute()
        if not res.data:
            return None
        claim = res.data[0]

        # Audit logs
        audit_res = supabase.table("audit_logs").select("*").eq("claim_id", claim_id).order("created_at", desc=False).execute()
        claim["audit_trail"] = audit_res.data or []
        return claim

    @staticmethod
    def verify_claim(claim_id: str, req: ClaimVerifyRequest) -> Dict[str, Any]:
        """Verify, approve, reject or send back a claim by Finance Admin."""
        claim_res = supabase.table("expense_claims").select("*").eq("id", claim_id).execute()
        if not claim_res.data:
            raise ValueError(f"Claim {claim_id} not found")
        claim = claim_res.data[0]
        prev_status = claim.get("status")

        now_iso = datetime.now(timezone.utc).isoformat()
        update_data = {}

        if req.action == "approve":
            new_status = "FINANCE_APPROVED"
            update_data["status"] = new_status
            update_data["finance_remark"] = req.remark or "Approved by Finance Treasury"

            # Auto-queue reimbursement record if personal card/upi/cash
            if claim.get("payment_method") != "CORPORATE_CARD":
                reimb_payload = {
                    "claim_id": claim_id,
                    "employee_id": claim.get("employee_id"),
                    "employee_name": claim.get("employee_name"),
                    "eligible_personal_amount": claim.get("amount", 0),
                    "corporate_card_amount": 0.0,
                    "currency": claim.get("currency", "INR"),
                    "status": "PENDING"
                }
                supabase.table("reimbursement_records").insert(reimb_payload).execute()

        elif req.action == "reject":
            new_status = "FINANCE_REJECTED"
            update_data["status"] = new_status
            update_data["finance_remark"] = req.reason or "Rejected by Finance Treasury"

        elif req.action == "send_back":
            new_status = "SUBMITTED"
            update_data["status"] = new_status
            update_data["finance_remark"] = f"Sent back for revision: {req.reason or ''}"
        else:
            raise ValueError(f"Invalid verification action: {req.action}")

        # Update claim
        upd_res = supabase.table("expense_claims").update(update_data).eq("id", claim_id).execute()

        # Insert audit log
        supabase.table("audit_logs").insert({
            "claim_id": claim_id,
            "action": f"FINANCE_{req.action.upper()}",
            "actor_id": req.actor_id,
            "actor_name": req.actor_name or "Aditya Kumar",
            "actor_role": "FINANCE",
            "previous_state": {"status": prev_status},
            "new_state": {"status": new_status},
            "remarks": req.remark or req.reason
        }).execute()

        return upd_res.data[0] if upd_res.data else {}

    @staticmethod
    def hold_claim(claim_id: str, req: ClaimHoldRequest) -> Dict[str, Any]:
        """Place or release hold on a claim."""
        now_iso = datetime.now(timezone.utc).isoformat()
        if req.action == "place_hold":
            update_data = {
                "is_hold": True,
                "hold_reason": req.reason or "Finance review hold",
                "held_at": now_iso
            }
        else:
            update_data = {
                "is_hold": False,
                "hold_reason": None,
                "held_at": None
            }

        upd_res = supabase.table("expense_claims").update(update_data).eq("id", claim_id).execute()

        supabase.table("audit_logs").insert({
            "claim_id": claim_id,
            "action": "HOLD_PLACED" if req.action == "place_hold" else "HOLD_RELEASED",
            "actor_id": req.actor_id,
            "actor_name": req.actor_name or "Aditya Kumar",
            "actor_role": "FINANCE",
            "remarks": req.reason
        }).execute()

        return upd_res.data[0] if upd_res.data else {}

    @staticmethod
    def disburse_payment(req: DisbursePaymentRequest) -> Dict[str, Any]:
        """Execute payment disbursement, update claim & reimbursement records, and update budget spend."""
        now_iso = datetime.now(timezone.utc).isoformat()

        # Update claim
        claim_res = supabase.table("expense_claims").select("*").eq("id", req.claim_id).execute()
        if not claim_res.data:
            raise ValueError(f"Claim {req.claim_id} not found")
        claim = claim_res.data[0]

        # Update claim to PAID / DISBURSED
        upd_claim = supabase.table("expense_claims").update({
            "status": "DISBURSED",
            "payment_reference": req.payment_reference,
            "disbursed_at": now_iso,
            "payment_channel": req.payment_channel
        }).eq("id", req.claim_id).execute()

        # Update reimbursement record if exists
        supabase.table("reimbursement_records").update({
            "status": "PAID",
            "payment_reference": req.payment_reference,
            "disbursed_at": now_iso,
            "payment_method": req.payment_channel
        }).eq("claim_id", req.claim_id).execute()

        # Deduct / increase department spent amount in budget
        dept = claim.get("employee_department")
        amount = claim.get("amount", 0)
        if dept:
            dept_res = supabase.table("department_budgets").select("*").eq("department", dept).execute()
            if dept_res.data:
                budget = dept_res.data[0]
                new_spent = (budget.get("spent_amount") or 0) + amount
                supabase.table("department_budgets").update({"spent_amount": new_spent}).eq("id", budget["id"]).execute()

        # Audit log
        supabase.table("audit_logs").insert({
            "claim_id": req.claim_id,
            "action": "PAYMENT_DISBURSED",
            "actor_id": req.actor_id,
            "actor_name": req.actor_name or "Aditya Kumar",
            "actor_role": "FINANCE",
            "remarks": f"Disbursed via {req.payment_channel} - Ref: {req.payment_reference}"
        }).execute()

        return upd_claim.data[0] if upd_claim.data else {}

    @staticmethod
    def get_budgets() -> List[Dict[str, Any]]:
        """Fetch all department budgets."""
        res = supabase.table("department_budgets").select("*").execute()
        return res.data or []

    @staticmethod
    def get_reimbursements() -> List[Dict[str, Any]]:
        """Fetch all reimbursement records."""
        res = supabase.table("reimbursement_records").select("*").order("created_at", desc=True).execute()
        return res.data or []

    @staticmethod
    def get_exceptions() -> List[Dict[str, Any]]:
        """Fetch all policy violation exceptions or held claims."""
        res = supabase.table("expense_claims").select("*").or_("is_hold.eq.true,policy_violation.not.is.null,is_duplicate_warning.eq.true").execute()
        return res.data or []

