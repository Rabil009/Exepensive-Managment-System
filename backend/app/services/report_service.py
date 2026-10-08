from app.services.approval_service import approval_service
from app.schemas.report import ReportMetricsModel

class ReportService:
    def get_quarterly_metrics(self) -> ReportMetricsModel:
        claims = list(approval_service._claims_store.values())
        
        approved = [c for c in claims if c["status"] == "Approved"]
        rejected = [c for c in claims if c["status"] == "Rejected"]
        
        approved_sum = sum(c["amount"] for c in approved)
        rejected_sum = sum(c["amount"] for c in rejected)
        
        total_decided = len(approved) + len(rejected)
        approval_rate = (len(approved) / total_decided * 100) if total_decided > 0 else 100.0

        # Exceptions = claims with policy notes or not verified
        exceptions_count = sum(1 for c in claims if c.get("policyNotes") or not c.get("receiptVerified"))

        return ReportMetricsModel(
            quarter="Q3 FY2026",
            totalClaimsProcessed=len(claims),
            approvedTotal=approved_sum,
            rejectedTotal=rejected_sum,
            approvalRatePercent=round(approval_rate, 1),
            auditExceptionsCount=exceptions_count,
            topDepartment="Engineering",
        )

report_service = ReportService()
