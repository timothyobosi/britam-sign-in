import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third party
import Chart from 'react-apexcharts';

// ============================|| SALES LINE CARD ||============================ //

const SalesLineChartCard = ({ bgColor, chartData, footerData, icon, title, percentage }) => {
    let footerHtml;
    if (footerData) {
        footerHtml = footerData.map((item, index) => (
            <Grid item key={index}>
                <Box sx={{ my: 3, p: 1 }}>
                    <Stack spacing={0.75} alignItems="center">
                        <Typography variant="h3">{item.value}</Typography>
                        <Typography variant="body1">{item.label}</Typography>
                    </Stack>
                </Box>
            </Grid>
        ));
    }

    return (
        <Card>
            <Box sx={{ color: '#fff', bgcolor: bgColor || 'primary.dark', p: 3 }}>
                <Grid container direction="column" spacing={1}>
                    <Grid item container justifyContent="space-between" alignItems="center">
                        {title && (
                            <Grid item>
                                <Typography variant="subtitle1" color="inherit">
                                    {title}
                                </Typography>
                            </Grid>
                        )}
                        <Grid item>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                {icon && icon}
                                {percentage && (
                                    <Typography variant="subtitle1" color="inherit">
                                        {percentage}
                                    </Typography>
                                )}
                            </Stack>
                        </Grid>
                    </Grid>
                    {chartData && (
                        <Grid item>
                            <Chart {...chartData} />
                        </Grid>
                    )}
                </Grid>
            </Box>
            {footerData && (
                <Grid container alignItems="center" justifyContent="space-around">
                    {footerHtml}
                </Grid>
            )}
        </Card>
    );
};

SalesLineChartCard.propTypes = {
    title: PropTypes.string,
    chartData: PropTypes.object,
    footerData: PropTypes.array,
    dropData: PropTypes.object,
    listData: PropTypes.object,
    bgColor: PropTypes.string,
    icon: PropTypes.element,
    percentage: PropTypes.string
};

export default SalesLineChartCard;
