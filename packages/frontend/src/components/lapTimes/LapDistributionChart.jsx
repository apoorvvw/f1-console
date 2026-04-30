import { ResponsiveBoxPlot } from '@nivo/boxplot';
import Skeleton from '@mui/material/Skeleton';
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

const darkAxisStyle = {
  tickSize: 5,
  tickPadding: 5,
};

const darkTheme = {
  axis: {
    ticks: { text: { fill: 'rgba(255,255,255,0.45)', fontSize: 11 } },
    legend: { text: { fill: 'rgba(255,255,255,0.35)', fontSize: 11 } },
  },
  grid: { line: { stroke: 'rgba(255,255,255,0.06)' } },
};

export default function LapDistributionChart({ data, isLoading, error, filters }) {
  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={300} sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }} />;
  }
  if (error) {
    return <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">{error.message}</div>;
  }
  if (!data?.laps?.length) {
    return <div className="p-3 text-sm text-white/40">No lap data available for the selected session.</div>;
  }

  const filteredLaps = filterLaps(data.laps, filters);
  const boxPlotData = toNivoBoxPlot(filteredLaps);

  if (!boxPlotData.length) {
    return <div className="p-3 text-sm text-white/40">No laps match the current filters.</div>;
  }

  return (
    <div style={{ height: 350 }}>
      <ResponsiveBoxPlot
        theme={darkTheme}
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
          ...darkAxisStyle,
          legend: 'Driver',
          legendPosition: 'middle',
          legendOffset: 48,
        }}
        axisLeft={{
          ...darkAxisStyle,
          legend: 'Lap Time (s)',
          legendPosition: 'middle',
          legendOffset: -56,
          format: (v) => v.toFixed(1),
        }}
        tooltip={({ group, data: d }) => (
          <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#fff' }}>
            <strong style={{ color: '#ef233c' }}>{group}</strong>
            <br />
            Median: {d.median?.toFixed(3)}s
            <br />
            Min: {d.extrema?.[0]?.toFixed(3)}s / Max: {d.extrema?.[1]?.toFixed(3)}s
          </div>
        )}
      />
    </div>
  );
}
