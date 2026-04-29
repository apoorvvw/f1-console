import fastf1
from fastf1.ergast import Ergast


POINTS_FOR_WIN = 25
POINTS_FOR_SPRINT_WIN = 8
FASTEST_LAP_POINT = 1


def get_championship_standings(year: int, round_number: int) -> dict:
    """Return driver standings after the given round."""
    ergast = Ergast()
    standings = ergast.get_driver_standings(season=year, round=round_number)
    content = standings.content[0]

    return {
        "year": year,
        "round": round_number,
        "standings": [
            {
                "position": int(row["position"]),
                "driver": f"{row['givenName']} {row['familyName']}",
                "constructor": row["constructorNames"][0] if row["constructorNames"] else "",
                "points": float(row["points"]),
                "wins": int(row["wins"]),
            }
            for _, row in content.iterrows()
        ],
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
