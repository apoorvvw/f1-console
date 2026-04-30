# Data Model: Dashboard & Session Navigation

## Entities

### Session (existing)

Represents a specific F1 session selected by the user. Stored in `SessionContext` and `localStorage`.

| Field | Type | Notes |
|-------|------|-------|
| `year` | `number` | Season year (2018–2026) |
| `event` | `string` | Event name (e.g. `"Bahrain Grand Prix"`) |
| `sessionType` | `string` | One of `FP1`, `FP2`, `FP3`, `Q`, `SQ`, `R`, `S` |

**Source**: Existing `SessionContext`. No changes required.

---

### SessionRouteMap (new — pure constant, no storage)

Maps session type codes to frontend route paths.

| sessionType | Route |
|-------------|-------|
| `R` | `/race` |
| `S` | `/race` |
| `Q` | `/qualifying` |
| `SQ` | `/qualifying` |
| `FP1` | `/race` *(interim)* |
| `FP2` | `/race` *(interim)* |
| `FP3` | `/race` *(interim)* |

**Location**: `packages/frontend/src/constants/sessionRouting.js` (new file).

---

### ScheduleEvent (existing, consumed on Dashboard)

Represents a single race weekend in the season schedule. Returned by `/api/sessions/schedule/{year}`.

| Field | Type | Notes |
|-------|------|-------|
| `EventName` | `string` | Full event name |
| `RoundNumber` | `number` | Round number in the season |
| `EventDate` | `string` | ISO date string of race day |
| `Country` | `string` | Country of the event |

**Source**: Existing backend schedule endpoint. No schema changes.

---

### StandingsSnapshot (existing endpoint, new Dashboard view)

A subset of the championship standings response used for the Dashboard card.

| Field | Type | Notes |
|-------|------|-------|
| `drivers` | `DriverStanding[]` | Top 3 only, sliced on the frontend |
| `constructors` | `ConstructorStanding[]` | Top 3 only, sliced on the frontend |

**Source**: Existing `/api/championship/{year}/{round}/standings` endpoint.

#### DriverStanding

| Field | Type |
|-------|------|
| `position` | `number` |
| `driver_name` | `string` |
| `team` | `string` |
| `points` | `number` |

#### ConstructorStanding

| Field | Type |
|-------|------|
| `position` | `number` |
| `team` | `string` |
| `points` | `number` |

---

## State & Derivations

### Dashboard-local state

| State | Type | Purpose |
|-------|------|---------|
| `selectorOpen` | `boolean` | Controls `SessionSelector` dialog visibility |

### Derived values (computed, not stored)

| Derived | Source | How |
|---------|--------|-----|
| `upcomingEvent` | `useSchedule(currentYear)` | First `ScheduleEvent` where `EventDate >= today` |
| `latestCompletedRound` | `useSchedule(currentYear)` | Last `ScheduleEvent` where `EventDate < today` |
| `standingsYear` | `currentYear` constant | Hardcoded to current season |
| `standingsRound` | `latestCompletedRound.RoundNumber` | Derived from schedule |
