import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const COMPOUNDS = ['All', 'SOFT', 'MEDIUM', 'HARD', 'INTERMEDIATE', 'WET'];

export default function LapFilters({ drivers = [], filters, onChange }) {
  const { selectedDrivers, compound, lapRange, maxLap } = filters;

  return (
    <div className="flex flex-wrap gap-4 items-start">
      {/* Driver multi-select — keep MUI Autocomplete for accessibility */}
      <Autocomplete
        multiple
        options={drivers}
        value={selectedDrivers}
        onChange={(_, value) => onChange({ ...filters, selectedDrivers: value })}
        renderInput={(params) => (
          <TextField {...params} label="Drivers" size="small" />
        )}
        size="small"
        sx={{ minWidth: 200 }}
      />

      {/* Compound filter */}
      <div className="flex items-center gap-1 flex-wrap" role="group" aria-label="tyre compound filter">
        {COMPOUNDS.map((c) => (
          <button
            key={c}
            onClick={() => onChange({ ...filters, compound: c })}
            aria-pressed={compound === c}
            className={[
              'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200',
              compound === c
                ? 'bg-[rgba(239,35,60,0.15)] text-[#ef233c] border-[rgba(239,35,60,0.4)]'
                : 'bg-white/5 text-white/50 border-white/10 hover:text-white hover:bg-white/10',
            ].join(' ')}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Lap range slider */}
      <div className="min-w-[200px]">
        <p className="text-xs text-white/40 mb-2">
          Lap Range: <span className="text-white/70">{lapRange[0]}–{lapRange[1]}</span>
        </p>
        <input
          type="range"
          min={1}
          max={maxLap || 70}
          value={lapRange[1]}
          onChange={(e) => onChange({ ...filters, lapRange: [lapRange[0], Number(e.target.value)] })}
          aria-label="lap range end"
          className="w-full h-1.5 appearance-none rounded-full cursor-pointer"
          style={{
            background: `linear-gradient(to right, rgba(239,35,60,0.5) ${((lapRange[1] - 1) / ((maxLap || 70) - 1)) * 100}%, rgba(255,255,255,0.1) 0%)`,
            accentColor: '#ef233c',
          }}
        />
      </div>
    </div>
  );
}

