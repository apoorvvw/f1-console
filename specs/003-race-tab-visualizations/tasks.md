# Tasks: Race Tab Visualizations

**Input**: Design documents from `specs/003-race-tab-visualizations/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Shared foundation — constants extraction and backend skeleton — that unblocks all user stories.

- [X] T001 Extract COMPOUND_COLORS constant from packages/frontend/src/components/lapTimes/LapDistributionChart.jsx into packages/frontend/src/constants/compoundColors.js
- [X] T002 [P] Create packages/backend/app/routers/race.py with empty router and three stub endpoints (position-changes, team-pace, driver-laps)
- [X] T003 [P] Create packages/backend/app/services/race_service.py with stub function signatures for get_position_changes, get_team_pace, get_driver_laps

**Checkpoint**: Shared constant exists; backend router stubs are in place

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Register the race router on the backend and wire the frontend route so all subsequent stories have a running scaffold to build on.

- [ ] T004 Register race router in packages/backend/app/main.py under prefix /api/race
- [ ] T005 Create packages/frontend/src/api/race.js with fetchPositionChanges, fetchTeamPace, fetchDriverLaps functions following the pattern in packages/frontend/src/api/lapTimes.js
- [ ] T006 Create packages/frontend/src/hooks/useRace.js with usePositionChanges, useTeamPace, useDriverLaps React Query hooks (enabled only when year and event are set)
- [ ] T007 Replace the Lap Times route with Race route in packages/frontend/src/App.jsx: change path /lap-times to /race, import RacePage, update default redirect from /lap-times to /race
- [ ] T008 Replace the Lap Times nav entry with Race in packages/frontend/src/components/layout/NavBar.jsx (change label and path in NAV_TABS)
- [ ] T009 Create packages/frontend/src/pages/RacePage.jsx as a minimal scaffold: import useSessionContext, render PageHeader with title "Race", render InfoAlert when no session is selected, render loading skeleton when data is loading

**Checkpoint**: App loads, Race tab is visible in nav, /race route renders, Lap Times tab is gone

---

## Phase 3: User Story 1 — Navigate Race Tab (Priority: P1) MVP

**Goal**: Replace the Lap Times tab with the Race tab, wired to real session data with proper loading/error states.

**Independent Test**: Load the app with no session; see the Race tab in nav. Select a race session; see the Race page header render with the session label and no JavaScript errors.

- [ ] T010 [US1] Implement get_position_changes in packages/backend/app/services/race_service.py using FastF1 session.laps to return per-driver per-lap position data grouped by driver abbreviation
- [ ] T011 [US1] Implement position-changes endpoint in packages/backend/app/routers/race.py calling race_service.get_position_changes, returning 500 on exception
- [ ] T012 [P] [US1] Implement get_team_pace in packages/backend/app/services/race_service.py using session.laps.pick_quicklaps() grouped by Team, ordered by ascending median lap time
- [ ] T013 [P] [US1] Implement team-pace endpoint in packages/backend/app/routers/race.py calling race_service.get_team_pace
- [ ] T014 [P] [US1] Implement get_driver_laps in packages/backend/app/services/race_service.py returning quick laps for a single driver with compound field
- [ ] T015 [P] [US1] Implement driver-laps endpoint in packages/backend/app/routers/race.py calling race_service.get_driver_laps with driver path parameter
- [ ] T016 [US1] Complete RacePage.jsx in packages/frontend/src/pages/RacePage.jsx: add selectedDrivers (Set) and selectedTeam state, wire usePositionChanges and useTeamPace hooks, render Card placeholders for all three panels with correct grid layout (2-col top row, full-width bottom)
- [ ] T017 [US1] Delete packages/frontend/src/pages/LapTimesPage.jsx, packages/frontend/src/api/lapTimes.js, packages/frontend/src/hooks/useLapTimes.js
- [ ] T018 [P] [US1] Write packages/backend/__tests__/unit/test_race_service.py with unit tests for all three service functions using mocked FastF1 session data

**Checkpoint**: Race tab renders with correct grid layout; all three backend endpoints respond; Lap Times page is removed; tests pass

---

## Phase 4: User Story 2 — Position Changes Chart (Priority: P1)

**Goal**: Full position-changes multi-line chart with inverted Y-axis, driver colours, click-to-toggle selection, and hover tooltips.

**Independent Test**: Load the Race tab for any completed race; see a multi-line chart with one coloured line per driver, Y-axis inverted (position 1 at top), and a tooltip on hover.

- [ ] T019 [US2] Create packages/frontend/src/components/race/PositionChangesChart.jsx using @nivo/line: map API response to nivo series (id = driver abbreviation, color = getTeamColor(team)); set yScale reverse=true; pointSize=5; margin large enough for 20-driver legend outside the plot
- [ ] T020 [US2] Add click handler to PositionChangesChart.jsx: onClick prop receives driver abbreviation; parent RacePage toggles that abbreviation in selectedDrivers Set
- [ ] T021 [US2] Add visual emphasis to PositionChangesChart.jsx: selected drivers render with lineWidth=3 and full opacity; unselected render with lineWidth=1 and opacity=0.25 via the layers prop or colors callback
- [ ] T022 [US2] Add tooltip to PositionChangesChart.jsx using nivo tooltip prop showing driver abbreviation, lap number, and position
- [ ] T023 [US2] Handle loading skeleton and empty state in PositionChangesChart.jsx using MUI Skeleton and a text fallback when data is null
- [ ] T024 [US2] Mount PositionChangesChart in the top-left Card of RacePage.jsx, passing positionData, selectedDrivers, selectedTeam, and onDriverToggle props

**Checkpoint**: Position changes chart renders correctly; clicking a driver line toggles selection; tooltips work; loading/empty states display

---

## Phase 5: User Story 3 — Team Pace Ranking Chart (Priority: P1)

**Goal**: Team pace boxplot ordered fastest to slowest, coloured by team colour, clicking a team highlights its drivers in the position changes chart.

**Independent Test**: Load the Race tab; see a boxplot chart with teams ordered fastest to slowest in official team colours. Click a team; see its drivers' lines emphasised in the position changes chart.

- [ ] T025 [US3] Create packages/frontend/src/components/race/TeamPaceChart.jsx using @nivo/boxplot: transform API response (teams array with laps array) to nivo boxplot data format; set colors callback using getTeamColor(group); horizontal layout with team names on Y-axis; lap time (s) on X-axis
- [ ] T026 [US3] Add click handler to TeamPaceChart.jsx: onClick receives team name; parent RacePage sets selectedTeam state (toggle: clicking the same team again clears it)
- [ ] T027 [US3] Wire selectedTeam into PositionChangesChart.jsx: when selectedTeam is set, derive highlightedDrivers as the set of drivers whose team matches; apply the same emphasis logic as selectedDrivers (bold + full opacity vs dimmed)
- [ ] T028 [US3] Add tooltip to TeamPaceChart.jsx showing team name, median lap time, and Q1/Q3 range
- [ ] T029 [US3] Handle loading skeleton and empty/error state in TeamPaceChart.jsx
- [ ] T030 [US3] Mount TeamPaceChart in the full-width bottom Card of RacePage.jsx, passing teamPaceData, selectedTeam, and onTeamClick props

**Checkpoint**: Team pace boxplot renders; clicking a team highlights its drivers in the position changes chart; loading/empty states display

---

## Phase 6: User Story 4 — Driver Lap Times Panel / Single Driver (Priority: P2)

**Goal**: When exactly one driver is selected, the driver analysis panel shows a scatterplot of that driver's quick laps coloured by tyre compound with inverted Y-axis and compound legend.

**Independent Test**: Select exactly one driver; the top-right panel renders a scatterplot with compound-coloured points, inverted Y-axis, and a tooltip showing lap number, lap time, and compound.

- [ ] T031 [US4] Create packages/frontend/src/components/race/DriverLapScatterplot.jsx using @nivo/line with enableLine=false (scatter mode): X-axis = lap number; Y-axis = lap time in seconds (inverted); map laps to nivo series grouped by compound; use COMPOUND_COLORS from packages/frontend/src/constants/compoundColors.js for point colours; pointSize=8
- [ ] T032 [US4] Add tooltip to DriverLapScatterplot.jsx showing lap number, lap time (formatted as m:ss.mmm), and compound name
- [ ] T033 [US4] Wire useDriverLaps hook in RacePage.jsx: call with (year, event, [...selectedDrivers][0]) when selectedDrivers.size === 1; pass data to DriverLapScatterplot
- [ ] T034 [US4] Mount DriverLapScatterplot in the top-right Card of RacePage.jsx when selectedDrivers.size === 1; show a hint text ("Click a driver line to see their lap times") when selectedDrivers.size === 0
- [ ] T035 [US4] Handle loading skeleton and empty state in DriverLapScatterplot.jsx

**Checkpoint**: Selecting one driver shows the compound-coloured scatterplot; deselecting shows the hint; tooltips display correctly

---

## Phase 7: User Story 5 — Driver Comparison Panel / Multiple Drivers (Priority: P2)

**Goal**: When two or more drivers are selected, the driver analysis panel switches to a multi-line lap time comparison chart with driver-specific colour and line style.

**Independent Test**: Select two drivers; the panel switches from scatterplot to a multi-line chart. Deselect one driver; panel transitions back to scatterplot.

- [ ] T036 [US5] Move packages/frontend/src/components/lapTimes/DriverComparisonChart.jsx to packages/frontend/src/components/race/DriverComparisonChart.jsx; update import path in RacePage.jsx
- [ ] T037 [US5] Update DriverComparisonChart.jsx to accept a selectedDrivers prop (Set or Array) and filter the data to only the selected drivers; remove dependency on the old LapFilters selectedDrivers prop shape if needed
- [ ] T038 [US5] Wire useDriverComparison (from existing /api/lap-times/{year}/{event}/R/comparison endpoint) in RacePage.jsx: call when selectedDrivers.size >= 2; pass comma-joined driver list; pass response data to DriverComparisonChart
- [ ] T039 [US5] Mount DriverComparisonChart in the top-right Card of RacePage.jsx when selectedDrivers.size >= 2, replacing the DriverLapScatterplot slot
- [ ] T040 [US5] Delete packages/frontend/src/components/lapTimes/LapDistributionChart.jsx and packages/frontend/src/components/lapTimes/LapFilters.jsx; remove the now-empty lapTimes/ component folder if empty

**Checkpoint**: Selecting 2+ drivers shows the multi-driver comparison chart; reducing back to 1 shows the scatterplot; reducing to 0 shows the hint

---

## Phase 8: User Story 6 — Interactive Cross-Chart Data Linking (Priority: P2)

**Goal**: Full bidirectional wiring between all three charts via shared selectedDrivers and selectedTeam state, plus a Clear Selection button.

**Independent Test**: Click a team boxplot; position changes chart highlights that team's drivers. Click a driver line; driver analysis panel updates. Click Clear; all charts reset to default.

- [ ] T041 [US6] Add Clear Selection button to RacePage.jsx header area (shown only when selectedDrivers.size > 0 or selectedTeam is set): clicking sets selectedDrivers to new Set() and selectedTeam to null; style as a small secondary MUI Button with a close icon
- [ ] T042 [US6] Verify full wiring in RacePage.jsx: onDriverToggle from PositionChangesChart toggles selectedDrivers; onTeamClick from TeamPaceChart sets/clears selectedTeam; selectedTeam causes PositionChangesChart to apply team-level emphasis; all panels re-render correctly on state change
- [ ] T043 [US6] Add aria-label attributes to PositionChangesChart container div, TeamPaceChart container div, and the driver analysis panel container div for accessibility

**Checkpoint**: All cross-chart interactions work end-to-end; Clear button appears and resets all state; ARIA labels are present

---

## Phase 9: User Story 7 — Animated UI Transitions (Priority: P3)

**Goal**: Smooth Tailwind CSS transitions on tab entry, panel content switching, and chart state changes.

**Independent Test**: Switch to Race tab; content fades in. Select/deselect a driver; the panel content transitions rather than snapping. Select a session; new data appears with a fade.

- [ ] T044 [US7] Add animate-fade-in class (already defined in App.css or index.css) to the root div of RacePage.jsx to fade in the page on tab navigation
- [ ] T045 [US7] Wrap the driver analysis panel content in RacePage.jsx with a transition container: apply transition-all duration-300 opacity-0/opacity-100 Tailwind classes controlled by a boolean derived from selectedDrivers.size; ensures smooth swap between hint → scatterplot → comparison chart
- [ ] T046 [US7] Add transition-opacity duration-200 to PositionChangesChart.jsx line rendering: selected drivers get opacity-100, unselected get opacity-25, ensuring the opacity change animates rather than snaps (CSS handles the interpolation via the @nivo/line layers approach or inline style on each series wrapper)
- [ ] T047 [US7] Verify tab transition: confirm the existing Tailwind animate-fade-in pattern used by other pages is applied consistently to RacePage

**Checkpoint**: All transitions are smooth (200–400ms); no visual jank when switching between driver selection states

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup, backend dead-code removal, and validation against quickstart.md.

- [ ] T048 [P] Delete get_lap_times_distribution function from packages/backend/app/services/lap_time_service.py and the /distribution endpoint from packages/backend/app/routers/lap_times.py
- [ ] T049 [P] Verify no remaining imports of LapTimesPage, useLapTimes, or lapTimes API client exist anywhere in packages/frontend/src/ using grep; fix any found
- [ ] T050 [P] Run ESLint on packages/frontend/src/components/race/ and packages/frontend/src/pages/RacePage.jsx; fix all warnings and errors
- [ ] T051 [P] Run pytest packages/backend/__tests__/unit/test_race_service.py and confirm all tests pass
- [ ] T052 Validate the full quickstart.md flow: start backend, start frontend, select 2024 Bahrain Grand Prix Race session, verify all three charts render, verify driver toggle and team click interactions work, verify Clear button resets state

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS all user stories
- **Phase 3 (US1 - Navigate Race Tab)**: Depends on Phase 2 — backend services + page scaffold
- **Phase 4 (US2 - Position Changes)**: Depends on Phase 3 (T010/T011 for data, T016 for page)
- **Phase 5 (US3 - Team Pace)**: Depends on Phase 3 (T012/T013 for data, T016 for page); can run in parallel with Phase 4
- **Phase 6 (US4 - Single Driver Panel)**: Depends on Phase 4 (selectedDrivers state wired); depends on Phase 3 T014/T015
- **Phase 7 (US5 - Multi Driver Panel)**: Depends on Phase 6 (same driver panel slot)
- **Phase 8 (US6 - Cross-Chart Linking)**: Depends on Phase 4 + Phase 5 + Phase 7 all complete
- **Phase 9 (US7 - Transitions)**: Depends on Phase 8
- **Phase 10 (Polish)**: Depends on all phases complete

### Story Dependencies

- **US1 (P1)**: No story dependencies — MVP entry point
- **US2 (P1)**: Depends on US1 scaffold (RacePage with state)
- **US3 (P1)**: Depends on US1 scaffold; can run in parallel with US2
- **US4 (P2)**: Depends on US2 (selectedDrivers state established)
- **US5 (P2)**: Depends on US4 (shares driver analysis panel slot)
- **US6 (P2)**: Depends on US2 + US3 + US5 (all charts must exist to link)
- **US7 (P3)**: Depends on US6 (all interactions in place before adding transitions)

### Parallel Opportunities Per Story

**Phase 3 (US1) backend tasks can run in parallel:**
- T010 (position-changes service) ‖ T012 (team-pace service) ‖ T014 (driver-laps service)
- T011 (position-changes endpoint) ‖ T013 (team-pace endpoint) ‖ T015 (driver-laps endpoint)
- T017 (delete lap times files) ‖ T018 (write unit tests)

**Phase 4 + Phase 5 can run in parallel** (different components, different data hooks)

**Phase 10 polish tasks are all independent** (T048–T051)

---

## Implementation Strategy

**MVP scope** (minimum to demonstrate value): Phases 1 → 2 → 3 → 4

This delivers: Race tab visible in nav, backend endpoints live, position changes chart rendered. US2 is independently testable and provides the most immediate race narrative value.

**Full delivery**: All phases in order, each phase independently testable.

**Task count summary**:
- Phase 1 (Setup): 3 tasks
- Phase 2 (Foundational): 6 tasks
- Phase 3 (US1): 9 tasks
- Phase 4 (US2): 6 tasks
- Phase 5 (US3): 6 tasks
- Phase 6 (US4): 5 tasks
- Phase 7 (US5): 5 tasks
- Phase 8 (US6): 3 tasks
- Phase 9 (US7): 4 tasks
- Phase 10 (Polish): 5 tasks
- **Total: 52 tasks**
