// material-ui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'ui-component/cards/MainCard';

import useConfig from 'hooks/useConfig';
import { gridSpacing } from 'store/constant';
import { ThemeMode } from 'config';

// ==============================|| LEAD - UPCOMING TASK ||============================== //

const UpcomingTask = () => {
    const { mode } = useConfig();

    return (
        <MainCard content={false}>
            <Box sx={{ px: 2.5, py: 2 }}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} alignItems="center" justifyContent="space-between">
                        <Typography variant="h4">Upcoming Task & Follow-ups</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="h3">200</Typography>
                            <Chip
                                label="Follow-up"
                                sx={{ color: 'primary.main', bgcolor: mode === ThemeMode.DARK ? 'dark.main' : 'primary.light' }}
                            />
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </MainCard>
    );
};

export default UpcomingTask;
