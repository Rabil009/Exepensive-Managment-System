from typing import List
from fastapi import APIRouter
from app.schemas.expense import TeamSpendSummary, CategorySpendBreakdown
from app.services.expense_service import expense_service

router = APIRouter(prefix="/expenses", tags=["Manager Team Expenses"])

@router.get("/summary", response_model=TeamSpendSummary)
def get_team_spend_summary():
    """Get aggregated metrics on team spending, pending amounts, and claim counts."""
    return expense_service.get_summary()

@router.get("/categories", response_model=List[CategorySpendBreakdown])
def get_category_spend_breakdown():
    """Get category distribution of expenses."""
    return expense_service.get_category_breakdown()
