import { useLocation, useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import Logo from 'ui-component/Logo';
import AnimateButton from 'ui-component/extended/AnimateButton';
import AuthFooter from 'ui-component/cards/AuthFooter';

// ==============================|| AUTH3 - CHECK MAIL ||============================== //

const CheckMail = () => {
    const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const { email } = state || {};

    const handleSetNewPassword = () => {
        if (!email) {
            navigate('/forgot'); // Redirect if email is missing
            return;
        }
        navigate('/set-new-password', { state: { email } }); // Pass only email
    };

    return (
        <AuthWrapper1>
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    <Grid item sx={{ mb: 3 }}>
                                        <Logo />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container direction="column" alignItems="center" justifyContent="center" textAlign="center">
                                            <Grid item>
                                                <Typography color="secondary.main" gutterBottom variant={downMD ? 'h3' : 'h2'}>
                                                    Check Your Email
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="caption" fontSize="16px" textAlign="center">
                                                    We have sent a password reset OTP to
                                                    <br />
                                                    <Typography variant="caption" component="span">
                                                        {email || 'your email'}
                                                    </Typography>
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <AnimateButton>
                                            <Button
                                                disableElevation
                                                fullWidth
                                                size="large"
                                                variant="contained"
                                                color="secondary"
                                                onClick={handleSetNewPassword}
                                            >
                                                Set New Password
                                            </Button>
                                        </AnimateButton>
                                    </Grid>
                                </Grid>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
                    <AuthFooter />
                </Grid>
            </Grid>
        </AuthWrapper1>
    );
};

export default CheckMail;