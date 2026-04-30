import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { ResponsiveBar } from '@nivo/bar';

function formatTime(seconds) {
  if (seconds == null) return '—';
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(3).padStart(6, '0');
  return `${mins}:${secs}`;
}

export default function DriverStatsCard({ driver }) {
  if (!driver) return null;

  const barData = [
    { round: 'Q1', seconds: driver.q1_seconds },
    { round: 'Q2', seconds: driver.q2_seconds },
    { round: 'Q3', seconds: driver.q3_seconds },
  ].filter((d) => d.seconds != null);

  const minVal = barData.length ? Math.min(...barData.map((d) => d.seconds)) - 0.5 : 0;
  const teamColor = driver.team_color ?? '#1976d2';

  return (
    <Box sx={{ px: 2, pt: 2, pb: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.25 }}>
        <Typography variant="h6" fontWeight={700} lineHeight={1}>
          {driver.driver}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {driver.full_name}
        </Typography>
      </Box>

      <Typography
        variant="caption"
        sx={{ display: 'block', mb: 1.5, color: teamColor, fontWeight: 600 }}
      >
        {driver.team}
      </Typography>

      <Divider sx={{ mb: 1.5, borderColor: 'rgba(255,255,255,0.08)' }} />

      <Typography variant="subtitle2" sx={{ mb: 0.75, color: 'rgba(255,255,255,0.5)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        Session Times
      </Typography>

      {['Q1', 'Q2', 'Q3'].map((q) => {
        const val = driver[q.toLowerCase() + '_seconds'];
        return (
          <Box key={q} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4 }}>
            <Typography variant="body2" color="text.secondary">
              {q}
            </Typography>
            <Typography variant="body2" fontWeight={val != null ? 500 : 400} color={val != null ? 'text.primary' : 'text.secondary'}>
              {formatTime(val)}
            </Typography>
          </Box>
        );
      })}

      <Divider sx={{ my: 1.25, borderColor: 'rgba(255,255,255,0.08)' }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4 }}>
        <Typography variant="body2" color="text.secondary">Best lap</Typography>
        <Typography variant="body2" fontWeight={600}>{formatTime(driver.lap_time_seconds)}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4 }}>
        <Typography variant="body2" color="text.secondary">Δ Pole</Typography>
        <Typography variant="body2" fontWeight={500}>
          {driver.delta_to_pole_seconds === 0 ? 'POLE' : `+${driver.delta_to_pole_seconds?.toFixed(3)}`}
        </Typography>
      </Box>

      {barData.length > 1 && (
        <Box sx={{ height: 160, mt: 2 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 10 }}>
            Progression
          </Typography>
          <ResponsiveBar
            data={barData}
            keys={['seconds']}
            indexBy="round"
            minValue={minVal}
            margin={{ top: 8, right: 8, bottom: 36, left: 64 }}
            padding={0.4}
            colors={[teamColor]}
            axisLeft={{
              format: (v) => v.toFixed(1),
              legend: 'Time (s)',
              legendOffset: -52,
              legendPosition: 'middle',
            }}
            axisBottom={{ legend: 'Session', legendOffset: 28, legendPosition: 'middle' }}
            theme={{
              axis: { ticks: { text: { fill: 'rgba(255,255,255,0.5)', fontSize: 10 } }, legend: { text: { fill: 'rgba(255,255,255,0.4)', fontSize: 10 } } },
            }}
            tooltip={({ indexValue, value }) => (
              <span style={{ fontSize: 11, color: '#fff', background: 'rgba(0,0,0,0.8)', padding: '2px 6px', borderRadius: 4 }}>
                {indexValue}: {value?.toFixed(3)}s
              </span>
            )}
          />
        </Box>
      )}
    </Box>
  );
}
