# Data Model: Qualifying Page Enhancements

**Feature**: `002-qualifying-page-enhancements`  
**Date**: 2026-04-30

---

## Entities

### QualifyingResult *(backend response shape — one item per driver)*

| Field | Type | Notes |
|-------|------|-------|
| `position` | `int` | 1-based grid position; ordered by best lap time |
| `driver` | `str` | Three-letter abbreviation (e.g. `"VER"`) |
| `full_name` | `str` | Full driver name (e.g. `"Max Verstappen"`) |
| `team` | `str` | Full team name (e.g. `"Red Bull Racing"`) |
| `team_color` | `str` | Hex RGB colour string (e.g. `"#3671C6"`); **NEW field** |
| `lap_time_seconds` | `float` | Best qualifying lap time in seconds |
| `delta_to_pole_seconds` | `float` | Gap to pole in seconds; `0.0` for P1 |
| `q1_seconds` | `float \| null` | Q1 fastest lap in seconds; `null` if not set |
| `q2_seconds` | `float \| null` | Q2 fastest lap in seconds; `null` if did not reach Q2 |
| `q3_seconds` | `float \| null` | Q3 fastest lap in seconds; `null` if did not reach Q3 |

**Source**: `packages/backend/app/services/qualifying_service.py`  
**Change**: Add `team_color` field via `fastf1.plotting.get_team_color(team, session=session)` with `#808080` fallback.

---

### QualifyingResultsResponse *(top-level backend response)*

| Field | Type | Notes |
|-------|------|-------|
| `year` | `int` | Season year |
| `event` | `str` | Event name |
| `results` | `QualifyingResult[]` | Array ordered by position (P1 first) |

---

### SelectedDriver *(client-side state — not persisted)*

| Field | Type | Notes |
|-------|------|-------|
| `driver` | `str` | Abbreviation of the currently selected driver (e.g. `"VER"`) |
| *(other QualifyingResult fields)* | — | Full row object is stored so downstream components (stats card) can read Q times without re-fetching |

**Shared via**: `useState` in `QualifyingPage`; passed as prop to `QualifyingDeltaChart`, `QualifyingTable`, `DriverStatsCard`, and the track map section.

**Cleared when**: active session changes, or user clicks the same driver again.

---

### TelemetryPoint *(track map input — existing, unchanged)*

| Field | Type | Notes |
|-------|------|-------|
| `x` | `float` | Track X coordinate |
| `y` | `float` | Track Y coordinate |
| `speed` | `float` | Speed in km/h |
| `throttle` | `float` | Throttle 0–1 |
| `brake` | `bool` | Brake active |
| `distance` | `float` | Distance from lap start in metres |

**Source**: `/api/track/{year}/{event}/Q/speed/{driver}` — existing endpoint, no changes.

---

### CornerPoint *(track map overlay — existing, unchanged)*

| Field | Type | Notes |
|-------|------|-------|
| `number` | `int` | Corner number |
| `x` | `float` | Track X coordinate |
| `y` | `float` | Track Y coordinate |

**Source**: `/api/track/{year}/{event}/corners` — existing endpoint, no changes.

---

## State Transitions

```
QualifyingPage mounts
  └─ activeSession set → fetch qualifying results
       └─ results loaded → render QualifyingTable (no selection) + QualifyingDeltaChart (no selection)

User clicks driver bar (delta chart) or table row
  └─ setSelectedDriver(row)
       ├─ QualifyingDeltaChart: highlight selected bar
       ├─ QualifyingTable: highlight selected row
       ├─ DriverStatsCard: render with Q1/Q2/Q3 times + mini chart
       └─ Track map section: fetch telemetry for driver (session_type="Q")

User clicks same driver again
  └─ setSelectedDriver(null)
       ├─ QualifyingDeltaChart: remove bar highlight
       ├─ QualifyingTable: remove row highlight
       ├─ DriverStatsCard: hidden
       └─ Track map section: show placeholder

User changes round filter (Q1/Q2/Q3/All)
  └─ setRoundFilter(value)
       ├─ QualifyingTable: column emphasis updates
       ├─ QualifyingDeltaChart: reference time recalculates; selected bar re-highlighted
       └─ DriverStatsCard + track map: UNCHANGED (selectedDriver preserved)

activeSession changes
  └─ setSelectedDriver(null) + refetch qualifying results
```

---

## Component Inventory

### New components

| Component | Location | Purpose |
|-----------|----------|---------|
| `QualifyingDeltaChart` | `src/components/qualifying/QualifyingDeltaChart.jsx` | SVG horizontal bar chart; gap to pole or round fastest; team-coloured; clickable |
| `DriverStatsCard` | `src/components/qualifying/DriverStatsCard.jsx` | Inline card: Q times text + Nivo mini progression chart; replaces `DriverDetailPanel` |

### Modified components

| Component | Change |
|-----------|--------|
| `QualifyingPage.jsx` | New layout (table top; 2-col below); add `selectedDriver` state; integrate `TrackMap`, `TelemetryToggle`, `useLapTelemetry`, `useCornerAnnotations`; remove `DriverDetailPanel` usage |
| `QualifyingTable.jsx` | Add `selectedDriver` prop; highlight matching row; remove unused `onDriverSelect` drawer-specific wiring |

### Deleted components

| Component | Reason |
|-----------|--------|
| `DriverDetailPanel.jsx` | Replaced by inline `DriverStatsCard` per FR-007 |
