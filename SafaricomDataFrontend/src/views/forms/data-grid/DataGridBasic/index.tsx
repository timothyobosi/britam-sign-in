import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { DataGrid } from '@mui/x-data-grid';

// project import
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import { CSVExport } from 'views/forms/tables/TableExports';

// table columns
export const columns = [
    { field: 'id', headerName: 'ID', width: 120 },
    {
        field: 'fullName',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        flex: 2,
        minWidth: 160,
        valueGetter: (params) => `${params.row.firstName || ''} ${params.row.lastName || ''}`
    },
    { field: 'firstName', headerName: 'First name', flex: 1, minWidth: 164 },
    { field: 'lastName', headerName: 'Last name', flex: 0.75, minWidth: 164 },
    {
        field: 'age',
        headerName: 'Age',
        flex: 0.5,
        minWidth: 120
    }
];

// table rows
export const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lancaster', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lancaster', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 }
];

function TableDataGrid({ Selected }) {
    return (
        <Box sx={{ width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                autoHeight
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5
                        }
                    }
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                onRowSelectionModelChange={(newSelectionModel) => {
                    const selectedIDs = new Set(newSelectionModel);
                    const selectedRowData = rows.filter((row) => selectedIDs.has(row.id));
                    Selected(selectedRowData);
                }}
            />
        </Box>
    );
}

TableDataGrid.propTypes = {
    Selected: PropTypes.func
};

// ==============================|| TABLE - BASIC DATA GRID ||============================== //

export default function DataGridBasic() {
    let headers = [];
    columns.map((item) => {
        return headers.push({ label: item.headerName, key: item.field });
    });

    const [selectedValue, setSelectedValue] = useState([]);
    const handlerClick = (data) => {
        setSelectedValue(data);
    };

    let NewValue = selectedValue.length > 0 ? selectedValue : rows;

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <MainCard
                    content={false}
                    title="Basic Data Grid"
                    secondary={
                        <Stack direction="row" spacing={2} alignItems="center">
                            <CSVExport data={NewValue} filename={'data-grid-table.csv'} header={headers} />
                            <SecondaryAction link="https://material-ui.com/components/data-grid/" />
                        </Stack>
                    }
                >
                    <TableDataGrid Selected={handlerClick} />
                </MainCard>
            </Grid>
        </Grid>
    );
}
