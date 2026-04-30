import { DataGrid } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

function buildColumns(canWinDrivers, isSeasonOver) {
  return [
    { field: 'position', headerName: 'Pos', width: 60, type: 'number' },
    {
      field: 'driver_name',
      headerName: 'Driver',
      width: 200,
      renderCell: (params) => {
        const canWin = canWinDrivers.has(params.value);
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {params.value}
            {canWin && !isSeasonOver && (
              <Chip label="Can Win" color="success" size="small" />
            )}
          </Box>
        );
      },
    },
    { field: 'constructor', headerName: 'Team', width: 180 },
    { field: 'points', headerName: 'Points', width: 100, type: 'number' },
    { field: 'wins', headerName: 'Wins', width: 80, type: 'number' },
  ];
}

export default function StandingsTable({
  standings,
  wdcScenarios,
  isLoading,
  isSeasonOver,
  onDriverSelect,
}) {
  if (isLoading) return <Skeleton variant="rectangular" width="100%" height={400} />;

  const canWinDrivers = new Set((wdcScenarios?.contenders ?? []).map((c) => c.driver));
  const rows = (standings ?? []).map((s, i) => ({ id: i, ...s }));
  const champion = isSeasonOver && rows[0]?.driver_name;

  return (
    <Box
      sx={{
        height: 500,
        '& .champion-row': {
          backgroundColor: 'rgba(255, 215, 0, 0.15)',
          fontWeight: 700,
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={buildColumns(canWinDrivers, isSeasonOver)}
        density="compact"
        onRowClick={(params) => onDriverSelect?.(params.row)}
        pageSizeOptions={[20]}
        initialState={{ pagination: { paginationModel: { pageSize: 20 } } }}
        getRowClassName={(params) =>
          isSeasonOver && params.row.driver_name === champion ? 'champion-row' : ''
        }
      />
    </Box>
  );
}
