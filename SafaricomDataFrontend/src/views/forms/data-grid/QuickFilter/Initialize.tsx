import { useMemo } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

// project import
import MainCard from 'ui-component/cards/MainCard';
import CardSecondaryAction from 'ui-component/cards/CardSecondaryAction';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin', 'phone', 'email'];

// ==============================|| QUICK FILTER DATA GRID ||============================== //

export default function QuickFilteringInitialize() {
    const { data } = useDemoData({
        dataSet: 'Employee',
        visibleFields: VISIBLE_FIELDS,
        rowLength: 100
    });

    // Otherwise filter will be applied on fields such as the hidden column id
    const columns = useMemo(() => data.columns.filter((column) => VISIBLE_FIELDS.includes(column.field)), [data.columns]);

    return (
        <MainCard
            content={false}
            title="Initialize Quick Filter"
            secondary={
                <Stack direction="row" spacing={2} alignItems="center">
                    <CardSecondaryAction link="https://mui.com/x/react-data-grid/filtering/quick-filter/#initialize-the-quick-filter-values" />
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
                            },
                            '& .MuiFormControl-root > .MuiInput-root': {
                                p: 0.6,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                bgcolor: 'grey.50'
                            },
                            '& .MuiFormControl-root > .MuiInputBase-root:after': {
                                display: 'none'
                            },
                            '& .MuiFormControl-root > .MuiInputBase-root:before': {
                                display: 'none'
                            },
                            '& .MuiFormControl-root > .Mui-focused': {
                                border: '1px solid',
                                borderColor: 'primary.main'
                            }
                        }
                    }
                }}
            >
                <DataGrid
                    {...data}
                    initialState={{
                        ...data.initialState,
                        pagination: {
                            paginationModel: {
                                pageSize: 5
                            }
                        },
                        filter: {
                            filterModel: {
                                items: [],
                                quickFilterValues: ['ab']
                            }
                        }
                    }}
                    autoHeight
                    disableColumnFilter
                    disableColumnSelector
                    disableDensitySelector
                    hideFooterSelectedRowCount
                    columns={columns}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true
                        }
                    }}
                />
            </Box>
        </MainCard>
    );
}
