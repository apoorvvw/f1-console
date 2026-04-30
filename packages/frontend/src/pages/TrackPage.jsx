import { useState, useEffect } from 'react';
import { useSessionContext } from '../context/SessionContext.jsx';
import { useSessionInfo } from '../hooks/useSession.js';
import { useLapTelemetry, useCornerAnnotations } from '../hooks/useTrack.js';
import LapSelector from '../components/track/LapSelector.jsx';
import TelemetryToggle from '../components/track/TelemetryToggle.jsx';
import TrackMap from '../components/track/TrackMap.jsx';
import Card from '../components/ui/Card.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import InfoAlert from '../components/ui/InfoAlert.jsx';

export default function TrackPage() {
  const { activeSession } = useSessionContext();
  const { year, event, sessionType } = activeSession ?? {};

  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedLap, setSelectedLap] = useState(null);
  const [metric, setMetric] = useState('speed');
  const [showCorners, setShowCorners] = useState(true);

  const { data: sessionInfo } = useSessionInfo(year, event, sessionType);
  const drivers = sessionInfo?.drivers ?? [];

  useEffect(() => {
    if (sessionInfo?.fastest_driver) {
      setSelectedDriver(sessionInfo.fastest_driver);
      setSelectedLap(null);
    }
  }, [sessionInfo?.fastest_driver]);

  const { data: telemetry, isLoading: telLoading, error: telError } = useLapTelemetry(
    year,
    event,
    sessionType,
    selectedDriver || null,
    selectedLap,
  );

  const { data: cornersData } = useCornerAnnotations(year, event);

  if (!activeSession) {
    return (
      <InfoAlert>
        No session selected. Use the <strong className="text-white/70">Select Session</strong> button to choose a session.
      </InfoAlert>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Track Visualization"
        subtitle={`${event} · ${year} · ${sessionType}`}
      />

      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4">
        {/* Sidebar */}
        <Card className="p-4 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-white/40 uppercase tracking-widest mb-2">Driver</label>
            <select
              value={selectedDriver}
              onChange={(e) => { setSelectedDriver(e.target.value); setSelectedLap(null); }}
              className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#ef233c] transition-colors"
            >
              <option value="" className="bg-[#111]">— Select —</option>
              {drivers.map((driver) => (
                <option key={driver.abbreviation} value={driver.abbreviation} className="bg-[#111]">
                  {driver.abbreviation} — {driver.full_name}
                </option>
              ))}
            </select>
          </div>

          <LapSelector
            lapCount={sessionInfo?.total_laps ?? 0}
            value={selectedLap}
            onChange={setSelectedLap}
          />

          <div className="h-px bg-white/8" />

          <div>
            <label className="block text-xs font-medium text-white/40 uppercase tracking-widest mb-2">Metric</label>
            <TelemetryToggle value={metric} onChange={setMetric} />
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer group">
            <div
              onClick={() => setShowCorners(!showCorners)}
              className={[
                'relative w-9 h-5 rounded-full border transition-all duration-200',
                showCorners
                  ? 'bg-[rgba(239,35,60,0.2)] border-[rgba(239,35,60,0.4)]'
                  : 'bg-white/5 border-white/15',
              ].join(' ')}
            >
              <span className={[
                'absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200',
                showCorners ? 'left-4 bg-[#ef233c]' : 'left-0.5 bg-white/40',
              ].join(' ')} />
            </div>
            <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">Corner annotations</span>
          </label>

          {telemetry && (
            <div className="mt-auto pt-3 border-t border-white/8">
              <p className="text-xs text-white/35">Lap time</p>
              <p className="text-sm font-mono text-white/70 mt-0.5">{telemetry.lap_time_seconds?.toFixed(3)}s</p>
            </div>
          )}
        </Card>

        {/* Map area */}
        <Card className="p-2">
          {telError && (
            <div className="m-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">{telError.message}</div>
          )}
          {!selectedDriver && !telLoading && (
            <div className="flex items-center justify-center h-40 text-sm text-white/30">
              Select a driver to view the track map.
            </div>
          )}
          <TrackMap
            points={telemetry?.telemetry}
            corners={cornersData?.corners}
            metric={metric}
            showCorners={showCorners}
            isLoading={telLoading}
          />
        </Card>
      </div>
    </div>
  );
}

