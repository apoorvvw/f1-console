# Implementation Plan: Qualifying Page Enhancements

**Branch**: `002-qualifying-page-enhancements` | **Date**: 2026-04-30 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/002-qualifying-page-enhancements/spec.md`

## Summary

Enhance the existing Qualifying page to add three integrated interactive elements:
a team-coloured horizontal delta bar chart (gap to pole / round fastest), an inline
driver stats card (Q1/Q2/Q3 times + mini progression chart), and an embedded track
map showing speed data for the selected driver's fastest qualifying lap. All three
elements share a single `selectedDriver` state so clicking any element syncs all
others. One minor backend change is required: add `team_color` (hex string, from
`fastf1.plotting.get_team_color`) to the qualifying results response. The existing
`DriverDetailPanel` drawer is removed and replaced by the inline stats card.

## Technical Context

**Language/Version**: JavaScript (ES2022, JSX) — frontend; Python 3.11 — backend  
**Primary Dependencies (frontend)**: React 19, Vite, React Router v7, TanStack Query v5, MUI v9, Nivo (`@nivo/bar`), D3 scales (`d3-scale`, `d3-scale-chromatic`), Vitest, React Testing Library, Playwright  
**Primary Dependencies (backend change)**: FastF1 3.5.3 (`fastf1.plotting.get_team_color`), FastAPI (existing)  
**Storage**: FastF1 file-based cache (existing); no new storage  
**Testing**: Vitest + React Testing Library (frontend unit/component); pytest (backend unit); Playwright (E2E — `tests/e2e/specs/qualifying-results.spec.js`)  
**Target Platform**: Modern web browsers (Chrome 120+, Firefox 120+, Safari 17+); responsive 375px–1440px  
**Project Type**: Web application — React SPA frontend + Python FastAPI backend  
**Performance Goals**: Track map loads within 5 s on warm cache; metric toggle re-renders in <300 ms (client-side only); qualifying results load in <5 s on warm cache  
**Constraints**: Responsive 375px+; WCAG AA colour contrast; keyboard accessible; no real-time data; no new npm dependencies  
**Scale/Scope**: Single-user local tool; 1 enhanced analytical page; 2 new components, 2 modified components, 1 deleted component, 1 backend service field addition

## Constitution Check

*GATE: Evaluated against `.specify/memory/constitution.md` v1.0.0*

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Code Quality & Consistency** | ✅ PASS | ESLint + Prettier already configured. New components follow 2-space indent, 100-char limit, `const`/`let`. SVG chart is idiomatic to the codebase (same pattern as `TrackMap`). |
| **II. Comprehensive Testing** | ✅ PASS | Frontend unit tests for `QualifyingDeltaChart` and `DriverStatsCard` in `packages/frontend/src/__tests__/`. Backend unit test for `team_color` field in `packages/backend/__tests__/unit/`. E2E qualifying journey updated in `tests/e2e/specs/qualifying-results.spec.js`. |
| **III. Accessible & Responsive UI** | ✅ PASS | SVG chart bars have `role="button"`, `aria-label`, `aria-pressed`. Layout is responsive (FR-014). Metric toggle and corner annotation toggle reuse existing accessible components. |
| **IV. Data-Driven Analysis** | ✅ PASS | All data via FastF1/FastAPI. Chart bars labelled with Δ values. Track map has speed/throttle/brake overlays. Team colours sourced from FastF1's official palette. |
| **V. Code Review Discipline** | ✅ PASS | All changes on branch `002-qualifying-page-enhancements`, merged via PR. |

**Post-Design Re-check**: No violations introduced. No new external dependencies. `DriverDetailPanel` deleted cleanly; no orphan imports remain after `QualifyingPage` is updated.

## Project Structure

### Documentation (this feature)

```text
specs/002-qualifying-page-enhancements/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── api.md           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created here)
```

### Source Code (repository root)

```text
packages/
├── backend/
│   ├── app/
│   │   └── services/
│   │       └── qualifying_service.py   # MODIFIED: add team_color field
│   └── __tests__/
│       └── unit/
│           └── test_services.py        # MODIFIED: add team_color assertion
└── frontend/
    └── src/
        ├── components/
        │   └── qualifying/
        │       ├── QualifyingDeltaChart.jsx   # NEW
        │       ├── DriverStatsCard.jsx         # NEW (replaces DriverDetailPanel)
        │       ├── DriverDetailPanel.jsx       # DELETED
        │       ├── QualifyingTable.jsx         # MODIFIED: selectedDriver prop + row highlight
        │       └── RoundFilter.jsx             # unchanged
        └── pages/
            └── QualifyingPage.jsx             # MODIFIED: new layout + track map integration

tests/
└── e2e/
    └── specs/
        └── qualifying-results.spec.js         # MODIFIED: cover new interactions
```

**Structure Decision**: Web application with separate `packages/backend` and
`packages/frontend`. All source changes are confined to qualifying-related files;
no new folders or packages are introduced.

## Complexity Tracking

No constitution violations. No complexity justifications required.
