import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';

export default function ScenarioPanel({ driver, wdcScenarios, onClose }) {
  const open = !!driver;

  const contender = wdcScenarios?.contenders?.find((c) => c.driver === driver?.driver);
  const remainingRaces = wdcScenarios?.remaining_races ?? 0;

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 360, p: 2 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">{driver?.driver}</Typography>
        <IconButton onClick={onClose} aria-label="close scenario panel" size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        {driver?.constructor}
      </Typography>

      <Divider sx={{ my: 1.5 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
        <Typography variant="body2">Current Points</Typography>
        <Typography variant="body2" fontWeight={600}>
          {driver?.points}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
        <Typography variant="body2">Wins</Typography>
        <Typography variant="body2" fontWeight={600}>
          {driver?.wins}
        </Typography>
      </Box>

      {contender ? (
        <>
          <Divider sx={{ my: 1.5 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
            <Typography variant="body2">Max Possible Points</Typography>
            <Typography variant="body2" fontWeight={600}>
              {contender.max_possible_points}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
            <Typography variant="body2">Points Behind Leader</Typography>
            <Typography variant="body2" fontWeight={600} color="error">
              {contender.points_behind_leader > 0 ? `-${contender.points_behind_leader}` : '—'}
            </Typography>
          </Box>

          <Divider sx={{ my: 1.5 }} />
          <Typography variant="body2" color="text.secondary">
            Needs{' '}
            <strong>{contender.points_behind_leader}</strong> points from{' '}
            <strong>{remainingRaces}</strong> remaining{' '}
            {remainingRaces === 1 ? 'race' : 'races'}.
            {contender.points_behind_leader === 0 && ' Already champion!'}
          </Typography>
        </>
      ) : (
        <>
          <Divider sx={{ my: 1.5 }} />
          <Typography variant="body2" color="text.secondary">
            This driver can no longer mathematically win the championship.
          </Typography>
        </>
      )}
    </Drawer>
  );
}
