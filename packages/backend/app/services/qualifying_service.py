import pandas as pd
from fastf1.core import Laps

from app.services.session_service import get_session


def get_qualifying_results(year: int, event: str) -> dict:
    """
    Return qualifying results with each driver's fastest lap time
    and their delta to pole position.
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

    results = []
    for pos, (_, lap) in enumerate(laps_df.iterrows(), start=1):
        driver_info = session.get_driver(lap["Driver"])
        delta = (lap["LapTime"] - pole_time).total_seconds()
        results.append(
            {
                "position": pos,
                "driver": lap["Driver"],
                "full_name": driver_info.get("FullName", ""),
                "team": driver_info.get("TeamName", ""),
                "lap_time_seconds": lap["LapTime"].total_seconds(),
                "delta_to_pole_seconds": round(delta, 3),
            }
        )

    return {"year": year, "event": event, "results": results}
