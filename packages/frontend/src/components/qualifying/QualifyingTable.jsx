import { DataGrid } from '@mui/x-data-grid';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

function formatTime(seconds) {
  if (seconds == null) return '—';
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(3).padStart(6, '0');
  return `${mins}:${secs}`;
}

function buildColumns(roundFilter) {
  const qCols = ['Q1', 'Q2', 'Q3'];
  return [
    { field: 'position', headerName: 'Pos', width: 60, type: 'number' },
    { field: 'driver', headerName: 'Driver', width: 80 },
    { field: 'full_name', headerName: 'Name', width: 150 },
    { field: 'team', headerName: 'Team', width: 160 },
    ...qCols.map((q) => ({
      field: q.toLowerCase() + '_seconds',
      headerName: q,
      width: 100,
      type: 'number',
      valueFormatter: (value) => formatTime(value),
      cellClassName: (params) => {
        if (params.value == null) return 'q-null-cell';
        if (roundFilter !== 'All' && roundFilter === q) return 'q-active-col';
        if (roundFilter !== 'All' && roundFilter !== q) return 'q-dim-col';
        return '';
      },
    })),
    {
      field: 'lap_time_seconds',
      headerName: 'Best',
      width: 100,
      type: 'number',
      valueFormatter: (value) => formatTime(value),
    },
    {
      field: 'delta_to_pole_seconds',
      headerName: 'Δ Pole',
      width: 90,
      type: 'number',
      valueFormatter: (value) => (value === 0 ? '—' : `+${value?.toFixed(3)}`),
    },
  ];
}

export default function QualifyingTable({ results, isLoading, roundFilter, onDriverSelect, selectedDriver }) {
  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={400} />;
  }

  const rows = (results ?? []).map((r, i) => ({ id: i, ...r }));

  return (
    <Box
      sx={{
        height: 500,
        '& .q-null-cell': { color: '#bdbdbd' },
        '& .q-active-col': { backgroundColor: 'rgba(25,118,210,0.08)', fontWeight: 700 },
        '& .q-dim-col': { color: '#9e9e9e' },
        '& .MuiDataGrid-row.q-selected-row': {
          backgroundColor: 'rgba(25,118,210,0.18) !important',
          fontWeight: 700,
        },
        '& .MuiDataGrid-row.q-selected-row:hover': {
          backgroundColor: 'rgba(25,118,210,0.28) !important',
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={buildColumns(roundFilter)}
        density="compact"
        disableRowSelectionOnClick={false}
        onRowClick={(params) => onDriverSelect?.(params.row)}
        getRowClassName={(params) =>
          params.row.driver === selectedDriver?.driver ? 'q-selected-row' : ''
        }
        pageSizeOptions={[20]}
        initialState={{ pagination: { paginationModel: { pageSize: 20 } } }}
      />
    </Box>
  );
}
