# API Contracts: F1 React Dashboard Backend

**Phase 1 output for**: `specs/001-f1-react-dashboard/plan.md`  
**Date**: 2026-04-29  
**Base URL**: `http://localhost:3030` (configurable via `VITE_API_BASE_URL` environment variable)  
**API Version prefix**: `/api/v1` (recommended — add prefix in FastAPI `main.py` router registration)

---

## Existing Endpoints (no changes)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/sessions/schedule/{year}` | Full event schedule for a season |
| GET | `/sessions/{year}/{event}/{session_type}` | Session metadata + driver list |
| GET | `/lap-times/{year}/{event}/distribution` | Lap time distributions for top N drivers |
| GET | `/lap-times/{year}/{event}/{session_type}/comparison` | Lap-by-lap comparison for specified drivers |
| GET | `/track/{year}/{event}/{session_type}/speed/{driver}` | Fastest lap telemetry |
| GET | `/track/{year}/{event}/corners` | Corner annotations for a circuit |
| GET | `/championship/{year}/{round_number}/wdc-scenarios` | WDC mathematical scenarios |

---

## Modified Endpoints

### GET `/qualifying/{year}/{event}`

**Change**: Add `q1_seconds`, `q2_seconds`, `q3_seconds` to each result entry.

**Request**
```
GET /qualifying/2024/Bahrain
```

**Response** `200 OK`
```json
{
  "year": 2024,
  "event": "Bahrain",
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
    },
    {
      "position": 16,
      "driver": "ALB",
      "full_name": "Alexander Albon",
      "team": "Williams",
      "q1_seconds": 91.045,
      "q2_seconds": null,
      "q3_seconds": null,
      "best_lap_seconds": 91.045,
      "delta_to_pole_seconds": 1.604
    }
  ]
}
```

**Notes**:
- `q2_seconds` and `q3_seconds` are `null` when a driver did not participate in that round.
- Backend reads `session.results[['Abbreviation','Q1','Q2','Q3']]` — these are FastF1 `timedelta` columns converted to `.total_seconds()`. `NaT` maps to `null`.

---

### GET `/championship/{year}/{round_number}/standings`

**Change**: Add `total_rounds` field to response root.

**Request**
```
GET /championship/2024/5/standings
```

**Response** `200 OK`
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

**Notes**:
- `total_rounds` is derived from `len(fastf1.get_event_schedule(year))` in the service layer.

---

## New Endpoints

### GET `/track/{year}/{event}/{session_type}/{driver}/lap/{lap_number}`

**Purpose**: Return telemetry for a specific lap number (FR-014/FR-017). The existing `/track/.../speed/{driver}` endpoint remains unchanged as the default (fastest lap).

**Request**
```
GET /track/2024/Bahrain/Q/VER/lap/18
```

**Path parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `year` | integer | Season year |
| `event` | string | Event name or round number |
| `session_type` | string | Session type: `FP1`, `FP2`, `FP3`, `Q`, `SQ`, `R`, `S` |
| `driver` | string | Three-letter driver abbreviation (case-insensitive, normalised to uppercase) |
| `lap_number` | integer | Lap number within the session (1-indexed) |

**Response** `200 OK`
```json
{
  "year": 2024,
  "event": "Bahrain",
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

**Response** `404 Not Found` — lap number does not exist for this driver/session
```json
{ "detail": "Lap 18 not found for driver VER in 2024 Bahrain Q" }
```

**Notes**:
- Response shape is identical to `GET /track/{year}/{event}/{session_type}/speed/{driver}` to allow the frontend to use the same rendering path.
- The frontend handles speed/throttle/brake toggle by selecting which `points[i]` field drives the color scale — no additional backend variants needed.
- `points` are ordered by ascending `distance`.

---

## Error Responses (all endpoints)

| Code | Condition |
|------|-----------|
| `400 Bad Request` | Invalid parameter value (e.g., unknown session type) |
| `404 Not Found` | Session/event/driver/lap not found in FastF1 data |
| `500 Internal Server Error` | FastF1 data loading failure (network, corrupt cache) |

All error responses follow the shape: `{ "detail": "<human-readable message>" }`

---

## Frontend API Client Convention

The React frontend wraps all fetch calls in functions under `packages/frontend/src/api/`. These functions are called exclusively from TanStack Query `queryFn` arguments — never called directly from components.

```js
// packages/frontend/src/api/qualifying.js
export async function fetchQualifyingResults(year, event) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/qualifying/${year}/${event}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
```

**CORS**: The FastAPI backend must allow `http://localhost:3000` as an allowed origin. Configure in `app/main.py` using `fastapi.middleware.cors.CORSMiddleware` with `allow_origins` set via environment variable.
