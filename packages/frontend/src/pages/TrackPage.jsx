import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import { useSessionContext } from '../context/SessionContext.jsx';
import { useSessionInfo } from '../hooks/useSession.js';
import { useLapTelemetry, useCornerAnnotations } from '../hooks/useTrack.js';
import LapSelector from '../components/track/LapSelector.jsx';
import TelemetryToggle from '../components/track/TelemetryToggle.jsx';
import TrackMap from '../components/track/TrackMap.jsx';

export default function TrackPage() {
  const { activeSession } = useSessionContext();
  const { year, event, sessionType } = activeSession ?? {};

  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedLap, setSelectedLap] = useState(null);
  const [metric, setMetric] = useState('speed');
  const [showCorners, setShowCorners] = useState(true);

  const { data: sessionInfo } = useSessionInfo(year, event, sessionType);
  const drivers = sessionInfo?.drivers ?? [];

  const { data: telemetry, isLoading: telLoading, error: telError } = useLapTelemetry(
    year,
    event,
    sessionType,
    selectedDriver || null,
    selectedLap,
  );

  const { data: cornersData } = useCornerAnnotations(year, event);

  if (!activeSession) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No session selected. Use the <strong>Select Session</strong> button to choose a session.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Track Visualization — {year} {event} ({sessionType})
      </Typography>

      <Grid container spacing={2}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Driver
            </Typography>
            <FormControl size="small" fullWidth sx={{ mb: 2 }}>
              <InputLabel id="driver-select-label">Driver</InputLabel>
              <Select
                labelId="driver-select-label"
                label="Driver"
                value={selectedDriver}
                onChange={(e) => { setSelectedDriver(e.target.value); setSelectedLap(null); }}
              >
                <MenuItem value="">— Select —</MenuItem>
                {drivers.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <LapSelector
              lapCount={sessionInfo?.total_laps ?? 0}
              value={selectedLap}
              onChange={setSelectedLap}
            />

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Metric
            </Typography>
            <TelemetryToggle value={metric} onChange={setMetric} />

            <FormControlLabel
              control={
                <Switch
                  checked={showCorners}
                  onChange={(e) => setShowCorners(e.target.checked)}
                  size="small"
                />
              }
              label="Corner annotations"
              sx={{ mt: 2, display: 'flex' }}
            />

            {telemetry && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Lap time: {telemetry.lap_time_seconds?.toFixed(3)}s
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Map area */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 1 }}>
            {telError && <Alert severity="error">{telError.message}</Alert>}
            {!selectedDriver && !telLoading && (
              <Alert severity="info">Select a driver to view the track map.</Alert>
            )}
            <TrackMap
              points={telemetry?.telemetry}
              corners={cornersData?.corners}
              metric={metric}
              showCorners={showCorners}
              isLoading={telLoading}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
