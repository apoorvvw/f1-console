# Implementation Plan: Dashboard & Session Navigation

**Branch**: `004-dashboard-session-navigation` | **Date**: 2026-04-30 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/004-dashboard-session-navigation/spec.md`

## Summary

Add a Dashboard landing page (`/`) that provides session selection with automatic routing to Race or Qualifying pages based on session type, a Tracks navigation card, a standings snapshot, and an upcoming race preview. The existing `SessionSelector`, `RecentSessions`, `SessionContext`, and championship/schedule hooks are reused. A new `sessionRouting.js` constant enforces the session-type-to-route mapping.

## Technical Context

**Language/Version**: JavaScript (React 18)
**Primary Dependencies**: React Router DOM, MUI v5, TanStack Query, Tailwind CSS
**Storage**: `localStorage` via existing `SessionContext` (recent sessions)
**Testing**: Vitest + React Testing Library (unit), Playwright (E2E)
**Target Platform**: Web SPA (Vite)
**Project Type**: Web application (frontend-only)
**Performance Goals**: Dashboard renders in <2s; no new backend endpoints
**Constraints**: Zero new backend API endpoints; reuse all existing hooks and context
**Scale/Scope**: 1 new page, 1 new constant file, 2 modified files, 2 new test files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Code Quality & Consistency | ✅ PASS | 2-space indent, const/let, ESLint enforced, reusing existing components |
| II. Comprehensive Testing | ✅ PASS | Unit tests for `DashboardPage`; E2E test for session-select-and-navigate journey |
| III. Accessible & Responsive UI | ✅ PASS | MUI components throughout; existing layout patterns reused; keyboard accessible |
| IV. Data-Driven Analysis | ✅ PASS | Standings and schedule data from FastF1 via existing endpoints |
| V. Code Review Discipline | ✅ PASS | Work on feature branch; PR required before merge |

**No violations. No Complexity Tracking needed.**

## Project Structure

### Documentation (this feature)

```text
specs/004-dashboard-session-navigation/
├── plan.md              ← This file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── contracts/
│   └── api.md           ← Phase 1 output
└── tasks.md             ← Phase 2 output (via /speckit.tasks)
```

### Source Code

```text
packages/frontend/
├── src/
│   ├── constants/
│   │   └── sessionRouting.js           ← NEW: session type → route map
│   ├── pages/
│   │   └── DashboardPage.jsx           ← NEW: dashboard page
│   ├── App.jsx                         ← MODIFY: mount DashboardPage at /
│   └── components/
│       └── session/
│           └── SessionSelector.jsx     ← MODIFY: accept onConfirm callback
│   └── __tests__/
│       └── DashboardPage.test.jsx      ← NEW: unit tests
tests/e2e/
├── pages/
│   └── DashboardPage.js               ← NEW: Playwright Page Object
└── specs/
    └── dashboard-navigation.spec.js   ← NEW: E2E test
```

**Structure Decision**: Web application layout. Frontend-only change. No backend modifications.

## Complexity Tracking

*No violations — no tracking required.*
