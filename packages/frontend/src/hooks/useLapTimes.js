import { useQuery } from '@tanstack/react-query';
import { fetchLapDistribution, fetchDriverComparison } from '../api/lapTimes.js';

export function useLapDistribution(year, event) {
  return useQuery({
    queryKey: ['lapDistribution', year, event],
    queryFn: () => fetchLapDistribution(year, event),
    enabled: !!(year && event),
  });
}

export function useDriverComparison(year, event, sessionType, drivers) {
  return useQuery({
    queryKey: ['lapComparison', year, event, sessionType, drivers],
    queryFn: () => fetchDriverComparison(year, event, sessionType, drivers),
    enabled: !!(year && event && sessionType && drivers?.length),
  });
}
