import pandas as pd

from app.services.session_service import get_session


def get_driver_lap_comparison(
    year: int, event: str, session_type: str, drivers: list[str]
) -> dict:
    """
    Return lap-by-lap times for specific drivers to enable direct comparison.
    """
    session = get_session(year, event, session_type)

    result: dict[str, list] = {}
    teams: dict[str, str] = {}
    for abbreviation in drivers:
        driver_laps = session.laps.pick_drivers(abbreviation).pick_quicklaps()
        if not driver_laps.empty:
            teams[abbreviation] = str(driver_laps.iloc[0].get("Team", ""))
        result[abbreviation] = [
            {
                "lap_number": int(row["LapNumber"]),
                "lap_time_seconds": row["LapTime"].total_seconds(),
                "compound": row.get("Compound", "UNKNOWN"),
            }
            for _, row in driver_laps.iterrows()
            if pd.notna(row.get("LapTime"))
        ]

    return {"year": year, "event": event, "session_type": session_type, "drivers": result, "teams": teams}
