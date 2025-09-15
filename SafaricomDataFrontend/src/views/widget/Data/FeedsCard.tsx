// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project imports
import Avatar from 'ui-component/extended/Avatar';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assets
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsTwoTone';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartTwoTone';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionTwoTone';

// ==============================|| DATA WIDGET - FEEDS CARD ||============================== //

const FeedsCard = () => (
    <MainCard title="Feeds" content={false}>
        <CardContent>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container spacing={2} alignItems="center" justifyContent="center">
                        <Grid item>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar color="primary">
                                    <NotificationsNoneOutlinedIcon />
                                </Avatar>
                            </Box>
                        </Grid>
                        <Grid item xs zeroMinWidth>
                            <Grid container spacing={1}>
                                <Grid item xs zeroMinWidth>
                                    <Typography variant="body2">You have 3 pending tasks.</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="caption">Just Now</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={2} alignItems="center" justifyContent="center">
                        <Grid item>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar color="error">
                                    <ShoppingCartOutlinedIcon />
                                </Avatar>
                            </Box>
                        </Grid>
                        <Grid item xs zeroMinWidth>
                            <Grid container spacing={1}>
                                <Grid item xs zeroMinWidth>
                                    <Typography variant="body2">New order received</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="caption">Just Now</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={2} alignItems="center" justifyContent="center">
                        <Grid item>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar color="success">
                                    <DescriptionOutlinedIcon />
                                </Avatar>
                            </Box>
                        </Grid>
                        <Grid item xs zeroMinWidth>
                            <Grid container spacing={1}>
                                <Grid item xs zeroMinWidth>
                                    <Typography variant="body2">You have 3 pending tasks.</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="caption">Just Now</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={2} alignItems="center" justifyContent="center">
                        <Grid item>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar color="primary">
                                    <NotificationsNoneOutlinedIcon />
                                </Avatar>
                            </Box>
                        </Grid>
                        <Grid item xs zeroMinWidth>
                            <Grid container spacing={1}>
                                <Grid item xs zeroMinWidth>
                                    <Typography variant="body2">New order received</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="caption">Just Now</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={2} alignItems="center" justifyContent="center">
                        <Grid item>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar color="warning">
                                    <ShoppingCartOutlinedIcon />
                                </Avatar>
                            </Box>
                        </Grid>
                        <Grid item xs zeroMinWidth>
                            <Grid container spacing={1}>
                                <Grid item xs zeroMinWidth>
                                    <Typography variant="body2">Order cancelled</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="caption">Just Now</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button variant="text" size="small">
                View all Feeds
            </Button>
        </CardActions>
    </MainCard>
);

export default FeedsCard;
