import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import { useSessionContext } from '../../context/SessionContext.jsx';

const NAV_TABS = [
  { label: 'Lap Times', path: '/lap-times' },
  { label: 'Track', path: '/track' },
  { label: 'Qualifying', path: '/qualifying' },
  { label: 'Championship', path: '/championship' },
];

export default function NavBar({ onSessionClick }) {
  const location = useLocation();
  const { activeSession } = useSessionContext();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentTab = NAV_TABS.findIndex((t) => location.pathname.startsWith(t.path));

  const sessionLabel = activeSession
    ? `${activeSession.year} – ${activeSession.event} ${activeSession.sessionType}`
    : 'Select Session';

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar sx={{ gap: 1 }}>
        {/* Hamburger — mobile only */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open navigation menu"
          sx={{ display: { sm: 'none' }, mr: 1 }}
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ fontWeight: 700, mr: 3, flexShrink: 0 }}>
          F1 Console
        </Typography>

        {/* Tab navigation — desktop only */}
        <Tabs
          value={currentTab === -1 ? false : currentTab}
          textColor="inherit"
          slotProps={{ indicator: { style: { backgroundColor: '#ff9800' } } }}
          sx={{ display: { xs: 'none', sm: 'flex' }, flexGrow: 1 }}
        >
          {NAV_TABS.map((tab) => (
            <Tab
              key={tab.path}
              label={tab.label}
              component={Link}
              to={tab.path}
              sx={{ minWidth: 100, fontWeight: 500 }}
            />
          ))}
        </Tabs>

        <Box sx={{ flexGrow: { xs: 1, sm: 0 } }} />

        <Button
          variant="outlined"
          color="inherit"
          size="small"
          onClick={onSessionClick}
          sx={{
            borderColor: 'rgba(255,255,255,0.5)',
            whiteSpace: 'nowrap',
            maxWidth: { xs: 140, sm: 200 },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {sessionLabel}
        </Button>
      </Toolbar>

      {/* Mobile navigation drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 240 } }}
      >
        <List>
          {NAV_TABS.map((tab) => (
            <ListItem key={tab.path} disablePadding>
              <ListItemButton
                component={Link}
                to={tab.path}
                selected={location.pathname.startsWith(tab.path)}
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemText primary={tab.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
}
