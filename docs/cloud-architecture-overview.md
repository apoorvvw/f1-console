# Cloud Architecture Overview

F1 Console is a full-stack web application. The frontend is a Vite-powered React SPA; the backend is a FastAPI service that wraps the [FastF1](https://docs.fastf1.dev/) Python library. All F1 telemetry and session data is sourced from the Ergast/FastF1 data pipeline at request time and cached on disk.

## Component Map

```
┌─────────────────────────────────────────────────┐
│                   Browser (SPA)                 │
│  React 19 · React Router v7 · MUI v5 · Nivo     │
│  TanStack Query · Tailwind CSS                  │
└────────────────────┬────────────────────────────┘
                     │  HTTP/JSON  (localhost:3000 → :8000)
                     ▼
┌─────────────────────────────────────────────────┐
│             FastAPI Backend  :8000              │
│  /api/sessions  /api/race  /api/qualifying      │
│  /api/lap-times  /api/track  /api/championship  │
└────────────────────┬────────────────────────────┘
                     │  Python SDK
                     ▼
┌─────────────────────────────────────────────────┐
│              FastF1 Library (3.5)               │
│  Ergast API  ·  Timing / Telemetry feeds        │
│  Disk cache  (.fastf1_cache/)                   │
└─────────────────────────────────────────────────┘
```

---

## User Journey — Session Selection to Data View

The sequence below traces the complete path from a user landing on the Dashboard to a fully rendered data page.

```mermaid
sequenceDiagram
    actor User
    participant Dashboard as Dashboard Page<br/>(React)
    participant SessionCtx as SessionContext<br/>(localStorage)
    participant Router as React Router
    participant TQ as TanStack Query<br/>(cache)
    participant API as FastAPI Backend<br/>(:8000)
    participant FastF1 as FastF1 + Disk Cache

    User->>Dashboard: Opens app at /

    Dashboard->>API: GET /api/sessions/schedule/{year}
    API->>FastF1: ergast.fetch_season_schedule(year)
    FastF1-->>API: DataFrame (events)
    API-->>Dashboard: JSON event schedule

    Dashboard->>Dashboard: Renders upcoming race card<br/>& standings snapshot

    User->>Dashboard: Selects year / event / session type
    Dashboard->>API: GET /api/sessions/{year}/{event}/{type}
    API->>FastF1: fastf1.get_session(...)
    FastF1-->>API: Session metadata
    API-->>Dashboard: JSON session info

    User->>Dashboard: Clicks "Go"
    Dashboard->>SessionCtx: setActiveSession({year, event, sessionType})
    SessionCtx->>SessionCtx: Persist to localStorage<br/>(max 5 recent sessions)
    Dashboard->>Router: navigate(routeForSessionType(type))

    alt Session type = Q or SQ
        Router->>User: Renders /qualifying

        User->>Router: Qualifying Page mounts
        Router->>TQ: useQualifying(year, event)
        TQ->>API: GET /api/qualifying/{year}/{event}
        API->>FastF1: session.load() → laps DataFrame
        FastF1-->>API: Lap data
        API-->>TQ: JSON qualifying results
        TQ-->>User: QualifyingTable + QualifyingDeltaChart<br/>+ DriverStatsCard

    else Session type = R, S, FP1–FP3
        Router->>User: Renders /race

        User->>Router: Race Page mounts
        Router->>TQ: useRace(year, event)
        TQ->>API: GET /api/race/{year}/{event}/position-changes
        API->>FastF1: session.load() → position data
        FastF1-->>API: Per-lap positions
        API-->>TQ: JSON position array
        TQ-->>User: PositionChangesChart

        TQ->>API: GET /api/race/{year}/{event}/team-pace
        API->>FastF1: quick laps grouped by team
        FastF1-->>API: Team medians
        API-->>TQ: JSON team pace
        TQ-->>User: TeamPaceChart

        User->>Router: Selects driver in DriverSelector
        TQ->>API: GET /api/race/{year}/{event}/driver-laps/{driver}
        API->>FastF1: driver quick laps + tyre data
        FastF1-->>API: Lap rows
        API-->>TQ: JSON driver laps
        TQ-->>User: DriverLapScatterplot
    end

    User->>Router: Navigates to /track
    Router->>TQ: useTrack(year, event, sessionType, driver)
    TQ->>API: GET /api/track/{year}/{event}/{type}/speed/{driver}
    API->>FastF1: fastest lap telemetry (X, Y, Speed)
    FastF1-->>API: Telemetry DataFrame
    API-->>TQ: JSON telemetry points
    TQ-->>User: TrackMap (speed heat-map overlay)

    User->>Router: Navigates to /championship
    Router->>TQ: useChampionship(year, round)
    TQ->>API: GET /api/championship/{year}/{round}/standings
    API->>FastF1: ergast standings
    FastF1-->>API: Standings rows
    API-->>TQ: JSON standings
    TQ-->>User: StandingsTable + ConstructorsTable

    TQ->>API: GET /api/championship/{year}/{round}/wdc-scenarios
    API->>FastF1: compute remaining max points
    FastF1-->>API: Scenario rows
    API-->>TQ: JSON WDC scenarios
    TQ-->>User: ScenarioPanel
```

---

## Data Caching Strategy

| Layer | Mechanism | Notes |
|-------|-----------|-------|
| FastF1 disk cache | `.fastf1_cache/` directory | Persists raw timing / telemetry; avoids re-fetching from Ergast |
| TanStack Query | In-memory per client tab | `staleTime` keeps data fresh for the browser session; avoids redundant API calls |
| Browser localStorage | `f1.recentSessions` key | Stores up to 5 recent session selections across page reloads |

---

## API Endpoint Reference

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness check |
| GET | `/api/sessions/schedule/{year}` | Full season event schedule |
| GET | `/api/sessions/{year}/{event}/{type}` | Session metadata |
| GET | `/api/qualifying/{year}/{event}` | Qualifying results + delta to pole |
| GET | `/api/race/{year}/{event}/position-changes` | Per-lap race positions |
| GET | `/api/race/{year}/{event}/team-pace` | Team median lap times |
| GET | `/api/race/{year}/{event}/driver-laps/{driver}` | Driver quick laps + tyre data |
| GET | `/api/lap-times/{year}/{event}/{type}/comparison` | Multi-driver lap time comparison |
| GET | `/api/track/{year}/{event}/{type}/speed/{driver}` | Fastest-lap telemetry for track map |
| GET | `/api/track/{year}/{event}/{type}/{driver}/lap/{lap}` | Per-lap telemetry |
| GET | `/api/track/{year}/{event}/corners` | Circuit corner annotations |
| GET | `/api/championship/{year}/{round}/standings` | Driver + constructor standings |
| GET | `/api/championship/{year}/{round}/wdc-scenarios` | Remaining WDC title contenders |
