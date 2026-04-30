import { useState } from 'react';
import { useSessionContext } from '../context/SessionContext.jsx';
import { useQualifyingResults } from '../hooks/useQualifying.js';
import RoundFilter from '../components/qualifying/RoundFilter.jsx';
import QualifyingTable from '../components/qualifying/QualifyingTable.jsx';
import DriverDetailPanel from '../components/qualifying/DriverDetailPanel.jsx';
import Card from '../components/ui/Card.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import InfoAlert from '../components/ui/InfoAlert.jsx';

export default function QualifyingPage() {
  const { activeSession } = useSessionContext();
  const { year, event } = activeSession ?? {};

  const [roundFilter, setRoundFilter] = useState('All');
  const [selectedDriver, setSelectedDriver] = useState(null);

  const { data, isLoading, error } = useQualifyingResults(year, event);

  if (!activeSession) {
    return (
      <InfoAlert>
        No session selected. Use the <strong className="text-white/70">Select Session</strong> button to choose a qualifying session.
      </InfoAlert>
    );
  }

  if (error) {
    return <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">{error.message}</div>;
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Qualifying"
        subtitle={`${event} · ${year}`}
      />

      <Card className="p-4">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="text-xs font-medium text-white/40 uppercase tracking-widest">Filter by round:</span>
          <RoundFilter value={roundFilter} onChange={setRoundFilter} />
        </div>

        <QualifyingTable
          results={data?.results}
          isLoading={isLoading}
          roundFilter={roundFilter}
          onDriverSelect={setSelectedDriver}
        />
      </Card>

      <DriverDetailPanel driver={selectedDriver} onClose={() => setSelectedDriver(null)} />
    </div>
  );
}
