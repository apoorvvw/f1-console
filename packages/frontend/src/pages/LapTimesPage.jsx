import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import { useSessionContext } from '../context/SessionContext.jsx';
import { useSessionInfo } from '../hooks/useSession.js';
import { useLapDistribution, useDriverComparison } from '../hooks/useLapTimes.js';
import LapFilters from '../components/lapTimes/LapFilters.jsx';
import LapDistributionChart from '../components/lapTimes/LapDistributionChart.jsx';
import DriverComparisonChart from '../components/lapTimes/DriverComparisonChart.jsx';
import Card from '../components/ui/Card.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import InfoAlert from '../components/ui/InfoAlert.jsx';

export default function LapTimesPage() {
  const { activeSession } = useSessionContext();
  const { year, event, sessionType } = activeSession ?? {};

  const { data: sessionInfo } = useSessionInfo(year, event, sessionType);
  const drivers = (sessionInfo?.drivers ?? []).map((d) => d.abbreviation);
  const maxLap = sessionInfo?.total_laps ?? 70;

  const [filters, setFilters] = useState({
    selectedDrivers: [],
    compound: 'All',
    lapRange: [1, maxLap],
    maxLap,
  });

  const { data: distData, isLoading: distLoading, error: distError } = useLapDistribution(year, event);
  const { data: compData, isLoading: compLoading } = useDriverComparison(
    year,
    event,
    sessionType,
    filters.selectedDrivers,
  );

  if (!activeSession) {
    return (
      <InfoAlert>
        No session selected. Use the <strong className="text-white/70">Select Session</strong> button to choose a race or qualifying session.
      </InfoAlert>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Lap Times"
        subtitle={`${event} · ${year} · ${sessionType}`}
        badge="Live Data"
      />

      <Card className="p-4 mb-4">
        <LapFilters
          drivers={drivers}
          filters={{ ...filters, maxLap }}
          onChange={(f) => setFilters(f)}
        />
      </Card>

      <div className="grid grid-cols-1 gap-4">
        <Card className="p-4">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">
            Lap Time Distribution
          </h2>
          <LapDistributionChart
            data={distData}
            isLoading={distLoading}
            error={distError}
            filters={filters}
          />
        </Card>

        <Card className="p-4">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">
            Driver Comparison
          </h2>
          <DriverComparisonChart
            data={compData}
            isLoading={compLoading}
            selectedDrivers={filters.selectedDrivers}
          />
        </Card>
      </div>
    </div>
  );
}

