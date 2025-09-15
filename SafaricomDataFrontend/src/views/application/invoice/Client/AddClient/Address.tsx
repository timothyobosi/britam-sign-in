// material-ui
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';

// project imports
import { gridSpacing } from 'store/constant';

// ==============================|| ADDRESS ||============================== //

const Address = () => {
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Billing no./Name" />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Street" />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField fullWidth label="City" />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField fullWidth label="State" />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Country" />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Area Code" />
            </Grid>
            <Grid item xs={12}>
                <FormControlLabel control={<Checkbox defaultChecked name="checkedA" color="primary" />} label="Same as billing address" />
            </Grid>
        </Grid>
    );
};

export default Address;
