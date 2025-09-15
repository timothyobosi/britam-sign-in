import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// third-party
import Chart from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

// =========================|| CONVERSIONS CHART CARD ||========================= //

const ConversionsChartCard = ({ chartData }) => {
    return (
        <MainCard content={false}>
            <Box sx={{ p: 3 }}>
                <Grid container spacing={1} alignItems="center">
                    <Grid item>
                        <Typography variant="subtitle1">New Stock</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="caption">(Purchased)</Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <Typography variant="h4">0.85%</Typography>
                    </Grid>
                    <Grid item>
                        <Grid container spacing={1} alignItems="center" sx={{ color: 'info.main' }}>
                            <ArrowUpwardIcon color="inherit" />
                            <Typography variant="h4" color="inherit">
                                0.50%
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            <Chart {...chartData} />
        </MainCard>
    );
};

ConversionsChartCard.propTypes = {
    chartData: PropTypes.object
};

export default ConversionsChartCard;
