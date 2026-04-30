import { useMemo } from 'react';
import { scaleLinear, scaleBand } from 'd3-scale';
import Skeleton from '@mui/material/Skeleton';
import { getTeamColor } from '../../constants/teamColors.js';
import { COMPOUND_COLORS } from '../../constants/compoundColors.js';

// Chart dimensions
const W = 900;
const H = 380;
const MARGIN = { top: 32, right: 24, bottom: 56, left: 68 };
const IW = W - MARGIN.left - MARGIN.right;
const IH = H - MARGIN.top - MARGIN.bottom;

// Epanechnikov KDE kernel
function epanechnikov(bw) {
  return (v) => (Math.abs((v /= bw)) <= 1 ? (0.75 * (1 - v * v)) / bw : 0);
}

function computeKDE(times, steps = 80) {
  if (times.length < 3) return [];
  const min = Math.min(...times);
  const max = Math.max(...times);
  const bw = Math.max((max - min) * 0.15, 0.08);
  const kernel = epanechnikov(bw);
  return Array.from({ length: steps }, (_, i) => {
    const x = min + (i / (steps - 1)) * (max - min);
    return [x, times.reduce((s, v) => s + kernel(x - v), 0) / times.length];
  });
}

function violinPath(kde, yScale, cx, halfWidth) {
  if (kde.length < 2) return '';
  const maxD = Math.max(...kde.map((k) => k[1]));
  if (maxD === 0) return '';
  const sc = halfWidth / maxD;
  const right = kde.map(([y, d]) => `${(cx + d * sc).toFixed(1)},${yScale(y).toFixed(1)}`);
  const left = [...kde].reverse().map(([y, d]) => `${(cx - d * sc).toFixed(1)},${yScale(y).toFixed(1)}`);
  return `M ${right.join(' L ')} L ${left.join(' L ')} Z`;
}

// Deterministic jitter — same seed always produces the same visual
function seededJitter(i, range) {
  const v = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return (v - Math.floor(v) - 0.5) * range;
}

function filterLaps(laps, filters) {
  const { selectedDrivers, compound, lapRange } = filters;
  return laps.filter((lap) => {
    if (selectedDrivers.length && !selectedDrivers.includes(lap.driver)) return false;
    if (compound !== 'All' && lap.compound !== compound) return false;
    if (lap.lap_number < lapRange[0] || lap.lap_number > lapRange[1]) return false;
    return true;
  });
}

export default function LapDistributionChart({ data, isLoading, error, filters }) {
  const driverData = useMemo(() => {
    if (!data?.laps?.length) return [];
    const filtered = filterLaps(data.laps, filters);
    const map = {};
    for (const lap of filtered) {
      if (!map[lap.driver]) map[lap.driver] = { driver: lap.driver, team: lap.team, laps: [] };
      if (lap.lap_time_seconds != null) map[lap.driver].laps.push(lap);
    }
    return Object.values(map);
  }, [data, filters]);

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={300} sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }} />;
  }
  if (error) {
    return <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">{error.message}</div>;
  }
  if (!data?.laps?.length) {
    return <div className="p-3 text-sm text-white/40">No lap data available for the selected session.</div>;
  }
  if (!driverData.length) {
    return <div className="p-3 text-sm text-white/40">No laps match the current filters.</div>;
  }

  const allTimes = driverData.flatMap((d) => d.laps.map((l) => l.lap_time_seconds));
  const globalMin = Math.min(...allTimes);
  const globalMax = Math.max(...allTimes);
  const pad = (globalMax - globalMin) * 0.12;

  const yScale = scaleLinear()
    .domain([globalMin - pad, globalMax + pad])
    .range([IH, 0]);

  const xScale = scaleBand()
    .domain(driverData.map((d) => d.driver))
    .range([0, IW])
    .padding(0.28);

  const halfWidth = xScale.bandwidth() / 2.1;
  const yTicks = yScale.ticks(6);

  const compoundsPresent = [
    ...new Set(driverData.flatMap((d) => d.laps.map((l) => l.compound))),
  ].filter(Boolean);

  return (
    <div style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: 'auto' }}
        aria-label="Lap time distribution violin plot"
      >
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {/* Horizontal grid lines */}
          {yTicks.map((t) => (
            <line
              key={t}
              x1={0} x2={IW}
              y1={yScale(t)} y2={yScale(t)}
              stroke="rgba(255,255,255,0.06)"
              strokeDasharray="4 4"
            />
          ))}

          {/* Per-driver violin + dots */}
          {driverData.map(({ driver, team, laps }) => {
            const times = laps.map((l) => l.lap_time_seconds);
            const kde = computeKDE(times);
            const cx = xScale(driver) + xScale.bandwidth() / 2;
            const teamColor = getTeamColor(team);

            return (
              <g key={driver}>
                {/* Violin shape */}
                <path
                  d={violinPath(kde, yScale, cx, halfWidth)}
                  fill={teamColor}
                  fillOpacity={0.45}
                  stroke={teamColor}
                  strokeOpacity={0.75}
                  strokeWidth={1}
                />
                {/* Individual dots colored by compound */}
                {laps.map((lap, i) => (
                  <circle
                    key={i}
                    cx={cx + seededJitter(i, halfWidth * 0.75)}
                    cy={yScale(lap.lap_time_seconds)}
                    r={3.5}
                    fill={COMPOUND_COLORS[lap.compound] ?? '#aaaaaa'}
                    fillOpacity={0.88}
                    stroke="rgba(0,0,0,0.35)"
                    strokeWidth={0.5}
                  />
                ))}
              </g>
            );
          })}

          {/* Y axis line */}
          <line x1={0} x2={0} y1={0} y2={IH} stroke="rgba(255,255,255,0.12)" />
          {yTicks.map((t) => (
            <g key={t} transform={`translate(0,${yScale(t)})`}>
              <line x1={-5} x2={0} stroke="rgba(255,255,255,0.2)" />
              <text
                x={-10}
                textAnchor="end"
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.45)"
                fontSize={11}
              >
                {t.toFixed(1)}
              </text>
            </g>
          ))}
          {/* Y axis label */}
          <text
            transform={`translate(-54,${IH / 2}) rotate(-90)`}
            textAnchor="middle"
            fill="rgba(255,255,255,0.35)"
            fontSize={12}
          >
            Lap Time (s)
          </text>

          {/* X axis line */}
          <line x1={0} x2={IW} y1={IH} y2={IH} stroke="rgba(255,255,255,0.12)" />
          {driverData.map(({ driver }) => {
            const cx = xScale(driver) + xScale.bandwidth() / 2;
            return (
              <g key={driver} transform={`translate(${cx},${IH})`}>
                <line y2={5} stroke="rgba(255,255,255,0.2)" />
                <text
                  y={18}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.55)"
                  fontSize={12}
                  fontWeight={500}
                >
                  {driver}
                </text>
              </g>
            );
          })}
          {/* X axis label */}
          <text
            x={IW / 2}
            y={IH + 47}
            textAnchor="middle"
            fill="rgba(255,255,255,0.35)"
            fontSize={12}
          >
            Driver
          </text>

          {/* Compound legend */}
          {compoundsPresent.length > 0 && (
            <g transform="translate(8, 2)">
              <text fill="rgba(255,255,255,0.4)" fontSize={10} fontWeight={600}>
                Compound
              </text>
              {compoundsPresent.map((c, i) => (
                <g key={c} transform={`translate(0, ${16 + i * 16})`}>
                  <circle r={4} fill={COMPOUND_COLORS[c] ?? '#888'} />
                  <text x={12} dominantBaseline="middle" fill="rgba(255,255,255,0.5)" fontSize={10}>
                    {c}
                  </text>
                </g>
              ))}
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}

