import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import useConfig from 'hooks/useConfig';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import { ThemeDirection, ThemeMode } from 'config';

// chart data
import chartData from '../chart-data/revenue-bar-chart';

// assets
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const status = [
    {
        value: 'month',
        label: 'This Month'
    },
    {
        value: 'today',
        label: 'Today'
    },
    {
        value: 'year',
        label: 'This Year'
    }
];

// ==============================|| REVENUE BAR CHART ||============================== //

const RevenueBarChart = ({ isLoading }) => {
    const [value, setValue] = React.useState('month');
    const theme = useTheme();
    const { mode, themeDirection } = useConfig();

    const { primary } = theme.palette.text;
    const darkLight = theme.palette.dark.light;
    const grey100 = theme.palette.grey[theme.palette.mode === ThemeMode.DARK ? 900 : 100];
    const divider = theme.palette.divider;
    const grey500 = theme.palette.grey[500];

    const primaryDark = theme.palette.primary.dark;
    const secondaryMain = theme.palette.secondary.main;
    const secondaryLight = theme.palette.secondary.light;

    React.useEffect(() => {
        const newChartData = {
            ...chartData.options,
            colors: [primaryDark, grey100],
            xaxis: {
                labels: {
                    style: {
                        colors: [primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary]
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: [primary]
                    }
                }
            },
            grid: {
                borderColor: divider
            },
            tooltip: {
                theme: mode
            },
            legend: {
                labels: {
                    colors: grey500
                }
            }
        };

        // do not load chart when loading
        if (!isLoading) {
            ApexCharts.exec(`bar-chart`, 'updateOptions', newChartData);
        }
    }, [mode, primaryDark, secondaryMain, secondaryLight, primary, darkLight, divider, isLoading, grey500, grey100]);

    if (isLoading) <SkeletonTotalGrowthBarChart />;

    return (
        <MainCard content={false} sx={{ px: 2, py: 2.5 }}>
            <Grid container spacing={{ xs: 2.5, sm: 1.5 }}>
                <Grid item xs={12}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={{ xs: 2, sm: 1 }}
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        justifyContent="space-between"
                    >
                        <Typography variant="h4">Revenue Trends</Typography>
                        <Stack direction="row" spacing={2}>
                            <TextField
                                id="standard-select-currency"
                                select
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                sx={{
                                    '& .MuiSelect-outlined': {
                                        borderRadius: theme.shape.borderRadius / 2
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: theme.shape.borderRadius / 2
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        py: 1,
                                        px: 1.5,
                                        color: mode === ThemeMode.DARK ? 'grey.600' : 'grey.900'
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderRadius: theme.shape.borderRadius / 2,
                                        borderColor: 'divider'
                                    }
                                }}
                            >
                                {status.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Button
                                variant="outlined"
                                sx={{
                                    borderRadius: theme.shape.borderRadius / 2,
                                    py: 0.5,
                                    px: 1.25,
                                    ml: 1,
                                    borderColor: 'divider',
                                    color: theme.palette.mode === ThemeMode.DARK ? 'grey.600' : 'grey.900'
                                }}
                                endIcon={<OpenInNewIcon color="disabled" sx={{ fontSize: 18 }} />}
                            >
                                Export
                            </Button>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <Stack spacing={0.5}>
                        <Typography color="grey.600" sx={{ fontSize: '1rem' }}>
                            Total
                        </Typography>
                        <Typography variant="h1">999.00</Typography>
                    </Stack>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sx={{ '& .apexcharts-legend-text': { marginLeft: themeDirection === ThemeDirection.RTL ? '8px' : 'initial' } }}
                >
                    <Chart {...chartData} />
                </Grid>
            </Grid>
        </MainCard>
    );
};

RevenueBarChart.propTypes = {
    isLoading: PropTypes.bool
};

export default RevenueBarChart;
