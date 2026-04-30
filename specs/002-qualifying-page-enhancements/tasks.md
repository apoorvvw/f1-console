# Tasks: Qualifying Page Enhancements

**Input**: Design documents from `specs/002-qualifying-page-enhancements/`  
**Branch**: `002-qualifying-page-enhancements`  
**Prerequisites**: [plan.md](./plan.md) · [spec.md](./spec.md) · [data-model.md](./data-model.md) · [contracts/api.md](./contracts/api.md) · [research.md](./research.md)

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (targets different files, no dependency on incomplete tasks)
- **[US1–US5]**: User story this task belongs to
- Exact file paths included in every task

---

## Phase 1: Setup

**Purpose**: Minimal wiring changes needed before any user story work begins.  
No new packages, project structure, or framework setup is required — the project already exists.

- [ ] T001 Remove `DriverDetailPanel.jsx` from `packages/frontend/src/components/qualifying/DriverDetailPanel.jsx` (delete file)

**Checkpoint**: Dead component removed; no orphan imports remain (they will be cleaned up in T011).

---

## Phase 2: Foundational — Backend `team_color` Field

**Purpose**: Add `team_color` to the qualifying results response. Every frontend user story depends on this field being present.

**⚠️ CRITICAL**: Phase 3 (QualifyingDeltaChart) cannot render correct team colours until this is shipped.

- [ ] T002 Add `import fastf1.plotting` and `team_color` field to `get_qualifying_results` in `packages/backend/app/services/qualifying_service.py`: call `fastf1.plotting.get_team_color(lap["Team"], session=session)` inside `try/except`, fallback `"#808080"`; add `"team_color": team_color` to each result dict
- [ ] T003 [P] Add `team_color` assertion to backend unit test in `packages/backend/__tests__/unit/test_services.py`: mock qualifying results; assert each result contains a non-empty `team_color` string matching `^#[0-9A-Fa-f]{6}$` or `"#808080"`

**Checkpoint**: `GET /api/qualifying/{year}/{event}` returns `team_color` per driver. Backend tests pass.

---

## Phase 3: User Story 1 — Qualifying Delta Chart (Priority: P1) 🎯 MVP

**Goal**: Render a team-coloured horizontal bar chart below the results table showing each driver's gap to the reference lap (pole for "All"; fastest within the selected round for Q1/Q2/Q3).

**Independent Test**: Load the qualifying page for any cached session; confirm a horizontal bar chart renders with team-coloured bars and Δ labels. No driver selection needed.

### Implementation for User Story 1

- [ ] T004 [US1] Create `packages/frontend/src/components/qualifying/QualifyingDeltaChart.jsx`: SVG component with `ResizeObserver` for responsive width; accepts `results`, `selectedDriver`, `onDriverSelect`, `roundFilter`, `isLoading` props; computes `chartData` (sorted by delta) from `results` filtered/referenced per `roundFilter`; renders one `<rect>` bar per driver coloured by `team_color`, `<text>` driver abbreviation, `<text>` Δ label; each bar `<g>` has `role="button"`, `aria-label`, `aria-pressed`; selected driver bar gets highlight rect and border; loading state shows `<Skeleton>`; empty state shows a note when no bars for selected round
- [ ] T005 [P] [US1] Update `QualifyingTable.jsx` in `packages/frontend/src/components/qualifying/QualifyingTable.jsx`: add `selectedDriver` prop; apply `'q-selected-row'` CSS class to the row whose `driver` field matches `selectedDriver?.driver`; add MUI DataGrid `sx` rule `'& .q-selected-row': { backgroundColor: 'rgba(25,118,210,0.12)', fontWeight: 700 }`
- [ ] T006 [US1] Update `packages/frontend/src/pages/QualifyingPage.jsx`: replace existing single-card layout with three-section layout — (1) full-width `<Card>` containing `RoundFilter` + `QualifyingTable`; (2) two-column responsive row (`grid grid-cols-1 md:grid-cols-2 gap-4`) — left column: `<Card>` containing `QualifyingDeltaChart`; right column: placeholder Card; wire `selectedDriver` state (`useState(null)`); pass `selectedDriver` and `onDriverSelect` to both `QualifyingTable` and `QualifyingDeltaChart`; remove `DriverDetailPanel` import; reset `selectedDriver` to `null` when `activeSession` changes (use `useEffect`)

**Checkpoint**: Delta chart renders with team colours; clicking a bar or table row highlights both; round filter updates both table and chart simultaneously; driver selection survives round filter change. User Story 1 is independently testable.

---

## Phase 4: User Story 2 — Cross-Element Driver Selection (Priority: P1)

**Goal**: Clicking a bar in the delta chart or a row in the results table selects that driver across all elements simultaneously; clicking again deselects. Both elements show the same highlighted driver.

**Independent Test**: Click any bar → corresponding table row highlights and bar highlights. Click same bar again → both highlights clear.

*(This phase is implemented as part of T005 + T006 above — the `selectedDriver` state wiring covers all User Story 2 acceptance scenarios. There are no additional implementation tasks beyond Phase 3 for this story.)*

### Verification tasks

- [ ] T007 [US2] Verify in `QualifyingPage.jsx` that `onDriverSelect` passed to both `QualifyingDeltaChart` and `QualifyingTable` uses the toggle pattern: `(row) => setSelectedDriver(prev => prev?.driver === row?.driver ? null : row)`
- [ ] T008 [P] [US2] Verify `QualifyingDeltaChart.jsx` passes `isSelected ? null : d.row` to `onDriverSelect` on bar click (deselect on re-click)

**Checkpoint**: All three User Story 2 acceptance scenarios pass when tested manually.

---

## Phase 5: User Story 3 — Embedded Track Map with Speed Data (Priority: P1)

**Goal**: When a driver is selected, a compact stats card (Q times + mini progression chart) and the circuit track map with speed overlay appear in the right column.

**Independent Test**: Select a driver → right column shows stats card with Q1/Q2/Q3 times and a mini bar chart; below it the track map renders with the speed colour gradient; hovering shows the tooltip.

### Implementation for User Story 3

- [ ] T009 [US3] Create `packages/frontend/src/components/qualifying/DriverStatsCard.jsx`: accepts `driver` (full QualifyingResult row or null) prop; when `driver` is null renders nothing; when set renders: driver abbreviation + full name + team name header; Q1/Q2/Q3 text rows with `formatTime`; best lap + Δ to pole; Nivo `ResponsiveBar` mini chart (height 160px) with `data` = participating rounds only, `keys={['seconds']}`, `indexBy="round"`, `minValue` = min - 0.5, team colour fill, axis labels; port chart markup from deleted `DriverDetailPanel`
- [ ] T010 [US3] Update right column in `packages/frontend/src/pages/QualifyingPage.jsx`: import `DriverStatsCard`, `TrackMap`, `TelemetryToggle`, `useLapTelemetry`, `useCornerAnnotations`; add `metric` state (default `'speed'`) and `showCorners` state (default `true`); right column Card renders: `<DriverStatsCard driver={selectedDriver} />`; then telemetry error alert if error; then placeholder div if `!selectedDriver`; then `<TrackMap points={telemetry?.telemetry} corners={cornersData?.corners} metric={metric} showCorners={showCorners} isLoading={telLoading} />`; `useLapTelemetry` called with `year, event, 'Q', selectedDriver?.driver ?? null, null`; `useCornerAnnotations` called with `year, event`

**Checkpoint**: Selecting a driver shows stats card + track map. Deselecting hides both. Telemetry error shows inline message without breaking page. Loading shows skeleton in map area.

---

## Phase 6: User Story 4 — Telemetry Metric Toggle (Priority: P2)

**Goal**: Speed / Throttle / Brake toggle buttons above the track map change the colour overlay on the map. Selected metric is preserved when switching drivers.

**Independent Test**: Select a driver → toggle to "Throttle" → map redraws with green throttle scale → switch driver → throttle scale is still active.

### Implementation for User Story 4

- [ ] T011 [US4] Add metric toggle controls to right column in `packages/frontend/src/pages/QualifyingPage.jsx`: above `<TrackMap>`, render `<TelemetryToggle value={metric} onChange={setMetric} />` (already imported in T010); label it with a `text-xs text-white/40 uppercase` heading "Overlay metric"; ensure `metric` state is NOT reset when `selectedDriver` changes

**Checkpoint**: Metric toggle is visible and functional when a driver is selected. Switching drivers keeps the chosen metric.

---

## Phase 7: User Story 5 — Corner Annotations Toggle (Priority: P3)

**Goal**: A toggle switch shows/hides corner number circles on the track map without reloading telemetry.

**Independent Test**: Enable corners toggle → numbered circles appear on track map → disable → circles disappear; telemetry does not reload.

### Implementation for User Story 5

- [ ] T012 [US5] Add corner annotations toggle to right column in `packages/frontend/src/pages/QualifyingPage.jsx`: below `<TelemetryToggle>`, render the same toggle switch pattern used in `TrackPage.jsx` (inline `onClick` toggles `showCorners` boolean, styled with conditional classes); label "Corner annotations"; pass `showCorners` prop to `<TrackMap>`

**Checkpoint**: Corner circles appear/disappear client-side with no API call.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Responsive layout, edge case handling, and E2E test update.

- [ ] T013 [P] Verify responsive stacking in `QualifyingPage.jsx`: confirm the two-column row uses `grid grid-cols-1 md:grid-cols-2` (or `lg:grid-cols-2`) breakpoint so layout stacks on screens < 960px; manually test at 375px viewport width
- [ ] T014 [P] Add `useEffect` in `QualifyingPage.jsx` that resets `selectedDriver` to `null` and `metric` to `'speed'` when `activeSession` changes (dependency array: `[activeSession]`)
- [ ] T015 [P] Handle missing-round edge case in `QualifyingDeltaChart.jsx`: when `roundFilter !== 'All'` and the selected driver has no bar in the current round's data, render a small informational note below the chart: "Selected driver did not participate in {roundFilter}"
- [ ] T016 [P] Update E2E test `tests/e2e/specs/qualifying-results.spec.js`: add assertions for — delta chart is visible after data loads; clicking a chart bar highlights a table row; right column track map is visible after bar click; metric toggle buttons are visible; corner annotations toggle is visible

---

## Dependency Graph

```
T001 (delete DriverDetailPanel)
  └─ T006 (QualifyingPage — no more import)

T002 (backend team_color)
  └─ T004 (QualifyingDeltaChart — uses team_color from results)

T004 (QualifyingDeltaChart) + T005 (QualifyingTable selectedDriver) + T006 (QualifyingPage layout)
  └─ T007 (verify toggle pattern — US2)
  └─ T008 (verify deselect — US2)

T006 (QualifyingPage layout)
  └─ T009 (DriverStatsCard)
  └─ T010 (right column track map)
       └─ T011 (metric toggle)
            └─ T012 (corner annotations toggle)

T010–T012
  └─ T013 (responsive check)
  └─ T014 (session change reset)
  └─ T015 (missing-round edge case)
  └─ T016 (E2E test update)

T003 (backend unit test) — parallel to T002, no blockers
```

---

## Parallel Execution Opportunities

**Group A** (after T002 is done, can run simultaneously):
- T003 [backend unit test] + T004 [QualifyingDeltaChart] + T005 [QualifyingTable row highlight]

**Group B** (after T004 + T005 + T006 are done):
- T007 + T008 [US2 verification tasks] — read-only checks, no file conflicts

**Group C** (after T010 is done, independent files):
- T013 [responsive] + T014 [session reset] + T015 [missing-round note] + T016 [E2E]

---

## Implementation Strategy

**MVP scope** (User Stories 1–3, highest value): T001 → T002 → T003 (parallel) → T004 + T005 (parallel) → T006 → T007 + T008 → T009 → T010  
**Full feature** (User Stories 4–5): T011 → T012  
**Polish**: T013–T016 (all parallelisable)

Suggested delivery order for a single developer:
1. T001, T002, T003 — backend foundation
2. T004, T005 — new component + table update (parallel)
3. T006 — page assembly (depends on T004 + T005)
4. T007, T008 — US2 verification
5. T009, T010 — stats card + track map
6. T011, T012 — metric toggle + corner annotations
7. T013–T016 — polish + E2E

---

## Task Count Summary

| Phase | Story | Tasks | Notes |
|-------|-------|-------|-------|
| Phase 1 — Setup | — | 1 | Delete `DriverDetailPanel.jsx` |
| Phase 2 — Foundational | — | 2 | Backend `team_color` + unit test |
| Phase 3 — Delta Chart | US1 | 3 | New component + table update + page layout |
| Phase 4 — Driver Selection | US2 | 2 | Verification of toggle wiring |
| Phase 5 — Track Map | US3 | 2 | `DriverStatsCard` + right column map |
| Phase 6 — Metric Toggle | US4 | 1 | Single control addition |
| Phase 7 — Corner Toggle | US5 | 1 | Single control addition |
| Phase 8 — Polish | — | 4 | Responsive, reset, edge case, E2E |
| **Total** | | **16** | |

**Parallel opportunities**: 4 identified (Groups A, B, C + backend unit test)  
**Independent test criteria**: Each of US1–US5 has a stated independent test in the phases above  
**MVP scope**: T001–T010 (10 tasks) delivers US1 + US2 + US3 — the complete interactive qualifying analysis experience
