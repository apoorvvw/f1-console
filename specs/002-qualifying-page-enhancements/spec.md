# Feature Specification: Qualifying Page Enhancements

**Feature Branch**: `002-qualifying-page-enhancements`  
**Created**: 2026-04-30  
**Status**: Draft  
**Input**: User description: "I want to update the qualifying page to add more features. Here is the example, plot_qualifying_results.py. also include the track map with speed data for the driver clicked on. Comprehensively integrate them into page tying different elements together by driver and make them interactive together."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Qualifying Delta Chart (Priority: P1)

As an F1 fan reviewing qualifying results, I want to see each driver's time gap to pole visualised as a horizontal bar chart — coloured by team — so I can instantly compare the performance spread across the grid.

**Why this priority**: This is the primary new data-visualisation feature, directly derived from the `plot_qualifying_results.py` reference. It transforms the existing plain table into a richer analysis tool. Without it the other interactive features have no anchor.

**Independent Test**: Load the qualifying page for any session that has data, see a horizontal bar chart below (or alongside) the results table with one bar per driver, bars coloured by team colour, and the Δ-to-pole label next to each bar.

**Acceptance Scenarios**:

1. **Given** a qualifying session is selected and results have loaded, **When** the Qualifying page renders, **Then** a horizontal bar chart is visible showing every driver's gap to pole, with bars coloured by team colour.
2. **Given** the round filter is set to "Q1", **When** the chart re-renders, **Then** bars reflect each driver's gap to the fastest Q1 time (excluding drivers that did not set a Q1 time).
3. **Given** no qualifying data is available (loading or error), **When** the chart section renders, **Then** a loading skeleton or empty state is displayed without breaking the page.

---

### User Story 2 - Select Driver via Chart Bar or Table Row (Priority: P1)

As a user, I want to click on a bar in the delta chart or a row in the results table and have both the chart and the downstream track-map panel respond to that selection so that all page elements stay in sync.

**Why this priority**: Cross-element interactivity is the core integration requirement stated in the request. It is what differentiates this from independent, disconnected widgets.

**Independent Test**: Click any bar in the delta chart; confirm the corresponding table row is visually highlighted and the track map panel loads telemetry for that driver.

**Acceptance Scenarios**:

1. **Given** the qualifying page is loaded, **When** the user clicks a driver's bar in the delta chart, **Then** that driver is marked as "selected" across both the chart (highlighted bar) and the results table (highlighted row).
2. **Given** a driver is selected, **When** the user clicks a different row in the results table, **Then** the chart bar for the new driver becomes highlighted, the previous driver's highlighting is cleared, and the right column updates to show the new driver's stats card and track map.
3. **Given** a driver is already selected, **When** the user clicks the same bar or row again, **Then** the selection is cleared, the stats card and track map are hidden, and the right column reverts to its empty placeholder state.

---

### User Story 3 - Track Map with Speed Data for Selected Driver (Priority: P1)

As a user, I want to see the circuit track map with speed data overlaid for the selected driver's fastest qualifying lap so I can understand where on track they were fast or slow.

**Why this priority**: Explicitly requested in the feature description. The telemetry backend already exists (`/api/track/{year}/{event}/Q/speed/{driver}`); this story makes it accessible directly from the qualifying page without navigating away.

**Independent Test**: Select a driver on the qualifying page; the track map renders below the chart showing the circuit layout coloured by speed, with a tooltip showing speed/throttle/brake on hover.

**Acceptance Scenarios**:

1. **Given** a driver is selected on the qualifying page, **When** the track map section is visible, **Then** the circuit layout is drawn with a colour gradient representing speed for that driver's fastest qualifying lap.
2. **Given** the track map is rendered, **When** the user hovers over the track, **Then** a tooltip shows speed (km/h), throttle %, and distance at that point.
3. **Given** no driver is selected, **When** the track map area is visible, **Then** a clear placeholder message prompts the user to select a driver.
4. **Given** telemetry data is loading, **When** the track map area is visible, **Then** a loading skeleton is displayed in the map area.

---

### User Story 4 - Telemetry Metric Toggle on Track Map (Priority: P2)

As a user, I want to switch between Speed, Throttle, and Brake overlays on the qualifying track map so I can analyse different aspects of the driver's lap.

**Why this priority**: The existing `TrackMap` component already supports three metrics. Exposing this control on the qualifying page adds significant analytical depth with minimal implementation effort.

**Independent Test**: After selecting a driver, use the metric toggle (Speed / Throttle / Brake); confirm the track map colour scale updates to reflect the chosen metric.

**Acceptance Scenarios**:

1. **Given** a driver is selected and the track map is visible, **When** the user toggles the metric to "Throttle", **Then** the map redraws with the throttle colour scale.
2. **Given** the user switches drivers, **When** the new driver's telemetry loads, **Then** the currently selected metric is preserved.

---

### User Story 5 - Corner Annotations Toggle on Track Map (Priority: P3)

As a user, I want to toggle corner number annotations on the qualifying track map so I can correlate slow-speed points with specific corners.

**Why this priority**: Low-effort addition that reuses the existing `showCorners` / `cornersData` infrastructure already present in `TrackPage`.

**Independent Test**: Click the "Corner annotations" toggle while a driver is selected; corner number circles appear on or disappear from the track layout.

**Acceptance Scenarios**:

1. **Given** the track map is visible with a driver selected, **When** the user enables corner annotations, **Then** numbered circles appear at each corner location on the track map.
2. **Given** corner annotations are enabled, **When** the user disables them, **Then** the corner circles are removed without reloading telemetry data.

---

### Edge Cases

- What happens when a driver did not set a lap time in a particular qualifying round (e.g., eliminated in Q1)? — The chart omits that driver for the filtered round; the table still shows them with "—".
- What happens when the track telemetry API returns an error for a selected driver? — An inline error message is shown in the track map panel; the rest of the page remains functional.
- What happens when a session has no Q2 or Q3 data (e.g., sprint qualifying)? — The Q2/Q3 round filter buttons still appear but produce an empty chart with an informational message.
- What happens when the user switches the active session while a driver is selected? — The selected driver is cleared and the track map panel resets.
- What happens when the round filter changes to a round in which the selected driver did not participate (e.g., driver was eliminated in Q1 and Q2 is selected)? — The driver's bar is absent from the delta chart for that round, but the stats card and track map in the right column remain visible; an informational note in the chart explains the driver did not participate in the selected round.
- What happens on small/mobile screens with the two-column layout? — The layout stacks vertically (delta chart above track map) at narrow viewports.

## Clarifications

### Session 2026-04-30

- Q: What is the page layout for the new elements (results table, delta chart, track map)? → A: Results table spans full width at the top; below it, a two-column row places the delta chart on the left and the track map on the right; on screens < 960px the two columns stack vertically (delta chart above track map).
- Q: What happens to the existing slide-out DriverDetailPanel drawer when driver selection now also triggers the inline track map? → A: Remove the drawer entirely; replace it with a compact inline stats card (showing Q1/Q2/Q3 times and lap time) rendered above the track map in the right column whenever a driver is selected.
- Q: Does the round filter (Q1/Q2/Q3/All) affect which lap the track map loads for the selected driver? → A: No — the round filter only changes the delta chart's reference time; the track map always loads the driver's overall fastest qualifying lap regardless of the active round filter.
- Q: When the round filter changes and a driver is already selected, should the driver selection be cleared or preserved? → A: Preserved — the same driver stays highlighted in the table and delta chart; only the chart's reference time and bar lengths update; the track map does not reload.
- Q: Should the inline driver stats card include a mini Q1/Q2/Q3 progression bar chart or just plain text times? → A: Include the mini progression bar chart (ported from the existing DriverDetailPanel), showing the driver's time trend across rounds alongside the text values.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The qualifying page MUST display a horizontal bar chart of drivers' time gaps to the reference lap (pole for "All", fastest time for a specific round) when qualifying results are loaded.
- **FR-002**: Each bar in the delta chart MUST be coloured using the driver's team colour returned by the backend.
- **FR-003**: The backend qualifying results endpoint MUST return a `team_color` hex string per driver (sourced from FastF1's `get_team_color`).
- **FR-004**: Clicking a bar in the delta chart MUST set that driver as the selected driver, updating the results table highlight and triggering track map telemetry loading.
- **FR-005**: Clicking a row in the results table MUST set that driver as the selected driver, updating the chart bar highlight and triggering track map telemetry loading.
- **FR-006**: Clicking an already-selected driver (bar or row) MUST deselect them and clear the track map.
- **FR-007**: The existing `DriverDetailPanel` slide-out drawer MUST be removed from the qualifying page; it is replaced by the inline right column.
- **FR-007b**: When a driver is selected, a compact stats card MUST appear at the top of the right column showing: driver abbreviation, full name, team name, Q1/Q2/Q3 session times as text rows, best lap time, Δ to pole, and a mini horizontal bar chart visualising the Q1/Q2/Q3 time progression (only rounds in which the driver participated are included). This card replaces the removed `DriverDetailPanel` drawer.
- **FR-007c**: The track map section MUST load and render the selected driver's **overall fastest qualifying lap** telemetry using the existing `/api/track/{year}/{event}/Q/speed/{driver}` endpoint, regardless of the active round filter.
- **FR-008**: The track map MUST support Speed, Throttle, and Brake metric overlays toggled via the existing `TelemetryToggle` component.
- **FR-009**: The track map MUST support corner annotation toggling via the existing `showCorners` / `cornersData` mechanism.
- **FR-010**: A hover tooltip on the track map MUST display speed, throttle, brake, and distance at the nearest point.
- **FR-011**: The round filter (Q1/Q2/Q3/All) MUST update both the results table column emphasis AND the delta chart reference time. It MUST NOT change the lap loaded by the track map — the track map always shows the driver's overall fastest qualifying lap.
- **FR-015**: Changing the round filter MUST NOT clear the selected driver. If a driver is selected, the delta chart MUST re-highlight that driver's bar in the updated round context; the right column stats card and track map MUST remain visible and unchanged.
- **FR-012**: When no driver is selected, the track map area MUST display a contextual placeholder message.
- **FR-013**: When the active session changes, the selected driver state MUST reset.
- **FR-014**: The page layout MUST be: (1) results table spanning full width at the top; (2) below the table, a two-column row with the delta chart on the left and the track map on the right; (3) on screens narrower than 960px the two-column row stacks vertically (delta chart above track map).

### Key Entities

- **QualifyingResult**: Driver abbreviation, full name, team name, team colour (hex), Q1/Q2/Q3 times (seconds), best lap time, delta to pole (seconds), grid position.
- **SelectedDriver**: The currently highlighted driver (abbreviation string); shared state between the delta chart, results table, and track map panel.
- **TelemetryData**: Array of telemetry points (x, y, speed, throttle, brake, distance) for a driver's fastest qualifying lap — used exclusively by the track map.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can identify the largest gaps in the qualifying field within 5 seconds of the page loading by scanning the delta chart.
- **SC-002**: Clicking any driver element (bar or table row) loads and displays the track map with speed data within 5 seconds on a warm cache.
- **SC-003**: All three interactive elements (delta chart, results table, track map) reflect the same selected driver simultaneously — zero desync visible to the user.
- **SC-004**: Switching metric overlays on the track map (Speed → Throttle → Brake) responds within 300 ms (client-side re-render only).
- **SC-005**: The page remains fully usable on screens as narrow as 375px with no horizontal scrolling required.

## Assumptions

- The existing FastAPI backend and FastF1 caching infrastructure will be reused without major changes; only the `team_color` field needs to be added to the qualifying results endpoint response.
- The `TrackMap`, `TelemetryToggle`, and `useCornerAnnotations` components/hooks already exist in the codebase and will be reused as-is on the qualifying page.
- Qualifying telemetry uses session type `"Q"` (the backend already supports this path).
- Team colours are available for all current F1 teams via FastF1's `plotting.get_team_color`; a fallback grey (`#808080`) is used for unknown teams.
- No authentication is required; the page is a local single-user tool.
- Real-time data updates are out of scope — all data is cached by FastF1.
- The `useTrack.js` hook's `useLapTelemetry` with `lapNumber = null` fetches the fastest lap, which is the correct default for qualifying.
