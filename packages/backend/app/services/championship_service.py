import fastf1
from fastf1.ergast import Ergast


POINTS_FOR_WIN = 25
POINTS_FOR_SPRINT_WIN = 8
FASTEST_LAP_POINT = 1


def get_championship_standings(year: int, round_number: int) -> dict:
    """Return driver and constructor standings after the given round."""
    ergast = Ergast()

    driver_standings_resp = ergast.get_driver_standings(season=year, round=round_number)
    driver_content = driver_standings_resp.content[0]

    constructor_standings_resp = ergast.get_constructor_standings(season=year, round=round_number)
    constructor_content = constructor_standings_resp.content[0]

    schedule = fastf1.get_event_schedule(year)
    total_rounds = len(schedule)

    drivers = [
        {
            "position": int(row["position"]) if row["position"] == row["position"] else 0,
            "driver_name": f"{row['givenName']} {row['familyName']}",
            "constructor": row["constructorNames"][0] if row["constructorNames"] else "",
            "points": float(row["points"]) if row["points"] == row["points"] else 0.0,
            "wins": int(row["wins"]) if row["wins"] == row["wins"] else 0,
        }
        for _, row in driver_content.iterrows()
    ]

    constructors = [
        {
            "position": int(row["position"]) if row["position"] == row["position"] else 0,
            "team": row["constructorName"] if row["constructorName"] == row["constructorName"] else "",
            "nationality": row["constructorNationality"] if row["constructorNationality"] == row["constructorNationality"] else "",
            "points": float(row["points"]) if row["points"] == row["points"] else 0.0,
            "wins": int(row["wins"]) if row["wins"] == row["wins"] else 0,
        }
        for _, row in constructor_content.iterrows()
    ]

    return {
        "year": year,
        "round": round_number,
        "total_rounds": total_rounds,
        "drivers": drivers,
        "constructors": constructors,
    }


def get_wdc_scenarios(year: int, round_number: int) -> dict:
    """
    Determine which drivers can still mathematically win the WDC
    given remaining races in the season.
    """
    ergast = Ergast()
    standings_resp = ergast.get_driver_standings(season=year, round=round_number)
    standings = standings_resp.content[0]

    events = fastf1.events.get_event_schedule(year, backend="ergast")
    remaining = events[events["RoundNumber"] > round_number]

    sprint_events = len(remaining[remaining["EventFormat"] == "sprint_shootout"])
    conventional_events = len(remaining[remaining["EventFormat"] == "conventional"])

    max_additional = (
        sprint_events * (POINTS_FOR_SPRINT_WIN + POINTS_FOR_WIN + FASTEST_LAP_POINT)
        + conventional_events * (POINTS_FOR_WIN + FASTEST_LAP_POINT)
    )

    leader_points = float(standings.iloc[0]["points"])

    contenders = []
    for _, row in standings.iterrows():
        driver_points = float(row["points"])
        if driver_points + max_additional >= leader_points:
            contenders.append(
                {
                    "driver": f"{row['givenName']} {row['familyName']}",
                    "current_points": driver_points,
                    "max_possible_points": driver_points + max_additional,
                    "points_behind_leader": leader_points - driver_points,
                }
            )

    return {
        "year": year,
        "round": round_number,
        "remaining_races": int(len(remaining)),
        "max_additional_points": max_additional,
        "contenders": contenders,
    }
