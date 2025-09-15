import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// =============================|| SIDE ICON CARD ||============================= //

const SideIconCard = ({ iconPrimary, primary, secondary, secondarySub, color, bgcolor }) => {
    const IconPrimary = iconPrimary;
    const primaryIcon = iconPrimary !== undefined ? <IconPrimary /> : null;

    return (
        <Card sx={{ bgcolor: bgcolor || '', position: 'relative' }}>
            <Grid container justifyContent="space-between" alignItems="center" columnSpacing={2}>
                <Grid item xs={4} sx={{ bgcolor: color, py: 3.5, px: 0 }}>
                    <Typography
                        variant="h5"
                        sx={{ textAlign: 'center', color: '#fff', '& > svg': { width: 32, height: 32 } }}
                        align="center"
                    >
                        {primaryIcon}
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <Stack alignItems={{ xs: 'center', sm: 'flex-start' }} spacing={1} justifyContent="space-between">
                        <Typography variant="h3" {...(bgcolor && { sx: { color: '#fff' } })}>
                            {primary}
                        </Typography>
                        <Typography
                            component={'span'}
                            variant="body2"
                            sx={{ color: bgcolor ? '#fff' : 'grey.600', display: 'flex', gap: 0.25 }}
                        >
                            {secondary}{' '}
                            <Box component="span" sx={{ color }}>
                                {secondarySub}
                            </Box>
                        </Typography>
                    </Stack>
                </Grid>
            </Grid>
        </Card>
    );
};

SideIconCard.propTypes = {
    iconPrimary: PropTypes.object,
    primary: PropTypes.string,
    secondary: PropTypes.string,
    secondarySub: PropTypes.string,
    color: PropTypes.string,
    bgcolor: PropTypes.string
};

export default SideIconCard;
