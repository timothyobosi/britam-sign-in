import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import Logo from 'ui-component/Logo';
import AnimateButton from 'ui-component/extended/AnimateButton';
import AuthFooter from 'ui-component/cards/AuthFooter';
import { completeResetPassword } from 'safaricom-data/api';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

// ==============================|| AUTH3 - SET NEW PASSWORD ||============================== //

const SetNewPassword = () => {
    const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const { email: initialEmail } = state || {};
    const dispatch = useDispatch();

    const [newPassword, setNewPassword] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [successOpen, setSuccessOpen] = useState(false);

    useEffect(() => {
        console.log('State received:', state);
        if (!initialEmail) {
            navigate('/forgot');
        }
    }, [initialEmail, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPassword || !token) {
            setError('New password and token are required');
            return;
        }

        console.log('Submitting payload:', { token, newPassword, email: initialEmail });
        try {
            const response = await completeResetPassword(token, newPassword, initialEmail);
            console.log('API response:', response);
            if (response.success) {
                setSuccessOpen(true);
                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Password reset was successful',
                        variant: 'alert',
                        alert: { color: 'success' },
                        close: false
                    })
                );
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            } else {
                if (response.message === "Invalid or expired token.") {
                    setError("The token is invalid or has expired. Please request a new one.");
                } else {
                    setError(response.message || 'Failed to set new password');
                }
            }
        } catch (err) {
            console.error('Error:', err);
            setError('An error occurred. Please try again.');
        }
    };

    const handleCloseSnackbar = () => {
        setSuccessOpen(false);
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
                                        <Link to="#" aria-label="theme logo">
                                            <Logo />
                                        </Link>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container alignItems="center" justifyContent="center" textAlign="center" spacing={2}>
                                            <Grid item xs={12}>
                                                <Typography color="secondary.main" gutterBottom variant={downMD ? 'h3' : 'h2'}>
                                                    Set New Password
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="caption" fontSize="16px" textAlign="center">
                                                    Enter your new password and the token received in your email to proceed.
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <form onSubmit={handleSubmit}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Token"
                                                        value={token}
                                                        onChange={(e) => setToken(e.target.value)}
                                                        helperText="Paste the token from your email"
                                                        error={!!error && !newPassword}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="New Password"
                                                        type="password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        error={!!error}
                                                        helperText={error || 'Enter your new password'}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <AnimateButton>
                                                        <Button
                                                            disableElevation
                                                            fullWidth
                                                            size="large"
                                                            type="submit"
                                                            variant="contained"
                                                            color="secondary"
                                                        >
                                                            Submit
                                                        </Button>
                                                    </AnimateButton>
                                                </Grid>
                                            </Grid>
                                        </form>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid item container direction="column" alignItems="center" xs={12}>
                                            <Typography
                                                component={Link}
                                                to="/login"
                                                variant="subtitle1"
                                                sx={{ textDecoration: 'none' }}
                                            >
                                                Already have an account?
                                            </Typography>
                                        </Grid>
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
            <Snackbar
                open={successOpen}
                autoHideDuration={1500}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Password reset was successful
                </Alert>
            </Snackbar>
        </AuthWrapper1>
    );
};

export default SetNewPassword;