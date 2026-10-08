from pydantic import BaseModel

class DepartmentBudgetModel(BaseModel):
    name: str
    spent: float
    cap: float
    members: int
    color: str
    status: str
