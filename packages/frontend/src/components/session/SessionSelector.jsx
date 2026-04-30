import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { useSessionContext } from '../../context/SessionContext.jsx';
import { useSchedule } from '../../hooks/useSession.js';

const YEARS = Array.from({ length: 9 }, (_, i) => 2018 + i); // 2018–2026
const SESSION_TYPES = ['FP1', 'FP2', 'FP3', 'Q', 'SQ', 'R', 'S'];

export default function SessionSelector({ open, onClose }) {
  const { setActiveSession } = useSessionContext();
  const [year, setYear] = useState('');
  const [event, setEvent] = useState('');
  const [sessionType, setSessionType] = useState('');

  const { data: schedule, isLoading } = useSchedule(year || null);

  const events = schedule?.events ?? [];

  function handleYearChange(e) {
    setYear(e.target.value);
    setEvent('');
    setSessionType('');
  }

  function handleConfirm() {
    if (year && event && sessionType) {
      setActiveSession({ year: Number(year), event, sessionType });
      onClose();
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Select Session</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="year-label">Year</InputLabel>
            <Select
              labelId="year-label"
              label="Year"
              value={year}
              onChange={handleYearChange}
            >
              {YEARS.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={!year}>
            <InputLabel id="event-label">Grand Prix</InputLabel>
            <Select
              labelId="event-label"
              label="Grand Prix"
              value={event}
              onChange={(e) => { setEvent(e.target.value); setSessionType(''); }}
              endAdornment={isLoading ? <CircularProgress size={16} sx={{ mr: 2 }} /> : null}
            >
              {events.map((ev) => (
                <MenuItem key={ev.event_name} value={ev.event_name}>
                  {ev.event_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={!event}>
            <InputLabel id="session-label">Session Type</InputLabel>
            <Select
              labelId="session-label"
              label="Session Type"
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
            >
              {SESSION_TYPES.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={!year || !event || !sessionType}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
