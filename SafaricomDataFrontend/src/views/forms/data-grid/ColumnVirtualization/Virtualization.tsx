import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

// project import
import MainCard from 'ui-component/cards/MainCard';
import CardSecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { CSVExport } from 'views/forms/tables/TableExports';

function useData(rowLength, columnLength) {
    const [data, setData] = useState({ columns: [], rows: [] });

    useEffect(() => {
        const rows = [];

        for (let i = 0; i < rowLength; i += 1) {
            const row = {
                id: i
            };

            for (let j = 1; j <= columnLength; j += 1) {
                row[`price${j}M`] = `${i.toString()}, ${j} `;
            }

            rows.push(row);
        }

        const columns = [];

        for (let j = 1; j <= columnLength; j += 1) {
            columns.push({ field: `price${j}M`, headerName: `${j}M` });
        }

        setData({
            rows,
            columns
        });
    }, [rowLength, columnLength, setData]);

    return data;
}

useData.propTypes = {
    rowLength: PropTypes.array,
    columnLength: PropTypes.array,
    columns: PropTypes.array,
    rows: PropTypes.array
};

// ==============================|| COLUMN VIRTUALIZATION DATA GRID ||============================== //

export default function ColumnVirtualizationGrid() {
    const data = useData(100, 1000);
    let headers = [];
    data.columns.map((item) => {
        return headers.push({ label: item.headerName, key: item.field });
    });

    return (
        <MainCard
            content={false}
            title="Column Virtualization"
            secondary={
                <Stack direction="row" spacing={2} alignItems="center">
                    <CSVExport data={data.rows} filename={'column-virtualization-data-grid-table.csv'} header={headers} />
                    <CardSecondaryAction link="https://mui.com/x/react-data-grid/virtualization/#column-virtualization" />
                </Stack>
            }
        >
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    hideFooter
                    {...data}
                    columnBuffer={2}
                    columnThreshold={2}
                    sx={{ '& .MuiDataGrid-columnHeaderTitleContainer': { minWidth: '135px' } }}
                />
            </Box>
        </MainCard>
    );
}
