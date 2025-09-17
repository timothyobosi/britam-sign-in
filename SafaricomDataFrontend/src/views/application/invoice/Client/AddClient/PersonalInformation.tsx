// material-ui
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

// project imports
import { gridSpacing } from 'store/constant';

// ==============================|| PERSONAL INFORMATION ||============================== //


import React, { useEffect, useState } from 'react';

const PersonalInformation = () => {
    // Persist form progress in localStorage
    type FormDataType = {
        businessName: number;
        industry: number;
        phone: string;
        email: string;
        website: string;
        currency: number;
        sameAsBilling: boolean;
    };
    const [formData, setFormData] = useState<FormDataType>(() => {
        const saved = localStorage.getItem('formProgress');
        return saved ? JSON.parse(saved) : {
            businessName: 1,
            industry: 1,
            phone: '000-00-00000',
            email: 'demo@company.com',
            website: 'company.ltd',
            currency: 1,
            sameAsBilling: true
        };
    });

    useEffect(() => {
        localStorage.setItem('formProgress', JSON.stringify(formData));
    }, [formData]);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel id="business-name-label">Business Name</InputLabel>
                    <Select
                        labelId="business-name-label"
                        id="business-name-select"
                        label="Business Name"
                        value={formData.businessName}
                        onChange={e => setFormData(f => ({ ...f, businessName: Number(e.target.value) }))}
                    >
                        <MenuItem value={1}>Select One</MenuItem>
                        <MenuItem value={2}>Select Two</MenuItem>
                        <MenuItem value={3}>Select Three</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel id="industry-label">Industry</InputLabel>
                    <Select
                        labelId="industry-label"
                        id="industry-select"
                        label="Industry"
                        value={formData.industry}
                        onChange={e => setFormData(f => ({ ...f, industry: Number(e.target.value) }))}
                    >
                        <MenuItem value={1}>company.com</MenuItem>
                        <MenuItem value={2}>company.com</MenuItem>
                        <MenuItem value={3}>company.com</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Phone no."
                    value={formData.phone}
                    onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Email ID"
                    value={formData.email}
                    onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Website"
                    value={formData.website}
                    onChange={e => setFormData(f => ({ ...f, website: e.target.value }))}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel id="currency-label">Currency</InputLabel>
                    <Select
                        labelId="currency-label"
                        id="currency-select"
                        label="Currency"
                        value={formData.currency}
                        onChange={e => setFormData(f => ({ ...f, currency: Number(e.target.value) }))}
                    >
                        <MenuItem value={1}>Indian(Rs)</MenuItem>
                        <MenuItem value={2}>company.com</MenuItem>
                        <MenuItem value={3}>company.com</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formData.sameAsBilling}
                            onChange={e => setFormData(f => ({ ...f, sameAsBilling: e.target.checked }))}
                            name="checkedA"
                            color="primary"
                        />
                    }
                    label="Same as billing address"
                />
            </Grid>
        </Grid>
    );
};

export default PersonalInformation;
