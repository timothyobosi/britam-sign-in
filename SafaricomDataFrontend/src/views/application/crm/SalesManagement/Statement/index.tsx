import { useEffect, useState } from 'react';

// mui
import Grid from '@mui/material/Grid';

// project imports
import Filter from './Filter';
import OverView from './OverView';
import StatementTable from './StatementTable';
import MainCard from 'ui-component/cards/MainCard';

import { dispatch, useSelector } from 'store';
import { gridSpacing } from 'store/constant';
import { getOrders } from 'store/slices/customer';

// ==============================|| STATEMENT ||============================== //

const Statement = () => {
    const [rows, setRows] = useState([]);

    const { orders } = useSelector((state) => state.customer);

    useEffect(() => {
        dispatch(getOrders());
    }, []);

    useEffect(() => {
        setRows(orders);
    }, [orders]);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <OverView />
            </Grid>
            <Grid item xs={12}>
                <MainCard title="Transaction History" content={false}>
                    <Filter {...{ rows: orders, setRows }} />
                    <StatementTable {...{ rows }} />
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default Statement;
