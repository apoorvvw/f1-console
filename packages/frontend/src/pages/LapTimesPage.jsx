import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import { useSessionContext } from '../context/SessionContext.jsx';
import { useSessionInfo } from '../hooks/useSession.js';
import { useLapDistribution, useDriverComparison } from '../hooks/useLapTimes.js';
import LapFilters from '../components/lapTimes/LapFilters.jsx';
import LapDistributionChart from '../components/lapTimes/LapDistributionChart.jsx';
import DriverComparisonChart from '../components/lapTimes/DriverComparisonChart.jsx';

export default function LapTimesPage() {
  const { activeSession } = useSessionContext();
  const { year, event, sessionType } = activeSession ?? {};

  const { data: sessionInfo } = useSessionInfo(year, event, sessionType);
  const drivers = sessionInfo?.drivers ?? [];
  const maxLap = sessionInfo?.total_laps ?? 70;

  const [filters, setFilters] = useState({
    selectedDrivers: [],
    compound: 'All',
    lapRange: [1, maxLap],
    maxLap,
  });

  const { data: distData, isLoading: distLoading, error: distError } = useLapDistribution(year, event);
  const { data: compData, isLoading: compLoading } = useDriverComparison(
    year,
    event,
    sessionType,
    filters.selectedDrivers,
  );

  if (!activeSession) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No session selected. Use the <strong>Select Session</strong> button to choose a race or
        qualifying session.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Lap Times — {year} {event} ({sessionType})
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <LapFilters
          drivers={drivers}
          filters={{ ...filters, maxLap }}
          onChange={(f) => setFilters(f)}
        />
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Lap Time Distribution
            </Typography>
            <LapDistributionChart
              data={distData}
              isLoading={distLoading}
              error={distError}
              filters={filters}
            />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Driver Comparison
            </Typography>
            <DriverComparisonChart
              data={compData}
              isLoading={compLoading}
              selectedDrivers={filters.selectedDrivers}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
