import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DriverStatsCard from '../components/qualifying/DriverStatsCard';

const mockDriver = {
  driver: 'VER',
  full_name: 'Max Verstappen',
  team: 'Red Bull Racing',
  team_color: '#FF1801',
  lap_time_seconds: 88.0,
  delta_to_pole_seconds: 0,
  q1_seconds: 90.123,
  q2_seconds: 89.456,
  q3_seconds: 88.0,
};

describe('DriverStatsCard', () => {
  it('renders nothing when driver prop is null', () => {
    const { container } = render(<DriverStatsCard driver={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders driver abbreviation and full name when driver is set', () => {
    render(<DriverStatsCard driver={mockDriver} />);
    expect(screen.getByText('VER')).toBeInTheDocument();
    expect(screen.getByText('Max Verstappen')).toBeInTheDocument();
  });

  it('renders team name', () => {
    render(<DriverStatsCard driver={mockDriver} />);
    expect(screen.getByText('Red Bull Racing')).toBeInTheDocument();
  });

  it('renders Q1, Q2, Q3 time rows', () => {
    render(<DriverStatsCard driver={mockDriver} />);
    expect(screen.getByText('Q1')).toBeInTheDocument();
    expect(screen.getByText('Q2')).toBeInTheDocument();
    expect(screen.getByText('Q3')).toBeInTheDocument();
  });

  it('shows dash for rounds with no time', () => {
    const driverNoQ2 = { ...mockDriver, q2_seconds: null, q3_seconds: null };
    render(<DriverStatsCard driver={driverNoQ2} />);
    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBeGreaterThanOrEqual(2);
  });

  it('renders POLE for delta_to_pole_seconds of 0', () => {
    render(<DriverStatsCard driver={mockDriver} />);
    expect(screen.getByText('POLE')).toBeInTheDocument();
  });

  it('renders delta value for non-pole drivers', () => {
    const driver2 = { ...mockDriver, driver: 'NOR', delta_to_pole_seconds: 1.234 };
    render(<DriverStatsCard driver={driver2} />);
    expect(screen.getByText('+1.234')).toBeInTheDocument();
  });

  it('renders mini Nivo bar chart only when driver has 2+ participating rounds', () => {
    // VER participates in Q1, Q2, Q3 — chart section should render
    const { container: fullContainer } = render(<DriverStatsCard driver={mockDriver} />);
    expect(within(fullContainer).queryByText('Progression')).toBeInTheDocument();

    // Driver with only Q1 — no chart (barData.length > 1 is false)
    const oneRoundDriver = { ...mockDriver, q2_seconds: null, q3_seconds: null };
    const { container: oneContainer } = render(<DriverStatsCard driver={oneRoundDriver} />);
    expect(within(oneContainer).queryByText('Progression')).toBeNull();
  });
});
