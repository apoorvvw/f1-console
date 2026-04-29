from fastapi import APIRouter, HTTPException

from app.services import championship_service

router = APIRouter()


@router.get("/{year}/{round_number}/standings")
def get_championship_standings(year: int, round_number: int):
    """Return driver standings after the given round."""
    try:
        return championship_service.get_championship_standings(year, round_number)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/{year}/{round_number}/wdc-scenarios")
def get_wdc_scenarios(year: int, round_number: int):
    """
    Return drivers who can still mathematically win the WDC after the given round,
    along with their maximum possible points for the rest of the season.
    """
    try:
        return championship_service.get_wdc_scenarios(year, round_number)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
