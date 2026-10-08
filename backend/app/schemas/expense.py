from __future__ import annotations

from datetime import date as Date, datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, Field


class ExpenseInput(BaseModel):
    date: Date | None = None
    merchant: str = Field(default="", max_length=200)
    category: str = Field(default="", max_length=100)
    amount: Decimal = Field(default=Decimal("0"), ge=0, max_digits=15, decimal_places=2)
    description: str = Field(default="", max_length=5000)
    currency: Literal["INR"] = "INR"
    report: str = Field(default="", max_length=200)
    payment_method: str = Field(default="", max_length=100)
    attendees: list[str] = Field(default_factory=list, max_length=50)


class ExpenseRecord(ExpenseInput):
    id: str
    status: Literal["Draft", "Pending"]
    receipt_name: str | None = None
    created_at: datetime
    updated_at: datetime
    submitted_at: datetime | None = None
