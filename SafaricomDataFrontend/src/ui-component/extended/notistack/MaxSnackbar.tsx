import { useState } from 'react';

// material-ul
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// third-party
import { enqueueSnackbar } from 'notistack';

// project import
import SubCard from 'ui-component/cards/SubCard';
import { dispatch, useSelector } from 'store';
import { handlerIncrease } from 'store/slices/snackbar';

//asset
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

// ==============================|| NOTISTACK - MAXIMUM SNACKBAR ||============================== //

export default function MaxSnackbar() {
    const width = { minWidth: 'auto' };

    const snackbar = useSelector((state) => state.snackbar);
    const [value, setValue] = useState(3);

    const handlerMaxStack = () => {
        enqueueSnackbar('Your notification here', { variant: 'info' });
        dispatch(
            handlerIncrease({
                maxStack: value
            })
        );
    };

    return (
        <SubCard title="Maximum snackbars">
            <Stack justifyContent={'space-between'} flexDirection={'row'}>
                <Button
                    variant="outlined"
                    size="small"
                    sx={width}
                    disabled={snackbar.maxStack === 0 ? true : false}
                    onClick={() => setValue((prev) => prev - 1)}
                >
                    <RemoveOutlinedIcon />
                </Button>
                <Typography variant="body1">stack up to {value}</Typography>
                <Button
                    variant="outlined"
                    size="small"
                    sx={width}
                    disabled={snackbar.maxStack === 4 ? true : false}
                    onClick={() => setValue((prev) => prev + 1)}
                >
                    <AddOutlinedIcon />
                </Button>
            </Stack>
            <Button variant="contained" fullWidth sx={{ marginBlockStart: 2 }} onClick={() => handlerMaxStack()}>
                Show Snackbar
            </Button>
        </SubCard>
    );
}
