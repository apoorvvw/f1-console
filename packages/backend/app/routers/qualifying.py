from fastapi import APIRouter, HTTPException

from app.services import qualifying_service

router = APIRouter()


@router.get("/{year}/{event}")
def get_qualifying_results(year: int, event: str):
    """
    Return qualifying results with fastest lap times and delta to pole position.

    - **year**: Season year (e.g. 2024)
    - **event**: Event name or round number (e.g. "Monaco" or "8")
    """
    try:
        return qualifying_service.get_qualifying_results(year, event)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
