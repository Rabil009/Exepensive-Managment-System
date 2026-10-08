from typing import List
from fastapi import APIRouter
from app.schemas.policy import PolicySettingsModel, PolicyRuleItem
from app.services.policy_service import policy_service

router = APIRouter(prefix="/policies", tags=["Manager Policies"])

@router.get("/settings", response_model=PolicySettingsModel)
def get_policy_settings():
    """Get active manager policy threshold configuration."""
    return policy_service.get_settings()

@router.put("/settings", response_model=PolicySettingsModel)
def update_policy_settings(settings: PolicySettingsModel):
    """Update policy threshold limits (hotel, meals, receipt requirement threshold)."""
    return policy_service.update_settings(settings)

@router.get("/rules", response_model=List[PolicyRuleItem])
def get_policy_rules():
    """Get formal policy compliance rules."""
    return policy_service.list_rules()
