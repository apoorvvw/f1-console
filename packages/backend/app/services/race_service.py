import pandas as pd

from app.services.session_service import get_session


def get_position_changes(year: int, event: str) -> dict:
    """
    Return per-driver per-lap position data for a race session.
    Drivers are ordered by their final finishing position.
    """
    session = get_session(year, event, "R")
    laps = session.laps

    drivers = []
    for drv in session.drivers:
        driver_laps = laps.pick_drivers(drv)
        if driver_laps.empty:
            continue

        abbreviation = driver_laps["Driver"].iloc[0]
        team = driver_laps["Team"].iloc[0] if pd.notna(driver_laps["Team"].iloc[0]) else "Unknown"

        lap_data = []
        for _, row in driver_laps.iterrows():
            lap_data.append({
                "lap_number": int(row["LapNumber"]),
                "position": int(row["Position"]) if pd.notna(row.get("Position")) else None,
            })

        drivers.append({
            "abbreviation": abbreviation,
            "team": team,
            "laps": lap_data,
        })

    return {"year": year, "event": event, "drivers": drivers}


def get_team_pace(year: int, event: str) -> dict:
    """
    Return quick lap times grouped by team, ordered by ascending median lap time.
    """
    session = get_session(year, event, "R")
    quick_laps = session.laps.pick_quicklaps()

    team_groups: dict[str, list] = {}
    for _, row in quick_laps.iterrows():
        if pd.isna(row.get("LapTime")) or pd.isna(row.get("Team")):
            continue
        team = str(row["Team"])
        if team not in team_groups:
            team_groups[team] = []
        team_groups[team].append({
            "driver": str(row["Driver"]),
            "lap_number": int(row["LapNumber"]),
            "lap_time_seconds": row["LapTime"].total_seconds(),
        })

    # Order teams by ascending median lap time
    def team_median(laps):
        times = [lap["lap_time_seconds"] for lap in laps]
        return sorted(times)[len(times) // 2]

    ordered_teams = sorted(team_groups.items(), key=lambda kv: team_median(kv[1]))

    teams = [{"team": team, "laps": laps} for team, laps in ordered_teams]
    return {"year": year, "event": event, "teams": teams}


def get_driver_laps(year: int, event: str, driver: str) -> dict:
    """
    Return quick laps for a single driver including tyre compound.
    """
    session = get_session(year, event, "R")
    driver_laps = session.laps.pick_drivers(driver).pick_quicklaps()

    if driver_laps.empty:
        team = "Unknown"
    else:
        team = str(driver_laps["Team"].iloc[0]) if pd.notna(driver_laps["Team"].iloc[0]) else "Unknown"

    laps = []
    for _, row in driver_laps.iterrows():
        if pd.isna(row.get("LapTime")):
            continue
        compound = str(row.get("Compound", "UNKNOWN") or "UNKNOWN").upper()
        laps.append({
            "lap_number": int(row["LapNumber"]),
            "lap_time_seconds": row["LapTime"].total_seconds(),
            "compound": compound,
        })

    return {"year": year, "event": event, "driver": driver, "team": team, "laps": laps}
