import { useQuery } from '@tanstack/react-query';
import { fetchPositionChanges, fetchTeamPace, fetchDriverLaps, fetchDriverComparison } from '../api/race.js';

export function usePositionChanges(year, event) {
  return useQuery({
    queryKey: ['racePositionChanges', year, event],
    queryFn: () => fetchPositionChanges(year, event),
    enabled: !!(year && event),
  });
}

export function useTeamPace(year, event) {
  return useQuery({
    queryKey: ['raceTeamPace', year, event],
    queryFn: () => fetchTeamPace(year, event),
    enabled: !!(year && event),
  });
}

export function useDriverLaps(year, event, driver) {
  return useQuery({
    queryKey: ['raceDriverLaps', year, event, driver],
    queryFn: () => fetchDriverLaps(year, event, driver),
    enabled: !!(year && event && driver),
  });
}

export function useDriverComparison(year, event, drivers) {
  const driverList = Array.isArray(drivers) ? drivers : [...drivers];
  return useQuery({
    queryKey: ['raceDriverComparison', year, event, driverList.join(',')],
    queryFn: () => fetchDriverComparison(year, event, driverList),
    enabled: !!(year && event && driverList.length >= 2),
  });
}
