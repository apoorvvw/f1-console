"""Unit tests for service helper functions that do not require FastF1 network calls."""
from unittest.mock import MagicMock, patch

import pandas as pd
import pytest


class TestGetEventSchedule:
    @patch("app.services.session_service.fastf1.get_event_schedule")
    def test_returns_list_of_events(self, mock_schedule):
        mock_schedule.return_value = pd.DataFrame(
            [
                {
                    "RoundNumber": 1,
                    "EventName": "Bahrain Grand Prix",
                    "EventDate": pd.Timestamp("2024-03-02"),
                    "EventFormat": "conventional",
                    "Location": "Sakhir",
                    "Country": "Bahrain",
                }
            ]
        )

        from app.services.session_service import get_event_schedule

        result = get_event_schedule(2024)

        assert isinstance(result, list)
        assert len(result) == 1
        assert result[0]["EventName"] == "Bahrain Grand Prix"
        assert isinstance(result[0]["EventDate"], str)

    @patch("app.services.session_service.fastf1.get_event_schedule")
    def test_returns_correct_columns(self, mock_schedule):
        mock_schedule.return_value = pd.DataFrame(
            [
                {
                    "RoundNumber": 1,
                    "EventName": "Bahrain Grand Prix",
                    "EventDate": pd.Timestamp("2024-03-02"),
                    "EventFormat": "conventional",
                    "Location": "Sakhir",
                    "Country": "Bahrain",
                    "ExtraColumn": "ignored",
                }
            ]
        )

        from app.services.session_service import get_event_schedule

        result = get_event_schedule(2024)

        expected_keys = {"RoundNumber", "EventName", "EventDate", "EventFormat", "Location", "Country"}
        assert expected_keys == set(result[0].keys())


class TestGetLapTimesDistribution:
    @patch("app.services.lap_time_service.get_session")
    def test_returns_expected_shape(self, mock_get_session):
        mock_session = MagicMock()
        mock_session.drivers = ["1", "4"]

        mock_laps_df = pd.DataFrame(
            {
                "Driver": ["VER", "VER", "NOR"],
                "LapNumber": [1, 2, 1],
                "LapTime": [
                    pd.Timedelta(seconds=90),
                    pd.Timedelta(seconds=91),
                    pd.Timedelta(seconds=92),
                ],
            }
        )

        mock_session.laps.pick_drivers.return_value.pick_quicklaps.return_value.reset_index.return_value = (
            mock_laps_df
        )
        mock_session.get_driver.side_effect = lambda d: {"Abbreviation": d}
        mock_get_session.return_value = mock_session

        from app.services.lap_time_service import get_lap_times_distribution

        result = get_lap_times_distribution(2024, "Bahrain", top_n_drivers=2)

        assert result["year"] == 2024
        assert result["event"] == "Bahrain"
        assert isinstance(result["laps"], list)
        assert len(result["laps"]) == 3
