import { ResponsiveBoxPlot } from '@nivo/boxplot';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { getTeamColor } from '../../constants/teamColors.js';

function filterLaps(laps, filters) {
  const { selectedDrivers, compound, lapRange } = filters;
  return laps.filter((lap) => {
    if (selectedDrivers.length && !selectedDrivers.includes(lap.driver)) return false;
    if (compound !== 'All' && lap.compound !== compound) return false;
    if (lap.lap_number < lapRange[0] || lap.lap_number > lapRange[1]) return false;
    return true;
  });
}

function toNivoBoxPlot(laps) {
  const byDriver = {};
  for (const lap of laps) {
    if (!byDriver[lap.driver]) byDriver[lap.driver] = { driver: lap.driver, team: lap.team, times: [] };
    if (lap.lap_time_seconds != null) byDriver[lap.driver].times.push(lap.lap_time_seconds);
  }
  return Object.values(byDriver).map(({ driver, team, times }) => ({
    group: driver,
    value: times,
    color: getTeamColor(team),
  }));
}

export default function LapDistributionChart({ data, isLoading, error, filters }) {
  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={300} />;
  }
  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  if (!data?.laps?.length) {
    return <Alert severity="info">No lap data available for the selected session.</Alert>;
  }

  const filteredLaps = filterLaps(data.laps, filters);
  const boxPlotData = toNivoBoxPlot(filteredLaps);

  if (!boxPlotData.length) {
    return <Alert severity="info">No laps match the current filters.</Alert>;
  }

  return (
    <Box sx={{ height: 350 }}>
      <ResponsiveBoxPlot
        data={boxPlotData}
        margin={{ top: 20, right: 20, bottom: 60, left: 70 }}
        minValue="auto"
        maxValue="auto"
        groupBy="group"
        value="value"
        subGroupBy={null}
        colorBy="group"
        colors={({ group }) => {
          const item = boxPlotData.find((d) => d.group === group);
          return item?.color ?? '#888';
        }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          legend: 'Driver',
          legendPosition: 'middle',
          legendOffset: 48,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          legend: 'Lap Time (s)',
          legendPosition: 'middle',
          legendOffset: -56,
          format: (v) => v.toFixed(1),
        }}
        tooltip={({ group, data: d }) => (
          <div
            style={{
              background: '#fff',
              border: '1px solid #ccc',
              borderRadius: 4,
              padding: '8px 12px',
              fontSize: 12,
            }}
          >
            <strong>{group}</strong>
            <br />
            Median: {d.median?.toFixed(3)}s
            <br />
            Min: {d.extrema?.[0]?.toFixed(3)}s / Max: {d.extrema?.[1]?.toFixed(3)}s
          </div>
        )}
      />
    </Box>
  );
}
