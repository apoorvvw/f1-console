import { useState, useEffect, useRef } from 'react';
import { useSessionContext } from '../context/SessionContext.jsx';
import { useQualifyingResults } from '../hooks/useQualifying.js';
import { useLapTelemetry, useCornerAnnotations } from '../hooks/useTrack.js';
import RoundFilter from '../components/qualifying/RoundFilter.jsx';
import QualifyingTable from '../components/qualifying/QualifyingTable.jsx';
import QualifyingDeltaChart from '../components/qualifying/QualifyingDeltaChart.jsx';
import DriverStatsCard from '../components/qualifying/DriverStatsCard.jsx';
import TrackMap from '../components/track/TrackMap.jsx';
import TelemetryToggle from '../components/track/TelemetryToggle.jsx';
import Card from '../components/ui/Card.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import InfoAlert from '../components/ui/InfoAlert.jsx';

export default function QualifyingPage() {
  const { activeSession } = useSessionContext();
  const { year, event } = activeSession ?? {};

  const [roundFilter, setRoundFilter] = useState('All');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [metric, setMetric] = useState('speed');
  const [showCorners, setShowCorners] = useState(true);
  const rightColRef = useRef(null);

  // Reset selected driver and metric when session changes
  useEffect(() => {
    setSelectedDriver(null);
    setMetric('speed');
  }, [activeSession]);

  const { data, isLoading, error } = useQualifyingResults(year, event);

  const {
    data: telemetryData,
    isLoading: telLoading,
    error: telError,
  } = useLapTelemetry(year, event, 'Q', selectedDriver?.driver ?? null, null);

  const { data: cornersData } = useCornerAnnotations(year, event);

  const handleDriverSelect = (row) => {
    setSelectedDriver((prev) => (prev?.driver === row?.driver ? null : row));
    if (row && rightColRef.current) {
      setTimeout(() => {
        rightColRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  if (!activeSession) {
    return (
      <InfoAlert>
        No session selected. Use the <strong className="text-white/70">Select Session</strong> button to choose a qualifying session.
      </InfoAlert>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">
        {error.message}
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader title="Qualifying" subtitle={`${event} · ${year}`} />

      {/* Row 1: Full-width table + round filter */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="text-xs font-medium text-white/40 uppercase tracking-widest">
            Filter by round:
          </span>
          <RoundFilter value={roundFilter} onChange={setRoundFilter} />
        </div>
        <QualifyingTable
          results={data?.results}
          isLoading={isLoading}
          roundFilter={roundFilter}
          onDriverSelect={handleDriverSelect}
          selectedDriver={selectedDriver}
        />
      </Card>

      {/* Row 2: Two-column — delta chart (left) + track map panel (right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Delta chart */}
        <Card className="p-4">
          <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-3">
            Gap to {roundFilter === 'All' ? 'Pole' : `${roundFilter} fastest`}
          </p>
          <QualifyingDeltaChart
            results={data?.results}
            selectedDriver={selectedDriver}
            onDriverSelect={handleDriverSelect}
            roundFilter={roundFilter}
            isLoading={isLoading}
          />
        </Card>

        {/* Right: Stats card + track map */}
        <div ref={rightColRef}>
        <Card className="p-4">
          {!selectedDriver ? (
            <div className="flex items-center justify-center h-48 text-white/30 text-sm">
              Select a driver to view telemetry
            </div>
          ) : (
            <div className="space-y-3">
              <DriverStatsCard driver={selectedDriver} />

              {/* Metric toggle */}
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">
                  Overlay metric
                </p>
                <TelemetryToggle value={metric} onChange={setMetric} />
              </div>

              {/* Corner annotations toggle */}
              <div className="flex items-center gap-2">
                <p className="text-xs text-white/40 uppercase tracking-widest">
                  Corner annotations
                </p>
                <button
                  onClick={() => setShowCorners((v) => !v)}
                  aria-pressed={showCorners}
                  aria-label="Toggle corner annotations"
                  className={[
                    'px-3 py-1 rounded-lg text-xs font-semibold border transition-all duration-200',
                    showCorners
                      ? 'bg-[rgba(239,35,60,0.15)] text-[#ef233c] border-[rgba(239,35,60,0.4)]'
                      : 'bg-white/5 text-white/50 border-white/10 hover:text-white hover:bg-white/10',
                  ].join(' ')}
                >
                  {showCorners ? 'On' : 'Off'}
                </button>
              </div>

              {/* Telemetry error */}
              {telError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                  Could not load telemetry: {telError.message}
                </div>
              )}

              {/* Track map */}
              <TrackMap
                points={telemetryData?.telemetry}
                corners={cornersData?.corners}
                metric={metric}
                showCorners={showCorners}
                isLoading={telLoading}
              />
            </div>
          )}
        </Card>
        </div>
      </div>
    </div>
  );
}

