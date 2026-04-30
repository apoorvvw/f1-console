import { useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import Skeleton from '@mui/material/Skeleton';
import { COMPOUND_COLORS } from '../../constants/compoundColors.js';

const darkTheme = {
  axis: {
    ticks: { text: { fill: 'rgba(255,255,255,0.45)', fontSize: 11 } },
    legend: { text: { fill: 'rgba(255,255,255,0.35)', fontSize: 11 } },
  },
  grid: { line: { stroke: 'rgba(255,255,255,0.06)' } },
};

function formatLapTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toFixed(3).padStart(6, '0')}`;
}

/**
 * Group laps by compound into nivo series.
 */
function toScatterSeries(laps) {
  const groups = {};
  for (const lap of laps) {
    const compound = lap.compound ?? 'UNKNOWN';
    if (!groups[compound]) groups[compound] = [];
    groups[compound].push({ x: lap.lap_number, y: lap.lap_time_seconds, compound });
  }
  return Object.entries(groups).map(([compound, points]) => ({
    id: compound,
    color: COMPOUND_COLORS[compound] ?? COMPOUND_COLORS.UNKNOWN,
    data: points,
  }));
}

export default function DriverLapScatterplot({ data, isLoading, driver }) {
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

  if (!data?.laps?.length) {
    return (
      <p className="text-sm text-white/40 p-2">
        No lap data available for {driver ?? 'this driver'}.
      </p>
    );
  }

  const series = useMemo(() => toScatterSeries(data.laps), [data.laps]);

  const minTime = Math.min(...data.laps.map((l) => l.lap_time_seconds));
  const maxTime = Math.max(...data.laps.map((l) => l.lap_time_seconds));
  const pad = (maxTime - minTime) * 0.05 || 1;

  return (
    <div style={{ height: 340 }}>
      <ResponsiveLine
        data={series}
        theme={darkTheme}
        margin={{ top: 12, right: 100, bottom: 50, left: 64 }}
        xScale={{ type: 'linear', min: 1, max: 'auto' }}
        yScale={{ type: 'linear', min: minTime - pad, max: maxTime + pad }}
        enableLine={false}
        pointSize={8}
        pointColor={{ from: 'serieColor' }}
        pointBorderWidth={1}
        pointBorderColor={{ from: 'serieColor', modifiers: [['darker', 0.5]] }}
        colors={(serie) => serie.color}
        axisBottom={{
          legend: 'Lap',
          legendOffset: 38,
          legendPosition: 'middle',
          tickValues: 6,
        }}
        axisLeft={{
          legend: 'Lap Time',
          legendOffset: -55,
          legendPosition: 'middle',
          format: (v) => formatLapTime(v),
          tickValues: 5,
        }}
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
            {formatLapTime(point.data.y)}
          </div>
        )}
        legends={[
          {
            anchor: 'right',
            direction: 'column',
            translateX: 95,
            itemWidth: 90,
            itemHeight: 16,
            symbolSize: 10,
            symbolShape: 'circle',
            itemTextColor: 'rgba(255,255,255,0.45)',
          },
        ]}
        useMesh
        enableSlices={false}
      />
    </div>
  );
}
