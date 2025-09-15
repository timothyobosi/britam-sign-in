// material-ui
import Grid from '@mui/material/Grid';

// project import
import { gridSpacing } from 'store/constant';
import BasicColumnGroup from './BasicColumnGroup';
import CustomColumnGroup from './CustomColumnGroup';

// ==============================|| COLUMN GROUPING DATA GRID ||============================== //

export default function ColumnGroups() {
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <BasicColumnGroup />
            </Grid>
            <Grid item xs={12}>
                <CustomColumnGroup />
            </Grid>
        </Grid>
    );
}
