# Quickstart: F1 React Dashboard

**Phase 1 output for**: `specs/001-f1-react-dashboard/plan.md`  
**Date**: 2026-04-29

---

## Prerequisites

- Python 3.11+ with the existing virtual environment at `.venv/`
- Node.js 20+ and npm 10+
- FastF1 cache warmed up for at least one session (the backend loads data on first request)

---

## 1. Start the Backend

```bash
# From the repository root, activate the virtual environment
source .venv/bin/activate

# Start the FastAPI backend on port 3030
cd packages/backend
python run.py
# OR: uvicorn app.main:app --reload --port 3030
```

Verify: `curl http://localhost:3030/sessions/schedule/2024` should return event schedule JSON.

---

## 2. Bootstrap the Frontend (first time only)

```bash
# From the repository root
npm create vite@latest packages/frontend -- --template react
cd packages/frontend

# Install runtime dependencies
npm install \
  @mui/material @emotion/react @emotion/styled @mui/icons-material \
  @tanstack/react-query \
  react-router-dom \
  @nivo/core @nivo/boxplot @nivo/line @nivo/bar \
  d3-scale d3-scale-chromatic

# Install dev dependencies
npm install --save-dev \
  vitest @vitest/ui jsdom \
  @testing-library/react @testing-library/user-event @testing-library/jest-dom \
  vitest-canvas-mock \
  eslint eslint-plugin-react eslint-plugin-react-hooks \
  prettier
```

Create `.env` at `packages/frontend/.env`:
```
VITE_API_BASE_URL=http://localhost:3030
```

---

## 3. Start the Frontend

```bash
cd packages/frontend
npm run dev
# → http://localhost:3000
```

---

## 4. Run Tests

**Backend tests (pytest)**:
```bash
source .venv/bin/activate
cd packages/backend
pytest
```

**Frontend unit/component tests (Vitest)**:
```bash
cd packages/frontend
npm test
# OR: npm run test:ui  (browser-based Vitest UI)
```

**E2E tests (Playwright)**:
```bash
# Requires both backend and frontend running
npx playwright test tests/e2e/
```

---

## 5. Key Configuration Files

| File | Purpose |
|------|---------|
| `packages/frontend/.env` | `VITE_API_BASE_URL` — backend URL |
| `packages/frontend/vite.config.js` | Vite build config + Vitest config |
| `packages/frontend/.eslintrc.cjs` | ESLint rules (react, react-hooks plugins) |
| `packages/frontend/.prettierrc` | Prettier config (2-space indent, single quotes) |
| `packages/backend/app/config.py` | Backend CORS allowed origins |

---

## 6. Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:3030` | Backend API base URL (frontend) |
| `BACKEND_PORT` | `3030` | Backend listen port |
| `FRONTEND_PORT` | `3000` | Frontend dev server port |
| `CORS_ORIGINS` | `http://localhost:3000` | Allowed CORS origins for backend |

---

## 7. Development Workflow

```
1. Pick a task from tasks.md
2. git checkout 001-f1-react-dashboard
3. Implement the component or endpoint change
4. Run: npm test (frontend) or pytest (backend) to verify
5. Commit: git commit -m "feat: <description>"
6. Open a PR against main when the task group is complete
```

---

## 8. Dashboard URL Map

Once running, the dashboard is available at:

| URL | View |
|-----|------|
| `http://localhost:3000/` | Redirect to Lap Times (default) |
| `http://localhost:3000/lap-times` | Lap Time Distribution & Comparison |
| `http://localhost:3000/track` | Track Speed Visualization |
| `http://localhost:3000/qualifying` | Qualifying Results |
| `http://localhost:3000/championship` | Championship Standings & WDC Scenarios |
