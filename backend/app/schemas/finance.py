from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class ClaimVerifyRequest(BaseModel):
    action: str = Field(..., description="approve | reject | send_back")
    remark: Optional[str] = None
    reason: Optional[str] = None
    actor_id: Optional[str] = None
    actor_name: Optional[str] = "Aditya Kumar"

class ClaimHoldRequest(BaseModel):
    action: str = Field(..., description="place_hold | release_hold")
    reason: Optional[str] = None
    actor_id: Optional[str] = None
    actor_name: Optional[str] = "Aditya Kumar"

class DisbursePaymentRequest(BaseModel):
    claim_id: str
    payment_reference: str = Field(..., description="UTR or Transaction reference number")
    payment_channel: str = Field("Bank Transfer (NEFT)", description="NEFT, RTGS, IMPS, UPI, Corporate Card")
    notes: Optional[str] = None
    actor_id: Optional[str] = None
    actor_name: Optional[str] = "Aditya Kumar"

class BudgetCreateUpdateRequest(BaseModel):
    name: str
    department: str
    allocated_amount: float
    spent_amount: Optional[float] = 0.0
    currency: Optional[str] = "INR"
    fiscal_period: str
    threshold_percent: Optional[float] = 80.0

class FinanceMetricsResponse(BaseModel):
    awaitingVerificationCount: int
    awaitingHighPriorityCount: int
    approvedAmountTotal: float
    reimbursementsPendingCount: int
    reimbursementsPendingAmount: float
    paymentsPendingCount: int
    paymentsPendingAmount: float
    totalExceptions: int

