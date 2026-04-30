# F1 Console — Frontend

React SPA for exploring F1 session data. Built with Vite, MUI, Nivo charts, and TanStack Query.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Routing | React Router DOM v7 |
| UI Components | MUI v5 (Material UI) |
| Charts | Nivo (line, bar, boxplot) |
| Data Fetching | TanStack Query v5 |
| Styling | Tailwind CSS v4 |
| Build | Vite 8 |
| Testing (unit) | Vitest 4 + React Testing Library |
| Testing (e2e) | Playwright (see `tests/e2e/`) |

## Project Structure

```
packages/frontend/
├── index.html
├── vite.config.js          # Vite + Tailwind + Vitest config
├── tailwind.config.js
├── src/
│   ├── main.jsx            # ReactDOM root, QueryClientProvider, BrowserRouter
│   ├── App.jsx             # Route definitions, SessionProvider wrapper
│   ├── constants/
│   │   └── sessionRouting.js       # Session type → route map
│   ├── context/
│   │   └── SessionContext.jsx      # Active session + recent sessions (localStorage)
│   ├── api/                        # Fetch helpers for each domain
│   │   ├── sessions.js
│   │   ├── race.js
│   │   ├── qualifying.js
│   │   ├── track.js
│   │   └── championship.js
│   ├── hooks/                      # TanStack Query wrappers
│   │   ├── useSession.js
│   │   ├── useRace.js
│   │   ├── useQualifying.js
│   │   ├── useTrack.js
│   │   └── useChampionship.js
│   ├── pages/
│   │   ├── DashboardPage.jsx       # / — session selection + overview cards
│   │   ├── RacePage.jsx            # /race
│   │   ├── QualifyingPage.jsx      # /qualifying
│   │   ├── TrackPage.jsx           # /track
│   │   └── ChampionshipPage.jsx    # /championship
│   └── components/
│       ├── layout/
│       │   └── AppShell.jsx        # Top nav + page wrapper
│       ├── session/
│       │   ├── SessionSelector.jsx # Year / event / type dropdowns
│       │   └── RecentSessions.jsx  # Chip list from localStorage
│       ├── race/
│       │   ├── PositionChangesChart.jsx
│       │   ├── TeamPaceChart.jsx
│       │   ├── DriverLapScatterplot.jsx
│       │   ├── DriverComparisonChart.jsx
│       │   └── DriverSelector.jsx
│       ├── qualifying/
│       │   ├── QualifyingTable.jsx
│       │   ├── QualifyingDeltaChart.jsx
│       │   ├── DriverStatsCard.jsx
│       │   └── RoundFilter.jsx
│       ├── track/
│       │   ├── TrackMap.jsx        # SVG speed heat-map overlay
│       │   ├── LapSelector.jsx
│       │   └── TelemetryToggle.jsx
│       ├── championship/
│       │   ├── StandingsTable.jsx
│       │   ├── ConstructorsTable.jsx
│       │   ├── RoundSelector.jsx
│       │   └── ScenarioPanel.jsx
│       └── ui/
│           ├── Card.jsx
│           └── PageHeader.jsx
└── __tests__/
    ├── DashboardPage.test.jsx
    ├── DriverStatsCard.test.jsx
    └── QualifyingDeltaChart.test.jsx
```

## Setup

```bash
cd packages/frontend
npm install
```

## Running

```bash
npm run dev        # dev server at http://localhost:3000
npm run build      # production build → dist/
npm run preview    # serve the production build locally
```

The dev server expects the backend to be running at `http://localhost:8000`.

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | `DashboardPage` | Session selector, recent sessions, upcoming race card, standings snapshot |
| `/race` | `RacePage` | Position changes chart, team pace, driver lap scatterplot, driver comparison |
| `/qualifying` | `QualifyingPage` | Results table, delta-to-pole chart, driver stats card |
| `/track` | `TrackPage` | SVG track map with speed heat-map, per-lap telemetry |
| `/championship` | `ChampionshipPage` | Driver & constructor standings, WDC scenario panel |

## Session Routing

`src/constants/sessionRouting.js` defines which session types map to which route:

| Session Type | Route |
|-------------|-------|
| `R`, `S`, `FP1`, `FP2`, `FP3` | `/race` |
| `Q`, `SQ` | `/qualifying` |

The `routeForSessionType(type)` helper is used by `DashboardPage` after session confirmation to navigate to the correct page.

## State Management

**`SessionContext`** (React Context + localStorage) holds:
- `activeSession` — the currently selected `{ year, event, sessionType }` object
- `recentSessions` — up to 5 most-recently selected sessions, persisted across reloads
- `setActiveSession(session)` — updates both and saves to `localStorage`

All data-fetching hooks (`useRace`, `useQualifying`, etc.) read from `activeSession` and pass the values to TanStack Query, which handles caching, background refetch, and loading/error states.

## Testing

```bash
# unit tests with Vitest
npx vitest run        # single run (CI)
npx vitest            # watch mode
npx vitest --ui       # browser UI

# e2e tests (from repo root)
cd tests/e2e && npx playwright test
```

Unit tests live in `src/__tests__/` and use React Testing Library with jsdom. E2E tests are in `tests/e2e/specs/` and use Playwright Page Objects defined in `tests/e2e/pages/`.

## Linting

```bash
npm run lint          # ESLint with react + react-hooks + react-refresh plugins
```
