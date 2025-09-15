import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// project imports
import Avatar from 'ui-component/extended/Avatar';
import { gridSpacing } from 'store/constant';
import { getImageUrl, ImagePath } from 'utils/getImageUrl';

// assets
import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';
import PhoneTwoToneIcon from '@mui/icons-material/PhoneTwoTone';

// ==============================|| USER CONTACT LIST ||============================== //

const ContactList = ({ avatar, name, role, onActive }) => {
    return (
        <Box sx={{ py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Grid container alignItems="center" spacing={gridSpacing}>
                <Grid
                    item
                    xs={12}
                    sm={6}
                    onClick={() => {
                        onActive && onActive();
                    }}
                    sx={{ cursor: 'pointer' }}
                >
                    <Grid container alignItems="center" spacing={gridSpacing} sx={{ flexWrap: 'nowrap' }}>
                        <Grid item>
                            <Avatar alt={name} src={avatar && getImageUrl(`${avatar}`, ImagePath.USERS)} sx={{ width: 48, height: 48 }} />
                        </Grid>
                        <Grid item sm zeroMinWidth>
                            <Grid container spacing={0}>
                                <Grid item xs={12}>
                                    <Typography variant="h4">{name}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="caption">{role}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}>
                        <Tooltip placement="top" title="Message">
                            <Button variant="outlined" sx={{ minWidth: 32, height: 32, p: 0 }}>
                                <ChatBubbleTwoToneIcon fontSize="small" />
                            </Button>
                        </Tooltip>
                        <Tooltip placement="top" title="Call">
                            <Button variant="outlined" color="secondary" sx={{ minWidth: 32, height: 32, p: 0 }}>
                                <PhoneTwoToneIcon fontSize="small" />
                            </Button>
                        </Tooltip>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

ContactList.propTypes = {
    avatar: PropTypes.string,
    name: PropTypes.string,
    onActive: PropTypes.func,
    role: PropTypes.string
};

export default ContactList;
