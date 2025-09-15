import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import Chart from 'react-apexcharts';

// project import
import useConfig from 'hooks/useConfig';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import SubCard from 'ui-component/cards/SubCard';

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

// chart options
const chartData = {
    height: 480,
    type: 'bar',
    options: {
        chart: {
            id: 'bar-chart',
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
                columnWidth: '50%'
            }
        },
        xaxis: {
            type: 'category',
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
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
            data: [40, 110, 85, 20, 94, 95, 64, 104, 75, 80, 29, 15]
        },
        {
            name: 'Maintenance',
            data: [102, 103, 25, 85, 90, 90, 85, 40, 40, 48, 68, 25]
        },
        {
            name: 'Loss',
            data: [70, 52, 72, 50, 60, 40, 95, 86, 67, 41, 19, 9]
        }
    ]
};

const widget = [
    {
        name: 'Total Investment',
        number: 586,
        color: 'secondary.dark'
    },
    {
        name: 'Total Maintenance',
        number: 256,
        color: 'secondary.200'
    },
    {
        name: 'Total Loss',
        number: 256,
        color: 'secondary.light'
    }
];

// ==============================|| EARNING OVERVIEW ||============================== //

const Overview = ({ isLoading }) => {
    const theme = useTheme();
    const { mode } = useConfig();

    const { secondary } = theme.palette.text;
    const darkLight = theme.palette.dark.light;
    const divider = theme.palette.divider;
    const grey500 = theme.palette.grey[500];

    const secondary200 = theme.palette.secondary[200];
    const secondaryDark = theme.palette.secondary.dark;
    const secondaryMain = theme.palette.secondary.main;
    const secondaryLight = theme.palette.secondary.light;

    React.useEffect(() => {
        const newChartData = {
            ...chartData.options,
            colors: [secondaryDark, secondary200, secondaryLight],
            xaxis: {
                labels: {
                    style: {
                        colors: [
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary
                        ]
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: [secondary]
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
    }, [mode, secondary200, secondaryDark, secondaryMain, secondaryLight, secondary, darkLight, divider, isLoading, grey500]);

    if (isLoading) <SkeletonTotalGrowthBarChart />;

    return (
        <MainCard content={false}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 5 } }}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="h3">Earning Report</Typography>
                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <Stack spacing={2} mt={2} justifyContent="center" textAlign="center">
                            <SubCard
                                sx={{
                                    bgcolor: divider,
                                    height: { lg: 380, xs: 179 },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    textAlign: 'center'
                                }}
                            >
                                <Stack spacing={1}>
                                    <Typography fontSize={16} color="text.secondary">
                                        Your earning this month
                                    </Typography>
                                    <Typography variant="h3" fontSize={34} fontWeight={700}>
                                        $586
                                    </Typography>
                                </Stack>
                                <Button variant="contained" sx={{ mt: 3 }}>
                                    Withdraw all earnings
                                </Button>
                            </SubCard>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} lg={10} sx={{ '& .apexcharts-menu-icon': { display: 'none' } }}>
                        <Chart {...chartData} height={320} />
                        <Grid item xs={12} container justifyContent={{ xs: 'center', sm: 'flex-end' }}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                                {widget.map((item, index) => (
                                    <Stack
                                        key={index}
                                        sx={{
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            p: '10px 20px',
                                            borderRadius: '12px'
                                        }}
                                        spacing={1}
                                        direction="row"
                                    >
                                        <FiberManualRecordIcon fontSize="small" sx={{ color: item.color }} />
                                        <Stack spacing={0.5}>
                                            <Typography variant="h6" color="grey.500">
                                                {item.name}
                                            </Typography>
                                            <Typography variant="h4" color="grey.900" fontWeight={500}>
                                                ${item.number}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                ))}
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </MainCard>
    );
};

Overview.propTypes = {
    isLoading: PropTypes.bool
};

export default Overview;
