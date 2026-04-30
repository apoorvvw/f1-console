import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const COMPOUNDS = ['All', 'SOFT', 'MEDIUM', 'HARD', 'INTERMEDIATE', 'WET'];

export default function LapFilters({ drivers = [], filters, onChange }) {
  const { selectedDrivers, compound, lapRange, maxLap } = filters;

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <Autocomplete
        multiple
        options={drivers}
        value={selectedDrivers}
        onChange={(_, value) => onChange({ ...filters, selectedDrivers: value })}
        renderInput={(params) => (
          <TextField {...params} label="Drivers" size="small" sx={{ minWidth: 200 }} />
        )}
        size="small"
        sx={{ minWidth: 200 }}
      />

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel id="compound-label">Compound</InputLabel>
        <Select
          labelId="compound-label"
          label="Compound"
          value={compound}
          onChange={(e) => onChange({ ...filters, compound: e.target.value })}
        >
          {COMPOUNDS.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ minWidth: 200, px: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Lap Range: {lapRange[0]}–{lapRange[1]}
        </Typography>
        <Slider
          value={lapRange}
          min={1}
          max={maxLap || 70}
          onChange={(_, value) => onChange({ ...filters, lapRange: value })}
          valueLabelDisplay="auto"
          size="small"
          aria-label="lap range filter"
        />
      </Box>
    </Stack>
  );
}
