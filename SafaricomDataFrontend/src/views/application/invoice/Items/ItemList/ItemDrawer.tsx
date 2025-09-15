import PropTypes from 'prop-types';

// material-ui
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import ItemDetails from './ItemDetails';

// ==============================|| ITEM LIST - DRAWER ||============================== //

const ItemDrawer = ({ open, setOpen, rowValue }) => {
    const downSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Drawer
            sx={{
                flexShrink: 0,
                zIndex: 100,
                display: open ? 'block' : 'none',
                '& .MuiDrawer-paper': {
                    position: 'relative',
                    ...(!downSM && open && { borderTop: '1px solid', borderTopColor: 'divider' }),
                    ...(downSM && { position: 'absolute' }),
                    overflow: 'unset',
                    width: '100%',
                    borderLeft: 'none'
                }
            }}
            variant="persistent"
            anchor="right"
            open={open}
        >
            <ItemDetails rowValue={rowValue} handleDrawerClose={handleDrawerClose} />
        </Drawer>
    );
};

ItemDrawer.propTypes = {
    rowValue: PropTypes.object,
    open: PropTypes.bool,
    setOpen: PropTypes.func
};

export default ItemDrawer;
