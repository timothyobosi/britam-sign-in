import { Link } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import Logo from 'ui-component/Logo';
import AnimateButton from 'ui-component/extended/AnimateButton';
import AuthCodeVerification from '../auth-forms/AuthCodeVerification';
import BackgroundPattern1 from 'ui-component/cards/BackgroundPattern1';
import AuthSlider from 'ui-component/cards/AuthSlider';

// assets
import AuthBlueCard from 'assets/images/auth/auth-signup-blue-card.svg';
import AuthWhiteCard from 'assets/images/auth/auth-signup-white-card.svg';

// carousel items
const items = [
    {
        title: 'Powerful and easy to use multi-purpose theme.',
        description: 'Powerful and easy to use multipurpose theme'
    },
    {
        title: 'Powerful and easy to use multi-purpose theme.',
        description: 'Powerful and easy to use multipurpose theme'
    },
    {
        title: 'Powerful and easy to use multi-purpose theme.',
        description: 'Powerful and easy to use multipurpose theme'
    }
];

// ===========================|| AUTH1 - CODE VERIFICATION ||=========================== //

const CodeVerification = () => {
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
                                                Verification Code
                                            </Typography>
                                            <Typography color="textPrimary" gutterBottom variant="h4">
                                                We send you on mail.
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
                            <Grid item>
                                <Stack direction="row" justifyContent={{ xs: 'center', md: 'flex-start' }}>
                                    <Typography variant="caption" fontSize="16px" textAlign={{ xs: 'center', md: 'inherit' }}>
                                        We’ve send you code on jone.****@company.com
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <AuthCodeVerification />
                            </Grid>
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
                            <Grid item xs={12}>
                                <Grid item container direction="column" alignItems="flex-end" xs={12}>
                                    <Typography
                                        component={Link}
                                        to="#"
                                        variant="subtitle1"
                                        sx={{ textDecoration: 'none' }}
                                        textAlign={{ xs: 'center', md: 'inherit' }}
                                    >
                                        Did not receive the email? Check your spam filter, or
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <AnimateButton>
                                    <Button disableElevation fullWidth size="large" type="submit" variant="outlined" color="secondary">
                                        Resend Code
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

export default CodeVerification;
