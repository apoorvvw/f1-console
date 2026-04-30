import os

import fastf1
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import FASTF1_CACHE_DIR
from app.routers import championship, lap_times, qualifying, sessions, track

os.makedirs(FASTF1_CACHE_DIR, exist_ok=True)
fastf1.Cache.enable_cache(FASTF1_CACHE_DIR)

_cors_origins_env = os.getenv("CORS_ORIGINS", "http://localhost:3000")
CORS_ORIGINS = [origin.strip() for origin in _cors_origins_env.split(",")]

app = FastAPI(
    title="F1 Console API",
    description="Formula 1 data analysis API powered by FastF1",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sessions.router, prefix="/api/sessions", tags=["sessions"])
app.include_router(lap_times.router, prefix="/api/lap-times", tags=["lap-times"])
app.include_router(qualifying.router, prefix="/api/qualifying", tags=["qualifying"])
app.include_router(championship.router, prefix="/api/championship", tags=["championship"])
app.include_router(track.router, prefix="/api/track", tags=["track"])


@app.get("/health")
def health_check():
    return {"status": "ok"}
