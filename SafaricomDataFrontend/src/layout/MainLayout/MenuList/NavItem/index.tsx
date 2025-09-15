import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';
import Chip from '@mui/material/Chip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import useConfig from 'hooks/useConfig';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import { MenuOrientation, ThemeMode } from 'config';

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

const NavItem = ({ item, level, isParents = false, setSelectedID }) => {
    const theme = useTheme();
    const downMD = useMediaQuery(theme.breakpoints.down('md'));
    const ref = useRef(null);

    const { pathname } = useLocation();
    const { mode, menuOrientation, borderRadius } = useConfig();

    const { menuMaster } = useGetMenuMaster();
    const drawerOpen = menuMaster.isDashboardDrawerOpened;
    const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downMD;
    const isSelected = !!matchPath({ path: item?.link ? item.link : item.url, end: false }, pathname);

    const [hoverStatus, setHover] = useState(false);

    const compareSize = () => {
        const compare = ref.current && ref.current.scrollWidth > ref.current.clientWidth;
        setHover(compare);
    };

    useEffect(() => {
        compareSize();
        window.addEventListener('resize', compareSize);
        window.removeEventListener('resize', compareSize);
    }, []);

    const Icon = item?.icon;
    const itemIcon = item?.icon ? (
        <Icon
            stroke={1.5}
            size={drawerOpen ? '20px' : '24px'}
            style={{ ...(isHorizontal && isParents && { fontSize: 20, stroke: '1.5' }) }}
        />
    ) : (
        <FiberManualRecordIcon sx={{ width: isSelected ? 8 : 6, height: isSelected ? 8 : 6 }} fontSize={level > 0 ? 'inherit' : 'medium'} />
    );

    let itemTarget = '_self';
    if (item.target) {
        itemTarget = '_blank';
    }

    const itemHandler = () => {
        if (downMD) handlerDrawerOpen(false);

        if (isParents && setSelectedID) {
            setSelectedID();
        }
    };

    const iconSelectedColor = mode === ThemeMode.DARK && drawerOpen ? 'text.primary' : 'secondary.main';

    return (
        <>
            {!isHorizontal ? (
                <ListItemButton
                    component={Link}
                    to={item.url}
                    target={itemTarget}
                    disabled={item.disabled}
                    disableRipple={!drawerOpen}
                    sx={{
                        zIndex: 1201,
                        borderRadius: `${borderRadius}px`,
                        mb: 0.5,
                        pl: drawerOpen ? `${level * 24}px` : 1.25,
                        ...(drawerOpen &&
                            level === 1 &&
                            mode !== ThemeMode.DARK && {
                                '&:hover': {
                                    bgcolor: 'secondary.light'
                                },
                                '&.Mui-selected': {
                                    bgcolor: 'secondary.light',
                                    color: iconSelectedColor,
                                    '&:hover': {
                                        color: iconSelectedColor,
                                        bgcolor: 'secondary.light'
                                    }
                                }
                            }),
                        ...((!drawerOpen || level !== 1) && {
                            py: level === 1 ? 0 : 1,
                            '&:hover': {
                                bgcolor: 'transparent'
                            },
                            '&.Mui-selected': {
                                '&:hover': {
                                    bgcolor: 'transparent'
                                },
                                bgcolor: 'transparent'
                            }
                        })
                    }}
                    selected={isSelected}
                    onClick={() => itemHandler()}
                >
                    <ButtonBase aria-label="theme-icon" sx={{ borderRadius: `${borderRadius}px` }} disableRipple={drawerOpen}>
                        <ListItemIcon
                            sx={{
                                minWidth: level === 1 ? 36 : 18,
                                color: isSelected ? iconSelectedColor : 'text.primary',
                                ...(!drawerOpen &&
                                    level === 1 && {
                                        borderRadius: `${borderRadius}px`,
                                        width: 46,
                                        height: 46,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        '&:hover': {
                                            bgcolor: mode === ThemeMode.DARK ? alpha(theme.palette.secondary.main, 0.25) : 'secondary.light'
                                        },
                                        ...(isSelected && {
                                            bgcolor:
                                                mode === ThemeMode.DARK ? alpha(theme.palette.secondary.main, 0.25) : 'secondary.light',
                                            '&:hover': {
                                                bgcolor:
                                                    mode === ThemeMode.DARK ? alpha(theme.palette.secondary.main, 0.3) : 'secondary.light'
                                            }
                                        })
                                    })
                            }}
                        >
                            {itemIcon}
                        </ListItemIcon>
                    </ButtonBase>

                    {(drawerOpen || (!drawerOpen && level !== 1)) && (
                        <Tooltip title={item.title} disableHoverListener={!hoverStatus}>
                            <ListItemText
                                primary={
                                    <Typography
                                        ref={ref}
                                        noWrap
                                        overflow="hidden"
                                        textOverflow="ellipsis"
                                        variant={isSelected ? 'h5' : 'body1'}
                                        color="inherit"
                                        width={102}
                                    >
                                        {item.title}
                                    </Typography>
                                }
                                secondary={
                                    item.caption && (
                                        <Typography
                                            variant="caption"
                                            sx={{ ...theme.typography.subMenuCaption }}
                                            display="block"
                                            gutterBottom
                                        >
                                            {item.caption}
                                        </Typography>
                                    )
                                }
                            />
                        </Tooltip>
                    )}

                    {drawerOpen && item.chip && (
                        <Chip
                            color={item.chip.color}
                            variant={item.chip.variant}
                            size={item.chip.size}
                            label={item.chip.label}
                            avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
                        />
                    )}
                </ListItemButton>
            ) : (
                <ListItemButton
                    component={Link}
                    to={item.url}
                    target={itemTarget}
                    disabled={item.disabled}
                    sx={{
                        borderRadius: isParents ? `${borderRadius}px` : 0,
                        mb: isParents ? 0 : 0.5,
                        alignItems: 'flex-start',
                        backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
                        py: 1,
                        pl: 2,
                        mr: isParents ? 1 : 0
                    }}
                    selected={isSelected}
                    onClick={() => itemHandler()}
                >
                    <ListItemIcon
                        sx={{
                            my: 'auto',
                            minWidth: !item?.icon ? 18 : 36
                        }}
                    >
                        {itemIcon}
                    </ListItemIcon>

                    <ListItemText
                        primary={
                            <Typography variant={isSelected ? 'h5' : 'body1'} color="inherit">
                                {item.title}
                            </Typography>
                        }
                        secondary={
                            item.caption && (
                                <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
                                    {item.caption}
                                </Typography>
                            )
                        }
                    />

                    {item.chip && (
                        <Chip
                            color={item.chip.color}
                            variant={item.chip.variant}
                            size={item.chip.size}
                            label={item.chip.label}
                            avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
                        />
                    )}
                </ListItemButton>
            )}
        </>
    );
};

NavItem.propTypes = {
    setSelectedID: PropTypes.func,
    item: PropTypes.object,
    level: PropTypes.number,
    parentId: PropTypes.string,
    isParents: PropTypes.bool
};

export default NavItem;
