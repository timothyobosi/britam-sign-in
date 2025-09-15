import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import Chart from 'react-apexcharts';

// project import
import useConfig from 'hooks/useConfig';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';

// assets
import MenuIcon from '@mui/icons-material/Menu';

// chart options
const chartData = {
    height: 480,
    type: 'bar',
    options: {
        chart: {
            id: 'bar-chart',
            stacked: true,
            toolbar: {
                show: true
            },
            zoom: {
                enabled: true
            }
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    legend: {
                        position: 'bottom',
                        offsetX: -10,
                        offsetY: 0
                    }
                }
            }
        ],
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '40%'
            }
        },
        xaxis: {
            type: 'category',
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        legend: {
            show: false
        },
        fill: {
            type: 'solid'
        },
        dataLabels: {
            enabled: false
        },
        grid: {
            show: true
        }
    },
    series: [
        {
            name: 'Investment',
            data: [50, 105, 80, 50, 70, 80, 80]
        },
        {
            name: 'Loss',
            data: [50, 55, 30, 50, 140, 80, 40]
        },
        {
            name: 'Maintenance',
            data: [50, 150, 120, 110, 180, 150, 130]
        }
    ]
};

const widgetData = [
    { number: '200', label: 'Conversion Rate' },
    { number: '120', label: 'Average Deal' },
    { number: '234', label: 'Sales Target' }
];

// ==============================|| SALE PERFORMANCE - CHART ||============================== //

const SalesPerformance = ({ isLoading }) => {
    const theme = useTheme();
    const { mode } = useConfig();

    const { primary } = theme.palette.text;
    const darkLight = theme.palette.dark.light;
    const divider = theme.palette.divider;
    const grey500 = theme.palette.grey[500];

    const primary200 = theme.palette.primary[200];
    const primaryDark = theme.palette.primary.dark;
    const secondaryMain = theme.palette.secondary.main;
    const secondaryLight = theme.palette.secondary.light;

    React.useEffect(() => {
        const newChartData = {
            ...chartData.options,
            colors: [primary200, primaryDark, secondaryLight],
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
    }, [mode, primary200, primaryDark, secondaryMain, secondaryLight, primary, darkLight, divider, isLoading, grey500]);

    if (isLoading) <SkeletonTotalGrowthBarChart />;

    return (
        <MainCard content={false}>
            <Box sx={{ p: 2.5 }}>
                <Grid container spacing={2.5}>
                    <Grid item xs={12}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="h4">Sales Performance</Typography>
                            <IconButton>
                                <MenuIcon />
                            </IconButton>
                        </Stack>
                    </Grid>
                    <Grid item container xs={12} alignItems="center" justifyContent="space-between" spacing={2.5}>
                        {widgetData.map((data, index) => (
                            <Grid item xs={12} sm={4} key={index}>
                                <SubCard sx={{ bgcolor: divider }}>
                                    <Stack spacing={1}>
                                        <Typography variant="h3">{data.number}</Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 400 }}>
                                            {data.label}
                                        </Typography>
                                    </Stack>
                                </SubCard>
                            </Grid>
                        ))}
                    </Grid>
                    <Grid item xs={12} sx={{ pt: '0px !important', '& .apexcharts-menu-icon': { display: 'none' } }}>
                        <Chart {...chartData} height={320} />
                    </Grid>
                </Grid>
            </Box>
        </MainCard>
    );
};

SalesPerformance.propTypes = {
    isLoading: PropTypes.bool
};

export default SalesPerformance;
