from fastapi import APIRouter
from app.schemas.report import ReportMetricsModel
from app.services.report_service import report_service

router = APIRouter(prefix="/reports", tags=["Manager Financial Reports"])

@router.get("/quarterly", response_model=ReportMetricsModel)
def get_quarterly_report():
    """Get quarterly performance, approval ratios, and audit statistics."""
    return report_service.get_quarterly_metrics()
