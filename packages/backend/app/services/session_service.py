from typing import Literal

import fastf1
import pandas as pd


SessionType = Literal["FP1", "FP2", "FP3", "Q", "SQ", "R", "S"]


def get_session(year: int, event: str, session_type: SessionType) -> fastf1.core.Session:
    """Load and return a FastF1 session."""
    session = fastf1.get_session(year, event, session_type)
    session.load()
    return session


def get_session_info(year: int, event: str, session_type: SessionType) -> dict:
    """Return high-level metadata about a session."""
    session = get_session(year, event, session_type)

    try:
        fastest_driver = session.laps.pick_fastest()["Driver"]
    except Exception:
        fastest_driver = None

    return {
        "year": year,
        "event": session.event["EventName"],
        "session_type": session_type,
        "date": str(session.date),
        "fastest_driver": fastest_driver,
        "drivers": [
            {
                "number": drv,
                "abbreviation": session.get_driver(drv)["Abbreviation"],
                "full_name": session.get_driver(drv)["FullName"],
                "team": session.get_driver(drv)["TeamName"],
            }
            for drv in session.drivers
        ],
    }


def get_event_schedule(year: int) -> list[dict]:
    """Return the full event schedule for a given season."""
    schedule: pd.DataFrame = fastf1.get_event_schedule(year)
    records = schedule[
        ["RoundNumber", "EventName", "EventDate", "EventFormat", "Location", "Country"]
    ].to_dict(orient="records")
    return [
        {**r, "EventDate": str(r["EventDate"])}
        for r in records
    ]
