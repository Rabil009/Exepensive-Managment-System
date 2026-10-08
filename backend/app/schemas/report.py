from typing import List
from pydantic import BaseModel

class ReportMetricsModel(BaseModel):
    quarter: str
    totalClaimsProcessed: int
    approvedTotal: float
    rejectedTotal: float
    approvalRatePercent: float
    auditExceptionsCount: int
    topDepartment: str
