import { useEffect, useRef, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { scaleSequential } from 'd3-scale';
import {
  interpolateRdYlBu,
  interpolateGreens,
  interpolateReds,
} from 'd3-scale-chromatic';

const METRIC_SCALE = {
  speed: (min, max) => scaleSequential((t) => interpolateRdYlBu(1 - t)).domain([min, max]),
  throttle: (min, max) => scaleSequential(interpolateGreens).domain([min, max]),
  brake: () => scaleSequential(interpolateReds).domain([0, 1]),
};

function getMetricValue(point, metric) {
  if (metric === 'speed') return point.speed;
  if (metric === 'throttle') return point.throttle;
  if (metric === 'brake') return point.brake ? 1 : 0;
  return 0;
}

function buildColorScale(points, metric) {
  if (metric === 'brake') return METRIC_SCALE.brake();
  const values = points.map((p) => getMetricValue(p, metric));
  const min = Math.min(...values);
  const max = Math.max(...values);
  return METRIC_SCALE[metric]?.(min, max) ?? METRIC_SCALE.speed(min, max);
}

function projectPoints(points, width, height) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const trackW = maxX - minX || 1;
  const trackH = maxY - minY || 1;
  const padding = 40;
  const scaleX = (width - padding * 2) / trackW;
  const scaleY = (height - padding * 2) / trackH;
  const scale = Math.min(scaleX, scaleY);
  const offX = padding + (width - padding * 2 - trackW * scale) / 2;
  const offY = padding + (height - padding * 2 - trackH * scale) / 2;
  return points.map((p) => ({
    ...p,
    px: offX + (p.x - minX) * scale,
    py: offY + (maxY - p.y) * scale, // flip Y axis
  }));
}

export default function TrackMap({ points, corners, metric, showCorners, isLoading }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 600, height: 500 });
  const [tooltip, setTooltip] = useState(null);
  const projectedRef = useRef([]);

  // Observe container resize
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width: Math.max(width, 200), height: Math.max(height, 200) });
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !points?.length) return;
    const ctx = canvas.getContext('2d');
    const { width, height } = size;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    const colorScale = buildColorScale(points, metric);
    const projected = projectPoints(points, width, height);
    projectedRef.current = projected;

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    for (let i = 0; i < projected.length - 1; i++) {
      const p = projected[i];
      const q = projected[i + 1];
      const value = getMetricValue(p, metric);
      ctx.strokeStyle = colorScale(value);
      ctx.beginPath();
      ctx.moveTo(p.px, p.py);
      ctx.lineTo(q.px, q.py);
      ctx.stroke();
    }

    // Corner annotations
    if (showCorners && corners?.length) {
      const cornerProj = projectPoints(corners, width, height);
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      cornerProj.forEach((c) => {
        ctx.beginPath();
        ctx.arc(c.px, c.py, 8, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255,152,0,0.85)';
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.fillText(String(c.number), c.px, c.py);
      });
    }
  }, [points, corners, metric, showCorners, size]);

  useEffect(() => { draw(); }, [draw]);

  function handleMouseMove(e) {
    const canvas = canvasRef.current;
    if (!canvas || !projectedRef.current.length) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let nearest = null;
    let minDist = Infinity;
    for (const p of projectedRef.current) {
      const d = Math.hypot(p.px - mx, p.py - my);
      if (d < minDist) { minDist = d; nearest = p; }
    }
    if (nearest && minDist < 20) {
      setTooltip({ x: e.clientX, y: e.clientY, point: nearest });
    } else {
      setTooltip(null);
    }
  }

  if (isLoading) return <Skeleton variant="rectangular" width="100%" height={500} />;
  if (!points?.length) return null;

  return (
    <Box
      ref={containerRef}
      sx={{ position: 'relative', width: '100%', height: 500 }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
        aria-label="track speed visualization"
        role="img"
      />
      {tooltip && (
        <Box
          sx={{
            position: 'fixed',
            left: tooltip.x + 12,
            top: tooltip.y - 10,
            bgcolor: 'rgba(0,0,0,0.8)',
            color: '#fff',
            p: '6px 10px',
            borderRadius: 1,
            pointerEvents: 'none',
            zIndex: 9999,
            fontSize: 12,
          }}
        >
          <Typography variant="caption" display="block">
            Speed: {tooltip.point.speed?.toFixed(0)} km/h
          </Typography>
          <Typography variant="caption" display="block">
            Throttle: {(tooltip.point.throttle * 100)?.toFixed(0)}%
          </Typography>
          <Typography variant="caption" display="block">
            Brake: {tooltip.point.brake ? 'Yes' : 'No'}
          </Typography>
          <Typography variant="caption" display="block">
            Dist: {tooltip.point.distance?.toFixed(0)} m
          </Typography>
        </Box>
      )}
    </Box>
  );
}
