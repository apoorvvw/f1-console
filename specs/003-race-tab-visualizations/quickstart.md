# Quickstart: Race Tab Visualizations

**Branch**: `003-race-tab-visualizations`  
**Date**: 2026-04-30

---

## Development Setup

Both the backend and frontend must be running simultaneously.

### Backend

```bash
cd /Users/apoorv.wairagade/Projects/f1-console
source .venv/bin/activate
cd packages/backend
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd /Users/apoorv.wairagade/Projects/f1-console/packages/frontend
npm run dev
# Vite serves at http://localhost:3000
```

---

## Verifying the New Endpoints

Once the backend is running, test the three new race endpoints:

```bash
# Position changes
curl "http://localhost:8000/api/race/2024/Bahrain%20Grand%20Prix/position-changes"

# Team pace
curl "http://localhost:8000/api/race/2024/Bahrain%20Grand%20Prix/team-pace"

# Single driver laps
curl "http://localhost:8000/api/race/2024/Bahrain%20Grand%20Prix/driver-laps/VER"
```

Expected: JSON responses matching the shapes in `contracts/api.md`.

---

## Navigating the Race Tab

1. Open `http://localhost:3000`
2. The default route now redirects to `/race`
3. Click **Select Session** in the navbar → choose `Year: 2024`, `Event: Bahrain Grand Prix`, `Session: Race`
4. The Race page renders three panels:
   - **Top-left**: Position Changes chart (all 20 drivers)
   - **Top-right**: Driver Analysis panel (empty until a driver is selected)
   - **Bottom**: Team Pace Ranking boxplot
5. Click a driver line in the position changes chart to toggle driver selection
6. With 1 driver selected: lap scatterplot appears in the Driver Analysis panel
7. Click a second driver line: panel switches to the multi-driver comparison chart
8. Click a team boxplot: that team's driver lines are highlighted in the position changes chart
9. Click **Clear ×** button: all selections reset

---

## Running Tests

### Backend unit tests

```bash
cd /Users/apoorv.wairagade/Projects/f1-console
source .venv/bin/activate
cd packages/backend
pytest __tests__/unit/ -v
```

### Frontend unit tests

```bash
cd /Users/apoorv.wairagade/Projects/f1-console/packages/frontend
npm test
```

### E2E tests (Playwright)

```bash
cd /Users/apoorv.wairagade/Projects/f1-console/tests/e2e
npx playwright test tests/race-tab.spec.js
```

---

## Key Files Changed in This Feature

| File | Change |
|------|--------|
| `packages/backend/app/routers/race.py` | **New** — 3 race endpoints |
| `packages/backend/app/services/race_service.py` | **New** — FastF1 service functions |
| `packages/backend/app/main.py` | Register `/api/race` router |
| `packages/backend/app/routers/lap_times.py` | Delete `distribution` endpoint |
| `packages/backend/app/services/lap_time_service.py` | Delete `get_lap_times_distribution` function |
| `packages/frontend/src/App.jsx` | Replace `/lap-times` route with `/race`; update default redirect |
| `packages/frontend/src/components/layout/NavBar.jsx` | Replace `Lap Times` tab with `Race` |
| `packages/frontend/src/pages/RacePage.jsx` | **New** — Race tab page |
| `packages/frontend/src/pages/LapTimesPage.jsx` | **Deleted** |
| `packages/frontend/src/components/race/` | **New folder** — all race chart components |
| `packages/frontend/src/components/lapTimes/LapDistributionChart.jsx` | **Deleted** (replaced by PositionChangesChart) |
| `packages/frontend/src/components/lapTimes/LapFilters.jsx` | **Deleted** (no longer needed) |
| `packages/frontend/src/components/lapTimes/DriverComparisonChart.jsx` | **Moved** to `race/DriverComparisonChart.jsx` |
| `packages/frontend/src/api/race.js` | **New** — API client functions |
| `packages/frontend/src/api/lapTimes.js` | **Deleted** |
| `packages/frontend/src/hooks/useRace.js` | **New** — React Query hooks |
| `packages/frontend/src/hooks/useLapTimes.js` | **Deleted** |
| `packages/frontend/src/constants/compoundColors.js` | **New** — extracted from LapDistributionChart |
