import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSessionContext } from '../context/SessionContext.jsx';
import { useSchedule } from '../hooks/useSession.js';
import { useStandings } from '../hooks/useChampionship.js';
import SessionSelector from '../components/session/SessionSelector.jsx';
import RecentSessions from '../components/session/RecentSessions.jsx';
import Card from '../components/ui/Card.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import { routeForSessionType } from '../constants/sessionRouting.js';

const CURRENT_YEAR = new Date().getFullYear();

// ── Upcoming Race Card (T009) ─────────────────────────────────────────────────

function UpcomingRaceCard({ schedule, isLoading }) {
  const today = new Date().toISOString().split('T')[0];
  const upcoming = schedule?.find((e) => e.EventDate >= today) ?? null;

  return (
    <Card className="p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-[#ef233c] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span className="text-xs font-semibold text-white/40 uppercase tracking-widest font-display">
          Next Race
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-4 bg-white/10 rounded w-3/4" />
          <div className="h-3 bg-white/5 rounded w-1/2" />
        </div>
      ) : upcoming ? (
        <>
          <p className="text-base font-bold text-white leading-tight font-display">
            {upcoming.EventName}
          </p>
          <p className="text-xs text-white/45">
            {new Date(upcoming.EventDate).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </>
      ) : (
        <p className="text-sm text-white/30 italic">No upcoming events</p>
      )}
    </Card>
  );
}

// ── Standings Snapshot Card (T010) ────────────────────────────────────────────

function StandingsSnapshotCard({ schedule, scheduleLoading }) {
  const today = new Date().toISOString().split('T')[0];
  const past = schedule?.filter((e) => e.EventDate < today) ?? [];
  const latestRound = past.length > 0 ? past[past.length - 1].RoundNumber : null;

  const { data, isLoading } = useStandings(CURRENT_YEAR, latestRound);

  const drivers = data?.drivers?.slice(0, 3) ?? [];
  const constructors = data?.constructors?.slice(0, 3) ?? [];

  const loading = scheduleLoading || isLoading;

  return (
    <Card className="p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-[#ef233c] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 20 18 10" />
          <polyline points="12 20 12 4" />
          <polyline points="6 20 6 14" />
        </svg>
        <span className="text-xs font-semibold text-white/40 uppercase tracking-widest font-display">
          Standings {CURRENT_YEAR}
        </span>
        {latestRound && (
          <span className="ml-auto text-xs text-white/25">R{latestRound}</span>
        )}
      </div>

      {loading ? (
        <div className="space-y-2 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-3 bg-white/10 rounded" style={{ width: `${85 - i * 10}%` }} />
          ))}
        </div>
      ) : drivers.length === 0 ? (
        <p className="text-sm text-white/30 italic">No standings data</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          {/* Drivers */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">Drivers</span>
            {drivers.map((d) => (
              <div key={d.position} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[10px] text-white/30 w-3 shrink-0">{d.position}</span>
                  <span className="text-xs text-white/80 font-medium truncate">{d.driver_name}</span>
                </div>
                <span className="text-xs text-white/50 shrink-0">{d.points}</span>
              </div>
            ))}
          </div>
          {/* Constructors */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">Teams</span>
            {constructors.map((c) => (
              <div key={c.position} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[10px] text-white/30 w-3 shrink-0">{c.position}</span>
                  <span className="text-xs text-white/80 font-medium truncate">{c.team}</span>
                </div>
                <span className="text-xs text-white/50 shrink-0">{c.points}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

// ── Dashboard Page ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [selectorOpen, setSelectorOpen] = useState(false);  // T007
  const navigate = useNavigate();
  const { setActiveSession } = useSessionContext();
  const { data: schedule, isLoading: scheduleLoading } = useSchedule(CURRENT_YEAR);

  // T005: navigate to the correct page after session confirm
  function handleSessionConfirm(session) {
    navigate(routeForSessionType(session.sessionType));
  }

  // T006: recent session click → set active + navigate
  function handleRecentSelect(session) {
    setActiveSession(session);
    navigate(routeForSessionType(session.sessionType));
  }

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <PageHeader title="F1 Console" />

      {/* T005 — Session Selector Hero */}
      <Card glow className="p-6 md:p-8 mb-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold font-display text-white">Select Session</h2>
          <p className="text-sm text-white/45">
            Choose a year, event, and session type to load race or qualifying data.
          </p>
        </div>
        <div>
          <button
            onClick={() => setSelectorOpen(true)}
            className="shiny-cta inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Select Session
          </button>
        </div>

        {/* T006 — Recent sessions */}
        <RecentSessions onSelect={handleRecentSelect} />
      </Card>

      {/* Secondary cards grid (T008, T009, T010, T011) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* T008 — Tracks navigation card (US2) */}
        <Link to="/track" className="block group">
          <Card glow className="p-5 flex flex-col gap-3 h-full">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#ef233c] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" />
                <path d="M12 8v4l2 2" />
              </svg>
              <span className="text-xs font-semibold text-white/40 uppercase tracking-widest font-display">
                Tracks
              </span>
            </div>
            <p className="text-base font-bold text-white font-display group-hover:text-[#ef233c] transition-colors duration-200">
              Explore Circuits
            </p>
            <p className="text-xs text-white/40">
              View track layouts, telemetry overlays, and corner annotations.
            </p>
            <div className="mt-auto flex items-center gap-1 text-xs text-white/30 group-hover:text-white/60 transition-colors duration-200">
              Open Track page
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </Card>
        </Link>

        {/* T009 — Upcoming race card (US3) */}
        <UpcomingRaceCard schedule={schedule} isLoading={scheduleLoading} />

        {/* T010+T011 — Standings snapshot card (US3) */}
        <StandingsSnapshotCard schedule={schedule} scheduleLoading={scheduleLoading} />
      </div>

      {/* T005 — SessionSelector dialog with onConfirm navigation */}
      <SessionSelector
        open={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        onConfirm={handleSessionConfirm}
      />
    </div>
  );
}

