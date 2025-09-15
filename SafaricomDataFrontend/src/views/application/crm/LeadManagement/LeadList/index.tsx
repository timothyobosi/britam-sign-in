import { useEffect, useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

// project-imports
import LeadDrawer from './LeadDrawer';
import LeadTable from './LeadTable';
import Filter from './Filter';
import MainCard from 'ui-component/cards/MainCard';

import { dispatch, useSelector } from 'store';
import { getOrders } from 'store/slices/customer';

// ==============================|| LEAD LIST ||============================== //

const LeadList = () => {
    const [rows, setRows] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const { orders } = useSelector((state) => state.customer);

    const handleToggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    useEffect(() => {
        dispatch(getOrders());
    }, []);

    useEffect(() => {
        setRows(orders);
    }, [orders]);

    return (
        <MainCard content={false}>
            {/* table */}
            <Box sx={{ display: drawerOpen ? 'flex' : 'block' }}>
                <Grid container sx={{ position: 'relative', display: drawerOpen ? 'flex' : 'block' }}>
                    <Grid item xs={12} {...{ sm: drawerOpen && 8 }}>
                        <Filter {...{ handleToggleDrawer, rows: orders, setRows }} />
                        <LeadTable {...{ rows }} />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        {...{ sm: drawerOpen && 4 }}
                        sx={{
                            borderLeft: '1px solid',
                            borderColor: 'divider'
                        }}
                    >
                        <LeadDrawer {...{ open: drawerOpen, handleToggleDrawer }} />
                    </Grid>
                </Grid>
            </Box>
        </MainCard>
    );
};

export default LeadList;
