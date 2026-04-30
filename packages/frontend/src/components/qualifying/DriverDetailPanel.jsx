import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { ResponsiveBar } from '@nivo/bar';

function formatTime(seconds) {
  if (seconds == null) return null;
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(3).padStart(6, '0');
  return `${mins}:${secs}`;
}

export default function DriverDetailPanel({ driver, onClose }) {
  const open = !!driver;

  const barData = driver
    ? [
        { round: 'Q1', seconds: driver.q1_seconds },
        { round: 'Q2', seconds: driver.q2_seconds },
        { round: 'Q3', seconds: driver.q3_seconds },
      ].filter((d) => d.seconds != null)
    : [];

  const minVal = barData.length ? Math.min(...barData.map((d) => d.seconds)) - 0.5 : 0;

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 360, p: 2 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">{driver?.driver ?? ''}</Typography>
        <IconButton onClick={onClose} aria-label="close panel" size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        {driver?.team}
      </Typography>

      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
        Session Times
      </Typography>

      {['Q1', 'Q2', 'Q3'].map((q) => {
        const val = driver?.[q.toLowerCase() + '_seconds'];
        return (
          <Box key={q} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
            <Typography variant="body2">{q}</Typography>
            <Typography variant="body2" fontWeight={500}>
              {formatTime(val) ?? '—'}
            </Typography>
          </Box>
        );
      })}

      {barData.length > 1 && (
        <Box sx={{ height: 200, mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Progression
          </Typography>
          <ResponsiveBar
            data={barData}
            keys={['seconds']}
            indexBy="round"
            minValue={minVal}
            margin={{ top: 10, right: 10, bottom: 40, left: 70 }}
            padding={0.4}
            colors={['#1976d2']}
            axisLeft={{
              format: (v) => v.toFixed(1),
              legend: 'Time (s)',
              legendOffset: -56,
              legendPosition: 'middle',
            }}
            axisBottom={{ legend: 'Session', legendOffset: 32, legendPosition: 'middle' }}
            tooltip={({ indexValue, value }) => (
              <span style={{ fontSize: 12 }}>
                {indexValue}: {value?.toFixed(3)}s
              </span>
            )}
          />
        </Box>
      )}
    </Drawer>
  );
}
