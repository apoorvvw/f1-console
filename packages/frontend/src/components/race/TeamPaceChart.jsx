import { useMemo } from 'react';
import { ResponsiveBoxPlot } from '@nivo/boxplot';
import Skeleton from '@mui/material/Skeleton';
import { getTeamColor } from '../../constants/teamColors.js';

const darkTheme = {
  axis: {
    ticks: { text: { fill: 'rgba(255,255,255,0.45)', fontSize: 11 } },
    legend: { text: { fill: 'rgba(255,255,255,0.35)', fontSize: 11 } },
  },
  grid: { line: { stroke: 'rgba(255,255,255,0.06)' } },
};

/**
 * Transform race service response into nivo boxplot format.
 * nivo expects: [{ group, subGroup, value }]
 */
function toBoxPlotData(teams) {
  const rows = [];
  for (const team of teams) {
    for (const lap of team.laps) {
      rows.push({ group: team.team, subGroup: lap.driver, value: lap.lap_time_seconds });
    }
  }
  return rows;
}

export default function TeamPaceChart({
  data,
  isLoading,
  selectedTeam = null,
  onTeamClick,
}) {
  if (isLoading) {
    return (
      <Skeleton
        variant="rectangular"
        width="100%"
        height={280}
        sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}
      />
    );
  }

  if (!data?.teams?.length) {
    return (
      <p className="text-sm text-white/40 p-2">
        Select a race session to see team pace ranking.
      </p>
    );
  }

  const teams = data.teams; // already sorted ascending by median
  const teamNames = teams.map((t) => t.team);

  const boxData = useMemo(() => toBoxPlotData(teams), [teams]);

  return (
    <div style={{ height: 280 }}>
      <ResponsiveBoxPlot
        data={boxData}
        theme={darkTheme}
        margin={{ top: 12, right: 20, bottom: 50, left: 160 }}
        minValue="auto"
        maxValue="auto"
        layout="horizontal"
        groups={teamNames}
        subGroups={[]}
        colors={(d) => {
          const color = getTeamColor(d.group);
          if (selectedTeam && d.group !== selectedTeam) {
            return `${color}55`; // dim unselected teams
          }
          return color;
        }}
        borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
        borderRadius={3}
        borderWidth={1}
        medianWidth={2}
        medianColor={{ from: 'color', modifiers: [['brighter', 1]] }}
        whiskerEndSize={0.6}
        whiskerColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
        onClick={(d) => onTeamClick?.(d.group)}
        axisBottom={{
          legend: 'Lap Time (s)',
          legendOffset: 38,
          legendPosition: 'middle',
          format: (v) => v.toFixed(1),
        }}
        axisLeft={{ tickSize: 4 }}
        tooltip={({ color, ...d }) => (
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
            <strong style={{ color }}>{d.group}</strong>
            <br />
            Median: <strong>{d.median?.toFixed(3)}s</strong>
            <br />
            Range: {d.q1?.toFixed(3)}s – {d.q3?.toFixed(3)}s
          </div>
        )}
      />
    </div>
  );
}
