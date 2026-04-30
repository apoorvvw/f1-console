import { useState } from 'react';
import Box from '@mui/material/Box';
import NavBar from './NavBar.jsx';
import RecentSessions from '../session/RecentSessions.jsx';
import SessionSelector from '../session/SessionSelector.jsx';

export default function AppShell({ children }) {
  const [selectorOpen, setSelectorOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar onSessionClick={() => setSelectorOpen(true)} />
      <Box
        component="nav"
        sx={{
          backgroundColor: '#fff',
          borderBottom: '1px solid #e0e0e0',
          px: 2,
          py: 0.5,
          display: { xs: 'none', sm: 'flex' },
          alignItems: 'center',
          gap: 1,
          minHeight: 40,
        }}
      >
        <RecentSessions />
      </Box>
      <Box
        component="main"
        sx={{ flex: 1, p: { xs: 1, sm: 2, md: 3 }, backgroundColor: '#f5f5f5' }}
      >
        {children}
      </Box>
      <SessionSelector open={selectorOpen} onClose={() => setSelectorOpen(false)} />
    </Box>
  );
}
