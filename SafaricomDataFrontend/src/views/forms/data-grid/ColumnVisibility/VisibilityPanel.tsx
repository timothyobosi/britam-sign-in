// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

// project import
import MainCard from 'ui-component/cards/MainCard';
import CardSecondaryAction from 'ui-component/cards/CardSecondaryAction';

// ==============================|| COLUMN VISIBILITY PANEL DATA GRID ||============================== //

export default function ColumnVisibilityPanel() {
    const { data } = useDemoData({
        dataSet: 'Commodity',
        rowLength: 10,
        maxColumns: 8
    });

    return (
        <MainCard
            content={false}
            title="Column Visibility Panel"
            secondary={
                <Stack direction="row" spacing={2} alignItems="center">
                    <CardSecondaryAction link="https://mui.com/x/react-data-grid/column-visibility/#column-visibility-panel" />
                </Stack>
            }
        >
            <Box
                sx={{
                    width: '100%',
                    '& .MuiDataGrid-root': {
                        '& .MuiDataGrid-toolbarContainer': {
                            pl: 3,
                            pr: 2,
                            pt: 2,
                            '& .MuiButton-root': {
                                p: 1,
                                color: 'common.white',
                                borderRadius: 1.5,
                                bgcolor: 'primary.main'
                            }
                        }
                    }
                }}
            >
                <DataGrid
                    {...data}
                    autoHeight
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5
                            }
                        }
                    }}
                    slots={{ toolbar: GridToolbar }}
                    hideFooterSelectedRowCount
                />
            </Box>
        </MainCard>
    );
}
