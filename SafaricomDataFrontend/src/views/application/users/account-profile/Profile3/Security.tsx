// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';

// ==============================|| PROFILE 3 - SECURITY ||============================== //

const Security = () => {
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item sm={6} md={8}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <SubCard title="Change Password">
                            <Grid container spacing={gridSpacing}>
                                <Grid item xs={12}>
                                    <TextField type="password" id="outlined-basic9" fullWidth label="Current password" />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField type="password" id="outlined-basic10" fullWidth label="New Password" />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField type="password" id="outlined-basic11" fullWidth label="Re-enter New Password" />
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack direction="row">
                                        <AnimateButton>
                                            <Button variant="contained">Change Password</Button>
                                        </AnimateButton>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </SubCard>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item sm={6} md={4}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <SubCard title="Delete Account">
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="body1">
                                        To deactivate your account, first delete its resources. If you are the only owner of any teams,
                                        either assign another owner or deactivate the team.
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack direction="row">
                                        <AnimateButton>
                                            <Button color="error" variant="outlined" size="small">
                                                Deactivate Account
                                            </Button>
                                        </AnimateButton>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </SubCard>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Security;
