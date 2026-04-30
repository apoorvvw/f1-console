const METRICS = [
  { value: 'speed', label: 'Speed' },
  { value: 'throttle', label: 'Throttle' },
  { value: 'brake', label: 'Brake' },
];

export default function TelemetryToggle({ value, onChange }) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label="telemetry metric">
      {METRICS.map((m) => (
        <button
          key={m.value}
          onClick={() => onChange(m.value)}
          aria-pressed={value === m.value}
          className={[
            'flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200',
            value === m.value
              ? 'bg-[rgba(239,35,60,0.15)] text-[#ef233c] border-[rgba(239,35,60,0.4)]'
              : 'bg-white/5 text-white/50 border-white/10 hover:text-white hover:bg-white/10',
          ].join(' ')}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
