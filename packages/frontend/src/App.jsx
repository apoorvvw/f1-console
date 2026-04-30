import { Routes, Route, Navigate } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext.jsx';
import AppShell from './components/layout/AppShell.jsx';
import LapTimesPage from './pages/LapTimesPage.jsx';
import TrackPage from './pages/TrackPage.jsx';
import QualifyingPage from './pages/QualifyingPage.jsx';
import ChampionshipPage from './pages/ChampionshipPage.jsx';

export default function App() {
  return (
    <SessionProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/lap-times" replace />} />
          <Route path="/lap-times" element={<LapTimesPage />} />
          <Route path="/track" element={<TrackPage />} />
          <Route path="/qualifying" element={<QualifyingPage />} />
          <Route path="/championship" element={<ChampionshipPage />} />
        </Routes>
      </AppShell>
    </SessionProvider>
  );
}
