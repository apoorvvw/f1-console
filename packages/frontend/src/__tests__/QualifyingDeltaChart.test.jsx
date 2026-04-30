import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import QualifyingDeltaChart from '../components/qualifying/QualifyingDeltaChart';

const mockResults = [
  {
    driver: 'VER',
    full_name: 'Max Verstappen',
    team: 'Red Bull Racing',
    team_color: '#FF1801',
    lap_time_seconds: 88.0,
    delta_to_pole_seconds: 0,
    q1_seconds: 90.0,
    q2_seconds: 89.0,
    q3_seconds: 88.0,
  },
  {
    driver: 'NOR',
    full_name: 'Lando Norris',
    team: 'McLaren',
    team_color: '#FF8000',
    lap_time_seconds: 89.0,
    delta_to_pole_seconds: 1.0,
    q1_seconds: 91.0,
    q2_seconds: 90.0,
    q3_seconds: 89.0,
  },
  {
    driver: 'LEC',
    full_name: 'Charles Leclerc',
    team: 'Ferrari',
    team_color: '#E8002D',
    lap_time_seconds: 89.5,
    delta_to_pole_seconds: 1.5,
    q1_seconds: 91.5,
    q2_seconds: null,
    q3_seconds: null,
  },
];

describe('QualifyingDeltaChart', () => {
  it('renders one bar button per driver in All mode', () => {
    render(
      <QualifyingDeltaChart
        results={mockResults}
        selectedDriver={null}
        onDriverSelect={() => {}}
        roundFilter="All"
        isLoading={false}
      />,
    );
    const bars = screen.getAllByRole('button', { name: /gap/i });
    expect(bars).toHaveLength(3);
  });

  it('marks the selected driver bar as aria-pressed=true', () => {
    render(
      <QualifyingDeltaChart
        results={mockResults}
        selectedDriver={mockResults[0]}
        onDriverSelect={() => {}}
        roundFilter="All"
        isLoading={false}
      />,
    );
    const verBar = screen.getByRole('button', { name: /VER gap/i });
    expect(verBar).toHaveAttribute('aria-pressed', 'true');

    const norBar = screen.getByRole('button', { name: /NOR gap/i });
    expect(norBar).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onDriverSelect with the row on bar click', () => {
    const onSelect = vi.fn();
    render(
      <QualifyingDeltaChart
        results={mockResults}
        selectedDriver={null}
        onDriverSelect={onSelect}
        roundFilter="All"
        isLoading={false}
      />,
    );
    const norBar = screen.getByRole('button', { name: /NOR gap/i });
    fireEvent.click(norBar);
    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect.mock.calls[0][0].driver).toBe('NOR');
  });

  it('calls onDriverSelect with null when clicking the already-selected driver', () => {
    const onSelect = vi.fn();
    render(
      <QualifyingDeltaChart
        results={mockResults}
        selectedDriver={mockResults[0]}
        onDriverSelect={onSelect}
        roundFilter="All"
        isLoading={false}
      />,
    );
    const verBar = screen.getByRole('button', { name: /VER gap/i });
    fireEvent.click(verBar);
    expect(onSelect).toHaveBeenCalledWith(null);
  });

  it('renders a Skeleton when isLoading is true', () => {
    const { container } = render(
      <QualifyingDeltaChart
        results={[]}
        selectedDriver={null}
        onDriverSelect={() => {}}
        roundFilter="All"
        isLoading={true}
      />,
    );
    // MUI Skeleton renders as a span with MuiSkeleton class
    const skeleton = container.querySelector('.MuiSkeleton-root');
    expect(skeleton).toBeTruthy();
  });

  it('shows informational note when no drivers participated in selected round', () => {
    // LEC has no Q2 time — only VER and NOR have Q2
    const resultsWithMissingQ2 = mockResults.map((r) =>
      r.driver === 'LEC' ? { ...r, q2_seconds: null } : r,
    );
    render(
      <QualifyingDeltaChart
        results={resultsWithMissingQ2}
        selectedDriver={{ ...mockResults[2], q2_seconds: null }}
        onDriverSelect={() => {}}
        roundFilter="Q2"
        isLoading={false}
      />,
    );
    expect(screen.getByText(/did not participate in Q2/i)).toBeInTheDocument();
  });
});
