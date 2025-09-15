// material-ui
import Grid from '@mui/material/Grid';

// project import
import Initialize from './Initialize';
import CustomFilter from './CustomFilter';
import ParsingValues from './ParsingValues';
import ExcludeHiddenColumns from './ExcludeHiddenColumns';

import { gridSpacing } from 'store/constant';

// ==============================|| QUICK FILTER DATA GRID ||============================== //

export default function QuickFilter() {
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Initialize />
            </Grid>
            <Grid item xs={12}>
                <ExcludeHiddenColumns />
            </Grid>
            <Grid item xs={12}>
                <CustomFilter />
            </Grid>
            <Grid item xs={12}>
                <ParsingValues />
            </Grid>
        </Grid>
    );
}
