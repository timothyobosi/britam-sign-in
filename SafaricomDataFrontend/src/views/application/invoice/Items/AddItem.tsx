import { Link } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';

// ==============================|| ITEMS - ADD NEW ||============================== //

const AddItem = () => {
    return (
        <MainCard title="Add New Item" sx={{ '& .MuiCardContent-root': { p: 0 } }}>
            <Box sx={{ p: 2.5 }}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField fullWidth label="Name" />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Description" multiline rows={2} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField fullWidth label="Quantity" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField fullWidth label="Unit" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField fullWidth label="Tax" />
                    </Grid>
                </Grid>
            </Box>
            <Divider />
            <Box sx={{ p: 2.5 }}>
                <CardHeader sx={{ pt: 0, pb: 2.5, px: 0 }} title={<Typography variant="h4">Sales Information</Typography>} />
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField fullWidth label="Unit Price" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Currency</InputLabel>
                            <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Currency" value={1}>
                                <MenuItem value={1}>USD</MenuItem>
                                <MenuItem value={2}>EURO</MenuItem>
                                <MenuItem value={3}>POUND</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField fullWidth label="CESS%" />
                    </Grid>
                </Grid>
            </Box>
            <Divider />
            <Box sx={{ p: 2.5 }}>
                <CardHeader sx={{ pt: 0, pb: 2.5, px: 0 }} title={<Typography variant="h4">Purchase Information</Typography>} />
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField fullWidth label="Unit Price" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Currency</InputLabel>
                            <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Currency" value={1}>
                                <MenuItem value={1}>USD</MenuItem>
                                <MenuItem value={2}>EURO</MenuItem>
                                <MenuItem value={3}>POUND</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField fullWidth label="CESS%" />
                    </Grid>
                </Grid>
            </Box>
            <Stack sx={{ px: 2.5, pb: 2.5 }} spacing={1.5} direction="row" justifyContent="end">
                <AnimateButton>
                    <Button variant="contained" size="large" component={Link} to="/apps/invoice/items/item-list">
                        Save
                    </Button>
                </AnimateButton>
            </Stack>
        </MainCard>
    );
};

export default AddItem;
