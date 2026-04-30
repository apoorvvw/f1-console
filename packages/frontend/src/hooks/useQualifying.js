import { useQuery } from '@tanstack/react-query';
import { fetchQualifyingResults } from '../api/qualifying.js';

export function useQualifyingResults(year, event) {
  return useQuery({
    queryKey: ['qualifying', year, event],
    queryFn: () => fetchQualifyingResults(year, event),
    enabled: !!(year && event),
  });
}
