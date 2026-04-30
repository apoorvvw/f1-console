import { useSessionContext } from '../../context/SessionContext.jsx';

export default function RecentSessions() {
  const { recentSessions, setActiveSession } = useSessionContext();

  if (!recentSessions.length) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-white/35 font-medium shrink-0 tracking-wide uppercase">
        Recent:
      </span>
      {recentSessions.map((s) => (
        <button
          key={`${s.year}-${s.event}-${s.sessionType}`}
          onClick={() => setActiveSession(s)}
          className="px-3 py-1 rounded-full text-xs font-medium border border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all duration-200"
        >
          {s.event} {s.year} – {s.sessionType}
        </button>
      ))}
    </div>
  );
}

