import { Routes, Route } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext.jsx';
import AppShell from './components/layout/AppShell.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import RacePage from './pages/RacePage.jsx';
import TrackPage from './pages/TrackPage.jsx';
import QualifyingPage from './pages/QualifyingPage.jsx';
import ChampionshipPage from './pages/ChampionshipPage.jsx';

export default function App() {
  return (
    <SessionProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/race" element={<RacePage />} />
          <Route path="/track" element={<TrackPage />} />
          <Route path="/qualifying" element={<QualifyingPage />} />
          <Route path="/championship" element={<ChampionshipPage />} />
        </Routes>
      </AppShell>
    </SessionProvider>
  );
}
