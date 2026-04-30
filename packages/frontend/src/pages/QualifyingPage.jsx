import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { useSessionContext } from '../context/SessionContext.jsx';
import { useQualifyingResults } from '../hooks/useQualifying.js';
import RoundFilter from '../components/qualifying/RoundFilter.jsx';
import QualifyingTable from '../components/qualifying/QualifyingTable.jsx';
import DriverDetailPanel from '../components/qualifying/DriverDetailPanel.jsx';

export default function QualifyingPage() {
  const { activeSession } = useSessionContext();
  const { year, event } = activeSession ?? {};

  const [roundFilter, setRoundFilter] = useState('All');
  const [selectedDriver, setSelectedDriver] = useState(null);

  const { data, isLoading, error } = useQualifyingResults(year, event);

  if (!activeSession) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No session selected. Use the <strong>Select Session</strong> button to choose a qualifying
        session.
      </Alert>
    );
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Qualifying — {event} ({year})
      </Typography>

      <Paper sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Filter by round:</Typography>
          <RoundFilter value={roundFilter} onChange={setRoundFilter} />
        </Stack>

        <QualifyingTable
          results={data?.results}
          isLoading={isLoading}
          roundFilter={roundFilter}
          onDriverSelect={setSelectedDriver}
        />
      </Paper>

      <DriverDetailPanel driver={selectedDriver} onClose={() => setSelectedDriver(null)} />
    </Box>
  );
}
