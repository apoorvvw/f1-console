# Testing Guidelines

## Testing Principles

- All new features should include appropriate tests.
- Tests should be maintainable and follow best practices.
- Tests should be easy to read, maintain, and update as the codebase evolves.
- Use descriptive test names and clear assertions.
- All tests must be isolated and independent - each test should set up its own data and not rely on other tests.
- Mock external dependencies where appropriate.

## Types of Tests

### Unit Tests

Unit tests test individual functions and React components in isolation.

- **File Naming Convention**: Use `*.test.js` or `*.test.ts`
- **Backend Unit Tests Location**: `packages/backend/__tests__/` directory
- **Frontend Unit Tests Location**: `packages/frontend/src/__tests__/` directory
- **File Naming**: Name unit test files to match what they're testing (e.g., `app.test.js` for testing `app.js`)
- Cover edge cases and error handling.

### Integration Tests

Integration tests test backend API endpoints with real HTTP requests.

- **Location**: `packages/backend/__tests__/integration/` directory
- **File Naming Convention**: Use `*.test.*` (e.g., `*.test.js` or `*.test.ts`)
- **File Naming**: Name integration test files intelligently based on what they test (e.g., `todos-api.test.js` for TODO API endpoints)
- Ensure that data flows correctly through the API.
- Test the interaction between multiple backend components or modules.

### End-to-End (E2E) Tests

End-to-end tests use **Playwright** (required framework) to test complete UI workflows through browser automation.

- **Location**: `tests/e2e/` directory
- **File Naming Convention**: Use `*.spec.js` or `*.spec.ts`
- **File Naming**: Name E2E test files based on the user journey they test (e.g., `todo-workflow.spec.js`)
- **Browser Configuration**: Playwright tests must use one browser only
- **Design Pattern**: Playwright tests must use the Page Object Model (POM) pattern for maintainability
- **Scope**: Limit E2E tests to 5-8 critical user journeys - focus on happy paths and key edge cases, not exhaustive coverage
- Simulate real user scenarios from the UI to the backend.
- Validate that the app works as expected in a production-like environment.

## Test Setup and Maintenance

### Setup and Teardown Hooks

- Setup and teardown hooks are required - tests must succeed on multiple runs.
- Each test should set up its own data to ensure independence.
- Clean up resources after each test completes.

### Coverage and Maintenance

- Aim for high test coverage, especially for core features.
- Regularly review and update tests as features change.
- Remove obsolete tests and add new ones for updated functionality.

## Port Configuration

Always use environment variables with sensible defaults for port configuration to allow CI/CD workflows to dynamically detect ports.

**Backend Configuration**:
```javascript
const PORT = process.env.PORT || 8000;
```

**Frontend Configuration**:
```javascript
// React's default port is 3000, but can be overridden with PORT environment variable
const PORT = process.env.PORT || 3000;
```

This approach allows flexibility in different environments (local development, CI/CD, containerized deployments).
