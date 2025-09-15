import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import CloseIcon from '@mui/icons-material/Close';

// generate random
function rand() {
    return Math.round(Math.random() * 20) - 10;
}

// modal position
function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`
    };
}

const Body = React.forwardRef(({ modalStyle, handleClose }, ref) => (
    <div ref={ref} tabIndex={-1}>
        {/**
         * sx={...modalStyle}
         * Property 'style' does not exist on type 'IntrinsicAttributes & MainCardProps & RefAttributes<HTMLDivElement>
         */}
        <MainCard
            sx={{
                position: 'absolute',
                width: { xs: 280, lg: 450 },
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                ...modalStyle
            }}
            title="Title"
            content={false}
            secondary={
                <IconButton onClick={handleClose} size="large" aria-label="close modal">
                    <CloseIcon fontSize="small" />
                </IconButton>
            }
        >
            <CardContent>
                <Typography variant="body1">Laboris non ad et aute sint aliquip mollit voluptate velit dolore magna fugiat ex.</Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Commodo amet veniam nostrud mollit quis sint qui nulla elit esse excepteur ullamco esse magna. Nisi duis aute est in
                    mollit irure enim tempor in.
                </Typography>
            </CardContent>
            <Divider />
            <CardActions>
                <SimpleModal />
            </CardActions>
        </MainCard>
    </div>
));

Body.propTypes = {
    modalStyle: PropTypes.object,
    handleClose: PropTypes.func
};

// ==============================|| SIMPLE MODAL ||============================== //

export default function SimpleModal() {
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Grid container justifyContent="flex-end">
            <Button variant="contained" type="button" onClick={handleOpen}>
                Open Modal
            </Button>
            <Modal open={open} onClose={handleClose} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
                <Body modalStyle={modalStyle} handleClose={handleClose} />
            </Modal>
        </Grid>
    );
}
