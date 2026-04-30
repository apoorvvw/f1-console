export const SESSION_ROUTE_MAP = {
  R: '/race',
  S: '/race',
  FP1: '/race',
  FP2: '/race',
  FP3: '/race',
  Q: '/qualifying',
  SQ: '/qualifying',
};

export function routeForSessionType(type) {
  return SESSION_ROUTE_MAP[type] ?? '/race';
}
