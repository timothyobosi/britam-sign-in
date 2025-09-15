import { useState } from 'react';

// material-ul
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';

// third-party
import { enqueueSnackbar } from 'notistack';

// project import
import SubCard from 'ui-component/cards/SubCard';

import { dispatch } from 'store';
import { handlerIconVariants } from 'store/slices/snackbar';

// ==============================|| NOTISTACK - CUSTOM ICON ||============================== //

export default function IconVariants() {
    const [value, setValue] = useState('usedefault');
    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <SubCard title="With Icons">
            <FormControl>
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    value={value}
                    onChange={handleChange}
                    name="row-radio-buttons-group"
                >
                    <FormControlLabel value="usedefault" control={<Radio />} label="Use Default" />
                    <FormControlLabel value="useemojis" control={<Radio />} label="Use Emojis" />
                    <FormControlLabel value="hide" control={<Radio />} label="Hide" />
                </RadioGroup>
            </FormControl>
            <Button
                variant="contained"
                fullWidth
                sx={{ marginBlockStart: 2 }}
                onClick={() => {
                    enqueueSnackbar('Your notification here', { variant: 'info' });
                    dispatch(
                        handlerIconVariants({
                            iconVariant: value
                        })
                    );
                }}
            >
                Show Snackbar
            </Button>
        </SubCard>
    );
}
