import logging

from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict, Any
from app.schemas.finance import (
    ClaimVerifyRequest,
    ClaimHoldRequest,
    DisbursePaymentRequest,
    FinanceMetricsResponse,
    BudgetCreateUpdateRequest
)
from app.services.finance_service import FinanceService

router = APIRouter(prefix="/api/finance", tags=["Finance Admin"])
logger = logging.getLogger(__name__)

@router.get("/overview", response_model=FinanceMetricsResponse)
def get_finance_overview():
    """Returns headline metrics for the Finance dashboard."""
    try:
        return FinanceService.get_overview_metrics()
    except Exception:
        logger.exception("Failed to load finance overview")
        raise HTTPException(status_code=503, detail="Finance overview is temporarily unavailable")

@router.get("/claims")
def list_finance_claims(
    status: Optional[str] = Query(None, description="DRAFT, SUBMITTED, MANAGER_APPROVED, FINANCE_APPROVED, DISBURSED"),
    department: Optional[str] = Query(None),
    category: Optional[str] = Query(None)
):
    """List all expense claims with optional filters for finance auditing."""
    try:
        return FinanceService.get_claims(status=status, department=department, category=category)
    except Exception:
        logger.exception("Failed to load finance claims")
        raise HTTPException(status_code=503, detail="Finance claims are temporarily unavailable")

@router.get("/claims/{claim_id}")
def get_claim_details(claim_id: str):
    """Get single claim with full audit trail."""
    claim = FinanceService.get_claim_by_id(claim_id)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    return claim

@router.post("/claims/{claim_id}/verify")
def verify_claim(claim_id: str, request: ClaimVerifyRequest):
    """Finance Admin approval, rejection, or send-back for revision."""
    try:
        updated = FinanceService.verify_claim(claim_id, request)
        return {"status": "success", "claim": updated}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to verify claim: {str(e)}")

@router.post("/claims/{claim_id}/hold")
def toggle_claim_hold(claim_id: str, request: ClaimHoldRequest):
    """Place or release hold on a claim pending policy/receipt review."""
    try:
        updated = FinanceService.hold_claim(claim_id, request)
        return {"status": "success", "claim": updated}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to toggle hold: {str(e)}")

@router.post("/disburse")
def disburse_payment(request: DisbursePaymentRequest):
    """Execute payout, record UTR/bank reference, and update department budget."""
    try:
        disbursed = FinanceService.disburse_payment(request)
        return {"status": "success", "message": "Payment disbursed successfully", "claim": disbursed}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to disburse payment: {str(e)}")

@router.get("/budgets")
def list_department_budgets():
    """List department budgets and spend utilization."""
    return FinanceService.get_budgets()

@router.get("/reimbursements")
def list_reimbursements():
    """List reimbursement queue and completed payout records."""
    return FinanceService.get_reimbursements()

@router.get("/exceptions")
def list_policy_exceptions():
    """List flagged claims with violations, holds, or duplicate alerts."""
    return FinanceService.get_exceptions()
