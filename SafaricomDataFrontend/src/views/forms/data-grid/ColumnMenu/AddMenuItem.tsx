import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { DataGrid, GridColumnMenu } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

// project import
import MainCard from 'ui-component/cards/MainCard';
import CardSecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { CSVExport } from 'views/forms/tables/TableExports';

// assets
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';

function CustomUserItem(props) {
    const { myCustomHandler, myCustomValue } = props;
    return (
        <MenuItem onClick={myCustomHandler}>
            <ListItemIcon>
                <SettingsApplicationsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{myCustomValue}</ListItemText>
        </MenuItem>
    );
}

CustomUserItem.propTypes = {
    myCustomHandler: PropTypes.func,
    myCustomValue: PropTypes.func
};

function CustomColumnMenu(props) {
    return (
        <GridColumnMenu
            {...props}
            slots={{
                // Add new item
                columnMenuUserItem: CustomUserItem
            }}
            slotProps={{
                columnMenuUserItem: {
                    // set `displayOrder` for new item
                    displayOrder: 15,
                    // pass additional props
                    myCustomValue: 'Do custom action',
                    myCustomHandler: () => alert('Custom handler fired')
                }
            }}
        />
    );
}

// ==============================|| ADD MENU ITEM DATA GRID ||============================== //

export default function AddMenuItem() {
    const { data } = useDemoData({
        dataSet: 'Commodity',
        rowLength: 5,
        maxColumns: 8
    });

    let headers = [];
    data.columns.map((item) => {
        return headers.push({ label: item.headerName, key: item.field });
    });

    return (
        <MainCard
            content={false}
            title="Adding Menu Item"
            secondary={
                <Stack direction="row" spacing={2} alignItems="center">
                    <CSVExport data={data.rows} filename={'add-menu-item-data-grid-table.csv'} header={headers} />
                    <CardSecondaryAction link="https://mui.com/x/react-data-grid/column-menu/#adding-a-menu-item" />
                </Stack>
            }
        >
            <Box sx={{ width: '100%' }}>
                <DataGrid autoHeight hideFooter {...data} slots={{ columnMenu: CustomColumnMenu }} />
            </Box>
        </MainCard>
    );
}
