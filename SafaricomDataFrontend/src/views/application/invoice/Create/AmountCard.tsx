import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project imports
import { ThemeMode } from 'config';
import SubCard from 'ui-component/cards/SubCard';

// ==============================|| INVOICE - AMOUNT CARD ||============================== //

function AmountCard({ allAmounts }) {
    const theme = useTheme();

    return (
        <SubCard sx={{ bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'primary.light' }}>
            <Grid container justifyContent="flex-end" spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <Typography align="right" variant="subtitle1">
                                        Sub Total :
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography align="right" variant="body2">
                                        ${Math.round(allAmounts.subTotal * 100) / 100}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography align="right" variant="subtitle1">
                                        Tax (10%) :
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography align="right" variant="body2">
                                        ${Math.round(allAmounts.taxesAmount * 100) / 100}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography align="right" variant="subtitle1">
                                        Discount (5%) :
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography align="right" variant="body2">
                                        ${Math.round(allAmounts.discountAmount * 100) / 100}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <Typography align="right" color="primary" variant="subtitle1">
                                        Total :
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography align="right" color="primary" variant="subtitle1">
                                        ${Math.round(allAmounts.totalAmount * 100) / 100}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </SubCard>
    );
}

AmountCard.propTypes = {
    allAmounts: PropTypes.object
};

export default AmountCard;
