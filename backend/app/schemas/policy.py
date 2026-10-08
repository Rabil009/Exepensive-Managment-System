from pydantic import BaseModel

class PolicySettingsModel(BaseModel):
    hotelCap: float = 5000.0
    mealsCap: float = 1500.0
    receiptRequiredAbove: float = 500.0
    currency: str = "INR"

class PolicyRuleItem(BaseModel):
    id: str
    category: str
    ruleName: str
    thresholdAmount: float
    description: str
    status: str
