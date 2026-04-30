import { useState } from 'react';
import { useSessionContext } from '../context/SessionContext.jsx';
import { usePositionChanges, useTeamPace, useDriverLaps, useDriverComparison } from '../hooks/useRace.js';
import Card from '../components/ui/Card.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import InfoAlert from '../components/ui/InfoAlert.jsx';
import PositionChangesChart from '../components/race/PositionChangesChart.jsx';
import TeamPaceChart from '../components/race/TeamPaceChart.jsx';
import DriverLapScatterplot from '../components/race/DriverLapScatterplot.jsx';
import DriverComparisonChart from '../components/race/DriverComparisonChart.jsx';
import DriverSelector from '../components/race/DriverSelector.jsx';

export default function RacePage() {
  const { activeSession } = useSessionContext();
  const { year, event } = activeSession ?? {};

  const [selectedDrivers, setSelectedDrivers] = useState(new Set());
  const [selectedTeam, setSelectedTeam] = useState(null);

  const { data: positionData, isLoading: positionLoading } = usePositionChanges(year, event);
  const { data: teamPaceData, isLoading: teamPaceLoading } = useTeamPace(year, event);

  const singleDriver = selectedDrivers.size === 1 ? [...selectedDrivers][0] : null;
  const { data: driverLapsData, isLoading: driverLapsLoading } = useDriverLaps(year, event, singleDriver);
  const { data: comparisonData, isLoading: comparisonLoading } = useDriverComparison(year, event, selectedDrivers);

  const handleDriverToggle = (abbreviation) => {
    setSelectedDrivers((prev) => {
      const next = new Set(prev);
      if (next.has(abbreviation)) {
        next.delete(abbreviation);
      } else {
        next.add(abbreviation);
      }
      return next;
    });
  };

  const handleTeamClick = (team) => {
    setSelectedTeam((prev) => (prev === team ? null : team));
  };

  const handleClearSelection = () => {
    setSelectedDrivers(new Set());
    setSelectedTeam(null);
  };

  if (!activeSession) {
    return (
      <InfoAlert>
        No session selected. Use the <strong className="text-white/70">Select Session</strong> button to choose a race session.
      </InfoAlert>
    );
  }

  const hasSelection = selectedDrivers.size > 0 || selectedTeam !== null;

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <PageHeader
          title="Race"
          subtitle={`${event} · ${year} · Race`}
          badge="Live Data"
        />
        {hasSelection && (
          <button
            onClick={handleClearSelection}
            className="mt-1 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/15 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
            aria-label="Clear all selections"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Clear
          </button>
        )}
      </div>

      {/* Driver selector */}
      <DriverSelector
        drivers={positionData?.drivers ?? []}
        selectedDrivers={selectedDrivers}
        onDriverToggle={handleDriverToggle}
      />

      {/* Top row: 2-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        {/* Position Changes */}
        <Card className="p-4" aria-label="Position changes chart">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">
            Position Changes
          </h2>
          <PositionChangesChart
            data={positionData}
            isLoading={positionLoading}
            selectedDrivers={selectedDrivers}
            selectedTeam={selectedTeam}
            onDriverToggle={handleDriverToggle}
          />
        </Card>

        {/* Driver Analysis Panel */}
        <Card className="p-4" aria-label="Driver analysis panel">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">
            {selectedDrivers.size >= 2
              ? 'Driver Comparison'
              : singleDriver
              ? `${singleDriver} — Lap Times`
              : 'Driver Analysis'}
          </h2>
          {selectedDrivers.size >= 2 ? (
            <div key="comparison" className="transition-opacity duration-300 opacity-100">
              <DriverComparisonChart
                data={comparisonData}
                isLoading={comparisonLoading}
                selectedDrivers={selectedDrivers}
              />
            </div>
          ) : singleDriver ? (
            <div key="scatter" className="transition-opacity duration-300 opacity-100">
              <DriverLapScatterplot
                data={driverLapsData}
                isLoading={driverLapsLoading}
                driver={singleDriver}
              />
            </div>
          ) : (
            <div key="hint" className="h-[340px] flex items-center justify-center text-white/30 text-sm transition-opacity duration-300 opacity-100">
              Click a driver line to see their lap times
            </div>
          )}
        </Card>
      </div>

      {/* Bottom row: full-width Team Pace */}
      <Card className="p-4" aria-label="Team pace ranking chart">
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">
          Team Pace Ranking
        </h2>
        <TeamPaceChart
          data={teamPaceData}
          isLoading={teamPaceLoading}
          selectedTeam={selectedTeam}
          onTeamClick={handleTeamClick}
        />
      </Card>
    </div>
  );
}
