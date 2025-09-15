// material-ui
import Grid from '@mui/material/Grid';

// project import
import VisibilityPanel from './VisibilityPanel';
import ControlledVisibility from './ControlledVisibility';
import InitializeColumnVisibility from './InitializeColumnVisibility';
import { gridSpacing } from 'store/constant';

// ==============================|| COLUMN VISIBILITY DATA GRID ||============================== //

export default function ColumnVisibility() {
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <InitializeColumnVisibility />
            </Grid>
            <Grid item xs={12}>
                <ControlledVisibility />
            </Grid>
            <Grid item xs={12}>
                <VisibilityPanel />
            </Grid>
        </Grid>
    );
}
