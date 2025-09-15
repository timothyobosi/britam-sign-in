// material-ui
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

// project imports
import Item from './GridItem';

// ===============================|| GRID - AUTO ||=============================== //

export default function AutoGrid() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
                <Grid item xs>
                    <Item>xs</Item>
                </Grid>
                <Grid item xs={6}>
                    <Item>xs=6</Item>
                </Grid>
                <Grid item xs>
                    <Item>xs</Item>
                </Grid>
            </Grid>
        </Box>
    );
}
