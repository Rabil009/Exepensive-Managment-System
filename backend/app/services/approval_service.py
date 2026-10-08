from typing import List, Optional
from datetime import datetime
from app.supabase import supabase
from app.schemas.approval import ManagerClaimModel

# Rich baseline demo data for Manager Dashboard
DEFAULT_CLAIMS = [
    {
        "id": "CLM-8821",
        "employeeName": "Rahul Sharma",
        "department": "Engineering",
        "costCenter": "CC-ENG-104",
        "category": "Travel",
        "description": "Bangalore client architectural sync flight",
        "amount": 8500.0,
        "date": "Oct 06, 2026",
        "status": "Pending",
        "priority": "High",
        "receiptVerified": True,
        "policyNotes": "Booked within 7-day domestic cap",
        "managerRemark": None,
    },
    {
        "id": "CLM-8822",
        "employeeName": "Priya Nair",
        "department": "Product & UX",
        "costCenter": "CC-PRD-201",
        "category": "Hotel",
        "description": "Design sprint conference stay - Grand Hyatt",
        "amount": 4200.0,
        "date": "Oct 05, 2026",
        "status": "Pending",
        "priority": "Medium",
        "receiptVerified": True,
        "policyNotes": "Within Tier-1 metro nightly allowance",
        "managerRemark": None,
    },
    {
        "id": "CLM-8823",
        "employeeName": "Arjun Reddy",
        "department": "Sales & Growth",
        "costCenter": "CC-SLS-305",
        "category": "Meals",
        "description": "Enterprise Q4 contract dinner with CFO",
        "amount": 6800.0,
        "date": "Oct 05, 2026",
        "status": "Pending",
        "priority": "High",
        "receiptVerified": True,
        "policyNotes": "Client attendees listed on invoice",
        "managerRemark": None,
    },
    {
        "id": "CLM-8824",
        "employeeName": "Sneha Iyer",
        "department": "Marketing",
        "costCenter": "CC-MKT-402",
        "category": "Transport",
        "description": "Product launch shoot logistics transfers",
        "amount": 2300.0,
        "date": "Oct 04, 2026",
        "status": "Pending",
        "priority": "Low",
        "receiptVerified": True,
        "policyNotes": "Uber for Business verified route",
        "managerRemark": None,
    },
    {
        "id": "CLM-8825",
        "employeeName": "Vikram Malhotra",
        "department": "Engineering",
        "costCenter": "CC-ENG-104",
        "category": "Software",
        "description": "Cloud GPU training credits on Lambda Labs",
        "amount": 14900.0,
        "date": "Oct 03, 2026",
        "status": "Approved",
        "priority": "Medium",
        "receiptVerified": True,
        "policyNotes": "Manager pre-approved on budget",
        "managerRemark": "Pre-approved quarterly infrastructure credit",
    },
    {
        "id": "CLM-8826",
        "employeeName": "Ananya Deshmukh",
        "department": "Product & UX",
        "costCenter": "CC-PRD-201",
        "category": "Equipment",
        "description": "Ergonomic vertical mouse & testing keyboard",
        "amount": 3400.0,
        "date": "Oct 02, 2026",
        "status": "Approved",
        "priority": "Low",
        "receiptVerified": True,
        "policyNotes": None,
        "managerRemark": "Standard ergonomic equipment stipend",
    },
    {
        "id": "CLM-8827",
        "employeeName": "Rohan Kapoor",
        "department": "Sales & Growth",
        "costCenter": "CC-SLS-305",
        "category": "Travel",
        "description": "Personal weekend rental upgrade (unauthorized)",
        "amount": 7200.0,
        "date": "Oct 01, 2026",
        "status": "Rejected",
        "priority": "High",
        "receiptVerified": False,
        "policyNotes": "Exceeds personal car rental ceiling",
        "managerRemark": "Unauthorized personal luxury vehicle upgrade",
    },
]

class ApprovalService:
    def __init__(self):
        # In-memory store initialized with default manager claims
        self._claims_store: dict[str, dict] = {c["id"]: dict(c) for c in DEFAULT_CLAIMS}

    def list_claims(
        self,
        status: Optional[str] = None,
        department: Optional[str] = None,
        search: Optional[str] = None,
    ) -> List[ManagerClaimModel]:
        # Sync from Supabase if table has entries
        if supabase:
            try:
                res = supabase.from_("expense_claims").select("*").execute()
                if res.data and len(res.data) > 0:
                    for item in res.data:
                        cid = item.get("id")
                        raw_status = item.get("status", "Pending")
                        norm_status = "Approved" if "APPROVED" in raw_status.upper() else (
                            "Rejected" if "REJECTED" in raw_status.upper() else "Pending"
                        )
                        self._claims_store[cid] = {
                            "id": cid,
                            "employeeName": item.get("employee_name", "Unknown Employee"),
                            "department": item.get("employee_department", "Engineering"),
                            "costCenter": item.get("cost_center", "CC-GEN-100"),
                            "category": item.get("category", "General").capitalize(),
                            "description": item.get("description") or item.get("title", "Expense claim"),
                            "amount": float(item.get("amount", 0)),
                            "date": item.get("created_at", datetime.now().strftime("%b %d, %Y")),
                            "status": norm_status,
                            "priority": "High" if float(item.get("amount", 0)) > 5000 else "Medium",
                            "receiptVerified": bool(item.get("receipt_url")),
                            "policyNotes": item.get("policy_violation"),
                            "managerRemark": item.get("manager_remark"),
                        }
            except Exception as e:
                # Log but continue with in-memory store
                print(f"[ApprovalService] Supabase sync error: {e}")

        claims = list(self._claims_store.values())

        if status and status != "All":
            claims = [c for c in claims if c["status"].lower() == status.lower()]

        if department and department != "All":
            claims = [c for c in claims if c["department"].lower() == department.lower()]

        if search:
            q = search.lower()
            claims = [
                c for c in claims
                if q in c["employeeName"].lower()
                or q in c["description"].lower()
                or q in c["department"].lower()
                or q in c["id"].lower()
            ]

        # Return latest first
        return [ManagerClaimModel(**c) for c in claims]

    def get_claim(self, claim_id: str) -> Optional[ManagerClaimModel]:
        data = self._claims_store.get(claim_id)
        return ManagerClaimModel(**data) if data else None

    def approve_claim(self, claim_id: str, remark: Optional[str] = None) -> Optional[ManagerClaimModel]:
        if claim_id not in self._claims_store:
            return None

        final_remark = remark or "Approved by Manager"
        self._claims_store[claim_id]["status"] = "Approved"
        self._claims_store[claim_id]["managerRemark"] = final_remark

        # Sync to Supabase
        if supabase:
            try:
                supabase.from_("expense_claims").update({
                    "status": "MANAGER_APPROVED",
                    "manager_remark": final_remark,
                    "updated_at": datetime.utcnow().isoformat(),
                }).eq("id", claim_id).execute()
            except Exception as e:
                print(f"[ApprovalService] Supabase approve sync warning: {e}")

        return ManagerClaimModel(**self._claims_store[claim_id])

    def reject_claim(self, claim_id: str, reason: str) -> Optional[ManagerClaimModel]:
        if claim_id not in self._claims_store:
            return None

        self._claims_store[claim_id]["status"] = "Rejected"
        self._claims_store[claim_id]["managerRemark"] = reason

        # Sync to Supabase
        if supabase:
            try:
                supabase.from_("expense_claims").update({
                    "status": "MANAGER_REJECTED",
                    "manager_remark": reason,
                    "updated_at": datetime.utcnow().isoformat(),
                }).eq("id", claim_id).execute()
            except Exception as e:
                print(f"[ApprovalService] Supabase reject sync warning: {e}")

        return ManagerClaimModel(**self._claims_store[claim_id])

approval_service = ApprovalService()
