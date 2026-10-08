"""
Central Unified Shared Data Store
Single source of truth for claims, budgets, reimbursements, and audit logs
across Employee, Manager, and Finance modules.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from app.supabase import supabase

# Unified Claims Dataset across all 3 portals
UNIFIED_SEED_CLAIMS: List[Dict[str, Any]] = [
    {
        "id": "CLM-001",
        "employee_id": "u1",
        "employee_name": "Aditya Kumar",
        "employee_department": "Engineering",
        "cost_center": "CC-ENG-104",
        "title": "The Oberoi Bengaluru - Client Architecture Sync",
        "description": "3-day technical architecture review with enterprise client stakeholders.",
        "amount": 6000.0,
        "currency": "INR",
        "category": "HOTEL",
        "payment_method": "PERSONAL_CARD",
        "merchant": "The Oberoi Grand",
        "receipt_url": "https://example.com/receipts/oberoi.pdf",
        "receipt_name": "oberoi_invoice_oct2026.pdf",
        "status": "SUBMITTED",
        "priority": "Medium",
        "receipt_verified": True,
        "policy_violation": "Nightly accommodation cap exceeded. Standard threshold ₹5,000.",
        "policy_exceeded_amount": 1000.0,
        "employee_exception_reason": "Last-minute booking required due to emergency client migration meeting.",
        "is_duplicate_warning": False,
        "duplicate_details": None,
        "is_hold": False,
        "hold_reason": None,
        "held_at": None,
        "submitted_at": "2026-10-04T09:30:00Z",
        "created_at": "2026-10-04T08:15:00Z",
        "updated_at": "2026-10-04T09:30:00Z",
        "manager_remark": None,
        "finance_remark": None,
        "payment_reference": None,
        "disbursed_at": None,
        "payment_channel": None,
    },
    {
        "id": "CLM-8821",
        "employee_id": "u6",
        "employee_name": "Rahul Sharma",
        "employee_department": "Engineering",
        "cost_center": "CC-ENG-104",
        "title": "Bangalore client architectural sync flight",
        "description": "Bangalore client architectural sync flight with lead dev team.",
        "amount": 8500.0,
        "currency": "INR",
        "category": "TRAVEL",
        "payment_method": "PERSONAL_CARD",
        "merchant": "IndiGo Airlines Ltd",
        "receipt_url": "https://example.com/receipts/indigo.pdf",
        "receipt_name": "indigo_boarding_pass.pdf",
        "status": "SUBMITTED",
        "priority": "High",
        "receipt_verified": True,
        "policy_violation": None,
        "policy_exceeded_amount": 0.0,
        "employee_exception_reason": None,
        "is_duplicate_warning": False,
        "duplicate_details": None,
        "is_hold": False,
        "hold_reason": None,
        "held_at": None,
        "submitted_at": "2026-10-06T10:00:00Z",
        "created_at": "2026-10-06T10:00:00Z",
        "updated_at": "2026-10-06T10:00:00Z",
        "manager_remark": None,
        "finance_remark": None,
        "payment_reference": None,
        "disbursed_at": None,
        "payment_channel": None,
    },
    {
        "id": "CLM-8822",
        "employee_id": "u4",
        "employee_name": "Priya Nair",
        "employee_department": "Product & UX",
        "cost_center": "CC-PRD-201",
        "title": "Design sprint conference stay - Grand Hyatt",
        "description": "Design sprint conference stay - Grand Hyatt Mumbai.",
        "amount": 4200.0,
        "currency": "INR",
        "category": "HOTEL",
        "payment_method": "PERSONAL_CARD",
        "merchant": "Hyatt Hotels India",
        "receipt_url": "https://example.com/receipts/hyatt.pdf",
        "receipt_name": "hyatt_mumbai_invoice.pdf",
        "status": "SUBMITTED",
        "priority": "Medium",
        "receipt_verified": True,
        "policy_violation": None,
        "policy_exceeded_amount": 0.0,
        "employee_exception_reason": None,
        "is_duplicate_warning": False,
        "duplicate_details": None,
        "is_hold": False,
        "hold_reason": None,
        "held_at": None,
        "submitted_at": "2026-10-05T14:00:00Z",
        "created_at": "2026-10-05T14:00:00Z",
        "updated_at": "2026-10-05T14:00:00Z",
        "manager_remark": None,
        "finance_remark": None,
        "payment_reference": None,
        "disbursed_at": None,
        "payment_channel": None,
    },
    {
        "id": "CLM-8823",
        "employee_id": "u7",
        "employee_name": "Arjun Reddy",
        "employee_department": "Sales & Growth",
        "cost_center": "CC-SLS-305",
        "title": "Enterprise Q4 contract dinner with CFO",
        "description": "Enterprise Q4 contract negotiation dinner meeting with CFO.",
        "amount": 6800.0,
        "currency": "INR",
        "category": "MEALS",
        "payment_method": "PERSONAL_UPI",
        "merchant": "The Table Colaba",
        "receipt_url": "https://example.com/receipts/thetable.pdf",
        "receipt_name": "table_colaba_bill.pdf",
        "status": "SUBMITTED",
        "priority": "High",
        "receipt_verified": True,
        "policy_violation": "Per diem meal limit exceeded. Client attendees listed.",
        "policy_exceeded_amount": 1800.0,
        "employee_exception_reason": "Quarterly prospect closing dinner with 4 executive stakeholders.",
        "is_duplicate_warning": False,
        "duplicate_details": None,
        "is_hold": False,
        "hold_reason": None,
        "held_at": None,
        "submitted_at": "2026-10-05T20:30:00Z",
        "created_at": "2026-10-05T20:30:00Z",
        "updated_at": "2026-10-05T20:30:00Z",
        "manager_remark": None,
        "finance_remark": None,
        "payment_reference": None,
        "disbursed_at": None,
        "payment_channel": None,
    },
    {
        "id": "CLM-002",
        "employee_id": "u4",
        "employee_name": "Priya Nair",
        "employee_department": "Engineering",
        "cost_center": "CC-ENG-104",
        "title": "Air India Return Flight - BLR to DEL",
        "description": "Direct flight booked for on-site data center security migration.",
        "amount": 8500.0,
        "currency": "INR",
        "category": "TRAVEL",
        "payment_method": "CORPORATE_CARD",
        "merchant": "Air India",
        "receipt_url": "https://example.com/receipts/airindia.pdf",
        "receipt_name": "air_india_boarding_pass.pdf",
        "status": "MANAGER_APPROVED",
        "priority": "High",
        "receipt_verified": True,
        "policy_violation": None,
        "policy_exceeded_amount": 0.0,
        "employee_exception_reason": None,
        "is_duplicate_warning": False,
        "duplicate_details": None,
        "is_hold": False,
        "hold_reason": None,
        "held_at": None,
        "submitted_at": "2026-10-02T11:00:00Z",
        "created_at": "2026-10-02T10:00:00Z",
        "updated_at": "2026-10-03T14:20:00Z",
        "manager_remark": "Approved by Manager. Verified against corporate booking itinerary.",
        "finance_remark": None,
        "payment_reference": None,
        "disbursed_at": None,
        "payment_channel": None,
    },
    {
        "id": "CLM-8825",
        "employee_id": "u8",
        "employee_name": "Vikram Malhotra",
        "employee_department": "Engineering",
        "cost_center": "CC-ENG-104",
        "title": "Cloud GPU training credits on Lambda Labs",
        "description": "Cloud GPU training credits for LLM fine-tuning cluster.",
        "amount": 14900.0,
        "currency": "INR",
        "category": "SOFTWARE",
        "payment_method": "CORPORATE_CARD",
        "merchant": "Lambda Labs Inc",
        "receipt_url": "https://example.com/receipts/lambdalabs.pdf",
        "receipt_name": "lambda_labs_invoice.pdf",
        "status": "MANAGER_APPROVED",
        "priority": "High",
        "receipt_verified": True,
        "policy_violation": None,
        "policy_exceeded_amount": 0.0,
        "employee_exception_reason": None,
        "is_duplicate_warning": False,
        "duplicate_details": None,
        "is_hold": False,
        "hold_reason": None,
        "held_at": None,
        "submitted_at": "2026-10-03T09:00:00Z",
        "created_at": "2026-10-03T09:00:00Z",
        "updated_at": "2026-10-04T11:00:00Z",
        "manager_remark": "Pre-approved quarterly infrastructure credit.",
        "finance_remark": None,
        "payment_reference": None,
        "disbursed_at": None,
        "payment_channel": None,
    },
    {
        "id": "CLM-004",
        "employee_id": "u1",
        "employee_name": "Aditya Kumar",
        "employee_department": "Engineering",
        "cost_center": "CC-ENG-104",
        "title": "JetBrains All Products License Renewal",
        "description": "Annual IDE software licenses for the core backend engineering unit.",
        "amount": 14500.0,
        "currency": "INR",
        "category": "SOFTWARE",
        "payment_method": "PERSONAL_CARD",
        "merchant": "JetBrains s.r.o.",
        "receipt_url": "https://example.com/receipts/jetbrains.pdf",
        "receipt_name": "jetbrains_tax_invoice.pdf",
        "status": "FINANCE_APPROVED",
        "priority": "High",
        "receipt_verified": True,
        "policy_violation": None,
        "policy_exceeded_amount": 0.0,
        "employee_exception_reason": None,
        "is_duplicate_warning": False,
        "duplicate_details": None,
        "is_hold": False,
        "hold_reason": None,
        "held_at": None,
        "submitted_at": "2026-09-28T10:00:00Z",
        "created_at": "2026-09-28T09:00:00Z",
        "updated_at": "2026-10-01T15:30:00Z",
        "manager_remark": "Essential dev infrastructure. Approved.",
        "finance_remark": "Tax invoice validated with GSTIN. Cleared for disbursement.",
        "payment_reference": None,
        "disbursed_at": None,
        "payment_channel": None,
    },
    {
        "id": "CLM-005",
        "employee_id": "u4",
        "employee_name": "Priya Nair",
        "employee_department": "Engineering",
        "cost_center": "CC-ENG-104",
        "title": "Hardware Dongles & USB-C Adapters",
        "description": "Field deployment adapters for server racks.",
        "amount": 1850.0,
        "currency": "INR",
        "category": "HARDWARE",
        "payment_method": "PERSONAL_UPI",
        "merchant": "Croma Electronics",
        "receipt_url": "https://example.com/receipts/croma.pdf",
        "receipt_name": "croma_bill.pdf",
        "status": "FINANCE_APPROVED",
        "priority": "Low",
        "receipt_verified": True,
        "policy_violation": None,
        "policy_exceeded_amount": 0.0,
        "employee_exception_reason": None,
        "is_duplicate_warning": False,
        "duplicate_details": None,
        "is_hold": True,
        "hold_reason": "Awaiting physical GST invoice copy from claimant.",
        "held_at": "2026-10-03T10:15:00Z",
        "submitted_at": "2026-10-01T12:00:00Z",
        "created_at": "2026-10-01T11:00:00Z",
        "updated_at": "2026-10-02T16:00:00Z",
        "manager_remark": "Approved",
        "finance_remark": "Held pending invoice",
        "payment_reference": None,
        "disbursed_at": None,
        "payment_channel": None,
    },
    {
        "id": "CLM-006",
        "employee_id": "u1",
        "employee_name": "Aditya Kumar",
        "employee_department": "Engineering",
        "cost_center": "CC-ENG-104",
        "title": "Uber Executive Transit - Delhi Airport to HQ",
        "description": "Airport transit for late night client arrival.",
        "amount": 1250.0,
        "currency": "INR",
        "category": "TRAVEL",
        "payment_method": "PERSONAL_UPI",
        "merchant": "Uber India",
        "receipt_url": "https://example.com/receipts/uber.pdf",
        "receipt_name": "uber_ride_receipt.pdf",
        "status": "DISBURSED",
        "priority": "Low",
        "receipt_verified": True,
        "policy_violation": None,
        "policy_exceeded_amount": 0.0,
        "employee_exception_reason": None,
        "is_duplicate_warning": False,
        "duplicate_details": None,
        "is_hold": False,
        "hold_reason": None,
        "held_at": None,
        "submitted_at": "2026-09-20T22:00:00Z",
        "created_at": "2026-09-20T21:30:00Z",
        "updated_at": "2026-09-25T11:00:00Z",
        "manager_remark": "Approved",
        "finance_remark": "Disbursed via Corporate NEFT",
        "payment_reference": "UTR-NEFT-2026-0925-8812",
        "disbursed_at": "2026-09-25T11:00:00Z",
        "payment_channel": "Bank Transfer (NEFT)",
    },
    {
        "id": "CLM-8827",
        "employee_id": "u9",
        "employee_name": "Rohan Kapoor",
        "employee_department": "Sales & Growth",
        "cost_center": "CC-SLS-305",
        "title": "Personal weekend rental upgrade (unauthorized)",
        "description": "Personal weekend rental upgrade (unauthorized luxury car rental).",
        "amount": 7200.0,
        "currency": "INR",
        "category": "TRAVEL",
        "payment_method": "CORPORATE_CARD",
        "merchant": "Avis Car Rental",
        "receipt_url": None,
        "receipt_name": None,
        "status": "MANAGER_REJECTED",
        "priority": "High",
        "receipt_verified": False,
        "policy_violation": "Exceeds personal car rental ceiling without prior authorization.",
        "policy_exceeded_amount": 3200.0,
        "employee_exception_reason": None,
        "is_duplicate_warning": False,
        "duplicate_details": None,
        "is_hold": False,
        "hold_reason": None,
        "held_at": None,
        "submitted_at": "2026-10-01T15:00:00Z",
        "created_at": "2026-10-01T14:30:00Z",
        "updated_at": "2026-10-02T10:00:00Z",
        "manager_remark": "Unauthorized personal luxury vehicle upgrade. Rejected.",
        "finance_remark": None,
        "payment_reference": None,
        "disbursed_at": None,
        "payment_channel": None,
    },
]

# Unified Department Budgets
UNIFIED_SEED_BUDGETS: List[Dict[str, Any]] = [
    {
        "id": "b-eng",
        "name": "Engineering Ops & Infrastructure",
        "department": "Engineering",
        "spent": 184200.0,
        "cap": 250000.0,
        "allocated_amount": 250000.0,
        "spent_amount": 184200.0,
        "members": 14,
        "color": "#2563eb",
        "status": "On Track",
        "currency": "INR",
        "fiscal_period": "Q4-2026",
        "threshold_percent": 80.0,
    },
    {
        "id": "b-prd",
        "name": "Product & UX Design",
        "department": "Product & UX",
        "spent": 92400.0,
        "cap": 140000.0,
        "allocated_amount": 140000.0,
        "spent_amount": 92400.0,
        "members": 6,
        "color": "#10b981",
        "status": "On Track",
        "currency": "INR",
        "fiscal_period": "Q4-2026",
        "threshold_percent": 80.0,
    },
    {
        "id": "b-sls",
        "name": "Sales & Client Growth",
        "department": "Sales & Growth",
        "spent": 68400.0,
        "cap": 120000.0,
        "allocated_amount": 120000.0,
        "spent_amount": 68400.0,
        "members": 5,
        "color": "#a855f7",
        "status": "On Track",
        "currency": "INR",
        "fiscal_period": "Q4-2026",
        "threshold_percent": 75.0,
    },
    {
        "id": "b-mkt",
        "name": "Marketing & Brand Partnerships",
        "department": "Marketing",
        "spent": 39500.0,
        "cap": 60000.0,
        "allocated_amount": 60000.0,
        "spent_amount": 39500.0,
        "members": 3,
        "color": "#f59e0b",
        "status": "Review",
        "currency": "INR",
        "fiscal_period": "Q4-2026",
        "threshold_percent": 80.0,
    },
]

class SharedDataStore:
    def __init__(self):
        # Master in-memory dictionary keyed by claim id
        self._claims: Dict[str, Dict[str, Any]] = {c["id"]: dict(c) for c in UNIFIED_SEED_CLAIMS}
        self._budgets: Dict[str, Dict[str, Any]] = {b["id"]: dict(b) for b in UNIFIED_SEED_BUDGETS}
        self._reimbursements: List[Dict[str, Any]] = []
        self._audit_logs: List[Dict[str, Any]] = []
        self._sync_with_supabase()

    def _sync_with_supabase(self):
        """Pull any existing live rows from Supabase into the shared store."""
        if not supabase:
            return
        try:
            res = supabase.table("expense_claims").select("*").execute()
            if res.data and len(res.data) > 0:
                for row in res.data:
                    cid = str(row.get("id"))
                    self._claims[cid] = {**self._claims.get(cid, {}), **row}
        except Exception as e:
            # Continue with resilient shared memory
            print(f"[SharedDataStore] Supabase read note: {e}")

    # --- CLAIMS ---
    def get_all_claims(
        self,
        status: Optional[str] = None,
        department: Optional[str] = None,
        category: Optional[str] = None,
        search: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        self._sync_with_supabase()

        claims = list(self._claims.values())

        if status and status != "All":
            s_lower = status.lower()
            if s_lower == "pending":
                claims = [c for c in claims if str(c.get("status", "")).upper() in ("SUBMITTED", "PENDING", "DRAFT")]
            elif s_lower == "approved":
                claims = [
                    c for c in claims
                    if "APPROVED" in str(c.get("status", "")).upper()
                    or str(c.get("status", "")).upper() in ("DISBURSED", "PAID", "PAYMENT_PENDING")
                ]
            elif s_lower == "rejected":
                claims = [c for c in claims if "REJECTED" in str(c.get("status", "")).upper()]
            else:
                claims = [c for c in claims if str(c.get("status", "")).upper() == status.upper()]

        if department and department != "All":
            claims = [c for c in claims if c.get("employee_department", "").lower() == department.lower()]

        if category and category != "All":
            claims = [c for c in claims if c.get("category", "").lower() == category.lower()]

        if search:
            q = search.lower()
            claims = [
                c for c in claims
                if q in str(c.get("employee_name", "")).lower()
                or q in str(c.get("description", "")).lower()
                or q in str(c.get("title", "")).lower()
                or q in str(c.get("id", "")).lower()
            ]

        # Sort latest first
        return sorted(claims, key=lambda x: str(x.get("created_at") or ""), reverse=True)

    def get_claim(self, claim_id: str) -> Optional[Dict[str, Any]]:
        return self._claims.get(claim_id)

    def add_claim(self, claim: Dict[str, Any]) -> Dict[str, Any]:
        cid = claim["id"]
        self._claims[cid] = claim
        if supabase:
            try:
                supabase.table("expense_claims").insert(claim).execute()
            except Exception as e:
                print(f"[SharedDataStore] Supabase insert note: {e}")
        return claim

    def update_claim_status(
        self,
        claim_id: str,
        new_status: str,
        actor_name: str = "Manager",
        remark: Optional[str] = None,
    ) -> Optional[Dict[str, Any]]:
        claim = self._claims.get(claim_id)
        if not claim:
            return None

        prev_status = claim.get("status")
        now_iso = datetime.now(timezone.utc).isoformat()

        claim["status"] = new_status
        claim["updated_at"] = now_iso

        if "MANAGER" in new_status:
            claim["manager_remark"] = remark
        elif "FINANCE" in new_status:
            claim["finance_remark"] = remark

        # Audit log
        self._audit_logs.append({
            "claim_id": claim_id,
            "action": f"STATUS_{new_status}",
            "actor_name": actor_name,
            "previous_status": prev_status,
            "new_status": new_status,
            "remarks": remark,
            "timestamp": now_iso,
        })

        # Sync to Supabase if possible
        if supabase:
            try:
                upd_payload = {
                    "status": new_status,
                    "updated_at": now_iso,
                }
                if "MANAGER" in new_status:
                    upd_payload["manager_remark"] = remark
                elif "FINANCE" in new_status:
                    upd_payload["finance_remark"] = remark
                supabase.table("expense_claims").update(upd_payload).eq("id", claim_id).execute()
            except Exception as e:
                print(f"[SharedDataStore] Supabase update note: {e}")

        return claim

    def disburse_claim(
        self,
        claim_id: str,
        payment_reference: str,
        payment_channel: str = "Bank Transfer (NEFT)",
        notes: Optional[str] = None,
        actor_name: str = "Finance Treasury",
    ) -> Optional[Dict[str, Any]]:
        claim = self._claims.get(claim_id)
        if not claim:
            return None

        now_iso = datetime.now(timezone.utc).isoformat()
        claim["status"] = "DISBURSED"
        claim["payment_reference"] = payment_reference
        claim["payment_channel"] = payment_channel
        claim["disbursed_at"] = now_iso
        claim["updated_at"] = now_iso
        if notes:
            claim["finance_remark"] = notes

        # Update department budget
        dept = claim.get("employee_department")
        amount = float(claim.get("amount", 0))
        for b in self._budgets.values():
            if b.get("department") == dept or b.get("name") == dept:
                b["spent"] = float(b.get("spent", 0)) + amount
                b["spent_amount"] = float(b.get("spent_amount", 0)) + amount
                break

        # Record in audit log
        self._audit_logs.append({
            "claim_id": claim_id,
            "action": "PAYMENT_DISBURSED",
            "actor_name": actor_name,
            "remarks": f"Disbursed via {payment_channel} - Ref: {payment_reference}",
            "timestamp": now_iso,
        })

        if supabase:
            try:
                supabase.table("expense_claims").update({
                    "status": "DISBURSED",
                    "payment_reference": payment_reference,
                    "payment_channel": payment_channel,
                    "disbursed_at": now_iso,
                }).eq("id", claim_id).execute()
            except Exception as e:
                print(f"[SharedDataStore] Supabase disburse note: {e}")

        return claim

    def hold_claim(self, claim_id: str, place_hold: bool, reason: Optional[str] = None) -> Optional[Dict[str, Any]]:
        claim = self._claims.get(claim_id)
        if not claim:
            return None

        now_iso = datetime.now(timezone.utc).isoformat()
        claim["is_hold"] = place_hold
        claim["hold_reason"] = reason if place_hold else None
        claim["held_at"] = now_iso if place_hold else None
        claim["updated_at"] = now_iso

        return claim

    # --- BUDGETS ---
    def get_budgets(self) -> List[Dict[str, Any]]:
        return list(self._budgets.values())

    # --- REIMBURSEMENTS ---
    def get_reimbursements(self) -> List[Dict[str, Any]]:
        reimbs = []
        for c in self._claims.values():
            if c.get("payment_method") != "CORPORATE_CARD" and str(c.get("status", "")).upper() in (
                "FINANCE_APPROVED", "PAYMENT_PENDING", "DISBURSED", "PAID"
            ):
                status_label = "Paid" if str(c.get("status", "")).upper() in ("DISBURSED", "PAID") else "Pending"
                reimbs.append({
                    "id": f"REIMB-{c['id']}",
                    "claim_id": c["id"],
                    "employee_name": c.get("employee_name"),
                    "employee_department": c.get("employee_department"),
                    "eligible_personal_amount": float(c.get("amount", 0)),
                    "corporate_card_amount": 0.0,
                    "currency": c.get("currency", "INR"),
                    "status": status_label,
                    "payment_reference": c.get("payment_reference"),
                    "disbursed_at": c.get("disbursed_at"),
                    "payment_method": c.get("payment_channel") or "Bank Transfer (NEFT)",
                    "created_at": c.get("created_at"),
                })
        return sorted(reimbs, key=lambda x: str(x.get("created_at") or ""), reverse=True)

    # --- AUDIT LOGS ---
    def get_audit_trail(self, claim_id: str) -> List[Dict[str, Any]]:
        return [log for log in self._audit_logs if log.get("claim_id") == claim_id]

# Singleton instance for the running backend process
shared_data_store = SharedDataStore()

