import { useQuery } from '@tanstack/react-query';
import { fetchStandings, fetchWdcScenarios } from '../api/championship.js';

export function useStandings(year, roundNumber) {
  return useQuery({
    queryKey: ['standings', year, roundNumber],
    queryFn: () => fetchStandings(year, roundNumber),
    enabled: !!(year && roundNumber),
  });
}

export function useWdcScenarios(year, roundNumber) {
  return useQuery({
    queryKey: ['wdcScenarios', year, roundNumber],
    queryFn: () => fetchWdcScenarios(year, roundNumber),
    enabled: !!(year && roundNumber),
  });
}
