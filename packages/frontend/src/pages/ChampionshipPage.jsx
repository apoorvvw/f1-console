import { useState } from 'react';
import { useStandings, useWdcScenarios } from '../hooks/useChampionship.js';
import RoundSelector from '../components/championship/RoundSelector.jsx';
import StandingsTable from '../components/championship/StandingsTable.jsx';
import ScenarioPanel from '../components/championship/ScenarioPanel.jsx';
import Card from '../components/ui/Card.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';

const DEFAULT_YEAR = 2025;

export default function ChampionshipPage() {
  const [year] = useState(DEFAULT_YEAR);
  const [selectedRound, setSelectedRound] = useState(1);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const { data: standingsData, isLoading: standingsLoading, error } = useStandings(year, selectedRound);
  const { data: wdcData } = useWdcScenarios(year, selectedRound);

  const totalRounds = standingsData?.total_rounds ?? 24;
  const remainingRaces = wdcData?.remaining_races ?? 0;
  const isSeasonOver = remainingRaces === 0;

  if (error) {
    return <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300 mt-4">{error.message}</div>;
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Championship Standings"
        subtitle={String(year)}
        badge={isSeasonOver ? 'Season Complete' : `${remainingRaces} Races Remaining`}
      />

      <Card className="p-4 mb-4">
        <RoundSelector
          value={selectedRound}
          totalRounds={totalRounds}
          onChange={setSelectedRound}
        />
      </Card>

      <Card className="p-4">
        <StandingsTable
          standings={standingsData?.standings}
          wdcScenarios={wdcData}
          isLoading={standingsLoading}
          isSeasonOver={isSeasonOver}
          onDriverSelect={setSelectedDriver}
        />
      </Card>

      <ScenarioPanel
        driver={selectedDriver}
        wdcScenarios={wdcData}
        onClose={() => setSelectedDriver(null)}
      />
    </div>
  );
}

