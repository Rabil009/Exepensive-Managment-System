from typing import List
from app.supabase import supabase
from app.schemas.budget import DepartmentBudgetModel

DEFAULT_BUDGETS = [
    {"name": "Engineering", "spent": 184200.0, "cap": 220000.0, "members": 14, "color": "#2563eb", "status": "On Track"},
    {"name": "Product & UX", "spent": 92400.0, "cap": 120000.0, "members": 6, "color": "#10b981", "status": "On Track"},
    {"name": "Sales & Growth", "spent": 68400.0, "cap": 100000.0, "members": 5, "color": "#a855f7", "status": "On Track"},
    {"name": "Marketing", "spent": 39500.0, "cap": 60000.0, "members": 3, "color": "#f59e0b", "status": "Review"},
]

class BudgetService:
    def __init__(self):
        self._budgets = [dict(b) for b in DEFAULT_BUDGETS]

    def list_budgets(self) -> List[DepartmentBudgetModel]:
        if supabase:
            try:
                res = supabase.from_("department_budgets").select("*").execute()
                if res.data and len(res.data) > 0:
                    budgets_from_db = []
                    for b in res.data:
                        name = b.get("name", "General")
                        spent = float(b.get("spent_amount", 0.0))
                        cap = float(b.get("allocated_amount", 100000.0))
                        ratio = (spent / cap) if cap > 0 else 0
                        status = "Exceeded" if ratio >= 1.0 else ("Review" if ratio >= 0.8 else "On Track")
                        budgets_from_db.append(DepartmentBudgetModel(
                            name=name,
                            spent=spent,
                            cap=cap,
                            members=int(b.get("members", 8)),
                            color="#2563eb",
                            status=status,
                        ))
                    return budgets_from_db
            except Exception as e:
                print(f"[BudgetService] Supabase fetch error: {e}")

        return [DepartmentBudgetModel(**b) for b in self._budgets]

budget_service = BudgetService()
