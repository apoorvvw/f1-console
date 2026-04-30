# Feature Specification: Dashboard & Session Navigation

**Feature Branch**: `004-dashboard-session-navigation`
**Created**: 2026-04-30
**Status**: Draft
**Input**: User description: "I want to create a dashboard page which has the session selection and some other relevant data. Once session is selected, based on session type, navigate the user to either race page or quali page. Also have find an appropriate place to navigate to the Tracks page"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse Dashboard and Select a Session (Priority: P1)

A user opens the app and lands on a Dashboard page. They see a session selector and relevant contextual data (recent sessions, standings snapshot, upcoming race). They choose a year, event, and session type, confirm their selection, and are automatically routed to the appropriate analysis page.

**Why this priority**: This is the core navigation flow of the application. Without a Dashboard landing page that routes to the right page, every other feature depends on implicit navigation through the NavBar. This unlocks the full user journey from entry to analysis.

**Independent Test**: Open the app at `/`, confirm the Dashboard page renders with a session selector and contextual cards. Select a Race session and verify navigation to `/race`. Select a Qualifying session and verify navigation to `/qualifying`.

**Acceptance Scenarios**:

1. **Given** the user opens the app, **When** the root URL is accessed, **Then** the Dashboard page is displayed instead of redirecting directly to the Race page.
2. **Given** the user is on the Dashboard, **When** they select a Race (`R`) or Sprint (`S`) session and confirm, **Then** they are navigated to the Race page with the selected session active.
3. **Given** the user is on the Dashboard, **When** they select a Qualifying (`Q`) or Sprint Qualifying (`SQ`) session and confirm, **Then** they are navigated to the Qualifying page with the selected session active.
4. **Given** the user has previously selected sessions, **When** the Dashboard loads, **Then** recently used sessions are shown as quick-select options.

---

### User Story 2 - Navigate to Track Visualization from Dashboard (Priority: P2)

A user wants to explore circuit layout information. From the Dashboard, they can see a dedicated entry point (card or prominent link) that takes them to the Tracks page, in addition to the existing NavBar tab.

**Why this priority**: The Tracks page provides standalone value independent of session selection. Having a prominent Dashboard entry point increases discoverability for users who may not notice the NavBar tab.

**Independent Test**: From the Dashboard, click the Tracks navigation entry point and confirm navigation to `/track`.

**Acceptance Scenarios**:

1. **Given** the user is on the Dashboard, **When** they click the Tracks card or link, **Then** they are navigated to the Track page.
2. **Given** the user navigates to the Track page from the Dashboard, **When** no session is selected, **Then** the Track page handles the empty session state gracefully (existing behavior is preserved).

---

### User Story 3 - View Contextual F1 Data on Dashboard (Priority: P3)

A user visits the Dashboard and, without selecting a session, can see at-a-glance contextual data: a standings snapshot (drivers/constructors championship leaders), and the next upcoming race event.

**Why this priority**: Provides ambient value even when the user is browsing without intent to analyze a specific session. Enhances the feel of a proper landing page vs. a bare selector.

**Independent Test**: Open the Dashboard without any active session and confirm that standings and upcoming event information are visible without any interaction.

**Acceptance Scenarios**:

1. **Given** the user opens the Dashboard, **When** no session has been selected, **Then** a standings summary (top 3 drivers and constructors) is visible.
2. **Given** the user opens the Dashboard, **When** the current season schedule is available, **Then** the next upcoming race event is displayed with its name and date.
3. **Given** the data endpoint is unavailable, **When** the Dashboard loads, **Then** the contextual cards show a graceful empty/error state without breaking the session selector.

---

### Edge Cases

- What happens when a user selects a Practice session (FP1, FP2, FP3)? [NEEDS CLARIFICATION: Practice sessions are selectable but have no dedicated page — should they navigate to the Race page (for lap time analysis), remain on the Dashboard with a message, or be excluded from the session type dropdown on the Dashboard?]
- What happens when the schedule API returns no events for a selected year?
- What happens when the user refreshes the page mid-session — does the previously selected session persist?
- What if the user navigates directly to `/race` or `/qualifying` without going through the Dashboard first?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a Dashboard page accessible at the root URL (`/`).
- **FR-002**: Dashboard MUST contain a session selector allowing users to choose year, event, and session type.
- **FR-003**: Upon confirming a Race (`R`) or Sprint (`S`) session, the system MUST navigate the user to the Race analysis page.
- **FR-004**: Upon confirming a Qualifying (`Q`) or Sprint Qualifying (`SQ`) session, the system MUST navigate the user to the Qualifying analysis page.
- **FR-005**: Dashboard MUST display recently used sessions as quick-select shortcuts (reusing existing recent sessions state).
- **FR-006**: Dashboard MUST include a prominent navigation entry point (card or tile) to the Tracks page.
- **FR-007**: Dashboard MUST display a standings snapshot showing current season top drivers and constructors.
- **FR-008**: Dashboard MUST display the next upcoming race event name and date when schedule data is available.
- **FR-009**: All contextual data widgets MUST show a graceful empty or loading state when data is unavailable.
- **FR-010**: Existing NavBar tabs (Race, Track, Qualifying, Championship) MUST remain functional and accessible from the Dashboard.
- **FR-011**: Navigating directly to `/race`, `/qualifying`, `/track`, or `/championship` via the NavBar MUST continue to work without requiring a Dashboard visit first.

### Key Entities

- **Session**: A specific race weekend session identified by year, event name, and session type (R, S, Q, SQ, FP1, FP2, FP3).
- **Dashboard Card**: A visual tile on the Dashboard representing either a navigation destination (Tracks) or a data summary (Standings, Upcoming Race).
- **Recent Session**: A previously selected session stored locally, shown as a quick-select shortcut on the Dashboard.
- **Session Type Routing Rule**: The mapping from session type to destination page (R/S → Race, Q/SQ → Qualifying).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can select a session and arrive at the correct analysis page in under 30 seconds from opening the app.
- **SC-002**: 100% of Race and Qualifying session selections result in navigation to the correct destination page.
- **SC-003**: The Dashboard page fully renders (selector + contextual cards) in under 2 seconds on a standard broadband connection.
- **SC-004**: Users can reach the Tracks page from the Dashboard without using the NavBar (via the dedicated Dashboard entry point).
- **SC-005**: Recent sessions (up to last 5) are visible on the Dashboard without any additional user interaction.

## Assumptions

- The existing `SessionSelector` dialog component and `SessionContext` will be reused or adapted for the Dashboard session selection experience.
- The `RecentSessions` component already tracks recent sessions and can be embedded directly on the Dashboard.
- Standings and schedule data are available via existing or planned API endpoints consistent with the FastF1 data source already in use.
- The Tracks page (`/track`) does not require an active session to render its base state.
- Practice sessions (FP1, FP2, FP3) routing destination is out of scope until clarification is received.
- Mobile responsiveness follows existing app conventions (NavBar collapses to a drawer on small screens).
- The Dashboard replaces the current root redirect to `/race`; existing deep links to `/race`, `/qualifying`, etc. are unaffected.
