# API Contract: Qualifying Page Enhancements

**Feature**: `002-qualifying-page-enhancements`  
**Date**: 2026-04-30  
**Scope**: Changes to existing qualifying results endpoint only. All other endpoints are unchanged.

---

## Modified Endpoint

### `GET /api/qualifying/{year}/{event}`

Returns qualifying results for a given season and event. The response shape is
**backward-compatible** — one new field (`team_color`) is added to each result
object; all existing fields are preserved.

**Path Parameters**

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `year` | `int` | `2024` | Season year |
| `event` | `str` | `Monaco` or `8` | Event name or round number (URL-encoded) |

**Response: 200 OK**

```json
{
  "year": 2024,
  "event": "Monaco Grand Prix",
  "results": [
    {
      "position": 1,
      "driver": "LEC",
      "full_name": "Charles Leclerc",
      "team": "Ferrari",
      "team_color": "#E8002D",
      "lap_time_seconds": 70.270,
      "delta_to_pole_seconds": 0.0,
      "q1_seconds": 71.383,
      "q2_seconds": 70.526,
      "q3_seconds": 70.270
    },
    {
      "position": 2,
      "driver": "SAI",
      "full_name": "Carlos Sainz",
      "team": "Ferrari",
      "team_color": "#E8002D",
      "lap_time_seconds": 70.341,
      "delta_to_pole_seconds": 0.071,
      "q1_seconds": 71.521,
      "q2_seconds": 70.761,
      "q3_seconds": 70.341
    },
    {
      "position": 18,
      "driver": "ALB",
      "full_name": "Alexander Albon",
      "team": "Williams",
      "team_color": "#64C4FF",
      "lap_time_seconds": 71.842,
      "delta_to_pole_seconds": 1.572,
      "q1_seconds": 71.842,
      "q2_seconds": null,
      "q3_seconds": null
    }
  ]
}
```

**New field: `team_color`**

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `team_color` | `string` | No | Hex RGB colour code for the driver's team (e.g. `"#3671C6"`). Falls back to `"#808080"` if FastF1 cannot resolve the team name. |

**Error Responses**

| Status | Condition |
|--------|-----------|
| `500 Internal Server Error` | FastF1 failed to load session data (e.g. unknown event, network error during initial cache population) |

---

## Unchanged Endpoints (consumed by qualifying page)

### `GET /api/track/{year}/{event}/Q/speed/{driver}`

No changes. Called client-side when a driver is selected. Returns `TelemetryData`
for the driver's fastest qualifying lap.

### `GET /api/track/{year}/{event}/corners`

No changes. Called once per event to load corner annotation coordinates.
