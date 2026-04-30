# Research: Race Tab Visualizations

**Phase**: 0 — Research  
**Branch**: `003-race-tab-visualizations`  
**Date**: 2026-04-30

---

## 1. Existing Codebase Inventory

### Frontend

| Item | Location | Notes |
|------|----------|-------|
| Nav tabs | `packages/frontend/src/components/layout/NavBar.jsx` | `NAV_TABS` array — need to replace `Lap Times` entry with `Race` |
| App routes | `packages/frontend/src/App.jsx` | `/lap-times → LapTimesPage`; add `/race → RacePage`, remove `/lap-times` |
| Pages | `packages/frontend/src/pages/` | `LapTimesPage.jsx` → replace with `RacePage.jsx` |
| lapTimes components | `packages/frontend/src/components/lapTimes/` | `DriverComparisonChart.jsx` — reuse logic; `LapDistributionChart.jsx` — replace with PositionChangesChart; `LapFilters.jsx` — repurpose or remove |
| Hooks | `packages/frontend/src/hooks/useLapTimes.js` | Reuse `useDriverComparison`; add new `useRace.js` hook file |
| API clients | `packages/frontend/src/api/lapTimes.js` | Add new `packages/frontend/src/api/race.js` |
| Chart libraries | `package.json` | `@nivo/line@0.99`, `@nivo/bar@0.99`, `@nivo/boxplot@0.99`, `d3-scale` all already installed |
| Session context | `packages/frontend/src/context/SessionContext.jsx` | Provides `{ activeSession }` with `{ year, event, sessionType }` — shared across pages |
| Team colours | `packages/frontend/src/constants/teamColors.js` | `TEAM_COLORS` map + `getTeamColor(teamName)` — reuse for team pace chart |
| Compound colours | Inside `LapDistributionChart.jsx` | `COMPOUND_COLORS` const — extract to shared constants file |

### Backend

| Item | Location | Notes |
|------|----------|-------|
| Router registration | `packages/backend/app/main.py` | Add `race` router under `/api/race` |
| Existing lap-times service | `packages/backend/app/services/lap_time_service.py` | `get_driver_lap_comparison` for multi-driver reusable; `get_lap_times_distribution` uses race session already |
| Session helper | `packages/backend/app/services/session_service.py` | `get_session(year, event, session_type)` — reuse |
| New files needed | `packages/backend/app/routers/race.py` | 3 new endpoints |
| New files needed | `packages/backend/app/services/race_service.py` | 3 new service functions |

---

## 2. FastF1 Data Availability

### Decision: Use FastF1 Python library directly (already integrated)
**Rationale**: All four required datasets are natively available through FastF1's `session.laps` DataFrame.  
**Alternatives considered**: Direct Ergast API, OpenF1 REST API — rejected because FastF1 already abstracts both and provides richer telemetry data.

### Data Fields Available from `session.laps`

| Field | Type | Used for |
|-------|------|----------|
| `LapNumber` | int | X-axis for position changes and lap time charts |
| `Position` | int | Y-axis for position changes chart |
| `LapTime` | timedelta | Team pace + driver lap times |
| `Driver` | str (abbr) | Series grouping for all charts |
| `Team` | str | Team pace grouping + team colour lookup |
| `Compound` | str | Colour coding in single-driver scatterplot |

### Session type for race: `"R"`
All endpoints use `fastf1.get_session(year, event, "R")`.

---

## 3. New Backend Endpoints

### Decision: Three new endpoints under `/api/race`
**Rationale**: The three datasets (position changes, team pace, driver lap scatterplot) have distinct shapes and performance profiles. Separating them avoids delivering a massive monolithic payload and allows independent caching/loading states on the frontend.  
**Alternatives considered**: Single omnibus endpoint — rejected because it would block all three charts behind one slow call and make partial loading impossible.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/race/{year}/{event}/position-changes` | GET | Per-driver, per-lap position |
| `/api/race/{year}/{event}/team-pace` | GET | Lap times grouped by team (quick laps only) |
| `/api/race/{year}/{event}/driver-laps/{driver}` | GET | Quick laps for a single driver with compound |

The existing `/api/lap-times/{year}/{event}/R/comparison?drivers=` endpoint is reused for multi-driver comparison.

---

## 4. Frontend Architecture Decisions

### Decision: Dedicated `race/` component folder + `RacePage.jsx`
**Rationale**: Mirrors the established pattern (`qualifying/`, `lapTimes/`, `track/`, `championship/`). Clean separation keeps the code navigable.  
**Alternatives considered**: Reusing `lapTimes/` folder — rejected; the conceptual domain is different (race ≠ lap times analysis).

### Decision: Selection state lives in `RacePage.jsx` as `useState` (local state)
**Rationale**: The selected driver set is scoped entirely to the Race tab; no other page needs it. A context would be over-engineering.  
**Alternatives considered**: New `RaceContext` — rejected; spec explicitly uses a single page with co-located charts. `useReducer` considered but unnecessary for a simple `Set` toggle.

### Decision: Compound colours extracted to `packages/frontend/src/constants/compoundColors.js`
**Rationale**: Currently duplicated inside `LapDistributionChart.jsx`. The new `DriverLapScatterplot` also needs them. Extracting removes duplication (constitution: DRY principle).

### Decision: Use `@nivo/line` for position changes chart
**Rationale**: Already used for `DriverComparisonChart`, team is familiar with it. Supports `yScale.reverse` for inverted Y-axis. Performance is sufficient for 20 drivers × ~70 laps = ~1400 data points.  
**Alternatives considered**: `@nivo/scatterplot` — less suitable for connected lines; custom D3 SVG — more code, same result.

### Decision: Use `@nivo/boxplot` for team pace chart
**Rationale**: Already installed. Natively renders boxplots with whiskers, matches the `plot_team_pace_ranking.py` reference exactly.  
**Alternatives considered**: `@nivo/bar` with computed statistics — rejected; `@nivo/boxplot` provides correct statistical rendering out of the box.

### Decision: Use `@nivo/scatterplot` (or `@nivo/line` with `lineWidth: 0`) for single-driver lap scatterplot
**Rationale**: Each lap is an independent point coloured by compound; connecting lines would be misleading. `@nivo/line` with `enableLine: false, pointSize: 8` achieves scatter behaviour without adding a new dependency.  
**Alternatives considered**: `@nivo/scatterplot` — slightly more semantically correct but requires adding a new nivo package. Avoided to keep bundle size stable.

### Decision: UI transitions via Tailwind `transition-all duration-300` + CSS `opacity` toggling; no extra animation library
**Rationale**: The constitution specifies "subtle and non-distracting" animations. Tailwind utility classes cover 90% of the requirements (tab fade-in, panel opacity changes). Framer Motion or GSAP would be overkill.  
**Alternatives considered**: Framer Motion — capable but adds ~40kb to bundle; CSS keyframes inline — harder to maintain.

---

## 5. Routing Change

| Before | After |
|--------|-------|
| `<Route path="/" element={<Navigate to="/lap-times" replace />}` | `<Route path="/" element={<Navigate to="/race" replace />}` |
| `<Route path="/lap-times" element={<LapTimesPage />}` | `<Route path="/race" element={<RacePage />}` |
| `NAV_TABS` entry `{ label: 'Lap Times', path: '/lap-times' }` | `{ label: 'Race', path: '/race' }` |

The `LapTimesPage.jsx` file, `lapTimes/` component folder, `useLapTimes.js` hook, and `api/lapTimes.js` module are **deleted** — the multi-driver comparison endpoint is reused via a new `race.js` API module.

---

## 6. Page Layout Design (Race Tab)

```
┌─────────────────────────────────────────────────────────────┐
│  Race  ·  {Event}  ·  {Year}           [Clear Selection ×]  │
├──────────────────────────────┬──────────────────────────────┤
│   Position Changes           │   Driver Analysis Panel       │
│   (all drivers, ~70 laps)    │                               │
│   click a line to toggle     │  [0 selected] → hint text     │
│   selected driver set        │  [1 selected] → scatterplot   │
│   highlighted lines = bold   │  [2+ selected] → line chart   │
│                              │                               │
├──────────────────────────────┴──────────────────────────────┤
│   Team Pace Ranking  (boxplot, ordered fastest → slowest)    │
│   click a team box → highlights that team in position chart  │
└─────────────────────────────────────────────────────────────┘
```

**Grid**: 2-column top row (position changes left, driver analysis right), full-width bottom row (team pace). On mobile, stacks to single column.

---

## 7. Cross-Chart Interaction Wiring

| User action | State change | Effect |
|-------------|-------------|--------|
| Click driver line in position changes | Toggle driver abbr in `selectedDrivers` Set | Driver analysis panel re-renders; position changes chart bolds that line |
| Click team boxplot in team pace chart | Set `selectedTeam` string | All drivers for that team are highlighted in position changes chart |
| Click "Clear Selection" button | `selectedDrivers = new Set()`, `selectedTeam = null` | All charts reset to default |
| `selectedDrivers.size === 0` | — | Driver analysis shows empty hint |
| `selectedDrivers.size === 1` | — | Driver analysis shows `DriverLapScatterplot` |
| `selectedDrivers.size >= 2` | — | Driver analysis shows `DriverComparisonChart` |

---

## 8. NEEDS CLARIFICATION Resolution

All NEEDS CLARIFICATION items are now resolved:

| Item | Resolution |
|------|-----------|
| Selection model | **Option B** confirmed by user — click-to-toggle, free-growing Set |
| Chart for single driver | `plot_driver_laptimes.py` → scatterplot coloured by compound |
| Chart for multi-driver | `plot_driver_styling.py` → multi-line with driver styles |
| Chart replacing distribution | `plot_position_changes.py` → inverted multi-line per driver per lap |
| New chart to add | `plot_team_pace_ranking.py` → boxplot of team lap times |
| Animation approach | Tailwind `transition-*` utilities for tab and panel transitions |
