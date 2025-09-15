// material-ui
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assets
import Avatar1 from 'assets/images/users/avatar-1.png';
import Avatar2 from 'assets/images/users/avatar-2.png';
import Avatar3 from 'assets/images/users/avatar-3.png';
import Avatar4 from 'assets/images/users/avatar-4.png';

// ===========================|| DATA WIDGET - TEAM MEMBERS CARD ||=========================== //

const TeamMembers = () => (
    <MainCard title="Team Members" content={false}>
        <CardContent>
            <Grid container spacing={gridSpacing} alignItems="center">
                <Grid item xs={12}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <Avatar alt="User 1" src={Avatar1} />
                        </Grid>
                        <Grid item xs zeroMinWidth>
                            <Typography variant="subtitle1">David Jones</Typography>
                            <Typography variant="subtitle2">Developer</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="caption">5 min ago</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <Avatar alt="User 1" src={Avatar2} />
                        </Grid>
                        <Grid item xs zeroMinWidth>
                            <Typography variant="subtitle1">David Jones</Typography>
                            <Typography variant="subtitle2">Developer</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="caption">Today</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <Avatar alt="User 1" src={Avatar3} />
                        </Grid>
                        <Grid item xs zeroMinWidth>
                            <Typography variant="subtitle1">David Jones</Typography>
                            <Typography variant="subtitle2">Developer</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="caption">Yesterday</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <Avatar alt="User 1" src={Avatar4} />
                        </Grid>
                        <Grid item xs zeroMinWidth>
                            <Typography variant="subtitle1">David Jones</Typography>
                            <Typography variant="subtitle2">Developer</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="caption">02-05-2021</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button variant="text" size="small">
                View all Projects
            </Button>
        </CardActions>
    </MainCard>
);

export default TeamMembers;
