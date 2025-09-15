import PropTypes from 'prop-types';
import * as React from 'react';
import { Link } from 'react-router-dom';

// material-ui
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

// assets
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterListTwoTone';
import PrintIcon from '@mui/icons-material/PrintTwoTone';
import FileCopyIcon from '@mui/icons-material/FileCopyTwoTone';
import AddIcon from '@mui/icons-material/AddTwoTone';

// ==============================|| CLIENT LIST - FILTER ||============================== //

const ClientFilter = ({ users, setUsers }) => {
    const [search, setSearch] = React.useState('');

    const handleSearch = (event) => {
        const newString = event?.target.value;
        setSearch(newString || '');

        if (newString) {
            const newRows = users?.filter((row) => {
                let matches = true;

                const properties = ['id', 'name', 'email', 'contact', 'role', 'location', 'about'];
                let containsQuery = false;

                properties.forEach((property) => {
                    if (row[property].toString().toLowerCase().includes(newString.toString().toLowerCase())) {
                        containsQuery = true;
                    }
                });

                if (!containsQuery) {
                    matches = false;
                }
                return matches;
            });
            setUsers(newRows);
        } else {
            setUsers(users);
        }
    };

    return (
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-between" spacing={2}>
            <TextField
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                        </InputAdornment>
                    )
                }}
                onChange={handleSearch}
                placeholder="Search client"
                value={search}
                size="small"
                sx={{ width: { xs: 1, sm: 'auto' } }}
            />
            <Stack direction="row" alignItems="center" spacing={1.25}>
                <Tooltip title="Copy">
                    <IconButton size="large">
                        <FileCopyIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Print">
                    <IconButton size="large">
                        <PrintIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Filter">
                    <IconButton size="large">
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>

                {/* client add & dialog */}
                <Tooltip title="Add Client">
                    <Link to="/apps/invoice/client/add-client">
                        <Fab color="primary" size="small" sx={{ boxShadow: 'none', width: 32, height: 32, minHeight: 32 }}>
                            <AddIcon fontSize="small" />
                        </Fab>
                    </Link>
                </Tooltip>
            </Stack>
        </Stack>
    );
};

ClientFilter.propTypes = {
    setUsers: PropTypes.func,
    users: PropTypes.array
};

export default ClientFilter;
