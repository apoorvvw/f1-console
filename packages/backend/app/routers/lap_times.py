from fastapi import APIRouter, HTTPException, Query

from app.services import lap_time_service

router = APIRouter()


@router.get("/{year}/{event}/distribution")
def get_lap_times_distribution(
    year: int,
    event: str,
    top_n_drivers: int = Query(default=10, ge=1, le=20),
):
    """
    Return lap time distribution data for the top N finishers in a race.

    Slow laps (pit stops, safety car periods) are filtered out automatically.
    """
    try:
        return lap_time_service.get_lap_times_distribution(year, event, top_n_drivers)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/{year}/{event}/{session_type}/comparison")
def get_driver_lap_comparison(
    year: int,
    event: str,
    session_type: str,
    drivers: str = Query(description="Comma-separated driver abbreviations, e.g. VER,NOR,LEC"),
):
    """
    Return lap-by-lap times for specific drivers to compare their pace directly.
    """
    try:
        driver_list = [d.strip().upper() for d in drivers.split(",") if d.strip()]
        return lap_time_service.get_driver_lap_comparison(year, event, session_type, driver_list)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
