from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.expenses import router as employee_expenses_router
from app.api.supabase_new_expense import router as supabase_new_expense_router
from app.api.employee_auth import router as employee_auth_router
from app.api.employee_workspace import router as employee_workspace_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Finance Management System API for Payout"
)

# CORS Middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://*.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employee_expenses_router)
app.include_router(supabase_new_expense_router)
app.include_router(employee_auth_router)
app.include_router(employee_workspace_router)

@app.get("/")
def root():
    return {
        "status": "online",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

