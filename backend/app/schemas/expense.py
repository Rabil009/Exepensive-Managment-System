from typing import Optional, List
from pydantic import BaseModel

class TeamSpendSummary(BaseModel):
    totalSpent: float
    pendingAmount: float
    approvedCount: int
    pendingCount: int
    rejectedCount: int
    averageClaimAmount: float

class CategorySpendBreakdown(BaseModel):
    category: str
    amount: float
    percentage: float
