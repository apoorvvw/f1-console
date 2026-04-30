const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

async function apiFetch(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

export function fetchSchedule(year) {
  return apiFetch(`/api/sessions/schedule/${year}`);
}

export function fetchSessionInfo(year, event, sessionType) {
  return apiFetch(`/api/sessions/${year}/${encodeURIComponent(event)}/${sessionType}`);
}
