import json
import logging
import os
import uuid as uuid_lib
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Trip
from app.schemas import TripRequest, TripResponse, TripSaveRequest, TripOut
from app.utils import get_current_user

# ── 🟢 استدعاء الـ Fallback Chain الجديد من الملف اللي عدلنا ──
from app.services.ai_providers import call_ai_with_fallback

logger = logging.getLogger(__name__)
router = APIRouter()


# ── System Prompt (تعديل طفيف ليناسب جميع النماذج) ──────────────────
SYSTEM_PROMPT = """
You are a world-class Moroccan travel expert and professional tour guide with 20+ years of experience planning trips across all of Morocco.

ABSOLUTE RULES — never break:
1. Return ONLY a valid JSON array. No intro text, no closing remarks.
2. Every word (themes, activities, hotel/restaurant names, reasons) MUST be in ENGLISH.
3. Hotel and restaurant names MUST be real, well-known establishments in the destination city.
4. Activities must be specific to the destination city.
5. Each day object MUST exactly match this blueprint:

{
  "day": <integer>,
  "theme": "<evocative day title>",
  "activities": [
    {"time": "Morning",   "title": "<name>", "description": "<1-2 sentences>"},
    {"time": "Afternoon", "title": "<name>", "description": "<1-2 sentences>"},
    {"time": "Evening",   "title": "<name>", "description": "<1-2 sentences>"}
  ],
  "hotel_recommendation":      {"name": "<real hotel>", "style": "<Riad|Hotel|Resort|Guesthouse>", "reason": "<1 sentence>"},
  "restaurant_recommendation": {"name": "<real restaurant>", "cuisine": "<type>", "price_range": "<$|$$|$$$|$$$$>"}
}

Budget → price_range + accommodation:
  Budget   → $ or $$  | hostels, basic riads, street food
  Moderate → $$ or $$$  | mid-range riads, quality restaurants
  Luxury   → $$$ or $$$$ | 5-star riads, fine-dining

Travel style → activity type:
  Adventure  → desert trekking, Atlas hikes, camel rides, gorges, quad biking
  Cultural   → medinas, museums, monuments, souks, artisan workshops
  Relaxation → hammams, spas, rooftop cafés, gardens, sunset spots
  Family     → safe areas, interactive sites, kid-friendly dining

Output ONLY the raw JSON array wrapped inside a main key "itinerary" like this: {"itinerary": [...]}. Do not include any markdown styling.
""".strip()

_WRAPPER_KEYS = ("itinerary", "days", "trip", "plan", "data", "schedule", "result")

def _extract_list(parsed) -> list:
    if isinstance(parsed, list):
        return parsed
    if isinstance(parsed, dict):
        for k in _WRAPPER_KEYS:
            if k in parsed and isinstance(parsed[k], list):
                return parsed[k]
        vals = list(parsed.values())
        if vals and all(isinstance(v, dict) for v in vals):
            return vals
    raise ValueError("Cannot extract itinerary from AI response.")


# ════════════════════════════════════════════════════════════
#  POST /api/trips/generate
# ════════════════════════════════════════════════════════════
@router.post("/generate", response_model=TripResponse, status_code=200)
async def generate_trip(req: TripRequest):
    interests_str = f"\nInterests: {', '.join(req.interests)}." if req.interests else ""
    
    # صياغة الـ User Prompt الموجه للـ Fallback Chain
    user_msg = (
        f"{SYSTEM_PROMPT}\n\n"
        f"Generate a {req.duration}-day Morocco trip itinerary.\n"
        f"Departure city:   {req.departure}\n"
        f"Destination city: {req.destination}\n"
        f"Budget level:     {req.budget}\n"
        f"Travel style:     {req.travel_style}"
        f"{interests_str}\n\n"
        f"Return exactly {req.duration} day object(s) inside a JSON object with an 'itinerary' key. "
        f"Every day must have Morning, Afternoon, and Evening activities."
    )

    # ── 🟢 نداء الـ Fallback Chain الذكي (Async) ──────────────────────────
    try:
        logger.info(f"Generating: {req.departure}→{req.destination} {req.duration}d via Fallback Chain")
        
        # استدعاء الدالة السحرية اللي جرب الـ 15 حساب
        parsed_json, provider_used = await call_ai_with_fallback(user_msg)
        
        logger.info(f"[AI Success] Successfully generated itinerary using provider: {provider_used}")

    except Exception as e:
        logger.error(f"All AI providers failed in Fallback Chain: {e}")
        raise HTTPException(
            status_code=502, 
            detail="All AI providers are currently rate-limited or unavailable. Please try again in a few moments."
        )

    # ── Normalise (استخراج المصفوفة) ──────────────────────
    try:
        itinerary = _extract_list(parsed_json)
    except ValueError:
        logger.error(f"Cannot extract list from payload: {str(parsed_json)[:200]}")
        raise HTTPException(500, "Unexpected AI response structure — please retry.")

    # ── Pydantic validation ───────────────────────────────────
    try:
        return TripResponse(
            departure    = req.departure,
            destination  = req.destination,
            duration     = req.duration,
            budget       = req.budget,
            travel_style = req.travel_style,
            itinerary    = itinerary,
        )
    except ValidationError as e:
        logger.error(f"Validation failed: {e.error_count()} errors")
        raise HTTPException(422, f"AI response validation failed ({e.error_count()} errors) — retry.")


# ════════════════════════════════════════════════════════════
#  POST /api/trips/save
# ════════════════════════════════════════════════════════════
@router.post("/save", response_model=TripOut, status_code=201)
def save_trip(
    body:          TripSaveRequest,
    db:           Session = Depends(get_db),
    current_user          = Depends(get_current_user),
):
    trip = Trip(
        user_id       = current_user.id,
        uuid          = str(uuid_lib.uuid4()),
        destination   = body.plan.get("destination", "Unknown"),
        from_location = body.from_location or "",
        plan          = body.plan,
    )
    db.add(trip); db.commit(); db.refresh(trip)
    logger.info(f"Trip saved for user {current_user.id} → {trip.destination}")
    return trip


# ════════════════════════════════════════════════════════════
#  GET /api/trips/my-trips
# ════════════════════════════════════════════════════════════
@router.get("/my-trips", response_model=List[TripOut])
def get_my_trips(
    db:           Session = Depends(get_db),
    current_user          = Depends(get_current_user),
):
    return (
        db.query(Trip)
        .filter(Trip.user_id == current_user.id)
        .order_by(Trip.created_at.desc())
        .all()
    )


# ════════════════════════════════════════════════════════════
#  GET /api/trips/share/{uuid}  — public
# ════════════════════════════════════════════════════════════
@router.get("/share/{trip_uuid}")
def get_shared_trip(trip_uuid: str, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.uuid == trip_uuid).first()
    if not trip:
        raise HTTPException(404, "Trip not found.")
    return trip.plan