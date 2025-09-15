import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { ThemeMode } from 'config';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import { IconPlus } from '@tabler/icons-react';

// ==============================|| RECENT ACTIVITY ||============================== //

const RecentActivity = ({ isLoading }) => {
    const theme = useTheme();

    const activityData = [
        { name: 'Adaline Bergfalks', id: '0697', date: '09/05/2023', amount: '5678.09', status: 'Profit' },
        { name: 'Agilulf Fuxg', id: '0697', date: '09/05/2023', amount: '5678.09', status: 'Profit' },
        { name: 'Peahen', id: '0697', date: '09/05/2023', amount: '5678.09', status: 'Loss' },
        { name: 'Wilhelmine Durrg', id: '0697', date: '09/05/2023', amount: '5678.09', status: 'Profit' },
        { name: 'Herman Essertg', id: '0697', date: '09/05/2023', amount: '5678.09', status: 'Loss' },
        { name: 'Eadwulf Beckete', id: '0697', date: '09/05/2023', amount: '5678.09', status: 'Loss' }
    ];

    if (isLoading) <SkeletonPopularCard />;

    return (
        <MainCard content={false}>
            <CardContent sx={{ p: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                            <Typography variant="h4">Recent Activity</Typography>
                            <Button
                                size="small"
                                variant="outlined"
                                sx={{
                                    px: 1.75,
                                    borderColor: 'divider',
                                    borderRadius: theme.shape.borderRadius,
                                    color: theme.palette.mode === ThemeMode.DARK ? 'grey.600' : 'grey.900'
                                }}
                                startIcon={<IconPlus size={14} />}
                            >
                                Add new
                            </Button>
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        {activityData.map((data, index) => (
                            <Box key={index}>
                                <Grid container direction="row" justifyContent="space-between" alignItems="center">
                                    <Grid item xs={4}>
                                        <Grid container item spacing={0.5} direction="column">
                                            <Grid item>
                                                <Typography variant="subtitle2" color="grey.600">
                                                    #{data.id}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="h5">{data.date}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Stack direction="row" justifyContent="space-between" sx={{ minWidth: 120 }}>
                                            <Typography variant="h5">{data.name}</Typography>
                                            <Typography variant="h5" color={data.status === 'Loss' ? 'orange.dark' : 'success.dark'}>
                                                {data.status === 'Loss' ? '-' : ''} £{data.amount}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mt: 1, mb: activityData.length > index + 1 ? 1 : 0 }} />
                            </Box>
                        ))}
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions sx={{ pb: 1.75, pt: 0, justifyContent: 'center' }}>
                <Button size="small" disableElevation endIcon={<ChevronRightOutlinedIcon />}>
                    View All
                </Button>
            </CardActions>
        </MainCard>
    );
};

RecentActivity.propTypes = {
    isLoading: PropTypes.bool
};

export default RecentActivity;
