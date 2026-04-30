import { useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import Skeleton from '@mui/material/Skeleton';
import { getTeamColor } from '../../constants/teamColors.js';

const darkTheme = {
  axis: {
    ticks: { text: { fill: 'rgba(255,255,255,0.45)', fontSize: 11 } },
    legend: { text: { fill: 'rgba(255,255,255,0.35)', fontSize: 11 } },
  },
  grid: { line: { stroke: 'rgba(255,255,255,0.06)' } },
  legends: { text: { fill: 'rgba(255,255,255,0.5)', fontSize: 10 } },
  crosshair: { line: { stroke: 'rgba(255,255,255,0.2)' } },
};

function toNivoSeries(drivers) {
  return drivers.map((drv) => ({
    id: drv.abbreviation,
    color: getTeamColor(drv.team),
    data: drv.laps
      .filter((lap) => lap.position != null)
      .map((lap) => ({ x: lap.lap_number, y: lap.position })),
  }));
}

/**
 * Derives the set of drivers that should be "highlighted" given the
 * selected driver set and the selected team.
 */
function getHighlightedSet(selectedDrivers, selectedTeam, allDrivers) {
  if (selectedTeam) {
    const teamDrivers = new Set(
      allDrivers.filter((d) => d.team === selectedTeam).map((d) => d.abbreviation),
    );
    return teamDrivers;
  }
  return selectedDrivers;
}

export default function PositionChangesChart({
  data,
  isLoading,
  selectedDrivers = new Set(),
  selectedTeam = null,
  onDriverToggle,
}) {
  if (isLoading) {
    return (
      <Skeleton
        variant="rectangular"
        width="100%"
        height={340}
        sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}
      />
    );
  }

  if (!data?.drivers?.length) {
    return (
      <p className="text-sm text-white/40 p-2">
        Select a race session to see position changes.
      </p>
    );
  }

  const allDrivers = data.drivers;
  const highlighted = getHighlightedSet(selectedDrivers, selectedTeam, allDrivers);
  const hasHighlight = highlighted.size > 0;

  const series = useMemo(() => toNivoSeries(allDrivers), [allDrivers]);

  // Apply visual emphasis: highlighted = bold+opaque; others = thin+dimmed
  const styledSeries = series.map((s) => {
    const isHighlighted = highlighted.has(s.id);
    return {
      ...s,
      lineWidth: hasHighlight ? (isHighlighted ? 3 : 1) : 1.5,
      opacity: hasHighlight ? (isHighlighted ? 1 : 0.2) : 0.85,
    };
  });

  return (
    <div style={{ height: 340 }}>
      <ResponsiveLine
        data={styledSeries}
        theme={darkTheme}
        margin={{ top: 12, right: 16, bottom: 50, left: 42 }}
        xScale={{ type: 'linear', min: 1, max: 'auto' }}
        yScale={{ type: 'linear', min: 1, max: 20, reverse: true }}
        gridYValues={[1, 5, 10, 15, 20]}
        axisBottom={{
          legend: 'Lap',
          legendOffset: 38,
          legendPosition: 'middle',
          tickValues: 6,
        }}
        axisLeft={{
          legend: 'Position',
          legendOffset: -32,
          legendPosition: 'middle',
          tickValues: [1, 5, 10, 15, 20],
          format: (v) => `P${v}`,
        }}
        enablePoints={false}
        lineWidth={1.5}
        colors={(serie) => serie.color}
        // Per-series opacity via custom layer
        layers={[
          'grid',
          'axes',
          ({ series: allSeries, lineGenerator, xScale, yScale }) =>
            allSeries.map((serie) => (
              <path
                key={serie.id}
                d={lineGenerator(
                  serie.data.map((d) => ({
                    x: xScale(d.data.x),
                    y: yScale(d.data.y),
                  })),
                )}
                fill="none"
                stroke={serie.color}
                strokeWidth={serie.lineWidth ?? 1.5}
                style={{
                  opacity: serie.opacity ?? 0.85,
                  transition: 'opacity 200ms ease, stroke-width 200ms ease',
                  cursor: 'pointer',
                }}
                onClick={() => onDriverToggle?.(serie.id)}
              />
            )),
          'slices',
          'crosshair',
          'mesh',
        ]}
        useMesh
        enableSlices={false}
        tooltip={({ point }) => (
          <div
            style={{
              background: '#1a1a1a',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              padding: '6px 10px',
              fontSize: 12,
              color: '#fff',
            }}
          >
            <strong style={{ color: point.serieColor }}>{point.serieId}</strong>
            {' — '}Lap {point.data.x}
            <br />
            Position: <strong>P{point.data.y}</strong>
          </div>
        )}
        legends={[]}
      />
    </div>
  );
}
