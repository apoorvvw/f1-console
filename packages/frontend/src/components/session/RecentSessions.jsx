import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useSessionContext } from '../../context/SessionContext.jsx';

export default function RecentSessions() {
  const { recentSessions, setActiveSession } = useSessionContext();

  if (!recentSessions.length) return null;

  return (
    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
      <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
        Recent:
      </Typography>
      {recentSessions.map((s) => (
        <Chip
          key={`${s.year}-${s.event}-${s.sessionType}`}
          label={`${s.event} ${s.year} – ${s.sessionType}`}
          size="small"
          onClick={() => setActiveSession(s)}
          clickable
        />
      ))}
    </Stack>
  );
}
