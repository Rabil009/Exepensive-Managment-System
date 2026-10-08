from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.approvals import router as approvals_router
from app.api.expenses import router as expenses_router
from app.api.budgets import router as budgets_router
from app.api.policies import router as policies_router
from app.api.reports import router as reports_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend services for Expense Management System (Manager Module)",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Manager sub-routers under /api/manager
manager_prefix = f"{settings.API_PREFIX}/manager"
app.include_router(approvals_router, prefix=manager_prefix)
app.include_router(expenses_router, prefix=manager_prefix)
app.include_router(budgets_router, prefix=manager_prefix)
app.include_router(policies_router, prefix=manager_prefix)
app.include_router(reports_router, prefix=manager_prefix)

# Also expose direct aliases under /api/
app.include_router(approvals_router, prefix=settings.API_PREFIX)
app.include_router(expenses_router, prefix=settings.API_PREFIX)
app.include_router(budgets_router, prefix=settings.API_PREFIX)
app.include_router(policies_router, prefix=settings.API_PREFIX)
app.include_router(reports_router, prefix=settings.API_PREFIX)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "manager-backend",
        "version": settings.VERSION,
    }

@app.get("/")
def root():
    return {
        "message": "Expense Management System - Manager API is running",
        "docs": "/docs",
    }
