import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function LapSelector({ lapCount = 0, value, onChange }) {
  return (
    <FormControl size="small" fullWidth>
      <InputLabel id="lap-select-label">Lap</InputLabel>
      <Select
        labelId="lap-select-label"
        label="Lap"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
      >
        <MenuItem value="">Fastest Lap</MenuItem>
        {Array.from({ length: lapCount }, (_, i) => i + 1).map((n) => (
          <MenuItem key={n} value={n}>
            Lap {n}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
