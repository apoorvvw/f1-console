const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3030';

async function apiFetch(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

export function fetchFastestLapTelemetry(year, event, sessionType, driver) {
  return apiFetch(
    `/api/track/${year}/${encodeURIComponent(event)}/${sessionType}/speed/${driver}`,
  );
}

export function fetchLapTelemetry(year, event, sessionType, driver, lapNumber) {
  return apiFetch(
    `/api/track/${year}/${encodeURIComponent(event)}/${sessionType}/${driver}/lap/${lapNumber}`,
  );
}

export function fetchCornerAnnotations(year, event) {
  return apiFetch(`/api/track/${year}/${encodeURIComponent(event)}/corners`);
}
