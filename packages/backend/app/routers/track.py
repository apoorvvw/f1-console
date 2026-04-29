from fastapi import APIRouter, HTTPException

from app.services import track_service

router = APIRouter()


@router.get("/{year}/{event}/{session_type}/speed/{driver}")
def get_driver_speed_on_track(year: int, event: str, session_type: str, driver: str):
    """
    Return telemetry (speed, throttle, brake, X/Y coordinates) for a driver's
    fastest lap — useful for plotting speed across the track layout.

    - **driver**: Three-letter driver abbreviation (e.g. VER, HAM, LEC)
    """
    try:
        return track_service.get_driver_speed_on_track(
            year, event, session_type, driver.upper()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/{year}/{event}/corners")
def get_corner_annotations(year: int, event: str):
    """
    Return corner data (number, letter, angle, distance, X/Y) for a circuit.
    Data is sourced from the qualifying session of the given event.
    """
    try:
        return track_service.get_corner_annotations(year, event)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
