import React, { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// third-party
import ReactApexChart from 'react-apexcharts';

// project import
import useConfig from 'hooks/useConfig';
import MainCard from 'ui-component/cards/MainCard';

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

// chart options
const polarChartOptions = {
    chart: {
        width: 450,
        height: 450,
        type: 'polarArea'
    },
    fill: {
        opacity: 1
    },
    legend: {
        show: false
    },
    responsive: [
        {
            breakpoint: 450,
            chart: {
                width: 280,
                height: 280
            },
            options: {
                legend: {
                    show: false,
                    position: 'bottom'
                }
            }
        }
    ]
};

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

const legendData = [
    { name: 'Social Media', chipLabel: '9', color: 'primary.main' },
    { name: 'Website', chipLabel: '100+', color: 'secondary.main' },
    { name: 'Phone Call', chipLabel: '100+', color: 'secondary.200' },
    { name: 'Mail', chipLabel: '100+', color: 'primary.200' }
];
// ==============================|| LEAD SOURCE - CHART ||============================== //

const LeadSource = () => {
    const theme = useTheme();
    const { mode } = useConfig();

    const [value, setValue] = useState('today');
    const [series] = useState([20, 30, 25, 15, 35]);
    const [options, setOptions] = useState(polarChartOptions);

    const { primary } = theme.palette.text;
    const darkLight = theme.palette.dark.light;
    const divider = theme.palette.divider;
    const backColor = theme.palette.background.paper;
    const secondary = theme.palette.secondary.main;
    const secondary200 = theme.palette.secondary[200];
    const primaryMain = theme.palette.primary.main;
    const primary200 = theme.palette.primary[200];
    const error = theme.palette.error.main;
    const warningDark = theme.palette.warning.dark;

    React.useEffect(() => {
        setOptions((prevState) => ({
            ...prevState,
            colors: [secondary200, primaryMain, primary200, divider, secondary],
            xaxis: {
                show: false,
                labels: {
                    show: false
                }
            },
            yaxis: {
                show: false,
                labels: {
                    show: false
                }
            },
            grid: {
                borderColor: divider
            },
            labels: ['Phone call', 'Social Media', 'Mail', 'Message', 'Website'],
            legend: {
                labels: {
                    colors: 'grey.500'
                }
            },
            stroke: {
                colors: [backColor]
            },
            plotOptions: {
                polarArea: {
                    rings: {
                        strokeColor: divider
                    },
                    spokes: {
                        connectorColors: divider
                    }
                }
            }
        }));
    }, [mode, primary, darkLight, divider, backColor, primary200, secondary200, secondary, primaryMain, error, warningDark]);

    return (
        <MainCard content={false}>
            <Grid container sx={{ p: 2.5 }}>
                <Grid item alignItems="center" xs={12}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="h4">Lead Source</Typography>
                        <TextField
                            id="standard-select-currency"
                            select
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-input': {
                                    borderRadius: 1.5,
                                    py: 1,
                                    px: 1.5
                                }
                            }}
                        >
                            {status.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <ReactApexChart options={options} series={series} height={220} type="polarArea" />
                </Grid>
                <Grid item xs={12} sx={{ pt: 2 }}>
                    <Stack spacing={2}>
                        {legendData.map((data, index) => (
                            <Stack justifyContent="space-between" direction="row" alignItems="center" key={index}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <FiberManualRecordIcon fontSize="small" sx={{ color: data.color }} />
                                    <Typography>{data.name}</Typography>
                                </Stack>
                                <Chip size="small" label={data.chipLabel} />
                            </Stack>
                        ))}
                    </Stack>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default LeadSource;
