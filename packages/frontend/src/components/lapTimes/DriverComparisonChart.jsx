import { ResponsiveLine } from '@nivo/line';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { getTeamColor } from '../../constants/teamColors.js';

function toNivoLine(data, selectedDrivers) {
  const drivers = selectedDrivers.length ? selectedDrivers : Object.keys(data);
  return drivers
    .filter((d) => data[d])
    .map((driver) => ({
      id: driver,
      color: getTeamColor(data[driver]?.[0]?.team),
      data: (data[driver] ?? [])
        .filter((lap) => lap.lap_time_seconds != null)
        .map((lap) => ({
          x: lap.lap_number,
          y: lap.lap_time_seconds,
          isOutlier: lap.is_outlier,
        })),
    }));
}

export default function DriverComparisonChart({ data, isLoading, selectedDrivers = [] }) {
  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={280} />;
  }
  if (!data) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
        Select drivers to compare lap times across the race.
      </Typography>
    );
  }

  const lineData = toNivoLine(data, selectedDrivers);

  return (
    <Box sx={{ height: 280 }}>
      <ResponsiveLine
        data={lineData}
        margin={{ top: 20, right: 110, bottom: 60, left: 70 }}
        xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
        colors={(serie) => serie.color}
        pointSize={6}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointSymbol={({ datum, color, borderColor, borderWidth, size }) => {
          if (datum.isOutlier) {
            return (
              <circle
                r={size / 2}
                fill="transparent"
                stroke={borderColor}
                strokeWidth={borderWidth}
              />
            );
          }
          return (
            <circle r={size / 2} fill={color} stroke={borderColor} strokeWidth={borderWidth} />
          );
        }}
        axisBottom={{
          legend: 'Lap Number',
          legendOffset: 40,
          legendPosition: 'middle',
        }}
        axisLeft={{
          legend: 'Lap Time (s)',
          legendOffset: -56,
          legendPosition: 'middle',
          format: (v) => v.toFixed(1),
        }}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            translateX: 100,
            itemWidth: 80,
            itemHeight: 20,
            symbolSize: 12,
            symbolShape: 'circle',
          },
        ]}
        tooltip={({ point }) => (
          <div
            style={{
              background: '#fff',
              border: '1px solid #ccc',
              borderRadius: 4,
              padding: '6px 10px',
              fontSize: 12,
            }}
          >
            <strong>{point.serieId}</strong> — Lap {point.data.x}
            <br />
            {point.data.y.toFixed(3)}s{point.data.isOutlier ? ' (outlier)' : ''}
          </div>
        )}
      />
    </Box>
  );
}
