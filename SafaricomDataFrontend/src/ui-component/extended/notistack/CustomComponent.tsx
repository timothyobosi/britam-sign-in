import PropTypes from 'prop-types';
import { useState, forwardRef, useCallback } from 'react';

//material
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Paper from '@mui/material/Paper';

// third-party
import { enqueueSnackbar, useSnackbar, SnackbarContent } from 'notistack';

// project import
import SubCard from 'ui-component/cards/SubCard';

//assets
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

const SnackbarBox = styled(SnackbarContent)(() => ({
    '@media (min-width:600px)': {
        minWidth: '344px !important'
    }
}));

const CustomNotistack = forwardRef((props, ref) => {
    const { closeSnackbar } = useSnackbar();
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = useCallback(() => {
        setExpanded((prevState) => !prevState);
    }, []);

    const handleDismiss = useCallback(() => {
        closeSnackbar(props.id);
    }, [props.id, closeSnackbar]);

    return (
        <SnackbarBox ref={ref}>
            <Card sx={{ bgcolor: 'warning.light', width: '100%' }}>
                <CardActions sx={{ padding: '8px 8px 8px 16px', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2">{props.message}</Typography>
                    <Box sx={{ marginLeft: 'auto' }}>
                        <IconButton
                            aria-label="Show more"
                            sx={{ p: 1, transition: 'all .2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                            onClick={handleExpandClick}
                        >
                            <KeyboardArrowDownOutlinedIcon />
                        </IconButton>
                        <IconButton sx={{ p: 1, transition: 'all .2s' }} onClick={handleDismiss}>
                            <CloseOutlinedIcon />
                        </IconButton>
                    </Box>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Paper sx={{ padding: 2, borderTopLeftRadius: 0, borderTopRightRadius: 0, bgcolor: 'warning.lighter' }}>
                        <Typography gutterBottom>PDF ready</Typography>
                        <Button
                            size="small"
                            startIcon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                            sx={{ '&:hover': { bgcolor: 'transparent' } }}
                        >
                            Download now
                        </Button>
                    </Paper>
                </Collapse>
            </Card>
        </SnackbarBox>
    );
});

CustomNotistack.propTypes = {
    id: PropTypes.number,
    message: PropTypes.string
};

// ==============================|| NOTISTACK - CUSTOM STYLE ||============================== //

export default function CustomComponent() {
    return (
        <SubCard title="Custom Component">
            <Button
                variant="outlined"
                fullWidth
                sx={{ marginBlockStart: 2 }}
                onClick={() => {
                    enqueueSnackbar("You're report is ready", {
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'right'
                        },
                        content: (key, message) => <CustomNotistack id={key} message={message} />
                    });
                }}
            >
                Show snackbar
            </Button>
        </SubCard>
    );
}
