// mui
import Grid from '@mui/material/Grid';

// project import
import HoverDataCard from 'ui-component/cards/HoverDataCard';

// assets
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const widgetData = [
    { number: 30200, label: 'Funds' },
    { number: 9320, label: 'Earning' },
    { number: 15234, label: 'Fees' }
];

// ==============================|| STATEMENT - OVERVIEW ||============================== //

const OverView = () => {
    return (
        <Grid container spacing={1}>
            <Grid item container xs={12} spacing={2.5}>
                {widgetData.map((data, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                        <HoverDataCard
                            title={data.label}
                            iconPrimary={data?.number > 10000 ? ArrowUpwardIcon : ArrowDownwardIcon}
                            primary={data.number}
                            secondary="8% less Last 3 Months"
                            color={data?.number > 10000 ? 'success.dark' : 'error.main'}
                        />
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );
};

export default OverView;
