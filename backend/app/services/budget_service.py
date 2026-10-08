from typing import List
from app.schemas.budget import DepartmentBudgetModel
from app.services.shared_store import shared_data_store

class BudgetService:
    def list_budgets(self) -> List[DepartmentBudgetModel]:
        raw_budgets = shared_data_store.get_budgets()
        budgets_list = []
        for b in raw_budgets:
            name = b.get("name") or b.get("department", "General")
            spent = float(b.get("spent") or b.get("spent_amount", 0.0))
            cap = float(b.get("cap") or b.get("allocated_amount", 100000.0))
            ratio = (spent / cap) if cap > 0 else 0
            status = "Exceeded" if ratio >= 1.0 else ("Review" if ratio >= 0.8 else "On Track")
            budgets_list.append(DepartmentBudgetModel(
                name=name,
                spent=spent,
                cap=cap,
                members=int(b.get("members", 8)),
                color=b.get("color", "#2563eb"),
                status=status,
            ))
        return budgets_list

budget_service = BudgetService()

