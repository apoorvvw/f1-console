const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

async function apiFetch(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

export function fetchPositionChanges(year, event) {
  return apiFetch(`/api/race/${year}/${encodeURIComponent(event)}/position-changes`);
}

export function fetchTeamPace(year, event) {
  return apiFetch(`/api/race/${year}/${encodeURIComponent(event)}/team-pace`);
}

export function fetchDriverLaps(year, event, driver) {
  return apiFetch(`/api/race/${year}/${encodeURIComponent(event)}/driver-laps/${encodeURIComponent(driver)}`);
}

export function fetchDriverComparison(year, event, drivers) {
  const driverList = Array.isArray(drivers) ? drivers.join(',') : drivers;
  return apiFetch(`/api/lap-times/${year}/${encodeURIComponent(event)}/R/comparison?drivers=${encodeURIComponent(driverList)}`);
}
