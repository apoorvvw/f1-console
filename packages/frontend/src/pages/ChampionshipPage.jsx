import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import { useStandings, useWdcScenarios } from '../hooks/useChampionship.js';
import { useSchedule } from '../hooks/useSession.js';
import RoundSelector from '../components/championship/RoundSelector.jsx';
import StandingsTable from '../components/championship/StandingsTable.jsx';
import ScenarioPanel from '../components/championship/ScenarioPanel.jsx';

const DEFAULT_YEAR = new Date().getFullYear();

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
    return <Alert severity="error" sx={{ mt: 2 }}>{error.message}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Championship Standings — {year}
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <RoundSelector
          value={selectedRound}
          totalRounds={totalRounds}
          onChange={setSelectedRound}
        />
      </Paper>

      <Paper sx={{ p: 2 }}>
        <StandingsTable
          standings={standingsData?.standings}
          wdcScenarios={wdcData}
          isLoading={standingsLoading}
          isSeasonOver={isSeasonOver}
          onDriverSelect={setSelectedDriver}
        />
      </Paper>

      <ScenarioPanel
        driver={selectedDriver}
        wdcScenarios={wdcData}
        onClose={() => setSelectedDriver(null)}
      />
    </Box>
  );
}
