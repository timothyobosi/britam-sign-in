import { useMemo } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { DataGrid, GridToolbarQuickFilter, GridLogicOperator } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

// project import
import MainCard from 'ui-component/cards/MainCard';
import CardSecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { CSVExport } from 'views/forms/tables/TableExports';

function QuickSearchToolbar() {
    return (
        <Box
            sx={{
                pb: 0,
                pl: 3,
                pr: 2,
                pt: 2,
                '& .MuiFormControl-root > .MuiInputBase-root': {
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
            }}
        >
            <GridToolbarQuickFilter
                quickFilterParser={(searchInput) =>
                    searchInput
                        .split(',')
                        .map((value) => value.trim())
                        .filter((value) => value !== '')
                }
            />
        </Box>
    );
}

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin', 'email', 'phone'];

// ==============================|| PARSING VALUES DATA GRID ||============================== //

export default function ParsingValues() {
    const { data } = useDemoData({
        dataSet: 'Employee',
        visibleFields: VISIBLE_FIELDS,
        rowLength: 100
    });

    // Otherwise filter will be applied on fields such as the hidden column id
    const columns = useMemo(() => data.columns.filter((column) => VISIBLE_FIELDS.includes(column.field)), [data.columns]);

    let headers = [];
    columns.map((item) => {
        return headers.push({ label: item.headerName, key: item.field });
    });

    return (
        <MainCard
            content={false}
            title="Parsing Values"
            secondary={
                <Stack direction="row" spacing={2} alignItems="center">
                    <CSVExport data={data.rows} filename={'parsing-value-data-grid-table.csv'} header={headers} />
                    <CardSecondaryAction link="https://mui.com/x/react-data-grid/filtering/quick-filter/#parsing-values" />
                </Stack>
            }
        >
            <Box sx={{ width: '100%' }}>
                <DataGrid
                    {...data}
                    columns={columns}
                    autoHeight
                    initialState={{
                        ...data.initialState,
                        pagination: {
                            paginationModel: {
                                pageSize: 5
                            }
                        },
                        filter: {
                            ...data.initialState?.filter,
                            filterModel: {
                                items: [],
                                quickFilterLogicOperator: GridLogicOperator.Or
                            }
                        }
                    }}
                    hideFooterSelectedRowCount
                    slots={{ toolbar: QuickSearchToolbar }}
                />
            </Box>
        </MainCard>
    );
}
