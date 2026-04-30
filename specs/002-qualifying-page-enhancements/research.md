# Research: Qualifying Page Enhancements

**Feature**: `002-qualifying-page-enhancements`  
**Date**: 2026-04-30  
**Phase**: Phase 0 — resolving NEEDS CLARIFICATION items from Technical Context

---

## Finding 1: FastF1 `get_team_color` call signature

**Decision**: Import `fastf1.plotting` in `qualifying_service.py` and call
`fastf1.plotting.get_team_color(team_name, session=session)` where `team_name`
is `lap["Team"]` (a string such as `"Red Bull Racing"`).

**Rationale**: FastF1 3.5.3 (installed in `.venv`) exposes
`fastf1.plotting.get_team_color(identifier: str, session: Session, *, colormap='default', exact_match=False) -> str`.
The `session` parameter is required and is already available inside
`get_qualifying_results` (returned by `get_session()`). The call returns a
hex RGB string directly (e.g. `"#3671C6"`), suitable for JSON transport and
SVG `fill` attributes.

**Fallback**: Wrap the call in `try/except Exception` and fall back to
`"#808080"` to handle unknown or historic team names gracefully.

**Alternatives considered**:
- Returning raw team name and looking up colours client-side via a static map —
  rejected because it creates a maintenance burden and diverges from the
  single source of truth in FastF1.
- Using `colormap='official'` — rejected for now; official colours are
  sometimes less visually distinct than FastF1's default palette.

---

## Finding 2: Delta chart implementation strategy

**Decision**: Implement `QualifyingDeltaChart` as a raw SVG component (no Nivo)
using `<svg>`, `<rect>`, and `<text>` elements sized via a `ResizeObserver`.

**Rationale**: The delta chart is a horizontally-oriented ranked list with up to
20 rows. Nivo's `ResponsiveBar` is designed for vertical bar charts and requires
significant override work for horizontal orientation at this density. The
existing `TrackMap` already demonstrates the SVG-with-`ResizeObserver` pattern
in this codebase, confirming it is idiomatic. An SVG approach gives direct
control over bar colour (team hex), row highlight, and click interaction, all
of which are first-class requirements.

**Alternatives considered**:
- Nivo `ResponsiveBar` with `layout="horizontal"` — rejected because per-bar
  click selection, custom fill per bar, and row highlight require significant
  undocumented prop overrides, raising fragility risk.
- MUI `LinearProgress` per row — rejected as purely decorative; lacks click
  semantics and custom colour.

---

## Finding 3: Driver stats card — mini progression chart library

**Decision**: Reuse Nivo `ResponsiveBar` for the mini Q1/Q2/Q3 progression bar
chart inside `DriverStatsCard`. The chart is vertical, has exactly 2–3 bars,
and has low interactivity needs — the exact scenario where Nivo excels.

**Rationale**: `DriverDetailPanel` already uses `@nivo/bar` `ResponsiveBar` for
an identical chart. Porting the code to `DriverStatsCard` is a direct copy with
minor prop changes (`width`, `margin`). No new dependencies are introduced.

**Alternatives considered**:
- Plain SVG for the progression chart too — rejected to avoid duplication of
  chart rendering logic for a component that already exists and works.

---

## Finding 4: Track map on qualifying page — session type

**Decision**: Use session type `"Q"` (string literal) for all telemetry and
corner annotation calls from `QualifyingPage`. This matches the existing
`/api/track/{year}/{event}/Q/speed/{driver}` endpoint and requires no backend
changes.

**Rationale**: The qualifying page always deals with qualifying sessions.
Hard-coding `"Q"` avoids exposing a session-type picker on a page where it is
contextually fixed.

**Alternatives considered**:
- Passing `sessionType` from `activeSession` context — rejected because
  `activeSession` may be a race or practice session; the qualifying page must
  always load qualifying telemetry regardless of the globally selected session.

---

## Finding 5: `DriverDetailPanel` removal strategy

**Decision**: Delete `DriverDetailPanel.jsx` from source control and remove
its import from `QualifyingPage.jsx`. The MUI `Drawer` component is no longer
needed on this page.

**Rationale**: FR-007 explicitly mandates removal. The replacement is the inline
`DriverStatsCard` in the right column. Keeping the drawer would create two
competing interactions (drawer pop-out + track map load) on the same click event.

**Alternatives considered**:
- Keeping the drawer and disabling the `open` prop — rejected because dead code
  in the component tree increases maintenance burden with no user benefit.
