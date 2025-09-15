import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// third party
import { Chance } from 'chance';
import dayjs from 'dayjs';

// project imports
import Avatar from 'ui-component/extended/Avatar';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';

// assets
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';

const chance = new Chance();

// ==============================|| ADD CONTACT - BODY ||============================== //

const AddContactDialogContent = ({ row }) => {
    const [value, setValue] = useState(dayjs());
    const [value2, setValue2] = useState(dayjs());

    return (
        <DialogContent sx={{ p: 0 }}>
            <Grid container spacing={1} p={2.5}>
                <Grid item xs={12}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2.5}
                        alignItems="center"
                        justifyContent={{ xs: 'space-between' }}
                    >
                        <Stack alignItems="center" spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                            <Avatar
                                alt="User 1"
                                size="xl"
                                src={getImageUrl(`avatar-${Math.floor(Math.random() * 9) + 1}.png`, ImagePath.USERS)}
                            />
                            <Stack spacing={0.5} alignItems="center">
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    sx={{ px: 5.5, py: 1 }}
                                    startIcon={<AddPhotoAlternateOutlinedIcon />}
                                >
                                    Upload Profile
                                </Button>
                                <Typography variant="caption">
                                    <ErrorTwoToneIcon sx={{ height: 16, width: 16, mr: 1, verticalAlign: 'text-bottom' }} />
                                    Image size should be 125kb Max.
                                </Typography>
                            </Stack>
                        </Stack>
                        <FormControlLabel control={<Switch />} label="Active" />
                    </Stack>
                </Grid>
                <Grid item container xs={12} spacing={2.5} my={1}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="First Name"
                            placeholder="Enter First Name"
                            defaultValue={row && row.name.slice(0, -2)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Last Name" placeholder="Enter Last Name" defaultValue={row && chance.last()} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Email Id" placeholder="Enter Email" defaultValue={row && chance.email()} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Tag</InputLabel>
                            <Select labelId="demo-simple-select-label" id="demo-simple-select" value={1} label="Tag">
                                <MenuItem value="">Select Tag</MenuItem>
                                <MenuItem value={1}>VIP</MenuItem>
                                <MenuItem value={2}>Standard</MenuItem>
                                <MenuItem value={3}>Normal</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker label="Date of Birth" value={value} onChange={(newValue) => setValue(newValue)} />
                        </LocalizationProvider>
                    </Grid>
                </Grid>
                <Grid item xs={12} my={1.5}>
                    <Divider />
                </Grid>
                <Grid item container xs={12} spacing={2.5}>
                    <Grid item xs={12}>
                        <Typography variant="h5">Profession Information</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="First Name"
                            placeholder="Enter First Name"
                            defaultValue={row && row.name.slice(0, -2)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Last Name" placeholder="Enter Last Name" defaultValue={row && chance.last()} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Email Id" placeholder="Enter Email" defaultValue={row && chance.email()} />
                    </Grid>
                </Grid>
                <Grid item xs={12} my={1.5}>
                    <Divider />
                </Grid>
                <Grid item container xs={12} spacing={2.5}>
                    <Grid item xs={12}>
                        <Typography variant="h5">Address Information</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label2">Country</InputLabel>
                            <Select labelId="demo-simple-select-label2" id="demo-simple-select" value={1} label="Country">
                                <MenuItem value="">Select Country</MenuItem>
                                <MenuItem value={1}>India</MenuItem>
                                <MenuItem value={2}>Bangladesh</MenuItem>
                                <MenuItem value={2}>United Kingdom</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="State" placeholder="Enter State" defaultValue={row && chance.state()} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label2">City</InputLabel>
                            <Select labelId="demo-simple-select-label2" id="demo-simple-select" value={1} label="City">
                                <MenuItem value="">Select City</MenuItem>
                                <MenuItem value={1}>Surat</MenuItem>
                                <MenuItem value={2}>Delhi</MenuItem>
                                <MenuItem value={2}>Mumbai</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Zip/Postal Code" placeholder="Enter Zip/Postal Code" value={row && chance.zip()} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            id="outlined-multiline-flexible"
                            label="Address"
                            placeholder="address"
                            multiline
                            rows={3}
                            defaultValue={row && chance.address()}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12} my={1.5}>
                    <Divider />
                </Grid>
                <Grid item container xs={12} spacing={2.5}>
                    <Grid item xs={12}>
                        <Typography variant="h5">Contact Information</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Phone no" placeholder="Enter Phone" defaultValue={row && chance.phone()} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Mobile no" placeholder="Enter Mobile" defaultValue={row && chance.phone()} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <TextField
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="end">
                                            <FacebookIcon />
                                        </InputAdornment>
                                    )
                                }}
                                value={row && chance.email()}
                                placeholder="Enter Email"
                            />
                            <Button variant="contained" size="small" color="secondary">
                                Connect
                            </Button>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <TextField
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="end">
                                            <TwitterIcon />
                                        </InputAdornment>
                                    )
                                }}
                                defaultValue={row && chance.email()}
                                placeholder="Enter Email"
                            />
                            <Button variant="contained" size="small" color="secondary">
                                Connect
                            </Button>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <TextField
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="end">
                                            <LinkedInIcon />
                                        </InputAdornment>
                                    )
                                }}
                                defaultValue={row && chance.email()}
                                placeholder="Enter Email"
                            />
                            <Button variant="contained" size="small" color="secondary">
                                Connect
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
                <Grid item xs={12} my={1.5}>
                    <Divider />
                </Grid>
                <Grid item container xs={12} spacing={2.5}>
                    <Grid item xs={12}>
                        <Typography variant="h5">Other Details</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Lead Source</InputLabel>
                            <Select labelId="demo-simple-select-label" id="demo-simple-select" value={1} label="Lead manage">
                                <MenuItem value={1}>Message</MenuItem>
                                <MenuItem value={2}>Mail</MenuItem>
                                <MenuItem value={3}>Call</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                                label="Date of Birth"
                                slotProps={{
                                    textField: {
                                        fullWidth: true
                                    }
                                }}
                                value={value2}
                                onChange={(newValue) => setValue2(newValue)}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            id="outlined-multiline-flexible"
                            label="Notes"
                            placeholder="notes"
                            multiline
                            defaultValue={row && chance.sentence()}
                            rows={3}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </DialogContent>
    );
};

AddContactDialogContent.propTypes = {
    row: PropTypes.object
};

export default AddContactDialogContent;
