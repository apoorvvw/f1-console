# Tasks: Dashboard & Session Navigation

**Input**: Design documents from `specs/004-dashboard-session-navigation/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/api.md ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story label (US1, US2, US3)

---

## Phase 1: Setup

**Purpose**: Create the session routing constant and scaffold the Dashboard page file.

- [x] T001 Create session routing constant in `packages/frontend/src/constants/sessionRouting.js` — export `SESSION_ROUTE_MAP` object and `routeForSessionType(type)` function mapping `R`/`S` → `/race`, `Q`/`SQ` → `/qualifying`, `FP1`/`FP2`/`FP3` → `/race`
- [x] T002 Create empty `DashboardPage.jsx` in `packages/frontend/src/pages/` with a default export returning a placeholder `<div>` — used as scaffold for all subsequent tasks

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Wire the Dashboard route in `App.jsx` so all story work can be tested in the browser.

**⚠️ CRITICAL**: Must be complete before Phase 3+ work can be verified end-to-end.

- [x] T003 Modify `packages/frontend/src/App.jsx` — replace `<Route path="/" element={<Navigate to="/race" replace />} />` with `<Route path="/" element={<DashboardPage />} />` and add the `DashboardPage` import
- [x] T004 Modify `packages/frontend/src/components/session/SessionSelector.jsx` — add an optional `onConfirm` prop; after calling `setActiveSession(session)` in `handleConfirm`, call `onConfirm?.(session)` before `onClose()`

**Checkpoint**: App loads at `/` showing the scaffold Dashboard; `SessionSelector` can now accept a post-confirm navigation callback.

---

## Phase 3: User Story 1 — Browse Dashboard and Select a Session (Priority: P1) 🎯 MVP

**Goal**: User lands on the Dashboard, opens the session selector, picks a session, and is automatically navigated to the correct analysis page. Recent sessions are visible as quick-select shortcuts.

**Independent Test**: Open `/`, click the session selector button, pick a Race session → confirm navigation to `/race`. Repeat with a Qualifying session → confirm `/qualifying`. Verify recent sessions row appears after first selection.

### Implementation for User Story 1

- [x] T005 [US1] Implement the session selector trigger area in `packages/frontend/src/pages/DashboardPage.jsx` — a prominent hero card with a "Select Session" button that opens `SessionSelector` dialog; pass `onConfirm` callback that calls `useNavigate` with `routeForSessionType(session.sessionType)`
- [x] T006 [US1] Add `RecentSessions` component to `packages/frontend/src/pages/DashboardPage.jsx` below the hero card — clicking a recent session sets it as active via `setActiveSession` and navigates to the appropriate route using `routeForSessionType`
- [x] T007 [US1] Wire `SessionSelector` open/close state in `packages/frontend/src/pages/DashboardPage.jsx` — local `selectorOpen` boolean state controls dialog visibility

**Checkpoint**: User Story 1 is fully functional. Open `/`, select any session, land on correct page. Recent sessions appear and are clickable.

---

## Phase 4: User Story 2 — Navigate to Track Visualization from Dashboard (Priority: P2)

**Goal**: Dashboard shows a dedicated Tracks navigation card that takes the user to `/track` with a single click.

**Independent Test**: From `/`, click the Tracks card and confirm navigation to `/track`. No session selection required.

### Implementation for User Story 2

- [x] T008 [P] [US2] Add a Tracks navigation card to `packages/frontend/src/pages/DashboardPage.jsx` — use `<Link to="/track">` (React Router) styled as a MUI Card with a circuit/map icon and "Explore Tracks" label

**Checkpoint**: User Story 2 complete. Tracks card is visible on Dashboard and navigates to `/track` independently of session state.

---

## Phase 5: User Story 3 — View Contextual F1 Data on Dashboard (Priority: P3)

**Goal**: Dashboard displays a standings snapshot (top 3 drivers and constructors) and the next upcoming race event without requiring any user interaction.

**Independent Test**: Open `/` without selecting a session. Confirm standings card and upcoming race card are visible, show loading states during fetch, and show empty/error states gracefully when data is unavailable.

### Implementation for User Story 3

- [x] T009 [P] [US3] Create `UpcomingRaceCard` component in `packages/frontend/src/pages/DashboardPage.jsx` (or inline) — call `useSchedule(CURRENT_YEAR)`, derive `upcomingEvent` as the first event where `EventDate >= today`, display event name and date; show skeleton/empty state when loading or no events found
- [x] T010 [P] [US3] Create `StandingsSnapshotCard` component in `packages/frontend/src/pages/DashboardPage.jsx` (or inline) — derive `latestCompletedRound` from schedule (last event where `EventDate < today`), call `useStandings(CURRENT_YEAR, latestRound)`, display top 3 drivers and top 3 constructors; show skeleton/empty state when loading or round unavailable
- [x] T011 [US3] Compose `UpcomingRaceCard` and `StandingsSnapshotCard` into the Dashboard layout in `packages/frontend/src/pages/DashboardPage.jsx` alongside the session selector hero and Tracks card; ensure responsive grid layout using Tailwind

**Checkpoint**: User Story 3 complete. Dashboard shows all four sections: session selector, recent sessions, Tracks card, standings + upcoming race.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Unit tests, E2E test, and final layout polish.

- [x] T012 [P] Write unit tests for `routeForSessionType` in `packages/frontend/src/__tests__/DashboardPage.test.jsx` — verify correct route returned for each session type including edge cases
- [x] T013 [P] Write unit tests for `DashboardPage` render in `packages/frontend/src/__tests__/DashboardPage.test.jsx` — verify session selector button renders, Tracks card renders, and loading states show correctly when hooks return pending
- [x] T014 [P] Create Playwright Page Object `tests/e2e/pages/DashboardPage.js` with selectors and helper methods for: session selector button, recent sessions, Tracks card link
- [x] T015 Write E2E test `tests/e2e/specs/dashboard-navigation.spec.js` — journey: open app at `/`, select Race session via Dashboard, assert navigation to `/race`; select Qualifying session, assert `/qualifying`; click Tracks card, assert `/track`

---

## Dependencies

```
T001 → T005, T006                 (routing constant needed before navigation callbacks)
T002 → T003, T004                 (scaffold file must exist before wiring)
T003 → T005, T006, T007, T008     (route must be mounted before page work)
T004 → T005                       (onConfirm callback needed for session selection nav)
T005, T006, T007 → T011           (US1 complete before full layout composition)
T008 → T011                       (US2 complete before full layout composition)
T009, T010 → T011                 (US3 cards ready before composition)
T011 → T012, T013, T014, T015     (full page ready before tests)
```

## Parallel Execution Opportunities

**After T001–T004 complete** (foundational), these tasks can run in parallel:
- T005 + T006 + T007 (US1 implementation — all touch DashboardPage.jsx but in additive sections)
- T008 (US2 Tracks card — independent of US1 state logic)
- T009 + T010 (US3 cards — independent data fetches, no shared state)

**After T011 completes** (full layout):
- T012 + T013 + T014 can all run in parallel (different test files/targets)

## Implementation Strategy

**MVP scope**: Complete Phases 1–3 (T001–T007). This delivers US1: a working Dashboard that routes to the correct analysis page. Phases 4–6 layer in Tracks navigation, contextual data cards, and tests incrementally.

**Suggested order for solo development**:
T001 → T002 → T003 → T004 → T005 → T007 → T006 → T008 → T009 → T010 → T011 → T012 → T013 → T014 → T015
