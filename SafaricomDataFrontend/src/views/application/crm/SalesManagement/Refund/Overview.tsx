import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

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
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Set', 'Oct', 'Nov', 'Dec']
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
            data: [43, 125, 75, 36, 95, 30, 20, 75, 30, 40, 55, 150]
        },
        {
            name: 'Loss',
            data: [43, 20, 25, 35, 140, 50, 20, 115, 30, 25, 25, 70]
        },
        {
            name: 'Maintenance',
            data: [43, 125, 75, 36, 35, 10, 20, 20, 40, 55, 20, 250]
        }
    ]
};

const widget = [
    {
        name: 'Total Investment',
        number: 586,
        color: 'primary.dark'
    },
    {
        name: 'Total Maintenance',
        number: 256,
        color: 'primary.200'
    },
    {
        name: 'Total Loss',
        number: 256,
        color: 'secondary.light'
    }
];

const options = ['Last 7 Days', 'Last Month', 'Last Year'];

// ==============================|| REFUND OVERVIEW ||============================== //

const Overview = ({ isLoading }) => {
    const theme = useTheme();
    const { mode } = useConfig();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const open = Boolean(anchorEl);

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

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
            colors: [primaryDark, primary200, secondaryLight],
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
            <CardContent sx={{ p: 2.5 }}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Typography variant="h3">Refund Report</Typography>
                            </Grid>
                            <Stack direction="row" alignItems="center" justifyContent="center" sx={{ display: { xs: 'none', sm: 'flex' } }}>
                                <Button
                                    id="demo-positioned-button"
                                    aria-controls="demo-positioned-menu"
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClickListItem}
                                    sx={{ color: 'grey.500', fontWeight: 400 }}
                                    endIcon={<KeyboardArrowDownIcon sx={{ color: 'grey.900' }} />}
                                >
                                    {options.length > 0 && options[selectedIndex]}
                                </Button>
                                <Menu
                                    id="lock-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'lock-button',
                                        role: 'listbox'
                                    }}
                                >
                                    {options.map((option, index) => (
                                        <MenuItem
                                            key={option}
                                            selected={index === selectedIndex}
                                            onClick={(event) => handleMenuItemClick(event, index)}
                                        >
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Stack>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={10} sx={{ '& .apexcharts-menu-icon': { display: 'none' } }}>
                        <Chart {...chartData} height={320} />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Stack spacing={2}>
                            <SubCard
                                sx={{
                                    '.css-ngmjm5-MuiCardContent-root': { p: 2 },
                                    bgcolor: divider,
                                    '.css-ngmjm5-MuiCardContent-root:last-child': {
                                        pb: 2
                                    }
                                }}
                            >
                                <Stack spacing={1} textAlign="center">
                                    <Typography fontSize={16} color="text.secondary">
                                        Earnings Report
                                    </Typography>
                                    <Typography fontSize={'1.5rem'} variant="h3">
                                        $586
                                    </Typography>
                                </Stack>
                            </SubCard>
                            <Stack alignItems="center">
                                {widget.map((item, index) => (
                                    <Stack key={index} sx={{ py: 1.5, width: 130 }} spacing={1} direction="row">
                                        <FiberManualRecordIcon key={index} fontSize="small" sx={{ color: item.color }} />
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
                        </Stack>
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
