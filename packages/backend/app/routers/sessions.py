from fastapi import APIRouter, HTTPException

from app.services import session_service

router = APIRouter()


@router.get("/schedule/{year}")
def get_event_schedule(year: int):
    """Return the full event schedule for a season."""
    try:
        return session_service.get_event_schedule(year)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/{year}/{event}/{session_type}")
def get_session_info(year: int, event: str, session_type: str):
    """
    Return metadata for a specific session.

    - **year**: Season year (e.g. 2024)
    - **event**: Event name or round number (e.g. "Bahrain" or "1")
    - **session_type**: One of FP1, FP2, FP3, Q, SQ, R, S
    """
    try:
        return session_service.get_session_info(year, event, session_type)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
