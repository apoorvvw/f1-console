import pandas as pd

from app.services.session_service import get_session


def get_lap_times_distribution(year: int, event: str, top_n_drivers: int = 10) -> dict:
    """
    Return lap time data for the top N point finishers in a race session,
    filtering out slow laps (pit stops, safety car periods, etc.).
    """
    session = get_session(year, event, "R")

    point_finishers = session.drivers[:top_n_drivers]
    driver_laps = (
        session.laps.pick_drivers(point_finishers)
        .pick_quicklaps()
        .reset_index()
    )

    finishing_order = [session.get_driver(d)["Abbreviation"] for d in point_finishers]

    laps_data = [
        {
            "driver": row["Driver"],
            "lap_number": int(row["LapNumber"]),
            "lap_time_seconds": row["LapTime"].total_seconds() if pd.notna(row["LapTime"]) else None,
        }
        for _, row in driver_laps.iterrows()
        if pd.notna(row.get("LapTime"))
    ]

    return {
        "year": year,
        "event": event,
        "finishing_order": finishing_order,
        "laps": laps_data,
    }


def get_driver_lap_comparison(
    year: int, event: str, session_type: str, drivers: list[str]
) -> dict:
    """
    Return lap-by-lap times for specific drivers to enable direct comparison.
    """
    session = get_session(year, event, session_type)

    result: dict[str, list] = {}
    for abbreviation in drivers:
        driver_laps = session.laps.pick_drivers(abbreviation).pick_quicklaps()
        result[abbreviation] = [
            {
                "lap_number": int(row["LapNumber"]),
                "lap_time_seconds": row["LapTime"].total_seconds(),
                "compound": row.get("Compound", "UNKNOWN"),
            }
            for _, row in driver_laps.iterrows()
            if pd.notna(row.get("LapTime"))
        ]

    return {"year": year, "event": event, "session_type": session_type, "drivers": result}
