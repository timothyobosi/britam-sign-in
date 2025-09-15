import { useState } from 'react';

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

// ==============================|| CONTROLLED COLUMN VISIBILITY DATA GRID ||============================== //

export default function VisibleColumnsModelControlled() {
    const theme = useTheme();
    const { data, loading } = useDemoData({
        dataSet: 'Commodity',
        rowLength: 20,
        maxColumns: 20
    });

    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        id: false,
        brokerId: false,
        status: false
    });

    let headers = [];
    data.columns.map((item) => {
        return headers.push({ label: item.headerName, key: item.field });
    });

    return (
        <MainCard
            content={false}
            title="Controlled Visible Columns"
            secondary={
                <Stack direction="row" spacing={2} alignItems="center">
                    <CSVExport data={data.rows} filename={'controlled-visibility-data-grid-table.csv'} header={headers} />
                    <CardSecondaryAction link="https://mui.com/x/react-data-grid/column-visibility/#controlled-visible-columns" />
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
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5
                            }
                        }
                    }}
                    autoHeight
                    hideFooterSelectedRowCount
                    columnVisibilityModel={columnVisibilityModel}
                    onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
                />
            </Box>
        </MainCard>
    );
}
