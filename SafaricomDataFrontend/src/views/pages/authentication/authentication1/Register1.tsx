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
import AuthRegister from '../auth-forms/AuthRegister';
import BackgroundPattern1 from 'ui-component/cards/BackgroundPattern1';
import AuthSlider from 'ui-component/cards/AuthSlider';

// assets
import AuthBlueCard from 'assets/images/auth/auth-signup-blue-card.svg';
import AuthWhiteCard from 'assets/images/auth/auth-signup-white-card.svg';

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

// ===============================|| AUTH1 - REGISTER ||=============================== //

const Register = () => {
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
                                            pt={{ sm: 1 }}
                                        >
                                            <Typography color="secondary.main" gutterBottom variant={downMD ? 'h3' : 'h2'}>
                                                Sign up
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
                                <AuthRegister />
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
                                        '&:after': {
                                            content: '""',
                                            position: 'absolute',
                                            top: { xs: '50%', xl: '45%' },
                                            left: { xs: '25%', xl: '35%' },
                                            width: 260,
                                            backgroundSize: 380,
                                            height: 290,
                                            backgroundImage: `url(${AuthWhiteCard})`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'center',
                                            animation: '15s wings ease-in-out infinite'
                                        },
                                        '&:before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: { xs: '10%', xl: '12%' },
                                            left: { xs: '15%', xl: '25%' },
                                            width: 360,
                                            height: 350,
                                            backgroundSize: 460,
                                            backgroundImage: `url(${AuthBlueCard})`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'center',
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

export default Register;
