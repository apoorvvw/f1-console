import { getTeamColor } from '../../constants/teamColors.js';

export default function DriverSelector({ drivers = [], selectedDrivers = new Set(), onDriverToggle }) {
  if (!drivers.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {drivers.map((drv) => {
        const isSelected = selectedDrivers.has(drv.abbreviation);
        const color = getTeamColor(drv.team);
        return (
          <button
            key={drv.abbreviation}
            onClick={() => onDriverToggle?.(drv.abbreviation)}
            aria-pressed={isSelected}
            aria-label={`${drv.abbreviation} (${drv.team})`}
            style={{
              borderColor: isSelected ? color : 'rgba(255,255,255,0.12)',
              color: isSelected ? color : 'rgba(255,255,255,0.45)',
              backgroundColor: isSelected ? `${color}22` : 'rgba(255,255,255,0.04)',
              boxShadow: isSelected ? `0 0 0 1px ${color}55` : 'none',
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-bold tracking-wide transition-all duration-150 hover:opacity-90 cursor-pointer select-none"
          >
            <span
              style={{ background: color }}
              className="w-2.5 h-2.5 rounded-full shrink-0"
            />
            {drv.abbreviation}
          </button>
        );
      })}
    </div>
  );
}
