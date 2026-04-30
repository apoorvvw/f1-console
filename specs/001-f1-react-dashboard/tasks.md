# Tasks: F1 React Dashboard

**Input**: Design documents from `specs/001-f1-react-dashboard/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/api.md ✅, quickstart.md ✅

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no unresolved dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1–US5)
- Exact file paths are included in every task description

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Bootstrap the frontend project and wire the development environment.

- [ ] T001 Scaffold Vite React project at `packages/frontend/` with `npm create vite@latest packages/frontend -- --template react`
- [ ] T002 Install frontend runtime dependencies in `packages/frontend/package.json`: `@mui/material`, `@emotion/react`, `@emotion/styled`, `@mui/icons-material`, `@tanstack/react-query`, `react-router-dom`, `@nivo/core`, `@nivo/boxplot`, `@nivo/line`, `@nivo/bar`, `d3-scale`, `d3-scale-chromatic`
- [ ] T003 [P] Install frontend dev dependencies in `packages/frontend/package.json`: `vitest`, `@vitest/ui`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `vitest-canvas-mock`, `eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `prettier`
- [ ] T004 [P] Configure Vitest in `packages/frontend/vite.config.js`: add `test` block with `environment: 'jsdom'`, `setupFiles: ['./src/setupTests.js']`, and `globals: true`
- [ ] T005 [P] Create `packages/frontend/src/setupTests.js`: import `@testing-library/jest-dom` and `vitest-canvas-mock`
- [ ] T006 [P] Configure ESLint in `packages/frontend/.eslintrc.cjs` with `eslint-plugin-react` and `eslint-plugin-react-hooks` rules; enforce 2-space indent and 100-char line limit
- [ ] T007 [P] Configure Prettier in `packages/frontend/.prettierrc`: `{ "singleQuote": true, "semi": true, "printWidth": 100, "tabWidth": 2 }`
- [ ] T008 [P] Create `packages/frontend/.env` with `VITE_API_BASE_URL=http://localhost:3030`
- [ ] T009 Add CORS middleware to `packages/backend/app/main.py`: import `CORSMiddleware` from `fastapi.middleware.cors`, allow `http://localhost:3000` (and `CORS_ORIGINS` env var) with all headers and methods

---

## Phase 1.5: Figma Design Phase (Blocks all page implementation)

**Purpose**: Create all Figma screen designs before React page implementation begins. Each design frame becomes the reference for the corresponding implementation tasks in Phases 2–7.

**⚠️ CRITICAL**: Tasks T013, T014, T017–T019, T022–T024, T026, T031–T034, T039–T042, T047–T050 MUST NOT begin until the relevant Figma frame is complete.

- [ ] TD001 Create a new Figma file named "F1 Console Dashboard" using Figma MCP `create_new_file`; record the returned `fileKey` in `specs/001-f1-react-dashboard/figma-file.md` for use in all subsequent `get_design_context` calls
- [ ] TD002 [P] Design **AppShell frame** in Figma using `use_figma`: NavBar with F1 Console title, tab navigation (Lap Times / Track / Qualifying / Championship), session selector button, and recent sessions chip strip below; include a 375px mobile artboard showing hamburger menu; apply color palette (primary `#1976d2`, secondary `#ff9800`, bg `#f5f5f5`) and 8px grid
- [ ] TD003 [P] Design **LapTimesPage frame** in Figma using `use_figma`: filter bar (driver multi-select, compound select, lap range slider) at top, Nivo box plot taking 60% of the page width with one box per driver color-coded by team, and driver comparison line chart below; desktop 1440px frame
- [ ] TD004 [P] Design **TrackPage frame** in Figma using `use_figma`: left sidebar with driver select, lap number select, telemetry metric toggle (Speed/Throttle/Brake), and corner annotations toggle; main area showing track map canvas with gradient color legend; hover tooltip mockup; desktop 1440px frame
- [ ] TD005 [P] Design **QualifyingPage frame** in Figma using `use_figma`: round filter toggle (All/Q1/Q2/Q3) at top, MUI DataGrid with Pos/Driver/Team/Q1/Q2/Q3/Best/Δ Pole columns, driver detail drawer sliding in from right with Q1→Q2→Q3 bar chart; desktop 1440px frame
- [ ] TD006 [P] Design **ChampionshipPage frame** in Figma using `use_figma`: round slider at top (Round X of Y), MUI DataGrid with Pos/Driver/Team/Points/Wins and "Can Win" badge column, scenario drawer from right showing points math; concluded-season variant with gold champion highlight; desktop 1440px frame

**Checkpoint**: All 5 Figma frames complete and `fileKey` recorded. Implementation phases may now begin.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: App shell, routing, session context, and API infrastructure that every user story depends on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T010 Create `packages/frontend/src/main.jsx`: render `<QueryClientProvider>` wrapping `<RouterProvider>` with a `QueryClient` instance; import `@tanstack/react-query`
- [ ] T011 Create `packages/frontend/src/App.jsx`: define React Router v6 routes — `/` redirects to `/lap-times`, plus routes for `/lap-times`, `/track`, `/qualifying`, `/championship`; wrap routes in `<SessionProvider>` and `<AppShell>`
- [ ] T012 Create `packages/frontend/src/context/SessionContext.jsx`: provide `activeSession` (`{ year, event, sessionType }`), `setActiveSession`, and `recentSessions` (max 5, persisted to `localStorage` key `f1.recentSessions`); export `useSessionContext` hook
- [ ] T013 [P] Create `packages/frontend/src/components/layout/AppShell.jsx`: read AppShell frame from Figma using `get_design_context` (fileKey from `figma-file.md`) before coding; implement MUI `<Box>` layout with fixed `<NavBar>` at top and scrollable main content area; include `<RecentSessions>` strip below nav
- [ ] T014 [P] Create `packages/frontend/src/components/layout/NavBar.jsx`: reference AppShell Figma frame via `get_design_context` for nav spacing and tab layout; implement MUI `<AppBar>` with `<Toolbar>`, F1 Console title, MUI `<Tabs>` for Lap Times / Track / Qualifying / Championship nav links using React Router `<Link>`, and a `<SessionSelector>` trigger button
- [ ] T015 [P] Create `packages/frontend/src/api/sessions.js`: export `fetchSchedule(year)` → `GET /sessions/schedule/{year}` and `fetchSessionInfo(year, event, sessionType)` → `GET /sessions/{year}/{event}/{session_type}`; throw on non-ok responses
- [ ] T016 [P] Create `packages/frontend/src/hooks/useSession.js`: export `useSchedule(year)` and `useSessionInfo(year, event, sessionType)` using `useQuery` with query keys `['schedule', year]` and `['sessionInfo', year, event, sessionType]`

**Checkpoint**: App shell renders at `http://localhost:3000`, navigation between routes works, and session context is available to all pages.

---

## Phase 3: User Story 5 — Session & Data Navigation (Priority: P1) 🎯 MVP

**Goal**: Users can select a session by year → Grand Prix → session type, and recently viewed sessions (up to 5) appear as quick-access chips. All analysis pages refresh when the active session changes.

**Independent Test**: Open the dashboard, pick 2024 → Bahrain Grand Prix → Race, confirm the session is stored in context and appears in recent sessions. Pick a second session; confirm both appear in recent sessions and switching between them updates the page title/context.

- [ ] T017 [US5] Create `packages/frontend/src/components/session/SessionSelector.jsx`: MUI `<Dialog>` with three sequential MUI `<Select>` dropdowns — Year (hard-coded 2018–2026 range), Grand Prix (from `useSchedule`), Session Type (FP1/FP2/FP3/Q/SQ/R/S). On confirm, call `setActiveSession` from `SessionContext` and prepend to `recentSessions`
- [ ] T018 [US5] Create `packages/frontend/src/components/session/RecentSessions.jsx`: render up to 5 MUI `<Chip>` components from `recentSessions`, each with label `"{year} {event} – {sessionType}"` and `onClick` that calls `setActiveSession`
- [ ] T019 [US5] Integrate `<SessionSelector>` (opened by NavBar button) and `<RecentSessions>` strip into `packages/frontend/src/components/layout/AppShell.jsx`; wire `SessionSelector` open/close state to the NavBar button

**Checkpoint**: Session navigation is fully functional end-to-end. Recent sessions persist across page reloads.

---

## Phase 4: User Story 1 — Session Explorer & Lap Time Analysis (Priority: P1) 🎯 MVP

**Goal**: Users view a lap time distribution box plot for all drivers in a selected session, with filtering by driver, tyre compound, and lap range.

**Independent Test**: Select 2023 British GP – Race. Verify a Nivo box plot renders one box per driver. Apply driver filter (VER, LEC) and verify only those two boxes remain. Apply MEDIUM compound filter and verify only MEDIUM laps are shown.

- [ ] T020 [P] Create `packages/frontend/src/api/lapTimes.js`: export `fetchLapDistribution(year, event)` → `GET /lap-times/{year}/{event}/distribution` and `fetchDriverComparison(year, event, sessionType, drivers)` → `GET /lap-times/{year}/{event}/{session_type}/comparison?drivers={...}`
- [ ] T021 [P] [US1] Create `packages/frontend/src/hooks/useLapTimes.js`: export `useLapDistribution(year, event)` with query key `['lapDistribution', year, event]` and `useDriverComparison(year, event, sessionType, drivers)` with key `['lapComparison', year, event, sessionType, drivers]`; skip queries when `year` or `event` are null
- [ ] T022 [US1] Create `packages/frontend/src/components/lapTimes/LapFilters.jsx`: MUI `<Autocomplete multiple>` for driver selection (populated from `useSessionInfo` drivers list), MUI `<Select>` for compound (SOFT/MEDIUM/HARD/INTERMEDIATE/WET/All), and MUI `<Slider>` for lap range; emit filter state changes via `onChange` props
- [ ] T023 [US1] Create `packages/frontend/src/components/lapTimes/LapDistributionChart.jsx`: render Nivo `<ResponsiveBoxPlot>` with one group per driver; color each box by team color from a static `TEAM_COLORS` map in `packages/frontend/src/constants/teamColors.js`; apply driver and compound filters from props before transforming data into Nivo `boxplot` format; show MUI `<Skeleton>` while loading and MUI `<Alert>` on error
- [ ] T024 [US1] Create `packages/frontend/src/components/lapTimes/DriverComparisonChart.jsx`: render Nivo `<ResponsiveLine>` with one series per selected driver; x-axis = lap number, y-axis = lap time in seconds; mark outlier laps (`is_outlier: true`) with a hollow circle point; color series by `TEAM_COLORS`; show `<Skeleton>` while loading
- [ ] T025 [US1] Create `packages/frontend/src/constants/teamColors.js`: export a `TEAM_COLORS` object mapping team names (e.g., `'Red Bull Racing'`) to hex color strings matching official F1 team colors
- [ ] T026 [US1] Create `packages/frontend/src/pages/LapTimesPage.jsx`: read LapTimesPage frame from Figma using `get_design_context` for page layout proportions and filter bar placement; compose `<LapFilters>`, `<LapDistributionChart>`, and `<DriverComparisonChart>` in an MUI `<Grid>` layout; read `activeSession` from `SessionContext`; pass filter state down to chart components

**Checkpoint**: Lap Times page is fully functional. Distribution and comparison charts render and respond to filter changes.

---

## Phase 5: User Story 2 — Qualifying Results Dashboard (Priority: P2)

**Goal**: Users view a qualifying results table with Q1/Q2/Q3 per-round times, sort by any column, filter by round, and drill into a driver's progression.

**Independent Test**: Select any qualifying event (e.g., 2024 Monaco). Verify a MUI DataGrid renders with columns: Pos, Driver, Team, Q1, Q2, Q3, Best. Apply Q2 filter; verify Q3 column is de-emphasised. Click a driver row; verify the detail panel shows their Q1→Q2→Q3 progression.

- [ ] T027 Modify `packages/backend/app/services/qualifying_service.py`: update `get_qualifying_results()` to read `session.results[['Abbreviation','Q1','Q2','Q3']]` alongside lap data; add `q1_seconds`, `q2_seconds`, `q3_seconds` to each result dict by converting FastF1 `timedelta` via `.total_seconds()` (return `None` for `NaT`); keep existing `best_lap_seconds` and `delta_to_pole_seconds` fields
- [ ] T028 Update `packages/backend/__tests__/unit/test_services.py`: add unit tests asserting that `get_qualifying_results()` returns `q1_seconds`, `q2_seconds`, `q3_seconds` for classified drivers and `null` for drivers eliminated before Q2/Q3
- [ ] T029 [P] [US2] Create `packages/frontend/src/api/qualifying.js`: export `fetchQualifyingResults(year, event)` → `GET /qualifying/{year}/{event}`
- [ ] T030 [P] [US2] Create `packages/frontend/src/hooks/useQualifying.js`: export `useQualifyingResults(year, event)` with query key `['qualifying', year, event]`; skip when `year` or `event` are null
- [ ] T031 [US2] Create `packages/frontend/src/components/qualifying/RoundFilter.jsx`: MUI `<ToggleButtonGroup>` with options All / Q1 / Q2 / Q3; emit selected round via `onChange` prop
- [ ] T032 [US2] Create `packages/frontend/src/components/qualifying/QualifyingTable.jsx`: MUI `<DataGrid>` with columns Pos, Driver, Team, Q1, Q2, Q3 (seconds formatted as `m:ss.SSS`), Best, Δ Pole; sortable by all columns; highlight the active round column when `roundFilter` prop is set; grey out `null` cells; emit row click via `onDriverSelect` prop; show `<Skeleton>` while loading
- [ ] T033 [US2] Create `packages/frontend/src/components/qualifying/DriverDetailPanel.jsx`: MUI `<Drawer>` or `<Card>` showing selected driver name, team, and a Nivo `<ResponsiveBar>` with Q1/Q2/Q3 bar groups for lap time comparison; close button
- [ ] T034 [US2] Create `packages/frontend/src/pages/QualifyingPage.jsx`: read QualifyingPage frame from Figma using `get_design_context` for table column widths, filter toggle placement, and drawer layout; compose `<RoundFilter>`, `<QualifyingTable>`, `<DriverDetailPanel>` in MUI `<Grid>` layout; manage `selectedDriver` and `roundFilter` state locally

**Checkpoint**: Qualifying page is fully functional with sortable table, round filtering, and driver drill-down.

---

## Phase 6: User Story 3 — Track Speed Visualization (Priority: P2)

**Goal**: Users view a Canvas-rendered track map with a speed/throttle/brake color gradient for a selected driver and lap, with corner annotations and a hover tooltip.

**Independent Test**: Select 2024 Bahrain Qualifying, driver VER. Verify the track map renders a continuous colored path. Toggle to Throttle view; verify the gradient changes. Enable corner annotations; verify corner numbers appear at correct positions. Hover over the track; verify a tooltip shows speed/throttle/brake/distance.

- [ ] T035 Modify `packages/backend/app/services/track_service.py`: add `get_driver_lap_telemetry(year, event, session_type, driver, lap_number)` that loads the session, picks the specified lap number via `session.laps.pick_drivers(driver).iloc[lap_number - 1]`, retrieves telemetry, and returns the same response shape as `get_driver_speed_on_track`; raise `HTTPException(404)` if lap not found
- [ ] T036 Add route to `packages/backend/app/routers/track.py`: `GET /{year}/{event}/{session_type}/{driver}/lap/{lap_number}` calling `track_service.get_driver_lap_telemetry()`
- [ ] T037 [P] [US3] Create `packages/frontend/src/api/track.js`: export `fetchFastestLapTelemetry(year, event, sessionType, driver)` → `GET /track/{year}/{event}/{session_type}/speed/{driver}`, `fetchLapTelemetry(year, event, sessionType, driver, lapNumber)` → `GET /track/{year}/{event}/{session_type}/{driver}/lap/{lap_number}`, and `fetchCornerAnnotations(year, event)` → `GET /track/{year}/{event}/corners`
- [ ] T038 [P] [US3] Create `packages/frontend/src/hooks/useTrack.js`: export `useLapTelemetry(year, event, sessionType, driver, lapNumber)` with query key `['telemetry', year, event, sessionType, driver, lapNumber ?? 'fastest']` (use `fetchFastestLapTelemetry` when `lapNumber` is null) and `useCornerAnnotations(year, event)` with key `['corners', year, event]`
- [ ] T039 [US3] Create `packages/frontend/src/components/track/LapSelector.jsx`: MUI `<Select>` populated with lap numbers from session laps (derived from `useSessionInfo`); default label "Fastest Lap"; emit selected lap number (or `null` for fastest) via `onChange`
- [ ] T040 [US3] Create `packages/frontend/src/components/track/TelemetryToggle.jsx`: MUI `<ToggleButtonGroup>` with Speed / Throttle / Brake options; emit selected metric string via `onChange`
- [ ] T041 [US3] Create `packages/frontend/src/components/track/TrackMap.jsx`: render a `<canvas>` element sized to its container via `ResizeObserver`; on each `points` prop change, clear and redraw the track — iterate over consecutive point pairs, compute a `d3-scale` `scaleSequential` color from the active metric value (speed=`interpolateRdYlBu` reversed, throttle=`interpolateGreens`, brake=`interpolateReds`), draw segment with `ctx.strokeStyle`; overlay corner annotation circles and labels when `showCorners` prop is true; track mouse position to find nearest point by `distance` and render a positioned MUI `<Tooltip>` showing speed/throttle/brake/distance; show MUI `<Skeleton>` while `points` is loading
- [ ] T042 [US3] Create `packages/frontend/src/pages/TrackPage.jsx`: read TrackPage frame from Figma using `get_design_context` for sidebar vs. canvas proportions and control placement; compose `<LapSelector>`, `<TelemetryToggle>`, and `<TrackMap>` with `<DriverDetailPanel>` for driver selection; use MUI `<FormControl>` for driver select (from session drivers list); manage `selectedDriver`, `selectedLap`, `telemetryMetric`, `showCorners` state locally

**Checkpoint**: Track page renders a speed-gradient map for any driver/lap combination; toggle between metrics works; tooltips appear on hover.

---

## Phase 7: User Story 4 — Championship Standings & Scenarios (Priority: P3)

**Goal**: Users view WDC standings for a selected season/round with "can still win" badges, and click a driver to see their minimum required results.

**Independent Test**: Select season 2024, round 10. Verify a standings table shows positions, points, wins, and "can still win" badge for eligible drivers. Click Max Verstappen row; verify a scenario panel opens. Select a concluded season; verify only the champion is highlighted and no "can still win" badges appear.

- [ ] T043 Modify `packages/backend/app/services/championship_service.py`: in `get_championship_standings()`, add `total_rounds` to the returned dict, computed as `len(fastf1.get_event_schedule(year))`
- [ ] T044 Update `packages/backend/__tests__/unit/test_services.py`: add unit test asserting `get_championship_standings()` response includes a `total_rounds` integer field
- [ ] T045 [P] [US4] Create `packages/frontend/src/api/championship.js`: export `fetchStandings(year, roundNumber)` → `GET /championship/{year}/{round_number}/standings` and `fetchWdcScenarios(year, roundNumber)` → `GET /championship/{year}/{round_number}/wdc-scenarios`
- [ ] T046 [P] [US4] Create `packages/frontend/src/hooks/useChampionship.js`: export `useStandings(year, roundNumber)` with key `['standings', year, roundNumber]` and `useWdcScenarios(year, roundNumber)` with key `['wdcScenarios', year, roundNumber]`; skip when params are null
- [ ] T047 [US4] Create `packages/frontend/src/components/championship/RoundSelector.jsx`: MUI `<Slider>` with marks for rounds 1 to `total_rounds`; label shows "Round {round} of {total_rounds}"; emit selected round number via `onChange`
- [ ] T048 [US4] Create `packages/frontend/src/components/championship/StandingsTable.jsx`: MUI `<DataGrid>` with columns Pos, Driver, Team, Points, Wins; append a MUI `<Chip label="Can Win" color="success">` badge in the Driver column when `can_win` is true from WDC scenarios; highlight champion row in gold when `remaining_races === 0` and driver is position 1; sortable columns; emit row click via `onDriverSelect`; show `<Skeleton>` while loading
- [ ] T049 [US4] Create `packages/frontend/src/components/championship/ScenarioPanel.jsx`: MUI `<Drawer>` showing selected driver name, current points, max possible points, and a human-readable summary: "Needs X points from Y remaining races. Must finish P1 in all remaining races to win." Derive `points_needed` from `wdc_scenarios` data; close button
- [ ] T050 [US4] Create `packages/frontend/src/pages/ChampionshipPage.jsx`: read ChampionshipPage frame from Figma using `get_design_context` for slider position, badge styling, and drawer layout; compose `<RoundSelector>`, `<StandingsTable>`, `<ScenarioPanel>` in MUI `<Grid>` layout; manage `selectedRound`, `selectedDriver` state locally; default `selectedRound` to the highest available round from `useSchedule`

**Checkpoint**: Championship page fully functional — standings render, scenario panel opens on driver click, "can still win" badges are correct.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: E2E test coverage, responsive layout validation, and backend test gaps.

- [ ] T051 [P] Create `tests/e2e/pages/SessionSelectorPage.js`: Playwright Page Object Model class with methods `selectYear(year)`, `selectEvent(event)`, `selectSessionType(type)`, `confirm()`, `getRecentSessionChips()`
- [ ] T052 [P] Create `tests/e2e/specs/session-navigation.spec.js`: E2E test — open dashboard, select 2024 Bahrain Race, verify `activeSession` label in NavBar; select 2023 British Race, verify recent session chip for Bahrain appears
- [ ] T053 [P] Create `tests/e2e/specs/lap-times.spec.js`: E2E test — select 2024 Bahrain Race, wait for box plot to render, apply VER driver filter, assert non-VER boxes are absent
- [ ] T054 [P] Create `tests/e2e/specs/qualifying-results.spec.js`: E2E test — select 2024 Monaco Qualifying, wait for DataGrid, assert Q1/Q2/Q3 columns are visible, click VER row, assert detail panel opens
- [ ] T055 [P] Create `tests/e2e/specs/track-visualization.spec.js`: E2E test — select 2024 Bahrain Qualifying, select VER driver, wait for canvas to render (assert canvas element `width > 0`), toggle to Throttle, assert toggle active state
- [ ] T056 [P] Create `tests/e2e/specs/championship-scenarios.spec.js`: E2E test — navigate to Championship page, select 2024 round 10, wait for DataGrid, assert at least one "Can Win" chip visible, click VER row, assert scenario panel contains "points"
- [ ] T057 Verify responsive layout at mobile (375px), tablet (768px), and desktop (1440px) in `packages/frontend/src/components/layout/AppShell.jsx`: use MUI `sx` breakpoint props (`xs`/`sm`/`md`) to collapse NavBar tabs into a hamburger `<Drawer>` on mobile and hide `<RecentSessions>` strip below `sm`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 1.5 (Figma Design)**: Depends on Phase 1 completion (TD001 must run first); TD002–TD006 are **parallel** once TD001 is done — **blocks all page implementation tasks**
- **Phase 2 (Foundational)**: Depends on Phase 1; can run in parallel with Phase 1.5
- **Phase 3 (US5)**: Depends on Phase 2 AND TD002 (AppShell frame)
- **Phase 4 (US1)**: Depends on Phase 3 AND TD003 (LapTimesPage frame)
- **Phase 5 (US2)**: Depends on Phase 2 AND TD005 (QualifyingPage frame)
- **Phase 6 (US3)**: Depends on Phase 2 AND TD004 (TrackPage frame)
- **Phase 7 (US4)**: Depends on Phase 2 AND TD006 (ChampionshipPage frame)
- **Phase 8 (Polish)**: Depends on all phases being complete

### User Story Dependencies

| Story | Depends On | Can Parallelize With |
|-------|------------|---------------------|
| US5 (Session Nav) | Phase 2 complete | — |
| US1 (Lap Times) | US5 complete (needs active session) | US2, US3, US4 |
| US2 (Qualifying) | Phase 2 complete | US1, US3, US4 |
| US3 (Track) | Phase 2 complete | US1, US2, US4 |
| US4 (Championship) | Phase 2 complete | US1, US2, US3 |

### Parallel Execution Example: US1 + US2 + US3 (after Phase 2 & 3 complete)

```
Developer A (US1 — Lap Times):
  T020 → T021 → T022 → T023 → T024 → T025 → T026

Developer B (US2 — Qualifying):
  T027 → T028        (backend, sequential)
  T029 ∥ T030        (api + hook, parallel)
  → T031 → T032 → T033 → T034

Developer C (US3 — Track):
  T035 → T036        (backend, sequential)
  T037 ∥ T038        (api + hook, parallel)
  → T039 → T040 → T041 → T042
```

### Within Each User Story (ordering rule)

```
Backend service change → Backend router change
API client → TanStack Query hook     (these two are parallel [P])
Filter/control components → Chart/table components → Page assembly
```

---

## Implementation Strategy

**MVP scope** (minimum for a useful, demonstrable dashboard):
1. Complete Phases 1–3 (setup + shell + session navigation)
2. Complete Phase 4 (lap time analysis — the core value)

**Full scope**: Complete all 8 phases.

**Task count summary**:

| Phase | Story | Tasks | Parallelizable |
|-------|-------|-------|----------------|
| 1 – Setup | — | 9 | 7 |
| 1.5 – Figma Design | — | 6 | 5 (TD002–TD006 after TD001) |
| 2 – Foundational | — | 7 | 4 |
| 3 – Session Nav | US5 (P1) | 3 | 0 |
| 4 – Lap Times | US1 (P1) | 7 | 2 |
| 5 – Qualifying | US2 (P2) | 8 | 2 |
| 6 – Track Map | US3 (P2) | 8 | 2 |
| 7 – Championship | US4 (P3) | 8 | 2 |
| 8 – Polish | — | 7 | 6 |
| **Total** | | **63** | **30** |
