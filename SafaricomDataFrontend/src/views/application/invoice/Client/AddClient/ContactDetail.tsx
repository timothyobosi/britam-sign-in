// material-ui
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

// project imports
import { gridSpacing } from 'store/constant';

// ==============================|| CONTACT DETAIL ||============================== //

const ContactDetail = () => {
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Phone no." defaultValue="000-00-00000" />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Mobile no." defaultValue="000-00-00000" />
            </Grid>
            <Grid item xs={12}>
                <FormControlLabel control={<Checkbox defaultChecked name="checkedA" color="primary" />} label="Same as billing address" />
            </Grid>
        </Grid>
    );
};

export default ContactDetail;
