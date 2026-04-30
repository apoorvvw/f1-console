# Data Model: Race Tab Visualizations

**Phase**: 1 — Design  
**Branch**: `003-race-tab-visualizations`  
**Date**: 2026-04-30

---

## Entities

### 1. `RaceSession`

Represents a completed Formula 1 race, identified by calendar year and event name.

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| `year` | integer | URL param | e.g. `2024` |
| `event` | string | URL param | e.g. `"Bahrain Grand Prix"` |
| `session_type` | string (enum) | Fixed `"R"` | Race session |
| `total_laps` | integer | FastF1 | Total race laps completed |
| `drivers` | `Driver[]` | FastF1 `session.drivers` | Ordered by finishing position |

---

### 2. `Driver`

A race participant, enriched with team and display styling.

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| `abbreviation` | string (3-char) | FastF1 `session.get_driver()` | e.g. `"VER"` |
| `full_name` | string | FastF1 | e.g. `"Max Verstappen"` |
| `team` | string | FastF1 `session.laps["Team"]` | e.g. `"Red Bull Racing"` |

---

### 3. `PositionLap`

One driver's position at a specific lap — the unit of the position changes chart.

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| `driver` | string (abbr) | FastF1 `laps["Driver"]` | e.g. `"VER"` |
| `team` | string | FastF1 `laps["Team"]` | Used for default line colour |
| `lap_number` | integer | FastF1 `laps["LapNumber"]` | 1-indexed |
| `position` | integer | FastF1 `laps["Position"]` | 1 = leader; null if retired |

**API Shape** (grouped by driver):

```json
{
  "year": 2024,
  "event": "Bahrain Grand Prix",
  "drivers": [
    {
      "abbreviation": "VER",
      "team": "Red Bull Racing",
      "laps": [
        { "lap_number": 1, "position": 1 },
        { "lap_number": 2, "position": 1 }
      ]
    }
  ]
}
```

---

### 4. `TeamPaceLap`

A single quick lap belonging to a team — the unit of the team pace boxplot.

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| `team` | string | FastF1 `laps["Team"]` | Constructor name |
| `driver` | string (abbr) | FastF1 `laps["Driver"]` | For tooltip |
| `lap_number` | integer | FastF1 | For tooltip |
| `lap_time_seconds` | float | FastF1 `laps["LapTime"].dt.total_seconds()` | Quick laps only (slow laps filtered) |

**API Shape**:

```json
{
  "year": 2024,
  "event": "Bahrain Grand Prix",
  "teams": [
    {
      "team": "Red Bull Racing",
      "laps": [
        { "driver": "VER", "lap_number": 3, "lap_time_seconds": 93.42 }
      ]
    }
  ]
}
```

---

### 5. `DriverRaceLap`

A single lap for a specific driver, including tyre compound — the unit of the single-driver scatterplot.

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| `lap_number` | integer | FastF1 | 1-indexed |
| `lap_time_seconds` | float | FastF1 | Quick laps only |
| `compound` | string (enum) | FastF1 `laps["Compound"]` | `SOFT / MEDIUM / HARD / INTERMEDIATE / WET` |

**API Shape**:

```json
{
  "year": 2024,
  "event": "Bahrain Grand Prix",
  "driver": "VER",
  "team": "Red Bull Racing",
  "laps": [
    { "lap_number": 5, "lap_time_seconds": 93.42, "compound": "MEDIUM" }
  ]
}
```

---

### 6. `DriverComparison` (existing — reused)

Multi-driver lap time comparison, already provided by `/api/lap-times/{year}/{event}/R/comparison`.

```json
{
  "year": 2024,
  "event": "Bahrain Grand Prix",
  "session_type": "R",
  "drivers": {
    "VER": [
      { "lap_number": 1, "lap_time_seconds": 93.5, "compound": "MEDIUM" }
    ]
  }
}
```

---

## Frontend State Model

```text
RacePage local state
├── selectedDrivers: Set<string>       // e.g. new Set(["VER", "NOR"])
├── selectedTeam: string | null        // e.g. "Red Bull Racing"
└── (session from SessionContext)      // { year, event, sessionType }

Derived:
├── driverCount = selectedDrivers.size
├── showScatterplot = driverCount === 1
├── showComparison = driverCount >= 2
└── highlightedDrivers = selectedTeam
      ? drivers where team === selectedTeam
      : [...selectedDrivers]
```

---

## Compound Colour Constants (shared)

Extracted from `LapDistributionChart.jsx` to `src/constants/compoundColors.js`:

```js
export const COMPOUND_COLORS = {
  SOFT: '#e8002d',
  MEDIUM: '#FFC906',
  HARD: '#f0f0f0',
  INTERMEDIATE: '#39b54a',
  WET: '#0067ff',
  UNKNOWN: '#888888',
};
```

---

## Validation Rules

- `lap_time_seconds` values must be non-null (filter `pd.notna(row["LapTime"])`).
- Quick laps filter: use FastF1 `session.laps.pick_quicklaps()` (removes laps >107% of fastest).
- `position` may be `null` for DNF/DNS laps — frontend renders gap in the line.
- `compound` may be `"UNKNOWN"` if not recorded — mapped to grey in the colour constants.
