from fastapi import HTTPException

from app.services.session_service import get_session


def get_driver_speed_on_track(
    year: int, event: str, session_type: str, driver: str
) -> dict:
    """
    Return telemetry data (distance, speed, throttle, brake) for a driver's
    fastest lap, suitable for plotting speed on track layout.
    """
    session = get_session(year, event, session_type)

    fastest_lap = session.laps.pick_drivers(driver).pick_fastest()
    telemetry = fastest_lap.get_telemetry().add_distance()

    data = [
        {
            "distance": round(float(row["Distance"]), 2),
            "speed": float(row["Speed"]),
            "throttle": float(row["Throttle"]),
            "brake": bool(row["Brake"]),
            "x": float(row["X"]),
            "y": float(row["Y"]),
        }
        for _, row in telemetry.iterrows()
    ]

    return {
        "year": year,
        "event": event,
        "session_type": session_type,
        "driver": driver,
        "lap_time_seconds": fastest_lap["LapTime"].total_seconds(),
        "telemetry": data,
    }


def get_driver_lap_telemetry(
    year: int, event: str, session_type: str, driver: str, lap_number: int
) -> dict:
    """
    Return telemetry for a specific lap number of the given driver.
    Raises 404 if the lap is not found.
    """
    session = get_session(year, event, session_type)
    driver_laps = session.laps.pick_drivers(driver)

    if lap_number < 1 or lap_number > len(driver_laps):
        raise HTTPException(
            status_code=404,
            detail=f"Lap {lap_number} not found for driver {driver}. "
                   f"Available laps: 1–{len(driver_laps)}",
        )

    lap = driver_laps.iloc[lap_number - 1]
    telemetry = lap.get_telemetry().add_distance()

    data = [
        {
            "distance": round(float(row["Distance"]), 2),
            "speed": float(row["Speed"]),
            "throttle": float(row["Throttle"]),
            "brake": bool(row["Brake"]),
            "x": float(row["X"]),
            "y": float(row["Y"]),
        }
        for _, row in telemetry.iterrows()
    ]

    return {
        "year": year,
        "event": event,
        "session_type": session_type,
        "driver": driver,
        "lap_number": lap_number,
        "lap_time_seconds": lap["LapTime"].total_seconds(),
        "telemetry": data,
    }


def get_corner_annotations(year: int, event: str) -> dict:
    """
    Return circuit corner data (number, letter, angle, distance) for a given event.
    """
    session = get_session(year, event, "Q")
    circuit_info = session.get_circuit_info()

    corners = [
        {
            "number": int(row["Number"]),
            "letter": str(row["Letter"]),
            "angle": float(row["Angle"]),
            "distance": float(row["Distance"]),
            "x": float(row["X"]),
            "y": float(row["Y"]),
        }
        for _, row in circuit_info.corners.iterrows()
    ]

    return {"year": year, "event": event, "corners": corners}
