import pandas as pd
from fastf1.core import Laps
from typing import Optional

from app.services.session_service import get_session


def _timedelta_to_seconds(td) -> Optional[float]:
    """Convert a pandas Timedelta/timedelta to float seconds, or None if NaT/None."""
    if pd.isna(td):
        return None
    try:
        return td.total_seconds()
    except AttributeError:
        return None


def get_qualifying_results(year: int, event: str) -> dict:
    """
    Return qualifying results with each driver's fastest lap time,
    delta to pole, and Q1/Q2/Q3 session times.
    """
    session = get_session(year, event, "Q")

    drivers = pd.unique(session.laps["Driver"])

    fastest_laps: list = []
    for drv in drivers:
        fastest = session.laps.pick_drivers(drv).pick_fastest()
        if fastest is not None and pd.notna(fastest["LapTime"]):
            fastest_laps.append(fastest)

    laps_df = Laps(fastest_laps).sort_values(by="LapTime").reset_index(drop=True)

    pole_time = laps_df.iloc[0]["LapTime"]

    # Build Q1/Q2/Q3 lookup from session.results if available
    q_times: dict = {}
    try:
        results_df = session.results[["Abbreviation", "Q1", "Q2", "Q3"]]
        for _, row in results_df.iterrows():
            q_times[row["Abbreviation"]] = {
                "q1_seconds": _timedelta_to_seconds(row["Q1"]),
                "q2_seconds": _timedelta_to_seconds(row["Q2"]),
                "q3_seconds": _timedelta_to_seconds(row["Q3"]),
            }
    except (KeyError, AttributeError):
        pass

    results = []
    for pos, (_, lap) in enumerate(laps_df.iterrows(), start=1):
        driver_info = session.get_driver(lap["Driver"])
        delta = (lap["LapTime"] - pole_time).total_seconds()
        drv_q = q_times.get(lap["Driver"], {})
        results.append(
            {
                "position": pos,
                "driver": lap["Driver"],
                "full_name": driver_info.get("FullName", ""),
                "team": driver_info.get("TeamName", ""),
                "lap_time_seconds": lap["LapTime"].total_seconds(),
                "delta_to_pole_seconds": round(delta, 3),
                "q1_seconds": drv_q.get("q1_seconds"),
                "q2_seconds": drv_q.get("q2_seconds"),
                "q3_seconds": drv_q.get("q3_seconds"),
            }
        )

    return {"year": year, "event": event, "results": results}
