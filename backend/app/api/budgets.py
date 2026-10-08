from typing import List
from fastapi import APIRouter
from app.schemas.budget import DepartmentBudgetModel
from app.services.budget_service import budget_service

router = APIRouter(prefix="/budgets", tags=["Department Budgets"])

@router.get("", response_model=List[DepartmentBudgetModel])
def get_department_budgets():
    """Get active department budgets, member counts, and consumption rates."""
    return budget_service.list_budgets()
