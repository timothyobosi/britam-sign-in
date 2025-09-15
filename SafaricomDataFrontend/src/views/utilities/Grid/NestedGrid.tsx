// material-ui
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

// project imports
import Item from './GridItem';

function FormRow() {
    return (
        <>
            <Grid item xs={4}>
                <Item>Item</Item>
            </Grid>
            <Grid item xs={4}>
                <Item>Item</Item>
            </Grid>
            <Grid item xs={4}>
                <Item>Item</Item>
            </Grid>
        </>
    );
}

// ===============================|| GRID - NESTED ||=============================== //

export default function NestedGrid() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
                <Grid container item spacing={3}>
                    <FormRow />
                </Grid>
                <Grid container item spacing={3}>
                    <FormRow />
                </Grid>
                <Grid container item spacing={3}>
                    <FormRow />
                </Grid>
            </Grid>
        </Box>
    );
}
