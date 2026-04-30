# Research: F1 React Dashboard

**Phase 0 output for**: `specs/001-f1-react-dashboard/plan.md`  
**Date**: 2026-04-29

## 1. Charting Library

**Decision**: **Nivo**

**Rationale**: FR-007/FR-008 require a box/violin plot for lap time distributions across up to 20 drivers. Nivo provides first-class `<ResponsiveBoxPlot>` and `<ResponsiveViolinPlot>` components with no custom renderer hacks. Its consistent React-declarative API, built-in responsive wrappers, and MUI-compatible theming make it the cleanest fit for the full chart suite (distribution, line comparison, qualifying bar charts).

**Alternatives considered**:
- Recharts — ruled out: no native box/violin support; requires low-level `<Customized>` workarounds.
- ECharts-for-React — ruled out: ~900 kB bundle, significantly larger than needed.
- Chart.js — ruled out: box plot requires a separate unmaintained community plugin.

---

## 2. Track Map Visualization

**Decision**: **HTML5 Canvas 2D** with **D3 color scales** (`d3-scale` + `d3-scale-chromatic`) for color interpolation

**Rationale**: A single F1 lap contains ~3 000–6 000 telemetry points. Each segment must be drawn with a unique color derived from the speed/throttle/brake value at that point. Rendering 6 000 individually colored SVG path segments causes severe DOM bloat and repaint jank. Canvas draws the entire track in one raster pass using a per-segment `strokeStyle` at consistent 60 fps. D3 is used only as a color-scale helper (`scaleSequential` + `interpolateRdYlBu`) — its SVG rendering machinery is not needed.

**Alternatives considered**:
- D3.js full SVG rendering — ruled out: SVG performance degrades past ~3 000 unique segments.
- Recharts ScatterChart — ruled out: cannot draw a continuous gradient-colored path from sequential coordinates.

---

## 3. Build Tool

**Decision**: **Vite 5**

**Rationale**: CRA is deprecated since 2023 and unmaintained. Vite's native ES-module dev server starts in <300 ms. Vitest (the natural test companion) shares the same `vite.config.js` transform without additional Babel/SWC config duplication. `npm create vite@latest -- --template react` is the canonical bootstrap command.

**Alternatives considered**:
- CRA — ruled out: deprecated, no longer maintained, slow webpack cold start.

---

## 4. State Management

**Decision**: **TanStack Query v5** (server state) + **React Context** (UI state)

**Rationale**: The dashboard is read-heavy with no mutations. Every data domain (lap times, telemetry, standings, schedule) is an async API call that benefits from TanStack Query's built-in caching, deduplication, stale-while-revalidate, and per-query `isLoading`/`isError` states. UI state (selected session, active filters, selected driver, recently viewed sessions) is shallow and local — React Context with `useState` is sufficient without Redux ceremony.

**Query key convention**:
```js
// All keys follow: [domain, ...identifiers]
['schedule', year]
['sessionInfo', year, event, sessionType]
['lapDistribution', year, event]
['lapComparison', year, event, sessionType, driversArray]
['telemetry', year, event, sessionType, driver, lapNumber]
['qualifying', year, event]
['standings', year, roundNumber]
['wdcScenarios', year, roundNumber]
```

**Alternatives considered**:
- Redux Toolkit + RTK Query — ruled out: excessive boilerplate (slices, reducers, actions) only justified when complex client-side mutations already require Redux.
- Zustand — ruled out: no built-in async caching or deduplication; lap time data would require manual cache invalidation.

---

## 5. Frontend Testing

**Decision**: **Vitest** + **React Testing Library** + **@testing-library/jest-dom** + **jsdom**

**Rationale**: Vitest is Vite-native — it reuses the same config transform pipeline with zero extra setup. Jest requires a separate Babel/SWC config that duplicates Vite's pipeline. RTL asserts user-visible behavior rather than internal component state, aligning with the constitution's requirement for meaningful tests. Canvas rendering tests use `vitest-canvas-mock` (a Vitest-compatible fork of `jest-canvas-mock`).

**Test matrix**:
| Layer | Tool | Location |
|-------|------|----------|
| Component unit | Vitest + RTL | `packages/frontend/src/__tests__/components/` |
| Hook unit | Vitest + RTL `renderHook` | `packages/frontend/src/__tests__/hooks/` |
| Backend unit | pytest | `packages/backend/__tests__/unit/` |
| Backend integration | pytest | `packages/backend/__tests__/integration/` |
| E2E | Playwright + POM | `tests/e2e/` |

**E2E journeys (5, per constitution limit)**:
1. User selects a session and views the lap time distribution chart.
2. User filters lap times by driver and tyre compound.
3. User selects a qualifying session and views Q1/Q2/Q3 per-round times.
4. User views the track speed map for a selected driver and lap.
5. User views WDC standings and championship scenarios for a season.

---

## 6. Backend API Gaps

Three backend changes are needed. All are low-effort service-layer modifications.

### Gap 1 — Qualifying Q1/Q2/Q3 per-round times (service modification)

**Problem**: `GET /qualifying/{year}/{event}` returns only overall fastest lap per driver.  
**Fix**: Update `qualifying_service.get_qualifying_results()` to read `session.results[['Abbreviation','Q1','Q2','Q3']]` columns (FastF1 provides these as `timedelta`). Convert to seconds. Add `q1_seconds`, `q2_seconds`, `q3_seconds` fields to each result entry. `None` for drivers eliminated before a given round.  
**Effort**: ~20 lines; no new endpoint.

### Gap 2 — Selectable lap telemetry (new endpoint)

**Problem**: `GET /track/{year}/{event}/{session_type}/speed/{driver}` always returns the fastest lap.  
**Fix**: Add `GET /track/{year}/{event}/{session_type}/{driver}/lap/{lap_number}`. Uses `session.laps.pick_drivers(driver).pick_lap(lap_number)`. Response shape identical to existing endpoint — frontend handles speed/throttle/brake toggle client-side.  
**Effort**: ~15 lines in track router + service.

### Gap 3 — Total rounds in season (minor response augmentation)

**Problem**: Championship views need "Round X of Y" context; existing schedule endpoint is sufficient if the frontend counts records.  
**Fix**: The existing `GET /sessions/schedule/{year}` response already returns all round records — the frontend derives `total_rounds = schedule.length` with no backend change needed. Alternatively, add `"total_rounds"` to the `/championship/{year}/{round_number}/standings` response as a single-line addition to `championship_service`.  
**Chosen**: Augment standings response — keeps all championship context in one API call.  
**Effort**: 1 line.
