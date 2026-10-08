from typing import List, Optional, Dict, Any
from app.schemas.approval import ManagerClaimModel
from app.services.shared_store import shared_data_store

def to_manager_claim_model(c: Dict[str, Any]) -> ManagerClaimModel:
    raw_status = str(c.get("status", "Pending")).upper()
    if "APPROV" in raw_status or raw_status in ("DISBURSED", "PAID"):
        norm_status = "Approved"
    elif "REJECT" in raw_status:
        norm_status = "Rejected"
    else:
        norm_status = "Pending"

    amt = float(c.get("amount", 0))
    prio = c.get("priority")
    if not prio or prio not in ("High", "Medium", "Low"):
        prio = "High" if amt > 5000 else "Medium"

    date_str = c.get("date")
    if not date_str:
        created = str(c.get("created_at") or "")
        date_str = created[:10] if created else "Today"

    return ManagerClaimModel(
        id=str(c.get("id")),
        employeeName=c.get("employee_name") or c.get("employeeName") or "Employee",
        department=c.get("employee_department") or c.get("department") or "Engineering",
        costCenter=c.get("cost_center") or c.get("costCenter") or "CC-ENG-104",
        category=c.get("category", "Travel").capitalize(),
        description=c.get("description") or c.get("title") or "Expense claim",
        amount=amt,
        date=date_str,
        status=norm_status,
        priority=prio,
        receiptVerified=bool(c.get("receipt_url") or c.get("receipt_verified") or c.get("receipt_path")),
        policyNotes=c.get("policy_violation") or c.get("policyNotes"),
        managerRemark=c.get("manager_remark") or c.get("managerRemark"),
    )

class ApprovalService:
    @property
    def _claims_store(self) -> Dict[str, Dict[str, Any]]:
        """Dynamic backward-compatible dictionary for expense_service."""
        return {
            c["id"]: {
                "id": c["id"],
                "status": "Approved" if "APPROV" in str(c.get("status", "")).upper() or str(c.get("status", "")).upper() in ("DISBURSED", "PAID") else (
                    "Rejected" if "REJECT" in str(c.get("status", "")).upper() else "Pending"
                ),
                "amount": float(c.get("amount", 0)),
                "category": c.get("category", "General"),
                "department": c.get("employee_department", "Engineering"),
            }
            for c in shared_data_store.get_all_claims()
        }

    def list_claims(
        self,
        status: Optional[str] = None,
        department: Optional[str] = None,
        search: Optional[str] = None,
    ) -> List[ManagerClaimModel]:
        claims = shared_data_store.get_all_claims(status=status, department=department, search=search)
        return [to_manager_claim_model(c) for c in claims]

    def get_claim(self, claim_id: str) -> Optional[ManagerClaimModel]:
        c = shared_data_store.get_claim(claim_id)
        return to_manager_claim_model(c) if c else None

    def approve_claim(self, claim_id: str, remark: Optional[str] = None) -> Optional[ManagerClaimModel]:
        final_remark = remark or "Approved by Manager"
        updated = shared_data_store.update_claim_status(
            claim_id=claim_id,
            new_status="MANAGER_APPROVED",
            actor_name="Manager",
            remark=final_remark,
        )
        return to_manager_claim_model(updated) if updated else None

    def reject_claim(self, claim_id: str, reason: str) -> Optional[ManagerClaimModel]:
        updated = shared_data_store.update_claim_status(
            claim_id=claim_id,
            new_status="MANAGER_REJECTED",
            actor_name="Manager",
            remark=reason,
        )
        return to_manager_claim_model(updated) if updated else None

approval_service = ApprovalService()

