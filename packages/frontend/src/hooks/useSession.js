import { useQuery } from '@tanstack/react-query';
import { fetchSchedule, fetchSessionInfo } from '../api/sessions.js';

export function useSchedule(year) {
  return useQuery({
    queryKey: ['schedule', year],
    queryFn: () => fetchSchedule(year),
    enabled: !!year,
  });
}

export function useSessionInfo(year, event, sessionType) {
  return useQuery({
    queryKey: ['sessionInfo', year, event, sessionType],
    queryFn: () => fetchSessionInfo(year, event, sessionType),
    enabled: !!(year && event && sessionType),
  });
}
