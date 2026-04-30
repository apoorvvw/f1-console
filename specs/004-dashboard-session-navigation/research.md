# Research: Dashboard & Session Navigation

## 1. Session Routing Logic

**Decision**: Use a lookup map from session type to route path (`R`/`S` → `/race`, `Q`/`SQ` → `/qualifying`). Practice sessions (FP1/FP2/FP3) routed to `/race` as an interim solution; marked for future dedicated page.

**Rationale**: A simple constant map keeps routing logic co-located and easy to update when a Practice page is eventually added. React Router's `useNavigate` is already available via `react-router-dom`.

**Alternatives considered**:
- Conditionals in `SessionSelector` — rejected; mixes routing concern into a selector component.
- Server-side redirect — rejected; this is a SPA with client-side routing.

---

## 2. Dashboard Page Structure

**Decision**: Create a new `DashboardPage.jsx` at `packages/frontend/src/pages/`. Replace the root `/` redirect in `App.jsx` with `<DashboardPage />`. The page contains:
1. A session selector card (reuses `SessionSelector` dialog, triggered by a prominent button/card)
2. A recent sessions row (reuses `RecentSessions` component)
3. A Tracks navigation card
4. A standings snapshot card (top 3 drivers, top 3 constructors)
5. An upcoming race card

**Rationale**: Composing existing components minimises new code. A dedicated page component keeps routing clean and testable.

**Alternatives considered**:
- Embedding session selector inline (no dialog) — deferred; existing `SessionSelector` dialog works and avoids duplicating dropdown state.
- Putting dashboard content in `AppShell` — rejected; mixes page-level content with layout.

---

## 3. Standings Snapshot Data

**Decision**: Reuse the existing `/api/championship/{year}/{round_number}/standings` endpoint. On the Dashboard, default to the current year (2026) and latest available round (use `schedule` data to determine last completed round). Fetch top 3 drivers and top 3 constructors from the response.

**Rationale**: No new backend endpoint needed. `useStandings` hook already exists. To find "latest round", scan the schedule for events with `EventDate < today` and take the last one's `RoundNumber`.

**Alternatives considered**:
- A dedicated `/api/dashboard/standings` endpoint — rejected; over-engineering for data already exposed.
- Hardcoding current round — rejected; would break across the season.

---

## 4. Upcoming Race Data

**Decision**: Derive upcoming race from the schedule already fetched by `useSchedule(year)`. Filter for events with `EventDate >= today`, take the first result.

**Rationale**: Zero new API calls. `useSchedule` is already used in `SessionSelector`.

**Alternatives considered**:
- Dedicated `/api/sessions/next` endpoint — unnecessary; schedule data contains dates.

---

## 5. Tracks Navigation Entry Point

**Decision**: Add a "Tracks" card on the Dashboard that navigates to `/track` using React Router `<Link>`. No session is required.

**Rationale**: Tracks page already handles empty session state gracefully (based on existing `InfoAlert` pattern). A card on the Dashboard increases discoverability.

---

## 6. Post-Session-Selection Navigation

**Decision**: Extend `SessionContext.setActiveSession` caller (or use a wrapper on the Dashboard) to call `navigate(routeForSessionType(sessionType))` immediately after session is confirmed. `SessionSelector` receives an `onConfirm` callback prop that the Dashboard supplies with navigation logic.

**Rationale**: Keeps navigation logic in the page layer, not in the shared context or selector dialog.

**Alternatives considered**:
- Putting `navigate` inside `SessionContext` — rejected; context should not depend on router.
- Using a `useEffect` watching `activeSession` — rejected; causes flash/double-render, harder to test.

---

## 7. Testing Strategy

**Decision**:
- Unit tests: `DashboardPage` rendering (empty state, with active session), session type routing map function.
- E2E (Playwright): One critical journey — open app, select Race session on Dashboard, verify navigation to `/race`.

**Rationale**: Follows constitution mandate: unit tests in `packages/frontend/src/__tests__/`, E2E in `tests/e2e/` using Page Object Model.
