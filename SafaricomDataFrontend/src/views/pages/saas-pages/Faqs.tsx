// material-ui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project imports
import AppBar from 'ui-component/extended/AppBar';
import MainCard from 'ui-component/cards/MainCard';
import Accordion from 'ui-component/extended/Accordion';
import { gridSpacing } from 'store/constant';

// assets
import mailImg from 'assets/images/landing/widget-mail.svg';
import headerBackground from 'assets/images/landing/bg-header.jpg';

const basicData = [
    {
        id: 'basic1',
        title: 'When do I need Extended License?',
        defaultExpand: true,
        content:
            'If your End Product which is sold - Then only your required Extended License. i.e. If you take subscription charges (monthly, yearly, etc...) from your end users in this case you required Extended License.'
    },
    {
        id: 'basic2',
        title: 'What Support Includes?',
        content: '6 Months of Support Includes with 1 year of free updates. We are happy to solve your bugs, issue.'
    },
    {
        id: 'basic3',
        title: 'Is Berry Support TypeScript?',
        content: 'Yes, Berry Support the TypeScript and it is only available in Plus and Extended License.'
    },
    {
        id: 'basic4',
        title: 'Is there any RoadMap for Berry?',
        content:
            'Berry is our flagship React Dashboard Template and we always add the new features for the long run. You can check the Roadmap in Documentation.'
    }
];

// ============================|| SAAS PAGES - FAQs ||============================ //

const Faqs = () => {
    return (
        <Box
            sx={{
                backgroundImage: `url(${headerBackground})`,
                backgroundSize: '100% 600px',
                backgroundAttachment: 'fixed',
                backgroundRepeat: 'no-repeat',
                textAlign: 'center',
                pt: { xs: 0, md: 3.75 }
            }}
        >
            <AppBar />
            <Container>
                <Grid container justifyContent="center" spacing={gridSpacing}>
                    <Grid item sm={10} md={7} sx={{ mt: { md: 12.5, xs: 2.5 }, mb: { md: 12.5, xs: 2.5 } }}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <Typography
                                    variant="h1"
                                    color="white"
                                    sx={{
                                        fontSize: { xs: '1.8125rem', md: '3.5rem' },
                                        fontWeight: 900,
                                        lineHeight: 1.4,
                                        mt: { xs: 10, md: 'auto' }
                                    }}
                                >
                                    FAQs
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography
                                    variant="h4"
                                    sx={{ fontWeight: 400, lineHeight: 1.4, my: { xs: 0, md: 'auto' }, mx: { xs: 12.5, md: 'auto' } }}
                                    color="white"
                                >
                                    Please refer the Frequently ask question for your quick help
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{ position: 'relative', display: { xs: 'none', lg: 'block' } }}>
                        <img
                            src={mailImg}
                            alt="Berry"
                            style={{
                                marginBottom: -0.625,
                                position: 'absolute',
                                bottom: -90,
                                right: '0',
                                width: 400,
                                maxWidth: '100%',
                                animation: '5s wings ease-in-out infinite'
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <MainCard sx={{ textAlign: 'left' }} elevation={4} border={false} boxShadow shadow={4}>
                            <Accordion data={basicData} />
                        </MainCard>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Faqs;
