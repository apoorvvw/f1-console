<!--
  Sync Impact Report
  Version change: N/A → 1.0.0 (initial ratification)
  Added principles:
    - I. Code Quality & Consistency
    - II. Comprehensive Testing
    - III. Accessible & Responsive UI
    - IV. Data-Driven Analysis
    - V. Code Review Discipline
  Added sections:
    - Technology Stack
    - Development Workflow
  Removed sections: none
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ (no changes needed,
      Constitution Check section is generic)
    - .specify/templates/spec-template.md ✅ (no changes needed)
    - .specify/templates/tasks-template.md ✅ (no changes needed)
  Follow-up TODOs: none
-->

# F1 Console Constitution

## Core Principles

### I. Code Quality & Consistency

- All code MUST follow consistent formatting: 2-space indentation
  for JavaScript/JSX, no tabs, lines limited to 100 characters.
- Every variable, function, and component MUST use clear,
  descriptive names.
- The DRY principle MUST be enforced: extract reusable logic into
  functions or components. Duplicated code MUST be refactored.
- ESLint MUST be used for code quality enforcement; Prettier MUST
  be used for automatic formatting. All linter errors and warnings
  MUST be resolved before committing.
- Imports MUST be organized: external dependencies before internal
  modules, grouped by library then by relative path. Unused
  imports MUST be removed.
- Small, focused functions and components are required. Deeply
  nested code MUST be refactored for readability.
- `const` and `let` MUST be preferred over `var`.

**Rationale**: Consistent code reduces cognitive load, simplifies
reviews, and prevents style-related merge conflicts.

### II. Comprehensive Testing

- All new features MUST include appropriate tests covering unit,
  integration, and (where applicable) end-to-end levels.
- Tests MUST be isolated and independent: each test sets up its
  own data and MUST NOT rely on other tests.
- Test naming MUST be descriptive; assertions MUST be clear.
- Backend unit tests MUST reside in `packages/backend/__tests__/`.
  Frontend unit tests MUST reside in
  `packages/frontend/src/__tests__/`.
- Integration tests MUST reside in
  `packages/backend/__tests__/integration/` and validate data
  flow through API endpoints.
- E2E tests MUST use Playwright with the Page Object Model
  pattern, reside in `tests/e2e/`, and be limited to 5–8
  critical user journeys.
- Setup and teardown hooks are required; tests MUST succeed on
  repeated runs.
- Port configuration MUST use environment variables with sensible
  defaults (backend: 3030, frontend: 3000).

**Rationale**: Reliable, well-structured tests catch regressions
early and enable confident refactoring.

### III. Accessible & Responsive UI

- Material UI (MUI) MUST be used for all form elements, buttons,
  dialogs, and lists.
- The defined color palette MUST be followed: primary #1976d2,
  secondary #ff9800, background #f5f5f5, text #212121.
- All interactive elements MUST be keyboard accessible with
  visible focus indicators.
- Semantic HTML and ARIA attributes MUST be used where
  appropriate. Color contrast MUST meet WCAG AA compliance.
- Layout MUST be responsive across mobile, tablet, and desktop
  using an 8px spacing grid.
- Animations MUST be subtle and non-distracting; Material Icons
  MUST be used for actions.
- Buttons MUST have a minimum touch target of 48×48px.

**Rationale**: Accessible, responsive design ensures the
application is usable by all users on any device.

### IV. Data-Driven Analysis

- All F1 data MUST be retrieved via the FastF1 API with
  appropriate caching mechanisms.
- The system MUST support practice, qualifying, and race session
  data types, including historical data.
- Visualizations MUST include proper labels, legends, and
  color-coded driver identification.
- Data filtering and grouping MUST be flexible to support
  lap time analysis, track performance, qualifying results,
  championship scenarios, and corner annotations.

**Rationale**: The core value proposition is accurate, performant
F1 data analysis; data integrity and clear visualization are
non-negotiable.

### V. Code Review Discipline

- All changes MUST be submitted via pull requests.
- Reviewers MUST evaluate code for clarity, maintainability, and
  adherence to these principles.
- Review feedback MUST be addressed promptly and respectfully.
- Comments MUST explain complex logic; obvious comments MUST be
  avoided.

**Rationale**: Peer review catches defects, spreads knowledge,
and maintains collective code ownership.

## Technology Stack

- **Backend**: Python with FastAPI; dependencies managed via
  `requirements.txt`.
- **Frontend**: JavaScript/React with Material UI (MUI).
- **Data Layer**: FastF1 Python library for Formula 1 data.
- **Testing**: pytest (backend), Playwright (E2E).
- **Linting/Formatting**: ESLint + Prettier (frontend),
  Python linters (backend).
- **Visualization**: Matplotlib-based plots via FastF1 utilities.

## Development Workflow

- Feature work MUST begin on a dedicated feature branch.
- All code MUST pass linting and tests before merging.
- Pull requests MUST reference related specs or issues.
- Commits MUST use clear, descriptive messages following
  conventional commit format.
- Environment-specific configuration MUST use environment
  variables, never hard-coded values.

## Governance

This constitution supersedes all ad-hoc practices. Amendments
require:

1. A documented proposal describing the change and rationale.
2. Review and approval via pull request.
3. A migration plan for any breaking governance changes.
4. Version increment following semantic versioning:
   - MAJOR: principle removals or incompatible redefinitions.
   - MINOR: new principles or materially expanded guidance.
   - PATCH: clarifications, wording, or typo fixes.

All pull requests and reviews MUST verify compliance with these
principles. Refer to docs/ for detailed coding, testing, and UI
guidelines.

**Version**: 1.0.0 | **Ratified**: 2026-04-29 | **Last Amended**: 2026-04-29
