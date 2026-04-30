export const TEAM_COLORS = {
  'Red Bull Racing': '#3671C6',
  'Ferrari': '#E8002D',
  'Mercedes': '#27F4D2',
  'McLaren': '#FF8000',
  'Aston Martin': '#229971',
  'Alpine': '#FF87BC',
  'Williams': '#64C4FF',
  'RB': '#6692FF',
  'Haas F1 Team': '#B6BABD',
  'Sauber': '#52E252',
  // Legacy / older team names
  'AlphaTauri': '#5E8FAA',
  'Alpha Tauri': '#5E8FAA',
  'Alfa Romeo': '#C92D4B',
  'Racing Point': '#F596C8',
  'Renault': '#FFF500',
  'Force India': '#F596C8',
  'Toro Rosso': '#469BFF',
};

export function getTeamColor(teamName) {
  if (!teamName) return '#888888';
  return TEAM_COLORS[teamName] ?? '#888888';
}
