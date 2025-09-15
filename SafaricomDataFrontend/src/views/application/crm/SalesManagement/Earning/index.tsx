import { useEffect, useState } from 'react';

// mui
import Grid from '@mui/material/Grid';

// project imports
import EarningTable from './EarningTable';
import Filter from './Filter';
import Overview from './Overview';
import MainCard from 'ui-component/cards/MainCard';

import { dispatch, useSelector } from 'store';
import { gridSpacing } from 'store/constant';
import { getOrders } from 'store/slices/customer';

// ==============================|| EARNING ||============================== //

const Earning = () => {
    const [rows, setRows] = useState([]);
    const [isLoading, setLoading] = useState(true);

    const { orders } = useSelector((state) => state.customer);

    useEffect(() => {
        dispatch(getOrders()).then(() => setLoading(false));
    }, []);

    useEffect(() => {
        setRows(orders);
    }, [orders]);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Overview isLoading={isLoading} />
            </Grid>
            <Grid item xs={12}>
                <MainCard title="Earning Request" content={false}>
                    <Filter {...{ rows: orders, setRows }} />
                    <EarningTable {...{ rows }} />
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default Earning;
