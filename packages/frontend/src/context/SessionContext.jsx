import { createContext, useContext, useState, useCallback } from 'react';

const SessionContext = createContext(null);

const STORAGE_KEY = 'f1.recentSessions';
const MAX_RECENT = 5;

function loadRecent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecent(sessions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // ignore quota errors
  }
}

export function SessionProvider({ children }) {
  const [activeSession, setActiveSessionState] = useState(null);
  const [recentSessions, setRecentSessions] = useState(loadRecent);

  const setActiveSession = useCallback((session) => {
    setActiveSessionState(session);
    setRecentSessions((prev) => {
      const filtered = prev.filter(
        (s) =>
          !(s.year === session.year &&
            s.event === session.event &&
            s.sessionType === session.sessionType),
      );
      const next = [session, ...filtered].slice(0, MAX_RECENT);
      saveRecent(next);
      return next;
    });
  }, []);

  return (
    <SessionContext.Provider value={{ activeSession, setActiveSession, recentSessions }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSessionContext must be used within <SessionProvider>');
  return ctx;
}
