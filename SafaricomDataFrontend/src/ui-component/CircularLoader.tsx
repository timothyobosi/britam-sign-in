// material-ui
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

// ==============================|| LOADER - CIRCULAR ||============================== //

const CircularLoader = () => {
    return (
        <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
            <CircularProgress />
        </Stack>
    );
};

export default CircularLoader;
