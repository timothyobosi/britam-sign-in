import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

// project imports
import Avatar from 'ui-component/extended/Avatar';
import { gridSpacing } from 'store/constant';
import { getImageUrl, ImagePath } from 'utils/getImageUrl';
import { ThemeMode } from 'config';

// assets
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';
import PhoneTwoToneIcon from '@mui/icons-material/PhoneTwoTone';

// ==============================|| USER CONTACT CARD ||============================== //

const ContactCard = ({ avatar, contact, email, name, location, onActive, role }) => {
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(event?.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Card
            sx={{
                p: 2,
                bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'grey.50',
                ...(theme.palette.mode !== ThemeMode.DARK && { border: '1px solid', borderColor: 'grey.100' })
            }}
        >
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container spacing={gridSpacing}>
                        <Grid
                            item
                            xs
                            zeroMinWidth
                            onClick={() => {
                                onActive && onActive();
                            }}
                            sx={{ cursor: 'pointer' }}
                        >
                            <Avatar
                                alt={name}
                                size="lg"
                                src={avatar && getImageUrl(`${avatar}`, ImagePath.USERS)}
                                sx={{ width: 72, height: 72 }}
                            />
                        </Grid>
                        <Grid item>
                            <MoreHorizOutlinedIcon
                                fontSize="small"
                                sx={{ color: 'grey.500', cursor: 'pointer' }}
                                aria-controls="menu-user-details-card"
                                aria-haspopup="true"
                                onClick={handleClick}
                            />
                            {anchorEl && (
                                <Menu
                                    id="menu-user-details-card"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                    variant="selectedMenu"
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right'
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right'
                                    }}
                                >
                                    <MenuItem onClick={handleClose}> Today</MenuItem>
                                    <MenuItem onClick={handleClose}> This Month</MenuItem>
                                    <MenuItem onClick={handleClose}> This Year </MenuItem>
                                </Menu>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h3">{name}</Typography>
                    <Typography variant="caption">{role}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="caption">Email</Typography>
                    <Typography variant="h6">{email}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={6}>
                            <Typography variant="caption">Phone</Typography>
                            <Typography variant="h6">{contact}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="caption">Location</Typography>
                            <Typography variant="h6">{location}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Button variant="outlined" sx={{ width: '100%' }} startIcon={<ChatBubbleTwoToneIcon />}>
                                Message
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant="outlined" color="secondary" sx={{ width: '100%' }} startIcon={<PhoneTwoToneIcon />}>
                                Call
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    );
};

ContactCard.propTypes = {
    avatar: PropTypes.string,
    contact: PropTypes.string,
    email: PropTypes.string,
    location: PropTypes.string,
    name: PropTypes.string,
    onActive: PropTypes.func,
    role: PropTypes.string
};

export default ContactCard;
