# xplora_backend/app/schemas.py
from __future__ import annotations
from datetime   import datetime
from typing     import List, Literal, Optional
from pydantic   import BaseModel, Field, field_validator


# ── Auth ──────────────────────────────────────────────────────
class UserCreate(BaseModel):
    name:     str = Field(..., min_length=2, max_length=80)
    email:    str = Field(..., pattern=r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
    password: str = Field(..., min_length=8)

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int; name: str; email: str
    model_config = {"from_attributes": True}

class Token(BaseModel):
    access_token: str
    token_type:   str = "bearer"
    user:         UserOut


# ── Trip Request ──────────────────────────────────────────────
BudgetLevel     = Literal["Budget", "Moderate", "Luxury"]
TravelStyleType = Literal["Adventure", "Cultural", "Relaxation", "Family"]

class TripRequest(BaseModel):
    departure:    str              = Field(..., min_length=2, max_length=100)
    destination:  str              = Field(..., min_length=2, max_length=100)
    duration:     int              = Field(..., ge=1, le=21)
    budget:       BudgetLevel
    travel_style: TravelStyleType
    interests:    Optional[List[str]] = Field(default_factory=list)

    @field_validator("departure", "destination", mode="before")
    @classmethod
    def _clean_city(cls, v: str) -> str:
        return v.strip().title()

    @field_validator("interests", mode="before")
    @classmethod
    def _clean_interests(cls, v):
        return [str(i).strip() for i in (v or []) if str(i).strip()][:10]


# ── Trip Response ─────────────────────────────────────────────
class Activity(BaseModel):
    time: str; title: str; description: str

class HotelRecommendation(BaseModel):
    name: str; style: str; reason: str

class RestaurantRecommendation(BaseModel):
    name: str; cuisine: str; price_range: str

class DayPlan(BaseModel):
    day:   int
    theme: str
    activities:               List[Activity]
    hotel_recommendation:     HotelRecommendation
    restaurant_recommendation: RestaurantRecommendation

class TripResponse(BaseModel):
    departure:    str
    destination:  str
    duration:     int
    budget:       str
    travel_style: str
    itinerary:    List[DayPlan]
    generated_at: datetime = Field(default_factory=datetime.utcnow)


# ── Save / Retrieve ───────────────────────────────────────────
class TripSaveRequest(BaseModel):
    plan:          dict
    from_location: Optional[str] = ""

class TripOut(BaseModel):
    id: int; uuid: str; destination: str
    from_location: Optional[str]
    plan:          Optional[dict]
    created_at:    datetime
    model_config = {"from_attributes": True}