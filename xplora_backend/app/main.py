# xplora_backend/app/main.py
# ─────────────────────────────────────────────────────────────
# Run from xplora_backend/:
#   python -m uvicorn app.main:app --reload
# ─────────────────────────────────────────────────────────────
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.database import Base, engine
from app.routers  import auth, trips

load_dotenv()

logging.basicConfig(
    level  = logging.INFO,
    format = "%(asctime)s | %(levelname)s | %(message)s",
)

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title       = "SmartTrip API",
    description = "AI-powered Moroccan Travel Planner",
    version     = "1.0.0",
    docs_url    = "/docs",
)

# ── CORS ─────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:3000",
    ],
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)

# ── Routers ───────────────────────────────────────────────────
app.include_router(auth.router,  prefix="/api/auth",  tags=["Auth"])
app.include_router(trips.router, prefix="/api/trips", tags=["Trips"])

@app.get("/", tags=["Health"])
def health():
    return {"status": "ok", "service": "SmartTrip API", "version": "1.0.0"}