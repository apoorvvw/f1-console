from fastapi import APIRouter, HTTPException

from app.services import race_service

router = APIRouter()


@router.get("/{year}/{event}/position-changes")
def get_position_changes(year: int, event: str):
    """
    Return per-driver per-lap position data for a race session.
    """
    try:
        return race_service.get_position_changes(year, event)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/{year}/{event}/team-pace")
def get_team_pace(year: int, event: str):
    """
    Return quick lap times grouped by team, ordered fastest to slowest median.
    """
    try:
        return race_service.get_team_pace(year, event)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/{year}/{event}/driver-laps/{driver}")
def get_driver_laps(year: int, event: str, driver: str):
    """
    Return quick laps for a single driver including tyre compound.
    """
    try:
        return race_service.get_driver_laps(year, event, driver.upper())
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
