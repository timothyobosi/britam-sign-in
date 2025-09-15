import React from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// third party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import useConfig from 'hooks/useConfig';
import MainCard from 'ui-component/cards/MainCard';
import chartData from './chart-data/market-share-area-chart';
import { ThemeMode } from 'config';

// assets
import { IconBrandFacebook, IconBrandYoutube, IconBrandTwitter } from '@tabler/icons-react';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

// ===========================|| DASHBOARD ANALYTICS - MARKET SHARE AREA CHART CARD ||=========================== //

const MarketShareAreaChartCard = () => {
    const theme = useTheme();

    const { mode } = useConfig();

    const secondaryMain = theme.palette.secondary.main;
    const errorMain = theme.palette.error.main;
    const primaryDark = theme.palette.primary.dark;

    React.useEffect(() => {
        const newChartData = {
            ...chartData.options,
            colors: [secondaryMain, errorMain, primaryDark],
            tooltip: { theme: mode }
        };
        ApexCharts.exec(`market-share-area-chart`, 'updateOptions', newChartData);
    }, [mode, secondaryMain, errorMain, primaryDark]);

    return (
        <MainCard sx={{ '&>div': { p: 0, pb: '0px !important' } }}>
            <Box
                sx={{
                    p: 3
                }}
            >
                <Grid container direction="column" spacing={3}>
                    <Grid item container spacing={1} alignItems="center">
                        <Grid item>
                            <Typography variant="h3">Market Share</Typography>
                        </Grid>
                        <Grid item xs zeroMinWidth />
                        <Grid item>
                            <TrendingDownIcon fontSize="large" color="error" sx={{ mt: 1 }} />
                        </Grid>
                        <Grid item>
                            <Typography variant="h3">27, 695.65</Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography sx={{ mt: -2.5, fontWeight: 400 }} color="inherit" variant="h5">
                            Department wise monthly sales report
                        </Typography>
                    </Grid>
                    <Grid item container alignItems="center" spacing={3}>
                        <Grid item>
                            <Grid container alignItems="center" spacing={1}>
                                <Grid item>
                                    <Typography
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            color: 'secondary.main',
                                            borderRadius: '12px',
                                            padding: 1,
                                            bgcolor: mode === ThemeMode.DARK ? 'background.default' : 'secondary.light'
                                        }}
                                    >
                                        <IconBrandFacebook stroke={1.5} />
                                    </Typography>
                                </Grid>
                                <Grid item sm zeroMinWidth>
                                    <Typography variant="h4">+ 45.36%</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid container alignItems="center" spacing={1}>
                                <Grid item>
                                    <Typography
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            color: 'primary.main',
                                            borderRadius: '12px',
                                            padding: 1,
                                            bgcolor: mode === ThemeMode.DARK ? 'background.default' : 'primary.light'
                                        }}
                                    >
                                        <IconBrandTwitter stroke={1.5} />
                                    </Typography>
                                </Grid>
                                <Grid item sm zeroMinWidth>
                                    <Typography variant="h4">- 50.69%</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid container alignItems="center" spacing={1}>
                                <Grid item>
                                    <Typography
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            color: 'error.main',
                                            borderRadius: '12px',
                                            padding: 1,
                                            bgcolor: mode === ThemeMode.DARK ? 'background.default' : alpha(theme.palette.error.light, 0.25)
                                        }}
                                    >
                                        <IconBrandYoutube stroke={2} />
                                    </Typography>
                                </Grid>
                                <Grid item sm zeroMinWidth>
                                    <Typography variant="h4">+ 16.85%</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs zeroMinWidth />
                    </Grid>
                </Grid>
            </Box>
            <Chart {...chartData} />
        </MainCard>
    );
};
export default MarketShareAreaChartCard;
