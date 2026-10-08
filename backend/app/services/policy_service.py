from typing import List
from app.schemas.policy import PolicySettingsModel, PolicyRuleItem

DEFAULT_RULES = [
    {
        "id": "POL-001",
        "category": "Hotel",
        "ruleName": "Tier-1 Metro Daily Cap",
        "thresholdAmount": 5000.0,
        "description": "Standard business room limit for Mumbai, Delhi NCR, Bangalore, Hyderabad.",
        "status": "Active",
    },
    {
        "id": "POL-002",
        "category": "Meals",
        "ruleName": "Hospitality & Per Diem",
        "thresholdAmount": 1500.0,
        "description": "Daily food & beverage per-person ceiling on official travel.",
        "status": "Active",
    },
    {
        "id": "POL-003",
        "category": "Receipts",
        "ruleName": "Tax Invoice Verification",
        "thresholdAmount": 500.0,
        "description": "Mandatory itemized GST tax invoice upload required above ₹500.",
        "status": "Active",
    },
    {
        "id": "POL-004",
        "category": "Travel",
        "ruleName": "Domestic Flight Advance Booking",
        "thresholdAmount": 9000.0,
        "description": "Economy airfares booked less than 7 days in advance trigger manager review.",
        "status": "Active",
    },
]

class PolicyService:
    def __init__(self):
        self._settings = PolicySettingsModel()
        self._rules = [dict(r) for r in DEFAULT_RULES]

    def get_settings(self) -> PolicySettingsModel:
        return self._settings

    def update_settings(self, updates: PolicySettingsModel) -> PolicySettingsModel:
        self._settings = updates
        # Update corresponding rule thresholds
        for r in self._rules:
            if r["category"] == "Hotel":
                r["thresholdAmount"] = updates.hotelCap
            elif r["category"] == "Meals":
                r["thresholdAmount"] = updates.mealsCap
            elif r["category"] == "Receipts":
                r["thresholdAmount"] = updates.receiptRequiredAbove
        return self._settings

    def list_rules(self) -> List[PolicyRuleItem]:
        return [PolicyRuleItem(**r) for r in self._rules]

policy_service = PolicyService()
