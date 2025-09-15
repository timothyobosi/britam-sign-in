import React from 'react';
import { useLoaderData } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';

// project imports
import ItemTable from './ItemTable';
import ItemDrawer from './ItemDrawer';
import ItemFilter from './ItemFilter';

// assets
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| ITEM LIST ||============================== //

const ItemList = () => {
    const [open, setOpen] = React.useState(false);
    const [rowValue, setRowValue] = React.useState(null);
    const [rows, setRows] = React.useState([]);

    const products = useLoaderData();

    React.useEffect(() => {
        setRows(products);
    }, [products]);

    return (
        <MainCard content={false}>
            {/* filter section */}
            <CardContent>
                <ItemFilter {...{ products, setRows }} />
            </CardContent>

            {/* table */}
            <Box display={open ? 'flex' : 'block'}>
                <Grid container sx={{ position: 'relative' }}>
                    <Grid item sm={open ? 5 : 12} xs={12}>
                        <ItemTable open={open} setOpen={setOpen} setRowValue={setRowValue} rows={rows} />
                    </Grid>
                    <Grid item sm={open ? 7 : 12} xs={12} sx={{ borderLeft: '1px solid', borderColor: 'divider' }}>
                        <ItemDrawer open={open} setOpen={setOpen} rowValue={rowValue} />
                    </Grid>
                </Grid>
            </Box>
        </MainCard>
    );
};

export default ItemList;
