import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routeForSessionType, SESSION_ROUTE_MAP } from '../constants/sessionRouting.js';
import DashboardPage from '../pages/DashboardPage.jsx';

// ── T012: routeForSessionType unit tests ─────────────────────────────────────

describe('routeForSessionType', () => {
  it('returns /race for R', () => {
    expect(routeForSessionType('R')).toBe('/race');
  });

  it('returns /race for S (sprint)', () => {
    expect(routeForSessionType('S')).toBe('/race');
  });

  it('returns /qualifying for Q', () => {
    expect(routeForSessionType('Q')).toBe('/qualifying');
  });

  it('returns /qualifying for SQ (sprint qualifying)', () => {
    expect(routeForSessionType('SQ')).toBe('/qualifying');
  });

  it('returns /race for FP1', () => {
    expect(routeForSessionType('FP1')).toBe('/race');
  });

  it('returns /race for FP2', () => {
    expect(routeForSessionType('FP2')).toBe('/race');
  });

  it('returns /race for FP3', () => {
    expect(routeForSessionType('FP3')).toBe('/race');
  });

  it('falls back to /race for unknown session type', () => {
    expect(routeForSessionType('UNKNOWN')).toBe('/race');
  });

  it('SESSION_ROUTE_MAP covers all expected types', () => {
    const expected = ['R', 'S', 'Q', 'SQ', 'FP1', 'FP2', 'FP3'];
    expected.forEach((type) => {
      expect(SESSION_ROUTE_MAP).toHaveProperty(type);
    });
  });
});

// ── T013: DashboardPage render tests ─────────────────────────────────────────

// Mock hooks so we don't need a running backend
vi.mock('../hooks/useSession.js', () => ({
  useSchedule: () => ({ data: null, isLoading: false }),
}));

vi.mock('../hooks/useChampionship.js', () => ({
  useStandings: () => ({ data: null, isLoading: false }),
}));

vi.mock('../context/SessionContext.jsx', () => ({
  useSessionContext: () => ({
    activeSession: null,
    setActiveSession: vi.fn(),
    recentSessions: [],
  }),
  SessionProvider: ({ children }) => children,
}));

function renderDashboard() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={['/']}>
        <DashboardPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the session selector button', () => {
    renderDashboard();
    expect(screen.getByRole('button', { name: /select session/i })).toBeInTheDocument();
  });

  it('renders the Tracks card link', () => {
    renderDashboard();
    expect(screen.getByText(/explore circuits/i)).toBeInTheDocument();
  });

  it('renders the Tracks card as a link to /track', () => {
    renderDashboard();
    const link = screen.getByRole('link', { name: /explore circuits/i });
    expect(link).toHaveAttribute('href', '/track');
  });

  it('renders the upcoming race section heading', () => {
    renderDashboard();
    expect(screen.getByText(/next race/i)).toBeInTheDocument();
  });

  it('renders the standings section heading', () => {
    renderDashboard();
    const matches = screen.getAllByText(/standings/i);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('shows "No upcoming events" when schedule returns null', () => {
    renderDashboard();
    expect(screen.getByText(/no upcoming events/i)).toBeInTheDocument();
  });

  it('shows "No standings data" when standings returns null', () => {
    renderDashboard();
    expect(screen.getByText(/no standings data/i)).toBeInTheDocument();
  });

  it('opens the session selector dialog when button is clicked', async () => {
    renderDashboard();
    const button = screen.getByRole('button', { name: /select session/i });
    await userEvent.click(button);
    expect(screen.getByRole('dialog', { name: /select session/i })).toBeInTheDocument();
  });
});
