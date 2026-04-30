# Feature Specification: F1 React Dashboard

**Feature Branch**: `001-f1-react-dashboard`  
**Created**: 2026-04-29  
**Status**: Draft  
**Input**: User description: "create application requirements based on docs/functional-requirements.md. We also want to create a react application as a dashboard to display the data. Come up with features and UI requirements too"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Session Explorer & Lap Time Analysis (Priority: P1)

A motorsport analyst or F1 enthusiast opens the dashboard and selects a race weekend (year, Grand Prix, session type). They view a lap time distribution chart that shows all drivers' lap times, highlights outliers, and lets them compare specific drivers side-by-side. They can filter by compound, driver, or lap range to drill into performance trends.

**Why this priority**: Lap time analysis is the core analytical feature of the application. Without it, the dashboard delivers no value. It is the entry point for virtually every other analysis.

**Independent Test**: Can be fully tested by selecting any historical session (e.g., 2023 British GP – Race) and verifying that a lap time distribution chart renders with all active drivers, color-coded, with filter controls.

**Acceptance Scenarios**:

1. **Given** the user is on the dashboard home, **When** they select a year, Grand Prix, and session type, **Then** the session is loaded and a lap time distribution chart is displayed with one series per driver.
2. **Given** a session is loaded, **When** the user filters by one or more drivers, **Then** only the selected drivers' lap times are shown.
3. **Given** a session is loaded, **When** the user filters by tyre compound, **Then** only laps on that compound are displayed.
4. **Given** the session data is unavailable or still loading, **When** the user views the chart area, **Then** a loading skeleton or clear error message is shown instead of a broken chart.

---

### User Story 2 - Qualifying Results Dashboard (Priority: P2)

An analyst views the qualifying results for a selected Grand Prix. They see driver positions, Q1/Q2/Q3 round times, and can compare a driver's progression through qualifying rounds. They can sort and filter results by round or driver.

**Why this priority**: Qualifying data is the second most consumed analysis type, directly showing race grid positions and driver pace differentials.

**Independent Test**: Can be fully tested by selecting a qualifying session and verifying that a grid-position table and per-round time comparison chart render correctly.

**Acceptance Scenarios**:

1. **Given** the user selects a qualifying session, **When** the data loads, **Then** the grid position table shows all classified drivers with their Q1, Q2, and Q3 times (where applicable).
2. **Given** the qualifying results are shown, **When** the user clicks a driver's row, **Then** a detail panel shows the driver's progression through qualifying rounds.
3. **Given** the user applies a round filter (Q1/Q2/Q3), **When** the filter is applied, **Then** only results for that qualifying round are highlighted or displayed.

---

### User Story 3 - Track Speed Visualization (Priority: P2)

An analyst selects a driver and a lap, then views a track map with the driver's speed overlaid as a color gradient from corner entry to exit. They can annotate corners and toggle between throttle, brake, and speed views.

**Why this priority**: Track performance visualization is a flagship feature differentiating this dashboard from tabular data; it provides spatial context for telemetry data.

**Independent Test**: Can be fully tested by selecting a driver and fastest lap in any session and verifying the track map renders with a speed color gradient and corner annotations visible.

**Acceptance Scenarios**:

1. **Given** a session is loaded, **When** the user selects a driver and a specific lap, **Then** a track outline is drawn with speed data color-coded from slow (cool color) to fast (warm color).
2. **Given** the track map is visible, **When** the user toggles the "Throttle" or "Brake" view, **Then** the color gradient updates to reflect the selected metric.
3. **Given** the track map is visible, **When** corner annotations are enabled, **Then** corner numbers and names are displayed at the correct positions on the track layout.
4. **Given** the user hovers over a point on the track, **When** the tooltip appears, **Then** it shows speed, throttle percentage, brake status, and distance from start.

---

### User Story 4 - Championship Standings & Scenarios (Priority: P3)

An analyst views the current World Driver's Championship (WDC) standings and explores which drivers can still mathematically win the championship. The dashboard shows remaining points available and highlights each driver's scenario.

**Why this priority**: Championship scenarios are a compelling feature for fans during the season, but they have limited utility for historical or concluded seasons.

**Independent Test**: Can be fully tested by selecting an in-progress or recent season and verifying that the standings table renders with "can still win" indicators and a remaining-points calculation.

**Acceptance Scenarios**:

1. **Given** the user navigates to the Championship view, **When** they select a season, **Then** the current driver standings table shows points, wins, and a "can still win" badge where mathematically possible.
2. **Given** the standings are displayed, **When** the user clicks a driver, **Then** a panel shows the minimum results needed for that driver to win the championship.
3. **Given** the selected season is already concluded, **When** the standings load, **Then** the champion is highlighted and no "can still win" projections are shown for non-champions.

---

### User Story 5 - Session & Data Navigation (Priority: P1)

A user can easily navigate between sessions — browsing available years, Grand Prix events, and session types (FP1, FP2, FP3, Qualifying, Race) — from a persistent navigation panel. Recently viewed sessions are accessible quickly without re-selecting from scratch.

**Why this priority**: Without intuitive session navigation, users cannot reach any analytical view. This is foundational to the entire dashboard experience.

**Independent Test**: Can be fully tested by navigating the session selector, picking multiple sessions in sequence, and verifying that switching sessions updates all data panels correctly.

**Acceptance Scenarios**:

1. **Given** the user opens the dashboard, **When** the session selector is visible, **Then** they can browse and select by year → Grand Prix → session type in a hierarchical or step-by-step flow.
2. **Given** the user has previously viewed sessions, **When** they open the session selector, **Then** up to 5 recently viewed sessions appear as quick-access shortcuts.
3. **Given** the user changes the active session, **When** the selection is confirmed, **Then** all open analysis views refresh to show data for the newly selected session.

---

### Edge Cases

- What happens when FastF1 returns no data for a selected session (e.g., cancelled event or unloaded cache)?
- How does the system handle sessions with fewer than 20 drivers (e.g., retirements mid-race)?
- What is shown when a driver does not participate in Q2 or Q3?
- How does the track visualization behave if telemetry data is missing for a given lap?
- What happens when the user selects the current season and live session data is not yet available?
- How does the dashboard respond when the backend API is unreachable?

## Requirements *(mandatory)*

### Functional Requirements

#### Session & Data Management

- **FR-001**: The system MUST allow users to select a race session by year, Grand Prix name, and session type (FP1, FP2, FP3, Qualifying, Sprint, Race).
- **FR-002**: The system MUST retrieve session data from the FastF1 API with caching to prevent redundant network calls.
- **FR-003**: The system MUST support loading historical session data for all seasons available in FastF1.
- **FR-004**: The system MUST display a loading state while session data is being fetched.
- **FR-005**: The system MUST display a user-friendly error message when session data cannot be retrieved.
- **FR-006**: The system MUST retain the last 5 visited sessions for quick re-access.

#### Lap Time Analysis

- **FR-007**: The system MUST display a lap time distribution chart for all drivers in a selected session.
- **FR-008**: The system MUST allow filtering of lap times by driver (one or more).
- **FR-009**: The system MUST allow filtering of lap times by tyre compound.
- **FR-010**: The system MUST visually distinguish each driver using a unique color consistent with their team colors where available.
- **FR-011**: The system MUST highlight statistical outliers (e.g., laps with pit stops or safety car laps) in the distribution.
- **FR-012**: The system MUST allow users to select a lap range to narrow the displayed distribution.

#### Track Performance Visualization

- **FR-013**: The system MUST render a track layout for the selected Grand Prix circuit.
- **FR-014**: The system MUST overlay speed data on the track layout using a color gradient for a selected driver and lap.
- **FR-015**: The system MUST support toggling between speed, throttle, and brake telemetry on the track map.
- **FR-016**: The system MUST display corner annotations (numbers and names) at the correct positions on the track.
- **FR-017**: The system MUST show a tooltip with telemetry values when the user hovers over a position on the track map.

#### Qualifying Results

- **FR-018**: The system MUST display a qualifying results table with driver name, team, grid position, and times for each qualifying round (Q1, Q2, Q3).
- **FR-019**: The system MUST allow filtering qualifying results by round (Q1, Q2, Q3).
- **FR-020**: The system MUST show a per-driver qualifying progression panel when the user selects a driver from the results table.

#### Championship Scenarios

- **FR-021**: The system MUST display the current World Driver's Championship standings for a selected season.
- **FR-022**: The system MUST calculate and display remaining points available in the season.
- **FR-023**: The system MUST indicate which drivers can still mathematically win the championship.
- **FR-024**: The system MUST show the minimum results required for a selected driver to win the championship.

#### React Frontend Dashboard (UI)

- **FR-025**: The dashboard MUST be a single-page React application with client-side routing between views (Lap Times, Track, Qualifying, Championship).
- **FR-026**: The dashboard MUST include a persistent top navigation bar with links to all major views and the session selector.
- **FR-027**: The dashboard MUST be responsive and usable on mobile (≥320px), tablet (≥768px), and desktop (≥1280px) screen widths.
- **FR-028**: All charts and visualizations MUST resize fluidly to fit their container without horizontal scrolling.
- **FR-029**: The dashboard MUST use Material UI (MUI) for all form elements, buttons, dialogs, data tables, and navigation components.
- **FR-030**: The dashboard MUST communicate with the backend via a versioned REST API.
- **FR-031**: All interactive UI elements MUST be keyboard accessible with visible focus indicators.
- **FR-032**: All data tables MUST support sorting by column header click.

### Key Entities *(include if feature involves data)*

- **Session**: A specific F1 event session, identified by year, Grand Prix name, and session type (FP1–Race). Contains metadata: circuit name, date, total laps.
- **Driver**: A participant in a session, identified by driver code (e.g., VER, HAM), name, team name, and team color.
- **Lap**: A single timed lap by a driver within a session. Attributes: lap number, lap time, tyre compound, pit stop flag, sector times.
- **Telemetry Point**: A high-frequency data point within a lap. Attributes: distance from start, speed, throttle %, brake status, gear, DRS status.
- **Qualifying Result**: A driver's classification in a qualifying session. Attributes: grid position, Q1 time, Q2 time, Q3 time, classified round.
- **Championship Standing**: A driver's points tally at a point in the season. Attributes: driver, points, wins, position, can-still-win flag.
- **Circuit**: A race track. Attributes: name, country, track layout coordinates, corner annotations (number, name, position).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can select a session, load data, and view a lap time chart in under 5 seconds on a standard broadband connection (after initial cache warm-up).
- **SC-002**: Users can navigate between any two dashboard views in under 2 seconds without a full page reload.
- **SC-003**: The dashboard renders correctly and is fully functional on the three tested screen sizes: mobile (375px), tablet (768px), and desktop (1440px).
- **SC-004**: All chart and table interactions (filter, sort, hover tooltip) respond within 300 milliseconds of user input.
- **SC-005**: 90% of first-time users can successfully load a session and view lap time data without assistance (verified through usability testing or task completion observation).
- **SC-006**: All functional requirements have corresponding automated tests with a minimum of 80% code coverage on the backend service layer.
- **SC-007**: The championship scenario view correctly identifies all drivers who can still win based on remaining rounds, with zero incorrect inclusions or exclusions.

## Assumptions

- Users are assumed to have basic familiarity with Formula 1 terminology (lap time, sector, tyre compound, qualifying rounds).
- The FastF1 Python library and its caching layer are used exclusively as the backend data source; no other external F1 data APIs are integrated in this version.
- The React frontend communicates only with the local backend; no direct browser-to-FastF1 calls are made.
- Live/real-time session data streaming is out of scope; the dashboard displays finalized historical session data only.
- Authentication and user accounts are out of scope for this version; the dashboard is a single-user local tool.
- The backend API is assumed to run on port 3030 and the frontend on port 3000, configurable via environment variables.
- Mobile support targets read-only viewing; complex interactions (multi-driver comparison overlays) are optimized for desktop.
- Team colors for driver identification are sourced from a maintained static mapping; official FastF1 color data is used where available.
