from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.schemas.approval import ManagerClaimModel, ApprovalActionRequest, RejectActionRequest
from app.services.approval_service import approval_service

router = APIRouter(prefix="/approvals", tags=["Manager Approvals"])

@router.get("", response_model=List[ManagerClaimModel])
def get_claims(
    status: Optional[str] = Query(None, description="Filter by status (Pending, Approved, Rejected, All)"),
    department: Optional[str] = Query(None, description="Filter by department"),
    search: Optional[str] = Query(None, description="Search keyword"),
):
    """Retrieve claims requiring manager review with optional filtering."""
    return approval_service.list_claims(status=status, department=department, search=search)

@router.get("/{claim_id}", response_model=ManagerClaimModel)
def get_claim(claim_id: str):
    """Get single claim details."""
    claim = approval_service.get_claim(claim_id)
    if not claim:
        raise HTTPException(status_code=404, detail=f"Claim {claim_id} not found")
    return claim

@router.post("/{claim_id}/approve", response_model=ManagerClaimModel)
def approve_claim(claim_id: str, payload: Optional[ApprovalActionRequest] = None):
    """Approve an employee expense claim."""
    remark = payload.remark if payload and payload.remark else "Approved by Manager"
    claim = approval_service.approve_claim(claim_id, remark)
    if not claim:
        raise HTTPException(status_code=404, detail=f"Claim {claim_id} not found")
    return claim

@router.post("/{claim_id}/reject", response_model=ManagerClaimModel)
def reject_claim(claim_id: str, payload: RejectActionRequest):
    """Reject an employee expense claim with mandatory reason."""
    claim = approval_service.reject_claim(claim_id, payload.reason)
    if not claim:
        raise HTTPException(status_code=404, detail=f"Claim {claim_id} not found")
    return claim
