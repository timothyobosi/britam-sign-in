// material-ui
import Grid from '@mui/material/Grid';

// project import
import CustomMenu from './CustomMenu';
import ColumnMenu from './ColumnMenu';
import DisableMenu from './DisableMenu';
import AddMenuItem from './AddMenuItem';
import HideMenuItem from './HideMenuItem';
import OverrideMenu from './OverrideMenu';
import ReorderingMenu from './ReorderingMenu';
import { gridSpacing } from 'store/constant';

// ==============================|| COLUMN MENU DATA GRID ||============================== //

export default function ColumnMenuDemu() {
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <ColumnMenu />
            </Grid>
            <Grid item xs={12}>
                <AddMenuItem />
            </Grid>
            <Grid item xs={12}>
                <OverrideMenu />
            </Grid>
            <Grid item xs={12}>
                <HideMenuItem />
            </Grid>
            <Grid item xs={12}>
                <ReorderingMenu />
            </Grid>
            <Grid item xs={12}>
                <CustomMenu />
            </Grid>
            <Grid item xs={12}>
                <DisableMenu />
            </Grid>
        </Grid>
    );
}
