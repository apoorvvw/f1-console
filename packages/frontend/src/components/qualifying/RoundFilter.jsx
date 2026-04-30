import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const ROUNDS = ['All', 'Q1', 'Q2', 'Q3'];

export default function RoundFilter({ value, onChange }) {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={(_, newValue) => {
        if (newValue !== null) onChange(newValue);
      }}
      size="small"
      aria-label="qualifying round filter"
    >
      {ROUNDS.map((r) => (
        <ToggleButton key={r} value={r} aria-label={r}>
          {r}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
