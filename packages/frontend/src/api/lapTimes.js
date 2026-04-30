const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3030';

async function apiFetch(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

export function fetchLapDistribution(year, event) {
  return apiFetch(`/api/lap-times/${year}/${encodeURIComponent(event)}/distribution`);
}

export function fetchDriverComparison(year, event, sessionType, drivers) {
  const driverParam = drivers.map(encodeURIComponent).join(',');
  return apiFetch(
    `/api/lap-times/${year}/${encodeURIComponent(event)}/${sessionType}/comparison?drivers=${driverParam}`,
  );
}
