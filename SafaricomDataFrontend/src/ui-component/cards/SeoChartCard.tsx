import PropTypes from 'prop-types';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// third party
import Chart from 'react-apexcharts';

// project imports
import MainCard from './MainCard';

// =============================|| SEO CHART CARD ||============================= //

const SeoChartCard = ({ chartData, value, title, icon, type }) => {
    const downMM = useMediaQuery((theme) => theme.breakpoints.down('md'));

    return (
        <MainCard content={false} sx={{ p: 2.5 }}>
            <Grid container spacing={1.25} justifyContent="space-between">
                <Grid item xs={12}>
                    <Stack direction={type === 1 ? 'column-reverse' : 'column'} spacing={type === 1 ? 0.5 : 1}>
                        {value && <Typography variant={downMM ? 'h4' : 'h3'}>{value}</Typography>}
                        {(title || icon) && (
                            <Stack direction="row" alignItems="center" spacing={1}>
                                {title && (
                                    <Typography variant="body1" color="grey.500">
                                        {title}
                                    </Typography>
                                )}
                                {icon && icon}
                            </Stack>
                        )}
                    </Stack>
                </Grid>
                {chartData && (
                    <Grid item xs={12}>
                        <Chart {...chartData} />
                    </Grid>
                )}
            </Grid>
        </MainCard>
    );
};

SeoChartCard.propTypes = {
    chartData: PropTypes.object,
    title: PropTypes.string,
    icon: PropTypes.element,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.number
};

export default SeoChartCard;
