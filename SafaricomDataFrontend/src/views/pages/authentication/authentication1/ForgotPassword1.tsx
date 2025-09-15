import { Link } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import Logo from 'ui-component/Logo';
import AuthForgotPassword from '../auth-forms/AuthForgotPassword';
import BackgroundPattern1 from 'ui-component/cards/BackgroundPattern1';
import AuthSlider from 'ui-component/cards/AuthSlider';

// assets
import AuthMultiCard from 'assets/images/auth/auth-forgot-pass-multi-card.svg';

// carousel items
const items = [
    {
        title: 'Powerful and easy to use multipurpose theme.',
        description: 'Powerful and easy to use multipurpose theme'
    },
    {
        title: 'Power of React with Material UI',
        description: 'Powerful and easy to use multipurpose theme'
    },
    {
        title: 'Power of React with Material UI',
        description: 'Powerful and easy to use multipurpose theme'
    }
];

// ============================|| AUTH1 - FORGOT PASSWORD ||============================ //

const ForgotPassword = () => {
    const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

    return (
        <AuthWrapper1>
            <Grid container justifyContent="space-between" alignItems="center" sx={{ minHeight: '100vh' }}>
                <Grid item container justifyContent="center" md={6} lg={7} sx={{ my: 3 }}>
                    <AuthCardWrapper>
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item xs={12}>
                                <Grid
                                    container
                                    direction={{ xs: 'column-reverse', md: 'row' }}
                                    alignItems={{ xs: 'center', md: 'inherit' }}
                                    justifyContent={{ xs: 'center', md: 'space-between' }}
                                >
                                    <Grid item>
                                        <Stack
                                            justifyContent={{ xs: 'center', md: 'flex-start' }}
                                            textAlign={{ xs: 'center', md: 'inherit' }}
                                        >
                                            <Typography color="secondary.main" gutterBottom variant={downMD ? 'h3' : 'h2'}>
                                                Forgot password?
                                            </Typography>
                                            <Typography color="textPrimary" gutterBottom variant="h4">
                                                Enter credentials to continue
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item sx={{ mb: { xs: 3, sm: 0 } }}>
                                        <Link to="#" aria-label="theme logo">
                                            <Logo />
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack direction="row" justifyContent={{ xs: 'center', md: 'flex-start' }}>
                                    <Typography variant="caption" fontSize="16px" textAlign={{ xs: 'center', md: 'inherit' }}>
                                        Enter your email address below and we&apos;ll send you password reset OTP.
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <AuthForgotPassword />
                            </Grid>
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
                            <Grid item xs={12}>
                                <Grid item container direction="column" alignItems="flex-end" xs={12}>
                                    <Typography
                                        component={Link}
                                        to="/pages/login/login1"
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
                <Grid item md={6} lg={5} sx={{ position: 'relative', alignSelf: 'stretch', display: { xs: 'none', md: 'block' } }}>
                    <BackgroundPattern1>
                        <Grid item container alignItems="flex-end" justifyContent="center" spacing={3}>
                            <Grid item xs={12}>
                                <span />
                                <Box
                                    sx={{
                                        '&:before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: { xs: '10%', xl: '18%' },
                                            left: { xs: '6%', xl: '18%' },
                                            width: 515,
                                            height: 470,
                                            backgroundImage: `url(${AuthMultiCard})`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'center',
                                            backgroundSize: { xs: 450, xl: 'auto' },
                                            animation: '15s wings ease-in-out infinite',
                                            animationDelay: '1s'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Grid item container justifyContent="center" sx={{ pb: 8 }}>
                                    <Grid item xs={10} lg={8} sx={{ '& .slick-list': { pb: 2 } }}>
                                        <AuthSlider items={items} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </BackgroundPattern1>
                </Grid>
            </Grid>
        </AuthWrapper1>
    );
};

export default ForgotPassword;
