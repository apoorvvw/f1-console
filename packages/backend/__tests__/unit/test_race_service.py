"""Unit tests for race_service functions using mocked FastF1 sessions."""
from unittest.mock import MagicMock, patch

import pandas as pd
import pytest


def _make_laps(rows):
    """Build a minimal FastF1-like laps DataFrame from a list of dicts."""
    df = pd.DataFrame(rows)
    for col in ["LapNumber", "Position", "LapTime", "Driver", "Team", "Compound"]:
        if col not in df.columns:
            df[col] = None
    return df


class TestGetPositionChanges:
    @patch("app.services.race_service.get_session")
    def test_returns_expected_shape(self, mock_get_session):
        mock_session = MagicMock()
        mock_session.drivers = ["1", "44"]

        laps_ver = _make_laps([
            {"LapNumber": 1, "Position": 1, "Driver": "VER", "Team": "Red Bull Racing",
             "LapTime": pd.Timedelta(seconds=93.5), "Compound": "MEDIUM"},
            {"LapNumber": 2, "Position": 1, "Driver": "VER", "Team": "Red Bull Racing",
             "LapTime": pd.Timedelta(seconds=93.1), "Compound": "MEDIUM"},
        ])
        laps_ham = _make_laps([
            {"LapNumber": 1, "Position": 3, "Driver": "HAM", "Team": "Mercedes",
             "LapTime": pd.Timedelta(seconds=94.0), "Compound": "HARD"},
        ])

        def pick_drivers(drv):
            return laps_ver if drv == "1" else laps_ham

        mock_session.laps.pick_drivers = pick_drivers
        mock_get_session.return_value = mock_session

        from app.services.race_service import get_position_changes

        result = get_position_changes(2024, "Bahrain Grand Prix")

        assert result["year"] == 2024
        assert result["event"] == "Bahrain Grand Prix"
        assert len(result["drivers"]) == 2

        ver = next(d for d in result["drivers"] if d["abbreviation"] == "VER")
        assert ver["team"] == "Red Bull Racing"
        assert ver["laps"][0] == {"lap_number": 1, "position": 1}

    @patch("app.services.race_service.get_session")
    def test_null_position_for_retirement(self, mock_get_session):
        mock_session = MagicMock()
        mock_session.drivers = ["1"]

        laps = _make_laps([
            {"LapNumber": 1, "Position": 2, "Driver": "VER", "Team": "Red Bull Racing",
             "LapTime": pd.Timedelta(seconds=93.5), "Compound": "MEDIUM"},
            {"LapNumber": 2, "Position": float("nan"), "Driver": "VER", "Team": "Red Bull Racing",
             "LapTime": pd.Timedelta(seconds=94.0), "Compound": "MEDIUM"},
        ])
        mock_session.laps.pick_drivers = lambda _: laps
        mock_get_session.return_value = mock_session

        from app.services.race_service import get_position_changes

        result = get_position_changes(2024, "Bahrain Grand Prix")
        laps_data = result["drivers"][0]["laps"]
        assert laps_data[1]["position"] is None


class TestGetTeamPace:
    @patch("app.services.race_service.get_session")
    def test_returns_teams_ordered_by_median(self, mock_get_session):
        mock_session = MagicMock()

        quick_laps = _make_laps([
            {"LapNumber": 5, "Driver": "VER", "Team": "Red Bull Racing",
             "LapTime": pd.Timedelta(seconds=92.0), "Compound": "MEDIUM", "Position": 1},
            {"LapNumber": 6, "Driver": "VER", "Team": "Red Bull Racing",
             "LapTime": pd.Timedelta(seconds=92.5), "Compound": "MEDIUM", "Position": 1},
            {"LapNumber": 5, "Driver": "HAM", "Team": "Mercedes",
             "LapTime": pd.Timedelta(seconds=94.0), "Compound": "HARD", "Position": 3},
            {"LapNumber": 6, "Driver": "HAM", "Team": "Mercedes",
             "LapTime": pd.Timedelta(seconds=94.5), "Compound": "HARD", "Position": 3},
        ])
        mock_session.laps.pick_quicklaps.return_value = quick_laps
        mock_get_session.return_value = mock_session

        from app.services.race_service import get_team_pace

        result = get_team_pace(2024, "Bahrain Grand Prix")

        assert result["year"] == 2024
        assert len(result["teams"]) == 2
        # Red Bull (faster) should be first
        assert result["teams"][0]["team"] == "Red Bull Racing"
        assert result["teams"][1]["team"] == "Mercedes"

    @patch("app.services.race_service.get_session")
    def test_lap_time_seconds_are_floats(self, mock_get_session):
        mock_session = MagicMock()
        quick_laps = _make_laps([
            {"LapNumber": 5, "Driver": "VER", "Team": "Red Bull Racing",
             "LapTime": pd.Timedelta(seconds=93.42), "Compound": "MEDIUM", "Position": 1},
        ])
        mock_session.laps.pick_quicklaps.return_value = quick_laps
        mock_get_session.return_value = mock_session

        from app.services.race_service import get_team_pace

        result = get_team_pace(2024, "Bahrain Grand Prix")
        assert isinstance(result["teams"][0]["laps"][0]["lap_time_seconds"], float)


class TestGetDriverLaps:
    @patch("app.services.race_service.get_session")
    def test_returns_laps_with_compound(self, mock_get_session):
        mock_session = MagicMock()

        all_laps = MagicMock()
        driver_laps = _make_laps([
            {"LapNumber": 5, "Driver": "VER", "Team": "Red Bull Racing",
             "LapTime": pd.Timedelta(seconds=93.42), "Compound": "MEDIUM", "Position": 1},
            {"LapNumber": 20, "Driver": "VER", "Team": "Red Bull Racing",
             "LapTime": pd.Timedelta(seconds=92.88), "Compound": "HARD", "Position": 1},
        ])
        quick_laps = driver_laps

        all_laps.pick_drivers.return_value = MagicMock(
            pick_quicklaps=MagicMock(return_value=quick_laps),
            empty=False,
        )
        # Use a simple mock that returns team value
        all_laps.pick_drivers.return_value.__getitem__ = MagicMock(
            return_value=MagicMock(iloc=[MagicMock(return_value="Red Bull Racing")])
        )
        mock_session.laps = all_laps
        mock_get_session.return_value = mock_session

        from app.services.race_service import get_driver_laps

        # Direct test via the DataFrame path
        with patch("app.services.race_service.get_session") as m:
            s = MagicMock()
            s.laps.pick_drivers.return_value.pick_quicklaps.return_value = quick_laps
            s.laps.pick_drivers.return_value.empty = False
            s.laps.pick_drivers.return_value.__getitem__ = lambda self, key: quick_laps[key]
            m.return_value = s

            result = get_driver_laps(2024, "Bahrain Grand Prix", "VER")

        assert result["driver"] == "VER"
        assert result["year"] == 2024
        compounds = [lap["compound"] for lap in result["laps"]]
        assert "MEDIUM" in compounds or "HARD" in compounds

    @patch("app.services.race_service.get_session")
    def test_compound_uppercased(self, mock_get_session):
        mock_session = MagicMock()
        quick_laps = _make_laps([
            {"LapNumber": 5, "Driver": "VER", "Team": "Red Bull Racing",
             "LapTime": pd.Timedelta(seconds=93.42), "Compound": "soft", "Position": 1},
        ])
        mock_session.laps.pick_drivers.return_value.pick_quicklaps.return_value = quick_laps
        mock_session.laps.pick_drivers.return_value.empty = False
        mock_session.laps.pick_drivers.return_value.__getitem__ = lambda self, key: quick_laps[key]
        mock_get_session.return_value = mock_session

        from app.services.race_service import get_driver_laps

        result = get_driver_laps(2024, "Bahrain Grand Prix", "VER")
        assert result["laps"][0]["compound"] == "SOFT"
