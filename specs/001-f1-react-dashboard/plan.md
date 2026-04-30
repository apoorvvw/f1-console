# Implementation Plan: F1 React Dashboard

**Branch**: `001-f1-react-dashboard` | **Date**: 2026-04-29 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/001-f1-react-dashboard/spec.md`

## Summary

Build a React single-page application dashboard that visualises Formula 1 session data sourced from the existing Python/FastAPI backend. The dashboard provides four core analytical views — Lap Time Analysis, Track Speed Visualization, Qualifying Results, and Championship Scenarios — plus a session navigation panel. Three minor backend additions are required: Q1/Q2/Q3 per-round times in the qualifying endpoint, a selectable-lap telemetry endpoint, and a total-rounds field on the season schedule response.

## Technical Context

**Language/Version**: JavaScript (ES2022, JSX) — frontend; Python 3.11 — backend (existing)  
**Primary Dependencies (frontend)**: React 18, Vite 5, React Router v6, TanStack Query v5, MUI v5, Nivo (charts), D3 color scales (`d3-scale`, `d3-scale-chromatic`), Vitest, React Testing Library, Playwright  
**Design Tooling**: Figma MCP (`create_new_file`, `use_figma`, `get_design_context`, `get_screenshot`) — new dedicated Figma file "F1 Console Dashboard"; design-first workflow (Figma → React); `get_design_context` used as implementation reference per screen  
**Primary Dependencies (backend additions)**: FastF1 (existing), FastAPI (existing)  
**Storage**: FastF1 file-based cache (existing); browser `localStorage` for recently viewed sessions (client-side only)  
**Testing**: Vitest + React Testing Library (frontend unit/component); pytest (backend unit — existing); Playwright (E2E, `tests/e2e/`)  
**Target Platform**: Modern web browsers (Chrome 120+, Firefox 120+, Safari 17+); responsive 320px–1440px+  
**Project Type**: Web application — React SPA frontend + Python FastAPI backend  
**Performance Goals**: Session data loads and chart renders in <5 s on broadband (post cache warm-up); UI interactions respond in <300 ms; track map renders at 60 fps on desktop  
**Constraints**: Responsive across mobile/tablet/desktop; WCAG AA color contrast; keyboard accessible; no real-time data; no authentication required  
**Scale/Scope**: Single-user local tool; 4 analytical views; ~20 React components; 3 minor backend endpoint changes

## Constitution Check

*GATE: Evaluated against `.specify/memory/constitution.md` v1.0.0*

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Code Quality & Consistency** | ✅ PASS | Frontend: ESLint + Prettier configured via Vite. 2-space indent, 100-char line limit, `const`/`let`, no `var`. |
| **II. Comprehensive Testing** | ✅ PASS | Frontend unit/component tests in `packages/frontend/src/__tests__/` with Vitest + RTL. Backend tests unchanged. E2E in `tests/e2e/` with Playwright (Page Object Model, 5 journeys). |
| **III. Accessible & Responsive UI** | ✅ PASS | MUI v5 for all form/button/table/nav components. Color palette: primary #1976d2, secondary #ff9800. Keyboard accessible, WCAG AA, 8px grid, 48×48px min touch targets. |
| **IV. Data-Driven Analysis** | ✅ PASS | All data via FastF1 API through the existing caching backend. Visualisations include labels, legends, color-coded drivers. |
| **V. Code Review Discipline** | ✅ PASS | All work on branch `001-f1-react-dashboard`, merged via PR. |

**Post-Design Re-check**: No violations introduced. All new components use MUI. All new services route through the existing FastAPI backend. No external data calls from the browser.

## Design Workflow (Figma MCP)

**Approach**: Design-first — all 5 screens are designed in Figma before their corresponding React pages are implemented. Each implementation task reads the design via `get_design_context` before authoring components.

**Figma file**: A new dedicated file named **"F1 Console Dashboard"** created via Figma MCP `create_new_file`. The `fileKey` is recorded in `specs/001-f1-react-dashboard/figma-file.md` after creation.

**Screen inventory** (in design order — AppShell first, as it wraps all views):

| Frame | Covers | Blocks implementation of |
|-------|--------|--------------------------|
| `AppShell` | NavBar, shell layout, session selector dialog, recent sessions strip | T013, T014, T017, T018, T019 |
| `LapTimesPage` | Box plot area, filter controls, driver comparison chart | T022, T023, T024, T026 |
| `TrackPage` | Track map canvas, driver selector, lap selector, telemetry toggle, tooltip | T039, T040, T041, T042 |
| `QualifyingPage` | Results DataGrid, round filter toggle, driver detail drawer | T031, T032, T033, T034 |
| `ChampionshipPage` | Standings DataGrid, round slider, scenario drawer | T047, T048, T049, T050 |

**Design constraints to apply in Figma**:
- Color palette: primary `#1976d2`, secondary `#ff9800`, background `#f5f5f5`, text `#212121`
- 8px spacing grid; MUI component conventions for all interactive elements
- Desktop frame width: 1440px; include a 375px mobile artboard for AppShell only

**Implementation reference workflow** (per screen):
1. Call `get_design_context` with the frame's `nodeId` and `fileKey`
2. Review the returned screenshot and code hints for layout, spacing, and component hierarchy
3. Author MUI components manually, using the design as the source of truth for visual decisions
4. MUI idioms and project conventions override any auto-generated code snippets

## Project Structure

### Documentation (this feature)

```text
specs/001-f1-react-dashboard/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
packages/
├── backend/                         # Existing Python FastAPI backend (3 endpoint additions)
│   ├── app/
│   │   ├── routers/
│   │   │   ├── qualifying.py        # MODIFY: add Q1/Q2/Q3 per-round response fields
│   │   │   ├── track.py             # MODIFY: add /lap/{lap_number} endpoint
│   │   │   └── sessions.py          # MODIFY: augment schedule response with total_rounds
│   │   └── services/
│   │       ├── qualifying_service.py  # MODIFY: read session.results Q1/Q2/Q3 columns
│   │       ├── track_service.py       # MODIFY: add pick_lap(lap_number) variant
│   │       └── session_service.py     # MODIFY: add total_rounds to schedule response
│   └── __tests__/
│       └── unit/
│           └── test_services.py     # ADD: tests for new/modified service methods
│
└── frontend/                        # NEW React SPA
    ├── index.html
    ├── vite.config.js
    ├── .eslintrc.cjs
    ├── .prettierrc
    ├── package.json
    └── src/
        ├── main.jsx                 # App entry point, QueryClient provider
        ├── App.jsx                  # Router setup (React Router v6)
        ├── api/                     # API client functions (fetch wrappers)
        │   ├── sessions.js
        │   ├── lapTimes.js
        │   ├── qualifying.js
        │   ├── track.js
        │   └── championship.js
        ├── hooks/                   # TanStack Query hooks per domain
        │   ├── useSession.js
        │   ├── useLapTimes.js
        │   ├── useQualifying.js
        │   ├── useTrack.js
        │   └── useChampionship.js
        ├── context/
        │   └── SessionContext.jsx   # Active session + recent sessions (localStorage)
        ├── pages/                   # Route-level views
        │   ├── LapTimesPage.jsx
        │   ├── TrackPage.jsx
        │   ├── QualifyingPage.jsx
        │   └── ChampionshipPage.jsx
        ├── components/              # Shared + domain UI components
        │   ├── layout/
        │   │   ├── AppShell.jsx     # Top nav bar + sidebar layout
        │   │   └── NavBar.jsx
        │   ├── session/
        │   │   ├── SessionSelector.jsx
        │   │   └── RecentSessions.jsx
        │   ├── lapTimes/
        │   │   ├── LapDistributionChart.jsx   # Nivo BoxPlot
        │   │   ├── DriverComparisonChart.jsx  # Nivo Line chart
        │   │   └── LapFilters.jsx
        │   ├── track/
        │   │   ├── TrackMap.jsx               # Canvas 2D + D3 color scale
        │   │   ├── TelemetryToggle.jsx
        │   │   └── LapSelector.jsx
        │   ├── qualifying/
        │   │   ├── QualifyingTable.jsx        # MUI DataGrid
        │   │   ├── RoundFilter.jsx
        │   │   └── DriverDetailPanel.jsx
        │   └── championship/
        │       ├── StandingsTable.jsx
        │       ├── ScenarioPanel.jsx
        │       └── RoundSelector.jsx
        └── __tests__/
            ├── components/
            └── hooks/

tests/
└── e2e/                             # Playwright, Page Object Model
    ├── pages/
    │   ├── SessionSelectorPage.js
    │   ├── LapTimesPage.js
    │   ├── TrackPage.js
    │   ├── QualifyingPage.js
    │   └── ChampionshipPage.js
    └── specs/
        ├── session-navigation.spec.js
        ├── lap-times.spec.js
        ├── track-visualization.spec.js
        ├── qualifying-results.spec.js
        └── championship-scenarios.spec.js
```

**Structure Decision**: Option 2 (Web application) — the existing `packages/backend/` is augmented with 3 endpoint changes. A new `packages/frontend/` is created as a Vite React SPA. E2E tests live at the repository root in `tests/e2e/` per the constitution.

## Complexity Tracking

No constitution violations. No complexity justification required.
