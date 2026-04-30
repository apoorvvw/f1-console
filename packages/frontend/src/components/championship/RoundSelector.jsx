import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';

export default function RoundSelector({ value, totalRounds, onChange }) {
  const max = totalRounds || 24;

  return (
    <Box sx={{ px: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Round {value} of {max}
      </Typography>
      <Slider
        value={value}
        min={1}
        max={max}
        step={1}
        marks
        onChange={(_, v) => onChange(v)}
        valueLabelDisplay="auto"
        aria-label="championship round selector"
      />
    </Box>
  );
}
