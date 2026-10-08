from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.approvals import router as approvals_router
from app.api.budgets import router as budgets_router
from app.api.employee_auth import router as employee_auth_router
from app.api.employee_workspace import router as employee_workspace_router
from app.api.expenses import router as expenses_router
from app.api.policies import router as policies_router
from app.api.reports import router as reports_router
from app.api.supabase_new_expense import router as supabase_new_expense_router
from app.core.config import settings


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Expense Management System API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(supabase_new_expense_router)
app.include_router(employee_auth_router)
app.include_router(employee_workspace_router)

manager_prefix = f"{settings.API_PREFIX}/manager"
for router in (approvals_router, expenses_router, budgets_router, policies_router, reports_router):
    app.include_router(router, prefix=manager_prefix)
    app.include_router(router, prefix=settings.API_PREFIX)


@app.get("/")
def root():
    return {
        "status": "online",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
    }


@app.get("/health")
def health_check():
    return {"status": "healthy", "version": settings.VERSION}
