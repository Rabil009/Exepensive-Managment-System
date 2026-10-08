from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.approvals import router as approvals_router
from app.api.expenses import router as expenses_router
from app.api.budgets import router as budgets_router
from app.api.policies import router as policies_router
from app.api.reports import router as reports_router
from app.api.finance import router as finance_router
from app.api.supabase_new_expense import router as supabase_new_expense_router
from app.api.employee_auth import router as employee_auth_router
from app.api.employee_workspace import router as employee_workspace_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Expense Management System API (Employee, Manager & Finance Modules)",
)

# CORS Middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Employee Routers
app.include_router(supabase_new_expense_router)
app.include_router(employee_auth_router)
app.include_router(employee_workspace_router)

# Register Finance Router
app.include_router(finance_router)

# Register Manager sub-routers under /api/manager and /api/
manager_prefix = f"{settings.API_PREFIX}/manager"
for r in (approvals_router, expenses_router, budgets_router, policies_router, reports_router):
    app.include_router(r, prefix=manager_prefix)
    app.include_router(r, prefix=settings.API_PREFIX)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "expense-management-backend",
        "version": settings.VERSION,
    }

@app.get("/")
def root():
    return {
        "status": "online",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "docs": "/docs",
    }
