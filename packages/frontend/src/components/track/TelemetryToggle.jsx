import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const METRICS = [
  { value: 'speed', label: 'Speed' },
  { value: 'throttle', label: 'Throttle' },
  { value: 'brake', label: 'Brake' },
];

export default function TelemetryToggle({ value, onChange }) {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={(_, newValue) => {
        if (newValue !== null) onChange(newValue);
      }}
      size="small"
      aria-label="telemetry metric"
    >
      {METRICS.map((m) => (
        <ToggleButton key={m.value} value={m.value} aria-label={m.label}>
          {m.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
