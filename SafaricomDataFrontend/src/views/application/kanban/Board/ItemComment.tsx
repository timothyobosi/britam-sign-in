import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project imports
import Avatar from 'ui-component/extended/Avatar';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';
import { ThemeMode } from 'config';

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

// ==============================|| KANBAN BOARD - ITEM COMMENT ||============================== //

const ItemComment = ({ comment, profile }) => {
    const theme = useTheme();

    return (
        <Card sx={{ bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'grey.50', p: 1.5, mt: 1.25 }}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Grid container wrap="nowrap" alignItems="center" spacing={1}>
                        <Grid item>
                            <Avatar
                                sx={{ width: 24, height: 24 }}
                                size="sm"
                                alt="User 1"
                                src={profile && profile.avatar && getImageUrl(`${profile.avatar}`, ImagePath.USERS)}
                            />
                        </Grid>
                        <Grid item xs zeroMinWidth>
                            <Grid container alignItems="center" spacing={1}>
                                <Grid item>
                                    <Typography variant="h5">{profile.name}</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="caption">
                                        <FiberManualRecordIcon sx={{ width: 10, height: 10, opacity: 0.5, my: 0, mx: 0.625 }} />
                                        {profile.time}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{ '&.MuiGrid-root': { pt: 1.5 } }}>
                    <Typography variant="body2">{comment?.comment}</Typography>
                </Grid>
            </Grid>
        </Card>
    );
};

ItemComment.propTypes = {
    comment: PropTypes.object,
    profile: PropTypes.object
};

export default ItemComment;
