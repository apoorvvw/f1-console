import { useEffect, useRef, useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

const BAR_HEIGHT = 24;
const BAR_GAP = 6;
const LEFT_LABEL_WIDTH = 48;
const RIGHT_LABEL_PAD = 8;
const DELTA_LABEL_WIDTH = 72;
const PADDING_TOP = 12;
const PADDING_BOTTOM = 8;

function computeChartData(results, roundFilter) {
  if (!results?.length) return [];

  if (roundFilter === 'All') {
    const pole = results.reduce(
      (min, r) => (r.lap_time_seconds < min ? r.lap_time_seconds : min),
      Infinity,
    );
    return results
      .map((r) => ({ ...r, delta: r.lap_time_seconds - pole }))
      .sort((a, b) => a.delta - b.delta);
  }

  const key = roundFilter.toLowerCase() + '_seconds';
  const participating = results.filter((r) => r[key] != null);
  if (!participating.length) return [];

  const fastest = participating.reduce(
    (min, r) => (r[key] < min ? r[key] : min),
    Infinity,
  );
  return participating
    .map((r) => ({ ...r, delta: r[key] - fastest }))
    .sort((a, b) => a.delta - b.delta);
}

export default function QualifyingDeltaChart({
  results,
  selectedDriver,
  onDriverSelect,
  roundFilter,
  isLoading,
}) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(400);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(Math.max(entry.contentRect.width, 200));
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  if (isLoading) {
    return (
      <div ref={containerRef} className="w-full">
        <Skeleton variant="rectangular" width="100%" height={300} />
      </div>
    );
  }

  const chartData = computeChartData(results, roundFilter);
  const svgWidth = width;
  const barAreaWidth = svgWidth - LEFT_LABEL_WIDTH - DELTA_LABEL_WIDTH - RIGHT_LABEL_PAD;
  const svgHeight = PADDING_TOP + chartData.length * (BAR_HEIGHT + BAR_GAP) + PADDING_BOTTOM;

  const maxDelta = chartData.length ? chartData[chartData.length - 1].delta : 1;
  const deltaScale = (delta) => (maxDelta > 0 ? (delta / maxDelta) * barAreaWidth : 0);

  // Detect if the selected driver is absent in the current round's chart data
  const selectedAbsent =
    selectedDriver &&
    roundFilter !== 'All' &&
    !chartData.find((d) => d.driver === selectedDriver.driver);

  return (
    <div ref={containerRef} className="w-full">
      <svg
        width={svgWidth}
        height={svgHeight}
        aria-label="Qualifying delta chart"
        role="img"
      >
        {chartData.map((d, i) => {
          const y = PADDING_TOP + i * (BAR_HEIGHT + BAR_GAP);
          const barWidth = Math.max(deltaScale(d.delta), 2);
          const isSelected = selectedDriver?.driver === d.driver;
          const fillColor = d.team_color ?? '#808080';

          return (
            <g
              key={d.driver}
              role="button"
              aria-label={`${d.driver} gap +${d.delta.toFixed(3)}s`}
              aria-pressed={isSelected}
              tabIndex={0}
              style={{ cursor: 'pointer', outline: 'none' }}
              onClick={() => onDriverSelect?.(isSelected ? null : d)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onDriverSelect?.(isSelected ? null : d);
                }
              }}
            >
              {/* Selected highlight background */}
              {isSelected && (
                <rect
                  x={0}
                  y={y - 3}
                  width={svgWidth}
                  height={BAR_HEIGHT + 6}
                  fill="rgba(25,118,210,0.12)"
                  rx={4}
                />
              )}

              {/* Driver abbreviation label */}
              <text
                x={LEFT_LABEL_WIDTH - 6}
                y={y + BAR_HEIGHT / 2}
                textAnchor="end"
                dominantBaseline="middle"
                fill={isSelected ? '#fff' : 'rgba(255,255,255,0.65)'}
                fontSize={11}
                fontWeight={isSelected ? 700 : 400}
                fontFamily="Inter, sans-serif"
              >
                {d.driver}
              </text>

              {/* Bar */}
              <rect
                x={LEFT_LABEL_WIDTH}
                y={y}
                width={barWidth}
                height={BAR_HEIGHT}
                fill={fillColor}
                opacity={isSelected ? 1 : 0.8}
                rx={3}
              />

              {/* Selection border */}
              {isSelected && (
                <rect
                  x={LEFT_LABEL_WIDTH}
                  y={y}
                  width={barWidth}
                  height={BAR_HEIGHT}
                  fill="none"
                  stroke="#fff"
                  strokeWidth={1.5}
                  rx={3}
                />
              )}

              {/* Delta label */}
              <text
                x={LEFT_LABEL_WIDTH + barWidth + 6}
                y={y + BAR_HEIGHT / 2}
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.5)"
                fontSize={10}
                fontFamily="Inter, sans-serif"
              >
                {d.delta === 0 ? 'POLE' : `+${d.delta.toFixed(3)}`}
              </text>
            </g>
          );
        })}
      </svg>

      {chartData.length === 0 && !isLoading && (
        <Typography variant="body2" color="text.secondary" className="px-2 py-3 text-center">
          No data for {roundFilter === 'All' ? 'qualifying' : roundFilter}.
        </Typography>
      )}

      {selectedAbsent && (
        <Typography variant="caption" color="text.secondary" className="block px-2 pt-1">
          Selected driver did not participate in {roundFilter}.
        </Typography>
      )}
    </div>
  );
}
