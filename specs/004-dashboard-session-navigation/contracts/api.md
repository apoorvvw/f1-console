# API Contracts: Dashboard & Session Navigation

## No New Endpoints Required

This feature is purely frontend. It consumes existing backend endpoints.

---

## Consumed Endpoints

### GET `/api/sessions/schedule/{year}`

Returns the full race schedule for a season. Used to derive `upcomingEvent` and `latestCompletedRound`.

**Parameters**:
- `year` (path, int): Season year, e.g. `2026`

**Response** (array of objects):
```json
[
  {
    "EventName": "Bahrain Grand Prix",
    "RoundNumber": 1,
    "EventDate": "2026-03-22",
    "Country": "Bahrain"
  }
]
```

**Dashboard usage**: Fetch with `useSchedule(2026)`. Filter for `EventDate >= today` to get upcoming event. Filter for `EventDate < today` and take last item's `RoundNumber` for standings lookup.

---

### GET `/api/championship/{year}/{round_number}/standings`

Returns driver and constructor standings after a given round. Used to populate the standings snapshot card.

**Parameters**:
- `year` (path, int): Season year
- `round_number` (path, int): Round number (derived from schedule)

**Response**:
```json
{
  "drivers": [
    { "position": 1, "driver_name": "Max Verstappen", "team": "Red Bull Racing", "points": 287 },
    { "position": 2, "driver_name": "Lando Norris", "team": "McLaren", "points": 241 }
  ],
  "constructors": [
    { "position": 1, "team": "McLaren", "points": 476 },
    { "position": 2, "team": "Red Bull Racing", "points": 462 }
  ]
}
```

**Dashboard usage**: Fetch with `useStandings(year, latestRound)`. Display `drivers.slice(0, 3)` and `constructors.slice(0, 3)`.

---

## Frontend Routing Contract

The following mapping is enforced by `packages/frontend/src/constants/sessionRouting.js`:

| Session Type | Destination Route |
|--------------|------------------|
| `R` | `/race` |
| `S` | `/race` |
| `Q` | `/qualifying` |
| `SQ` | `/qualifying` |
| `FP1` | `/race` |
| `FP2` | `/race` |
| `FP3` | `/race` |

Any session type not in this map falls back to `/race`.
