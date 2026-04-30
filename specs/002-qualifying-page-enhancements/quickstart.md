# Quickstart: Qualifying Page Enhancements

**Feature**: `002-qualifying-page-enhancements`  
**Branch**: `002-qualifying-page-enhancements`

---

## Prerequisites

- Python ≥ 3.11 with `.venv` activated (`source .venv/bin/activate`)
- Node.js ≥ 20 with frontend deps installed (`npm install --legacy-peer-deps` in `packages/frontend/`)

---

## Run the stack

**Backend** (from repo root):
```bash
source .venv/bin/activate
cd packages/backend
python run.py
# → API available at http://localhost:8000
```

**Frontend** (from repo root, new terminal):
```bash
cd packages/frontend
npm run dev
# → App available at http://localhost:3000
```

---

## Verify the team_color field

After starting the backend, confirm the new field is present:
```bash
curl "http://localhost:8000/api/qualifying/2024/Monaco%20Grand%20Prix" | python -m json.tool | grep team_color
```
Expected: hex colour strings (e.g. `"#E8002D"`) or `"#808080"` fallback for each driver.

---

## Exercise the qualifying page features

1. Open `http://localhost:3000` in a browser.
2. Click **Select Session** → choose year `2024` → event `Monaco Grand Prix` → session type `Qualifying`.
3. Confirm:
   - Results table renders at full width.
   - Delta chart appears below the table on the left, with team-coloured horizontal bars.
   - Right column shows a placeholder ("Select a driver").
4. Click any bar in the delta chart or any row in the results table.
   - The clicked driver's bar/row highlights.
   - Right column shows the driver stats card (Q1/Q2/Q3 times + mini progression chart).
   - Track map loads below the stats card with the speed overlay.
5. Hover over the track map to verify the speed/throttle/brake/distance tooltip.
6. Toggle the metric (Speed / Throttle / Brake) and confirm the colour scale updates.
7. Toggle **Corner annotations** and confirm numbered circles appear/disappear.
8. Change the round filter to **Q1** and confirm:
   - Delta chart re-renders with Q1 reference times.
   - The previously selected driver's bar re-highlights in the Q1 context (or is absent if the driver did not participate).
   - The stats card and track map are **unchanged**.
9. Click the same driver again to deselect; confirm the right column reverts to the placeholder.

---

## Run tests

**Backend unit tests**:
```bash
cd packages/backend
source ../../.venv/bin/activate
pytest __tests__/unit/ -v
```

**Frontend unit tests**:
```bash
cd packages/frontend
npm test
```

**E2E tests** (requires both servers running):
```bash
cd tests/e2e
npx playwright test specs/qualifying-results.spec.js
```
