import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

// Maps Ergast constructorName → logo file slug
const TEAM_LOGO_SLUG = {
  'Mercedes': 'mercedes',
  'Red Bull': 'red-bull-racing',
  'Ferrari': 'ferrari',
  'McLaren': 'mclaren',
  'Aston Martin': 'aston-martin',
  'Alpine F1 Team': 'alpine',
  'Alpine': 'alpine',
  'Williams': 'williams',
  'AlphaTauri': 'racing-bulls',
  'RB': 'racing-bulls',
  'Racing Bulls': 'racing-bulls',
  'Alfa Romeo': 'kick-sauber',
  'Sauber': 'kick-sauber',
  'Kick Sauber': 'kick-sauber',
  'Haas F1 Team': 'haas-f1-team',
  'Haas': 'haas-f1-team',
};

// Maps Ergast constructorNationality → country flag code
const NATIONALITY_FLAG = {
  'German': 'ger',
  'Austrian': 'aut',
  'Italian': 'ita',
  'British': 'gbr',
  'French': 'fra',
  'American': 'usa',
  'Japanese': 'jpn',
  'Dutch': 'ned',
  'Spanish': 'esp',
  'Belgian': 'bel',
  'Brazilian': 'bra',
  'Mexican': 'mex',
  'Canadian': 'can',
  'Australian': 'aus',
  'Russian': 'rus',
  'Hungarian': 'hun',
  'Portuguese': 'por',
  'Monegasque': 'mon',
};

function TeamCell({ team }) {
  const slug = TEAM_LOGO_SLUG[team];
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {slug ? (
        <img
          src={`/team-logos/${slug}.svg`}
          alt={team}
          style={{ width: 20, height: 20, objectFit: 'contain', flexShrink: 0 }}
        />
      ) : null}
      <span>{team}</span>
    </Box>
  );
}

function NationalityCell({ nationality }) {
  const code = NATIONALITY_FLAG[nationality];
  if (!code) return <span>{nationality}</span>;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
      <img
        src={`/country-flags/${code}.svg`}
        alt={nationality}
        style={{ width: 18, height: 12, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }}
      />
    </Box>
  );
}

function buildColumns() {
  return [
    { field: 'position', headerName: 'Pos', width: 55, type: 'number' },
    {
      field: 'team',
      headerName: 'Constructor',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => <TeamCell team={params.value} />,
    },
    {
      field: 'nationality',
      headerName: '',
      width: 50,
      sortable: false,
      renderCell: (params) => <NationalityCell nationality={params.value} />,
    },
    { field: 'points', headerName: 'Points', width: 90, type: 'number' },
    { field: 'wins', headerName: 'Wins', width: 70, type: 'number' },
  ];
}

export default function ConstructorsTable({ constructors, isLoading, isSeasonOver }) {
  if (isLoading) return <Skeleton variant="rectangular" width="100%" height={400} />;

  const rows = (constructors ?? []).map((c, i) => ({ id: i, ...c }));
  const champion = isSeasonOver && rows[0]?.team;

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
        columns={buildColumns()}
        density="compact"
        pageSizeOptions={[20]}
        initialState={{ pagination: { paginationModel: { pageSize: 20 } } }}
        getRowClassName={(params) =>
          isSeasonOver && params.row.team === champion ? 'champion-row' : ''
        }
      />
    </Box>
  );
}
