# Data Model: F1 React Dashboard

**Phase 1 output for**: `specs/001-f1-react-dashboard/plan.md`  
**Date**: 2026-04-29

This document describes the data shapes flowing between the FastAPI backend and the React frontend. All entities are JSON API response shapes — no database schema is involved (FastF1 file cache is the storage layer, managed entirely by the backend).

---

## 1. EventSchedule

Returned by `GET /sessions/schedule/{year}`.

```json
[
  {
    "RoundNumber": 1,
    "EventName": "Bahrain Grand Prix",
    "EventDate": "2024-03-02",
    "EventFormat": "conventional",
    "Location": "Sakhir",
    "Country": "Bahrain"
  }
]
```

**Frontend use**: Session selector year→GP hierarchy; deriving `total_rounds = schedule.length` for championship views.

**Validation rules**:
- `RoundNumber` ≥ 1
- `EventDate` is an ISO 8601 date string

---

## 2. SessionInfo

Returned by `GET /sessions/{year}/{event}/{session_type}`.

```json
{
  "year": 2024,
  "event": "Bahrain Grand Prix",
  "session_type": "R",
  "date": "2024-03-02 15:00:00",
  "drivers": [
    {
      "number": "1",
      "abbreviation": "VER",
      "full_name": "Max Verstappen",
      "team": "Red Bull Racing"
    }
  ]
}
```

**Frontend use**: Populating driver filter dropdowns (FR-008); session metadata header.

**Validation rules**:
- `session_type` one of: `FP1`, `FP2`, `FP3`, `Q`, `SQ`, `R`, `S`
- `drivers` array is non-empty for any loaded session

---

## 3. LapDistribution

Returned by `GET /lap-times/{year}/{event}/distribution`.

```json
{
  "year": 2024,
  "event": "Bahrain Grand Prix",
  "drivers": [
    {
      "driver": "VER",
      "team": "Red Bull Racing",
      "compound": "MEDIUM",
      "lap_times_seconds": [91.234, 91.456, 91.123]
    }
  ]
}
```

**Frontend use**: Nivo `<ResponsiveBoxPlot>` — each driver becomes one box. Filtered by compound (FR-009) and driver selection (FR-008) client-side.

**Validation rules**:
- `lap_times_seconds` contains only clean laps (pit outliers already filtered by backend service)
- `compound` one of: `SOFT`, `MEDIUM`, `HARD`, `INTERMEDIATE`, `WET`

---

## 4. DriverLapComparison

Returned by `GET /lap-times/{year}/{event}/{session_type}/comparison?drivers=VER,NOR`.

```json
{
  "year": 2024,
  "event": "Bahrain Grand Prix",
  "session_type": "R",
  "drivers": [
    {
      "driver": "VER",
      "laps": [
        { "lap_number": 1, "lap_time_seconds": 91.234, "compound": "MEDIUM", "is_outlier": false }
      ]
    }
  ]
}
```

**Frontend use**: Nivo `<ResponsiveLine>` with one series per driver (FR-007).

**State transitions**: `is_outlier: true` laps are visually marked but not removed — user can toggle visibility (FR-011).

---

## 5. QualifyingResults

Returned by `GET /qualifying/{year}/{event}`. *(Modified — adds Q1/Q2/Q3 fields)*

```json
{
  "year": 2024,
  "event": "Bahrain Grand Prix",
  "results": [
    {
      "position": 1,
      "driver": "VER",
      "full_name": "Max Verstappen",
      "team": "Red Bull Racing",
      "q1_seconds": 90.123,
      "q2_seconds": 89.876,
      "q3_seconds": 89.441,
      "best_lap_seconds": 89.441,
      "delta_to_pole_seconds": 0.0
    }
  ]
}
```

**Frontend use**: MUI DataGrid table (FR-018). Round filter toggles Q1/Q2/Q3 column visibility (FR-019). Row click opens `DriverDetailPanel` (FR-020).

**Validation rules**:
- `q2_seconds` and `q3_seconds` may be `null` for drivers eliminated in Q1/Q2.
- `position` is sorted ascending (1 = pole).

---

## 6. TelemetryLap

Returned by:
- `GET /track/{year}/{event}/{session_type}/speed/{driver}` (fastest lap — existing)
- `GET /track/{year}/{event}/{session_type}/{driver}/lap/{lap_number}` *(new endpoint)*

```json
{
  "year": 2024,
  "event": "Bahrain Grand Prix",
  "session_type": "Q",
  "driver": "VER",
  "lap_number": 18,
  "points": [
    {
      "distance": 0.0,
      "x": 412.3,
      "y": -103.2,
      "speed": 143,
      "throttle": 100.0,
      "brake": false,
      "gear": 3,
      "drs": 0
    }
  ]
}
```

**Frontend use**: Canvas 2D track map (FR-013/FR-014). Speed/throttle/brake toggle updates the color value used per segment (FR-015). Hover tooltip reads nearest point by distance (FR-017).

**Validation rules**:
- `points` array is ordered by ascending `distance`.
- `x`, `y` are normalised circuit coordinates (unitless, consistent scale within a season/event).
- `speed` in km/h; `throttle` 0–100%; `brake` boolean; `drs` 0 or 1.

---

## 7. CornerAnnotations

Returned by `GET /track/{year}/{event}/corners`.

```json
{
  "year": 2024,
  "event": "Bahrain Grand Prix",
  "corners": [
    {
      "number": 1,
      "letter": "",
      "angle": 180.0,
      "distance": 155.0,
      "x": 398.1,
      "y": -87.4
    }
  ]
}
```

**Frontend use**: Rendered as labeled circles on the Canvas track map when corner annotation toggle is enabled (FR-016).

---

## 8. ChampionshipStandings

Returned by `GET /championship/{year}/{round_number}/standings`. *(Modified — adds `total_rounds`)*

```json
{
  "year": 2024,
  "round": 5,
  "total_rounds": 24,
  "standings": [
    {
      "position": 1,
      "driver": "VER",
      "full_name": "Max Verstappen",
      "team": "Red Bull Racing",
      "points": 136,
      "wins": 5
    }
  ]
}
```

**Frontend use**: Standings table (FR-021). `total_rounds` displayed as "Round 5 of 24". `remaining_points` derived client-side: `(total_rounds - round) * 26` (max points per race).

---

## 9. WDCScenarios

Returned by `GET /championship/{year}/{round_number}/wdc-scenarios`.

```json
{
  "year": 2024,
  "round": 5,
  "remaining_races": 19,
  "remaining_points": 494,
  "leader_points": 136,
  "scenarios": [
    {
      "driver": "VER",
      "full_name": "Max Verstappen",
      "current_points": 136,
      "max_possible_points": 630,
      "can_win": true,
      "points_needed": 0
    }
  ]
}
```

**Frontend use**: Championship table badges and `ScenarioPanel` (FR-022/FR-023/FR-024). `can_win: false` drivers are visually dimmed.

---

## 10. Client-Side State

These entities live in the browser (React Context + localStorage) and are not persisted on the backend.

### ActiveSession (React Context)
```js
{
  year: 2024,
  event: 'Bahrain Grand Prix',
  sessionType: 'R',       // FP1|FP2|FP3|Q|SQ|R|S
}
```

### RecentSessions (localStorage, `f1.recentSessions`)
```js
[
  { year: 2024, event: 'Bahrain Grand Prix', sessionType: 'R', label: '2024 Bahrain GP – Race' }
  // max 5 entries, newest first
]
```

### FilterState (component-local, not persisted)
```js
{
  selectedDrivers: ['VER', 'NOR'],   // empty = all drivers
  selectedCompound: null,             // null = all compounds
  lapRange: [1, 57],                 // [min, max] lap numbers
  qualifyingRound: null,             // null | 'Q1' | 'Q2' | 'Q3'
  telemetryMetric: 'speed',          // 'speed' | 'throttle' | 'brake'
  selectedLapNumber: null,           // null = fastest lap
}
```
