import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

// third-party
import { FormattedMessage } from 'react-intl';
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import UpgradePlanCard from './UpgradePlanCard';
import useAuth from 'hooks/useAuth';
import User1 from 'assets/images/users/user-round.svg';
import { ThemeMode } from 'config';

// assets
import { IconLogout, IconSearch, IconSettings, IconUser } from '@tabler/icons-react';
import useConfig from 'hooks/useConfig';

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
    const theme = useTheme();
    const { mode, borderRadius } = useConfig();
    const navigate = useNavigate();

    const [sdm, setSdm] = useState(true);
    const [value, setValue] = useState('');
    const [notification, setNotification] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const { logout, user } = useAuth();
    const [open, setOpen] = useState(false);

    /**
     * anchorRef is used on different components and specifying one type leads to other components throwing an error
     * */
    const anchorRef = useRef(null);
    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error(err);
        }
    };

    const handleListItemClick = (event, index, route = '') => {
        setSelectedIndex(index);
        handleClose(event);

        if (route && route !== '') {
            navigate(route);
        }
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <>
            <Chip
                sx={{
                    ml: 2,
                    height: '48px',
                    alignItems: 'center',
                    borderRadius: '27px',
                    transition: 'all .2s ease-in-out',
                    borderColor: mode === ThemeMode.DARK ? 'dark.main' : 'primary.light',
                    bgcolor: mode === ThemeMode.DARK ? 'dark.main' : 'primary.light',
                    '&[aria-controls="menu-list-grow"], &:hover': {
                        borderColor: 'primary.main',
                        bgcolor: `${theme.palette.primary.main} !important`,
                        color: 'primary.light',
                        '& svg': {
                            stroke: theme.palette.primary.light
                        }
                    },
                    '& .MuiChip-label': {
                        lineHeight: 0
                    }
                }}
                icon={
                    <Avatar
                        src={User1}
                        alt="user-images"
                        sx={{
                            ...theme.typography.mediumAvatar,
                            margin: '8px 0 8px 8px !important',
                            cursor: 'pointer'
                        }}
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        color="inherit"
                    />
                }
                label={<IconSettings stroke={1.5} size="24px" />}
                variant="outlined"
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                color="primary"
                aria-label="user-account"
            />

            <Popper
                placement="bottom"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                modifiers={[
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 14]
                        }
                    }
                ]}
            >
                {({ TransitionProps }) => (
                    <ClickAwayListener onClickAway={handleClose}>
                        <Transitions in={open} {...TransitionProps}>
                            <Paper>
                                {open && (
                                    <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                        <Box sx={{ p: 2, pb: 0 }}>
                                            <Stack>
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <Typography variant="h4">Good Morning,</Typography>
                                                    <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                                                        {user?.name}
                                                    </Typography>
                                                </Stack>
                                                <Typography variant="subtitle2">Project Admin</Typography>
                                            </Stack>
                                            <OutlinedInput
                                                sx={{ width: '100%', pr: 1, pl: 2, my: 2 }}
                                                id="input-search-profile"
                                                value={value}
                                                onChange={(e) => setValue(e.target.value)}
                                                placeholder="Search profile options"
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        <IconSearch stroke={1.5} size="16px" />
                                                    </InputAdornment>
                                                }
                                                aria-describedby="search-helper-text"
                                                inputProps={{
                                                    'aria-label': 'weight'
                                                }}
                                            />
                                            <Divider />
                                        </Box>
                                        <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                                            <Box sx={{ p: 2, pt: 0 }}>
                                                <UpgradePlanCard />
                                                <Divider />
                                                <Card sx={{ bgcolor: mode === ThemeMode.DARK ? 'dark.800' : 'primary.light', my: 2 }}>
                                                    <CardContent>
                                                        <Grid container spacing={3} direction="column">
                                                            <Grid item>
                                                                <Grid item container alignItems="center" justifyContent="space-between">
                                                                    <Grid item>
                                                                        <Typography variant="subtitle1">Start DND Mode</Typography>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Switch
                                                                            color="primary"
                                                                            checked={sdm}
                                                                            onChange={(e) => setSdm(e.target.checked)}
                                                                            name="sdm"
                                                                            size="small"
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid item>
                                                                <Grid item container alignItems="center" justifyContent="space-between">
                                                                    <Grid item>
                                                                        <Typography variant="subtitle1">Allow Notifications</Typography>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Switch
                                                                            checked={notification}
                                                                            onChange={(e) => setNotification(e.target.checked)}
                                                                            name="sdm"
                                                                            size="small"
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                                <Divider />
                                                <List
                                                    component="nav"
                                                    sx={{
                                                        width: '100%',
                                                        maxWidth: 350,
                                                        minWidth: 300,
                                                        borderRadius: `${borderRadius}px`,
                                                        '& .MuiListItemButton-root': { mt: 0.5 }
                                                    }}
                                                >
                                                    <ListItemButton
                                                        sx={{ borderRadius: `${borderRadius}px` }}
                                                        selected={selectedIndex === 0}
                                                        onClick={(event) =>
                                                            handleListItemClick(event, 0, '/apps/user/account-profile/profile1')
                                                        }
                                                    >
                                                        <ListItemIcon>
                                                            <IconSettings stroke={1.5} size="20px" />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={
                                                                <Typography variant="body2">
                                                                    <FormattedMessage id="account-settings" />
                                                                </Typography>
                                                            }
                                                        />
                                                    </ListItemButton>
                                                    <ListItemButton
                                                        sx={{ borderRadius: `${borderRadius}px` }}
                                                        selected={selectedIndex === 1}
                                                        onClick={(event) =>
                                                            handleListItemClick(event, 1, '/apps/user/social-profile/posts')
                                                        }
                                                    >
                                                        <ListItemIcon>
                                                            <IconUser stroke={1.5} size="20px" />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={
                                                                <Grid container spacing={1} justifyContent="space-between">
                                                                    <Grid item>
                                                                        <Typography variant="body2">
                                                                            <FormattedMessage id="social-profile" />
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Chip
                                                                            label="02"
                                                                            size="small"
                                                                            color="warning"
                                                                            sx={{ '& .MuiChip-label': { mt: 0.25 } }}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            }
                                                        />
                                                    </ListItemButton>
                                                    <ListItemButton
                                                        sx={{ borderRadius: `${borderRadius}px` }}
                                                        selected={selectedIndex === 4}
                                                        onClick={handleLogout}
                                                    >
                                                        <ListItemIcon>
                                                            <IconLogout stroke={1.5} size="20px" />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={
                                                                <Typography variant="body2">
                                                                    <FormattedMessage id="logout" />
                                                                </Typography>
                                                            }
                                                        />
                                                    </ListItemButton>
                                                </List>
                                            </Box>
                                        </PerfectScrollbar>
                                    </MainCard>
                                )}
                            </Paper>
                        </Transitions>
                    </ClickAwayListener>
                )}
            </Popper>
        </>
    );
};

export default ProfileSection;
