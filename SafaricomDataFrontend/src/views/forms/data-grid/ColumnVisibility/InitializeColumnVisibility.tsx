// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

// project import
import MainCard from 'ui-component/cards/MainCard';
import CardSecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { CSVExport } from 'views/forms/tables/TableExports';
import { ThemeMode } from 'config';

// ==============================|| INITIALIZE COLUMN VISIBILITY DATA GRID ||============================== //

export default function VisibleColumnsModelInitialState() {
    const theme = useTheme();
    const { data, loading } = useDemoData({
        dataSet: 'Commodity',
        rowLength: 20,
        maxColumns: 20
    });

    let headers = [];
    data.columns.map((item) => {
        return headers.push({ label: item.headerName, key: item.field });
    });

    return (
        <MainCard
            content={false}
            title="Initialize Column Visibility"
            secondary={
                <Stack direction="row" spacing={2} alignItems="center">
                    <CSVExport data={data.rows} filename={'column-visibility-data-grid-table.csv'} header={headers} />
                    <CardSecondaryAction link="https://mui.com/x/react-data-grid/column-visibility/#initialize-the-visible-columns" />
                </Stack>
            }
        >
            <Box
                sx={{
                    width: '100%',
                    '& .MuiDataGrid-root': {
                        '& .MuiDataGrid-cell--withRenderer > .positive': {
                            color: theme.palette.mode === ThemeMode.DARK ? 'success.dark' : 'success.main'
                        },
                        '& .MuiDataGrid-cell--withRenderer > .negative': {
                            color: theme.palette.mode === ThemeMode.DARK ? 'error.dark' : 'error.main'
                        }
                    }
                }}
            >
                <DataGrid
                    {...data}
                    loading={loading}
                    autoHeight
                    hideFooterSelectedRowCount
                    initialState={{
                        ...data.initialState,
                        pagination: {
                            paginationModel: {
                                pageSize: 5
                            }
                        },
                        columns: {
                            ...data.initialState?.columns,
                            columnVisibilityModel: {
                                id: false,
                                brokerId: false,
                                status: false
                            }
                        }
                    }}
                />
            </Box>
        </MainCard>
    );
}
