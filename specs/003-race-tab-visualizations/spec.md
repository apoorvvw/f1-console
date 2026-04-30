# Feature Specification: Race Tab Visualizations

**Feature Branch**: `003-race-tab-visualizations`  
**Created**: 2026-04-30  
**Status**: Draft  
**Input**: User description: "I want to update the tabs; remove laptimes tab and I want a race tab which will have the race data. Suggest any data that can go here from the fastf1 api. Add team pace ranking. The driver comparison section is currently not working, populate that with driver styling when more than one driver is selected. If only one driver is selected, show driver lap times scatterplot. Replace current laptime distribution plot with position changes. From UI perspective, organize these in sensible manner and add ui transitions where you can. Also find ways to connect all this data interactively."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navigate Race Tab (Priority: P1)

As an F1 fan, I want a dedicated Race tab on the dashboard so I can explore race-specific data and visualisations without leaving the main application.

**Why this priority**: This is the foundational structural change — removing the Lap Times tab and introducing the Race tab — that all other stories depend on. Without it, none of the new charts have a home.

**Independent Test**: Load the app, observe that a "Race" tab exists and the "Lap Times" tab is gone. Selecting the Race tab shows race data content.

**Acceptance Scenarios**:

1. **Given** the application loads, **When** the user views the navigation tabs, **Then** a "Race" tab is visible and no "Lap Times" tab exists.
2. **Given** the Race tab is selected, **When** the page renders, **Then** race data for the currently selected season and event is fetched and displayed.
3. **Given** no race data is available (loading or error), **When** the Race page renders, **Then** skeleton loaders or an empty state message is shown without breaking the page.

---

### User Story 2 - Position Changes Chart (Priority: P1)

As an F1 fan, I want to see how each driver's position changed lap-by-lap throughout the race so I can understand the race narrative at a glance.

**Why this priority**: The position changes chart (replacing the current lap time distribution) is explicitly requested and provides the primary race narrative visualisation. It is the most immediately informative race chart.

**Independent Test**: Load the Race tab for any completed race session; see a multi-line chart with one line per driver showing position (Y-axis, inverted, 1 at top) vs lap number (X-axis), colour-coded by driver.

**Acceptance Scenarios**:

1. **Given** a race session is selected with data, **When** the position changes chart renders, **Then** each driver is represented by a uniquely coloured line, the Y-axis is inverted (position 1 at top), and the X-axis shows lap numbers.
2. **Given** a driver is selected (via any interaction on the page), **When** the chart updates, **Then** the selected driver's line is visually emphasised (bolder, brighter) while others are dimmed.
3. **Given** the chart is visible, **When** the user hovers over any lap point, **Then** a tooltip displays the driver's abbreviation, lap number, and position at that lap.

---

### User Story 3 - Team Pace Ranking Chart (Priority: P1)

As an F1 analyst, I want to see a boxplot ranking all teams by their race pace so I can compare overall team performance across the entire race.

**Why this priority**: The team pace ranking is explicitly requested and provides crucial team-level race analysis that complements driver-level data. It answers "which team was fastest overall?" at a glance.

**Independent Test**: Load the Race tab; see a horizontal boxplot chart listing teams ordered fastest to slowest, with each team coloured in their official team colour.

**Acceptance Scenarios**:

1. **Given** a completed race session is selected, **When** the team pace chart renders, **Then** all teams are displayed as boxplots ordered from fastest (lowest median lap time) to slowest, coloured by official team colours.
2. **Given** the team pace chart is visible, **When** the user clicks on a team's boxplot, **Then** all drivers belonging to that team are highlighted in the position changes chart and the driver panel filters to show that team's drivers.
3. **Given** no completed race data is available, **When** the team pace chart attempts to render, **Then** an informative empty state is shown (e.g., "Race data not yet available").

---

### User Story 4 - Driver Lap Times Panel (Single Driver) (Priority: P2)

As an F1 fan, I want to see a scatterplot of a selected driver's individual lap times coloured by tyre compound when exactly one driver is selected, so I can understand their race strategy and pace consistency.

**Why this priority**: This provides rich individual driver analysis. When one driver is selected, the compound-coloured scatterplot is the most insightful view; it only makes sense for a single driver at a time.

**Independent Test**: Select exactly one driver on the Race tab; the driver analysis panel shows a scatterplot of lap number (X) vs lap time (Y, inverted) with each point coloured by tyre compound.

**Acceptance Scenarios**:

1. **Given** exactly one driver is selected, **When** the driver analysis panel renders, **Then** a scatterplot is displayed with lap number on the X-axis, lap time on the Y-axis (inverted so faster times appear higher), and each lap point coloured by tyre compound.
2. **Given** the scatterplot is visible, **When** the user hovers over a data point, **Then** a tooltip shows the lap number, lap time, and tyre compound.
3. **Given** the driver switches tyre compounds mid-race, **When** the scatterplot renders, **Then** the compound transition is clearly visible via colour change, and the legend correctly labels all compounds used.

---

### User Story 5 - Driver Comparison Panel (Multiple Drivers) (Priority: P2)

As an F1 analyst, I want to see a multi-driver lap time comparison chart when two or more drivers are selected, so I can directly compare pace between drivers of interest.

**Why this priority**: Multi-driver comparison is more useful than showing multiple individual scatterplots. The line chart with driver-specific colours and line styles communicates relative pace differences more clearly.

**Independent Test**: Select two or more drivers; the driver analysis panel switches from scatterplot to a multi-line chart showing each driver's lap times as a coloured, styled line.

**Acceptance Scenarios**:

1. **Given** two or more drivers are selected, **When** the driver analysis panel renders, **Then** a multi-line chart is displayed with each driver's lap times plotted as a line, using driver-specific colour and line style.
2. **Given** the multi-driver chart is visible, **When** the user hovers over any point on the chart, **Then** a tooltip shows which driver the point belongs to, their lap time, and their lap number.
3. **Given** the user deselects drivers until only one remains, **When** the panel re-renders, **Then** the view automatically transitions from the multi-line chart to the single-driver scatterplot without a full page reload.

---

### User Story 6 - Interactive Cross-Chart Data Linking (Priority: P2)

As a user, I want selections and filters applied in one chart (e.g., clicking a team in the pace ranking) to automatically update all other charts on the Race tab so all views always reflect the same context.

**Why this priority**: Cross-chart interactivity is what transforms disconnected charts into a coherent analytical tool. This story captures the "connect all this data interactively" requirement.

**Independent Test**: Click on a team in the team pace chart; observe that the position changes chart highlights those drivers, and the driver panel updates to show that team's drivers.

**Acceptance Scenarios**:

1. **Given** the Race tab is loaded, **When** the user clicks a team in the team pace ranking chart, **Then** the corresponding drivers' lines are highlighted in the position changes chart.
2. **Given** a driver's line is clicked in the position changes chart, **When** the page updates, **Then** that driver is toggled into or out of the selected set, and the driver analysis panel updates accordingly (switching between single and multi-driver view as the count changes).
3. **Given** multiple selections are active, **When** the user clicks a clear/reset button, **Then** all highlights and selections are cleared across all charts simultaneously, and all charts return to their default state.

---

### User Story 7 - Animated UI Transitions (Priority: P3)

As a user, I want smooth visual transitions when switching tabs, selecting drivers, or changing data so the interface feels polished and responsive.

**Why this priority**: Transitions are a quality-of-life enhancement that makes the product feel more professional. They do not block core functionality but significantly improve perceived quality.

**Independent Test**: Switch tabs, select/deselect a driver, and change the session; each action produces a smooth fade, slide, or interpolated animation rather than an abrupt re-render.

**Acceptance Scenarios**:

1. **Given** the user switches between tabs, **When** the transition occurs, **Then** the new tab content fades or slides in within 200–400ms.
2. **Given** a driver is selected or deselected, **When** the chart updates, **Then** lines/bars animate to their new opacity/colour state rather than snapping instantly.
3. **Given** new race data is loaded, **When** the charts render, **Then** data points animate in (e.g., draw-on animation for lines) rather than appearing all at once.

---

### Edge Cases

- What happens when a race session has not yet occurred (future event)?
- How does the position changes chart handle retirements (driver drops off mid-race)?
- What if only one team completed the race (extreme scenario with many DNFs)?
- How does the driver comparison chart handle more than 5 selected drivers (visual clutter)?
- What if the FastF1 API returns incomplete lap data for a driver?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The application MUST replace the "Lap Times" tab with a "Race" tab in the main navigation.
- **FR-002**: The Race tab MUST display a position-changes-per-lap chart for all drivers in the selected race.
- **FR-003**: The position changes chart MUST invert the Y-axis so that position 1 appears at the top.
- **FR-004**: The Race tab MUST display a team pace ranking boxplot ordered from fastest to slowest median lap time.
- **FR-005**: Each team's boxplot MUST be coloured using the team's official colour from the FastF1 colour palette.
- **FR-006**: When exactly one driver is selected, the driver analysis panel MUST display a lap-time scatterplot coloured by tyre compound.
- **FR-007**: When two or more drivers are selected, the driver analysis panel MUST display a multi-line lap time comparison chart using driver-specific colours and line styles.
- **FR-008**: The driver analysis panel MUST animate its transition between single-driver and multi-driver views when the selection count changes.
- **FR-009**: Clicking a team in the team pace chart MUST highlight that team's drivers in the position changes chart.
- **FR-010**: Clicking a driver line in the position changes chart MUST toggle that driver's selected state (on/off); the selected set grows and shrinks freely with no maximum enforced.
- **FR-011**: A clear/reset control MUST allow the user to deselect all selections at once, returning all charts to their default unfiltered state.
- **FR-012**: All charts MUST show tooltips on hover displaying contextually relevant data fields.
- **FR-013**: Tab navigation transitions MUST animate with a duration of 200–400ms.
- **FR-014**: Chart data transitions (highlighting, filtering) MUST animate rather than snap.
- **FR-015**: Loading and error states MUST be handled gracefully for all charts on the Race tab.

### Key Entities

- **Race Session**: A completed Formula 1 race, identified by year and event name, providing lap-by-lap data for all drivers.
- **Driver**: A race participant identified by a three-letter abbreviation (e.g., VER), associated with a team, colour, and line style.
- **Lap**: A single timed circuit for a driver, containing lap number, lap time, compound, and position.
- **Team**: A constructor in the race, associated with two drivers and an official team colour.
- **Selection State**: The currently selected driver(s) and/or team — a freely growing/shrinking set populated by clicking driver lines in the position changes chart or team boxplots in the pace ranking chart. Shared across all charts on the Race tab.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All race charts render correctly for any completed F1 race session from 2018 to the present day.
- **SC-002**: Switching between single-driver and multi-driver views completes within 300ms on a standard desktop browser.
- **SC-003**: Cross-chart interactions (clicking a team or driver) update all linked charts within 200ms.
- **SC-004**: All charts display accessible tooltips on hover for every data point.
- **SC-005**: Tab transition animations complete within 400ms without visual jank.
- **SC-006**: The Race tab reaches a usable rendered state within 3 seconds of session data being available.
- **SC-007**: All charts correctly handle the "no data" and "loading" states without JavaScript errors.

## Assumptions

- The existing session selector (year + event) on the dashboard already controls session selection; the Race tab reuses this context.
- FastF1 API data is available for all completed F1 races from 2018 onwards; future or in-progress races show an appropriate empty state.
- The backend already provides (or will be extended to provide) race lap data endpoints compatible with the chart requirements.
- Driver and team colour mappings are sourced from FastF1's built-in colour palette and do not require manual configuration.
- Mobile layout is a secondary concern; the primary viewport target is a 1280px+ desktop screen.
- Tyre compound colours follow the standard F1 convention (Soft = red, Medium = yellow, Hard = white, etc.) as provided by FastF1.
- The existing shared driver selection/filter state mechanism from the qualifying page will be adapted or extended for the Race tab.
