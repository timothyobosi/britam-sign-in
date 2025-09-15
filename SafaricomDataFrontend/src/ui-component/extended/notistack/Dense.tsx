import { useState } from 'react';

// material-ul
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';

// third-party
import { enqueueSnackbar } from 'notistack';

// project import
import SubCard from 'ui-component/cards/SubCard';

import { dispatch } from 'store';
import { handlerDense } from 'store/slices/snackbar';

// ==============================|| NOTISTACK - DENSE ||============================== //

export default function Dense() {
    const [checked, setChecked] = useState(false);

    const handleChange = (event) => {
        setChecked(event.target.checked);
        dispatch(handlerDense({ dense: event.target.checked }));
    };

    return (
        <SubCard title="Dense">
            <Checkbox checked={checked} onChange={handleChange} inputProps={{ 'aria-label': 'controlled' }} />
            Dense margins
            <Button variant="outlined" fullWidth sx={{ marginBlockStart: 2 }} onClick={() => enqueueSnackbar('Your notification here')}>
                Show snackbar
            </Button>
        </SubCard>
    );
}
