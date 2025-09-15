import { Link } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import Logo from 'ui-component/Logo';
import AnimateButton from 'ui-component/extended/AnimateButton';
import BackgroundPattern1 from 'ui-component/cards/BackgroundPattern1';
import AuthSlider from 'ui-component/cards/AuthSlider';

// assets
import AuthBlueCard from 'assets/images/auth/auth-mail-blue-card.svg';

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

// ==============================|| AUTH1 - CHECK MAIL ||============================== //

const CheckMail = () => {
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
                                                Check Mail
                                            </Typography>
                                            <Typography color="textPrimary" gutterBottom variant="h4">
                                                Avoid getting locked out.
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
                                        We have sent a password recover instructions to your email.
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <AnimateButton>
                                    <Button disableElevation fullWidth size="large" type="submit" variant="contained" color="secondary">
                                        Open Mail
                                    </Button>
                                </AnimateButton>
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
                                            top: { xs: '20%', xl: '25%' },
                                            left: { xs: '6%', xl: '18%' },
                                            width: 455,
                                            height: 430,
                                            backgroundImage: `url(${AuthBlueCard})`,
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

export default CheckMail;
