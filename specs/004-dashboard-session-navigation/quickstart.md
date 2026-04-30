# Quickstart: Dashboard & Session Navigation

## Overview

Adds a Dashboard landing page to F1 Console. The Dashboard provides session selection with automatic routing to the Race or Qualifying analysis page, a quick-access Tracks card, a standings snapshot, and an upcoming race preview.

## Key Files

| File | Change |
|------|--------|
| `packages/frontend/src/pages/DashboardPage.jsx` | **New** — dashboard page component |
| `packages/frontend/src/constants/sessionRouting.js` | **New** — session type → route map |
| `packages/frontend/src/App.jsx` | **Modify** — replace `/` redirect with `<DashboardPage />` |
| `packages/frontend/src/components/session/SessionSelector.jsx` | **Modify** — accept `onConfirm` callback for post-selection navigation |
| `packages/frontend/src/__tests__/DashboardPage.test.jsx` | **New** — unit tests |
| `tests/e2e/specs/dashboard-navigation.spec.js` | **New** — E2E test |
| `tests/e2e/pages/DashboardPage.js` | **New** — Playwright Page Object |

## Development Flow

1. **Create session routing constant**
   ```js
   // packages/frontend/src/constants/sessionRouting.js
   export const SESSION_ROUTE_MAP = {
     R: '/race', S: '/race',
     Q: '/qualifying', SQ: '/qualifying',
     FP1: '/race', FP2: '/race', FP3: '/race',
   };
   export function routeForSessionType(type) {
     return SESSION_ROUTE_MAP[type] ?? '/race';
   }
   ```

2. **Modify `SessionSelector`** to accept an optional `onConfirm(session)` callback. When provided, call it after `setActiveSession`.

3. **Create `DashboardPage`** with:
   - Session selector trigger button → opens `SessionSelector` dialog, on confirm navigates via `routeForSessionType`
   - `RecentSessions` row with navigation on click (reuse, add `onSelect` nav callback)
   - Tracks card → `<Link to="/track">`
   - Standings snapshot card → `useStandings(currentYear, latestRound)`
   - Upcoming race card → derived from `useSchedule(currentYear)`

4. **Update `App.jsx`** — change root route from `<Navigate to="/race" replace />` to `<DashboardPage />`.

5. **Write tests** — unit tests for `DashboardPage` render states; E2E for full session-select-and-navigate journey.

## Running Locally

```bash
# Start backend
cd packages/backend && uvicorn app.main:app --reload --port 8000

# Start frontend
cd packages/frontend && npm run dev

# Run frontend unit tests
cd packages/frontend && npm test

# Run E2E tests
cd tests/e2e && npx playwright test dashboard-navigation.spec.js
```
