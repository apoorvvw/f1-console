# F1 Console — Backend

FastAPI service that exposes F1 telemetry and session data sourced from the [FastF1](https://docs.fastf1.dev/) Python library.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | FastAPI 0.115 |
| Server | Uvicorn (ASGI) |
| Data | FastF1 3.5 (wraps Ergast + timing feeds) |
| Data Processing | pandas ≥ 2.2, numpy ≥ 1.21 |
| Config | python-dotenv |
| Testing | pytest 8.3, pytest-asyncio, httpx |

## Project Structure

```
packages/backend/
├── run.py                  # Entry point — starts Uvicorn
├── requirements.txt
├── pytest.ini
├── app/
│   ├── main.py             # FastAPI app, CORS, router registration
│   ├── config.py           # PORT, FASTF1_CACHE_DIR from env
│   ├── routers/
│   │   ├── sessions.py     # /api/sessions
│   │   ├── race.py         # /api/race
│   │   ├── qualifying.py   # /api/qualifying
│   │   ├── lap_times.py    # /api/lap-times
│   │   ├── track.py        # /api/track
│   │   └── championship.py # /api/championship
│   └── services/           # Business logic & FastF1 calls
└── __tests__/
    ├── integration/
    │   └── test_api.py
    └── unit/
        ├── test_services.py
        └── test_race_service.py
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8000` | Port Uvicorn listens on |
| `FASTF1_CACHE_DIR` | `.fastf1_cache` | Path for FastF1 disk cache |
| `CORS_ORIGINS` | `http://localhost:3000` | Comma-separated allowed origins |

Create a `.env` file in `packages/backend/` to override these:

```
PORT=8000
FASTF1_CACHE_DIR=.fastf1_cache
CORS_ORIGINS=http://localhost:3000
```

## Setup

```bash
# from repo root — activate the shared virtualenv
source .venv/bin/activate

cd packages/backend
pip install -r requirements.txt
```

## Running

```bash
# development (auto-reload on file change)
python run.py
```

The API is available at `http://localhost:8000`. Interactive docs (Swagger UI) at `http://localhost:8000/docs`.

## API Endpoints

### Health

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Returns `{"status": "ok"}` |

### Sessions — `/api/sessions`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/schedule/{year}` | Full event calendar for a season |
| GET | `/{year}/{event}/{session_type}` | Metadata for a specific session |

`session_type` values: `FP1`, `FP2`, `FP3`, `Q`, `SQ`, `R`, `S`

### Qualifying — `/api/qualifying`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/{year}/{event}` | Qualifying results with fastest lap times and delta to pole |

### Race — `/api/race`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/{year}/{event}/position-changes` | Per-driver per-lap position data |
| GET | `/{year}/{event}/team-pace` | Quick lap medians grouped by team |
| GET | `/{year}/{event}/driver-laps/{driver}` | Quick laps + tyre compound for one driver |

### Lap Times — `/api/lap-times`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/{year}/{event}/{session_type}/comparison?drivers=VER,NOR` | Lap-by-lap comparison for comma-separated drivers |

### Track — `/api/track`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/{year}/{event}/{session_type}/speed/{driver}` | Telemetry (X, Y, Speed, Throttle, Brake) for fastest lap |
| GET | `/{year}/{event}/{session_type}/{driver}/lap/{lap_number}` | Telemetry for a specific lap number |
| GET | `/{year}/{event}/corners` | Circuit corner annotations (number, angle, X/Y) |

### Championship — `/api/championship`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/{year}/{round_number}/standings` | Driver and constructor standings after a round |
| GET | `/{year}/{round_number}/wdc-scenarios` | Drivers who can still mathematically win the WDC |

## Testing

```bash
# from packages/backend/
pytest                    # all tests
pytest __tests__/unit/    # unit tests only
pytest __tests__/integration/ # integration tests only (requires network / FastF1)
```

Tests are configured in `pytest.ini`. Integration tests exercise live API routes via httpx `TestClient`.

## Caching

FastF1 caches all fetched data to disk at `FASTF1_CACHE_DIR`. This directory is created automatically on startup. Subsequent requests for the same session skip the network round-trip entirely and typically respond in milliseconds.

To reset the cache, delete the directory:

```bash
rm -rf .fastf1_cache
```
