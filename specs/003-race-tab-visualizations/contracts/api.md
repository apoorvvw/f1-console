# API Contracts: Race Tab Visualizations

**Phase**: 1 — Design  
**Branch**: `003-race-tab-visualizations`  
**Date**: 2026-04-30  
**Base URL**: `http://localhost:8000` (dev) / `VITE_API_BASE_URL` (production)

---

## New Endpoints

### `GET /api/race/{year}/{event}/position-changes`

Returns every driver's position at each lap of the race.

**Path parameters**

| Param | Type | Example | Notes |
|-------|------|---------|-------|
| `year` | integer | `2024` | Four-digit season year |
| `event` | string (URL-encoded) | `Bahrain%20Grand%20Prix` | Event name as used by FastF1 |

**Response `200 OK`**

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
        { "lap_number": 2, "position": 1 },
        { "lap_number": 57, "position": null }
      ]
    }
  ]
}
```

**Notes**
- `position` is `null` when the driver has retired or did not record a position for that lap.
- Drivers are ordered by their final finishing position.
- All race laps are included (not filtered for quick laps).

**Error responses**

| Status | When |
|--------|------|
| `500` | FastF1 session load failure or race not yet held |

---

### `GET /api/race/{year}/{event}/team-pace`

Returns quick lap times grouped by team for the team pace boxplot.

**Path parameters** — same as above.

**Response `200 OK`**

```json
{
  "year": 2024,
  "event": "Bahrain Grand Prix",
  "teams": [
    {
      "team": "Red Bull Racing",
      "laps": [
        { "driver": "VER", "lap_number": 3, "lap_time_seconds": 93.42 },
        { "driver": "PER", "lap_number": 3, "lap_time_seconds": 93.78 }
      ]
    }
  ]
}
```

**Notes**
- Lap times are filtered using FastF1's `pick_quicklaps()` (within 107% of fastest).
- Teams are ordered by ascending median lap time (fastest first).
- `lap_time_seconds` is always a non-null float (filtered on the backend).

---

### `GET /api/race/{year}/{event}/driver-laps/{driver}`

Returns quick laps for a single driver, including tyre compound, for the scatterplot.

**Path parameters**

| Param | Type | Example |
|-------|------|---------|
| `year` | integer | `2024` |
| `event` | string | `Bahrain%20Grand%20Prix` |
| `driver` | string | `VER` |

**Response `200 OK`**

```json
{
  "year": 2024,
  "event": "Bahrain Grand Prix",
  "driver": "VER",
  "team": "Red Bull Racing",
  "laps": [
    { "lap_number": 5, "lap_time_seconds": 93.42, "compound": "MEDIUM" },
    { "lap_number": 20, "lap_time_seconds": 92.88, "compound": "HARD" }
  ]
}
```

**Notes**
- `compound` is one of `SOFT / MEDIUM / HARD / INTERMEDIATE / WET / UNKNOWN`.
- Quick laps only; slow laps (pit in/out, safety car) are excluded.

---

## Existing Endpoint Reused

### `GET /api/lap-times/{year}/{event}/R/comparison?drivers={csv}`

Used for the multi-driver comparison chart (2+ drivers selected). No changes needed.

**Example**: `GET /api/lap-times/2024/Bahrain%20Grand%20Prix/R/comparison?drivers=VER,NOR`

**Response** — see existing `contracts/api.md` in `specs/002-qualifying-page-enhancements/`.

---

## Removed Endpoints (no longer called by any frontend page after this feature)

| Endpoint | Reason |
|----------|--------|
| `GET /api/lap-times/{year}/{event}/distribution` | Lap Times page is removed; no remaining caller |

> **Note**: The backend router and service code for `distribution` will be **deleted** as part of this feature to avoid dead code. The `/comparison` endpoint remains because the Race tab reuses it.
