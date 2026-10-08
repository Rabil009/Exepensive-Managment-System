from typing import Optional, Literal
from pydantic import BaseModel, Field

class ApprovalActionRequest(BaseModel):
    remark: Optional[str] = Field(default="Approved by Manager", description="Manager review remark")

class RejectActionRequest(BaseModel):
    reason: str = Field(..., description="Mandatory reason for rejection")

class ManagerClaimModel(BaseModel):
    id: str
    employeeName: str
    department: str
    costCenter: str
    category: str
    description: str
    amount: float
    date: str
    status: Literal["Pending", "Approved", "Rejected"]
    priority: Literal["High", "Medium", "Low"]
    receiptVerified: bool
    policyNotes: Optional[str] = None
    managerRemark: Optional[str] = None
