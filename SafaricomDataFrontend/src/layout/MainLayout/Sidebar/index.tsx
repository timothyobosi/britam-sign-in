import { memo, useMemo } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MenuCard from './MenuCard';
import MenuList from '../MenuList';
import LogoSection from '../LogoSection';
import MiniDrawerStyled from './MiniDrawerStyled';
import Chip from 'ui-component/extended/Chip';

import useConfig from 'hooks/useConfig';
import { MenuOrientation } from 'config';
import { drawerWidth } from 'store/constant';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// ==============================|| SIDEBAR DRAWER ||============================== //

const Sidebar = () => {
    const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const { menuMaster } = useGetMenuMaster();
    const drawerOpen = menuMaster.isDashboardDrawerOpened;

    const { menuOrientation, miniDrawer } = useConfig();

    const logo = useMemo(
        () => (
            <Box sx={{ display: 'flex', p: 2 }}>
                <LogoSection />
            </Box>
        ),
        []
    );

    const drawer = useMemo(() => {
        const isVerticalOpen = menuOrientation === MenuOrientation.VERTICAL && drawerOpen;
        const drawerContent = (
            <>
                <MenuCard />
                <Stack direction="row" justifyContent="center" sx={{ mb: 2 }}>
                    <Chip label={import.meta.env.VITE_APP_VERSION} disabled chipcolor="secondary" size="small" sx={{ cursor: 'pointer' }} />
                </Stack>
            </>
        );

        let drawerSX = { paddingLeft: '0px', paddingRight: '0px', marginTop: '20px' };
        if (drawerOpen) drawerSX = { paddingLeft: '16px', paddingRight: '16px', marginTop: '0px' };

        return (
            <>
                {downMD ? (
                    <Box sx={drawerSX}>
                        <MenuList />
                        {isVerticalOpen && drawerContent}
                    </Box>
                ) : (
                    <PerfectScrollbar style={{ height: 'calc(100vh - 88px)', ...drawerSX }}>
                        <MenuList />
                        {isVerticalOpen && drawerContent}
                    </PerfectScrollbar>
                )}
            </>
        );
    }, [downMD, drawerOpen, menuOrientation]);

    return (
        <Box component="nav" sx={{ flexShrink: { md: 0 }, width: { xs: 'auto', md: drawerWidth } }} aria-label="mailbox folders">
            {downMD || (miniDrawer && drawerOpen) ? (
                <Drawer
                    variant={downMD ? 'temporary' : 'persistent'}
                    anchor="left"
                    open={drawerOpen}
                    onClose={() => handlerDrawerOpen(!drawerOpen)}
                    sx={{
                        '& .MuiDrawer-paper': {
                            mt: downMD ? 0 : 11,
                            zIndex: 1099,
                            width: drawerWidth,
                            bgcolor: 'background.default',
                            color: 'text.primary',
                            borderRight: 'none'
                        }
                    }}
                    ModalProps={{ keepMounted: true }}
                    color="inherit"
                >
                    {downMD && logo}
                    {drawer}
                </Drawer>
            ) : (
                <MiniDrawerStyled variant="permanent" open={drawerOpen}>
                    {logo}
                    {drawer}
                </MiniDrawerStyled>
            )}
        </Box>
    );
};

export default memo(Sidebar);
