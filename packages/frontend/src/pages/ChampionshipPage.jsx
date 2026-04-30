import { useState, useMemo, useEffect } from 'react';
import { useStandings, useWdcScenarios } from '../hooks/useChampionship.js';
import { useSchedule } from '../hooks/useSession.js';
import { useSessionContext } from '../context/SessionContext.jsx';
import RoundSelector from '../components/championship/RoundSelector.jsx';
import StandingsTable from '../components/championship/StandingsTable.jsx';
import ConstructorsTable from '../components/championship/ConstructorsTable.jsx';
import ScenarioPanel from '../components/championship/ScenarioPanel.jsx';
import Card from '../components/ui/Card.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';

const FALLBACK_YEAR = new Date().getFullYear();

function deriveCurrentRound(schedule) {
  if (!schedule?.length) return null;
  const today = new Date().toISOString().split('T')[0];
  const past = schedule.filter((e) => e.EventDate <= today);
  // Use completed rounds for current year; fall back to full schedule for future/unstarted years
  const pool = past.length > 0 ? past : schedule;
  return pool.reduce((max, e) => (e.RoundNumber > max ? e.RoundNumber : max), 0);
}

export default function ChampionshipPage() {
  const { activeSession } = useSessionContext();
  const year = activeSession?.year ?? FALLBACK_YEAR;
  const [selectedDriver, setSelectedDriver] = useState(null);

  const { data: schedule } = useSchedule(year);
  const currentRound = useMemo(() => deriveCurrentRound(schedule), [schedule]);

  const [selectedRound, setSelectedRound] = useState(null);
  // Reset manual round selection whenever the year changes
  useEffect(() => { setSelectedRound(null); }, [year]);
  const round = selectedRound ?? currentRound ?? 1;

  const { data: standingsData, isLoading: standingsLoading, error } = useStandings(year, round);
  const { data: wdcData } = useWdcScenarios(year, round);

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
          value={round}
          totalRounds={totalRounds}
          onChange={setSelectedRound}
        />
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2 px-1">Drivers Championship</h2>
          <Card className="p-4">
            <StandingsTable
              standings={standingsData?.drivers}
              wdcScenarios={wdcData}
              isLoading={standingsLoading}
              isSeasonOver={isSeasonOver}
              onDriverSelect={setSelectedDriver}
            />
          </Card>
        </div>

        <div>
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2 px-1">Constructors Championship</h2>
          <Card className="p-4">
            <ConstructorsTable
              constructors={standingsData?.constructors}
              isLoading={standingsLoading}
              isSeasonOver={isSeasonOver}
            />
          </Card>
        </div>
      </div>

      <ScenarioPanel
        driver={selectedDriver}
        wdcScenarios={wdcData}
        onClose={() => setSelectedDriver(null)}
      />
    </div>
  );
}

