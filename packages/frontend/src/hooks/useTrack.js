import { useQuery } from '@tanstack/react-query';
import {
  fetchFastestLapTelemetry,
  fetchLapTelemetry,
  fetchCornerAnnotations,
} from '../api/track.js';

export function useLapTelemetry(year, event, sessionType, driver, lapNumber) {
  return useQuery({
    queryKey: ['telemetry', year, event, sessionType, driver, lapNumber ?? 'fastest'],
    queryFn: () =>
      lapNumber
        ? fetchLapTelemetry(year, event, sessionType, driver, lapNumber)
        : fetchFastestLapTelemetry(year, event, sessionType, driver),
    enabled: !!(year && event && sessionType && driver),
  });
}

export function useCornerAnnotations(year, event) {
  return useQuery({
    queryKey: ['corners', year, event],
    queryFn: () => fetchCornerAnnotations(year, event),
    enabled: !!(year && event),
  });
}
