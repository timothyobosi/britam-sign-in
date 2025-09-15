import PropTypes from 'prop-types';
import * as React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

// third-party
import { format } from 'date-fns';

// project imports
import MailEmpty from './MailEmpty';
import MailListHeader from './MailListHeader';
import Chip from 'ui-component/extended/Chip';
import MainCard from 'ui-component/cards/MainCard';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';
import { ThemeMode } from 'config';

// assets
import AttachmentTwoToneIcon from '@mui/icons-material/AttachmentTwoTone';
import StarBorderTwoToneIcon from '@mui/icons-material/StarBorderTwoTone';
import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';
import LabelTwoToneIcon from '@mui/icons-material/LabelTwoTone';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveTwoTone';
import MailTwoToneIcon from '@mui/icons-material/MailTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

// ==============================|| TABLE HEADER ||============================== //

function EnhancedTableHead({ selected }) {
    return (
        <TableHead>
            <TableRow>
                <TableCell padding="none" colSpan={5}>
                    <EnhancedTableToolbar numSelected={selected.length} />
                </TableCell>
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    selected: PropTypes.array
};

// ==============================|| TABLE HEADER TOOLBAR ||============================== //

const EnhancedTableToolbar = ({ numSelected }) => (
    <Toolbar sx={{ p: 0, pl: 1, pr: 1, ...(numSelected > 0 && { color: 'secondary.main' }) }}>
        {numSelected > 0 && (
            <Typography color="inherit" variant="h4">
                {numSelected} Mail Selected
            </Typography>
        )}
    </Toolbar>
);

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
};

// ==============================|| CUSTOMER LIST ||============================== //

const MailList = ({ data, search, handleSearch, handleDrawerOpen, handleUserDetails, handleStarredChange, handleImportantChange }) => {
    const theme = useTheme();

    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event?.target.value, 10));
        setPage(0);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    const [denseTable, setDenseTable] = React.useState(false);
    const handleDenseTable = () => {
        setDenseTable(!denseTable);
    };

    const darkBG = theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'grey.100';

    return (
        <>
            <Grid container spacing={{ xs: 3, md: 1 }}>
                <Grid item xs={12}>
                    <MailListHeader
                        search={search}
                        handleSearch={handleSearch}
                        length={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                        handleDrawerOpen={handleDrawerOpen}
                        handleDenseTable={handleDenseTable}
                    />
                </Grid>
                <Grid item xs={12}>
                    {data.length ? (
                        <MainCard content={false} sx={{ bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.800' : 'grey.50' }}>
                            {/* table */}
                            <TableContainer>
                                <Table
                                    size={denseTable ? 'small' : undefined}
                                    aria-labelledby="tableTitle"
                                    sx={{ minWidth: 320, '& td': { whiteSpace: 'nowrap', px: 0.75, py: denseTable ? 0.5 : 1.25 } }}
                                >
                                    {selected.length > 0 && <EnhancedTableHead selected={selected} />}
                                    <TableBody>
                                        {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                                            const isItemSelected = isSelected(row.profile.name);
                                            const labelId = `enhanced-table-checkbox-${index}`;

                                            return (
                                                <TableRow
                                                    hover
                                                    sx={{
                                                        bgcolor: !row.isRead ? darkBG : '',
                                                        '& td:last-of-type>div': {
                                                            position: 'absolute',
                                                            top: '50%',
                                                            right: 5,
                                                            transform: 'translateY(-50%)',
                                                            display: 'none',
                                                            bgcolor: 'background.default',
                                                            boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
                                                            borderRadius: '12px',
                                                            py: 1,
                                                            px: 1.75,
                                                            '& button + button': {
                                                                ml: 0.625
                                                            }
                                                        },
                                                        '&:hover': {
                                                            '& td:last-of-type>div': {
                                                                display: 'block'
                                                            }
                                                        }
                                                    }}
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={index}
                                                    selected={isItemSelected}
                                                >
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={isItemSelected}
                                                            color="primary"
                                                            onChange={(event) => handleClick(event, row.profile.name)}
                                                            inputProps={{
                                                                'aria-labelledby': labelId
                                                            }}
                                                        />
                                                        <Checkbox
                                                            icon={<StarBorderTwoToneIcon />}
                                                            checkedIcon={<StarTwoToneIcon />}
                                                            sx={{ '&.Mui-checked': { color: 'warning.dark' } }}
                                                            checked={row.starred}
                                                            onChange={(event) => handleStarredChange(event, row)}
                                                            size="small"
                                                        />
                                                        <Checkbox
                                                            icon={<LabelOutlinedIcon />}
                                                            checkedIcon={<LabelTwoToneIcon />}
                                                            sx={{ '&.Mui-checked': { color: 'secondary.main' } }}
                                                            checked={row.important}
                                                            onChange={(event) => handleImportantChange(event, row)}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell
                                                        id={labelId}
                                                        sx={{ cursor: 'pointer' }}
                                                        onClick={(e) => handleUserDetails(e, row)}
                                                    >
                                                        <Grid container spacing={2} alignItems="center" sx={{ flexWrap: 'nowrap' }}>
                                                            <Grid item>
                                                                <Avatar
                                                                    sx={{
                                                                        width: denseTable ? 30 : 40,
                                                                        height: denseTable ? 30 : 40
                                                                    }}
                                                                    alt={row.profile.name}
                                                                    src={
                                                                        row.profile &&
                                                                        row.profile.avatar &&
                                                                        getImageUrl(`${row.profile.avatar}`, ImagePath.USERS)
                                                                    }
                                                                />
                                                            </Grid>
                                                            <Grid item xs zeroMinWidth>
                                                                <ButtonBase disableRipple>
                                                                    <Typography variant={row.isRead ? 'body2' : 'subtitle1'}>
                                                                        {row.profile.name}
                                                                    </Typography>
                                                                </ButtonBase>
                                                            </Grid>
                                                        </Grid>
                                                    </TableCell>
                                                    <TableCell sx={{ cursor: 'pointer' }} onClick={(e) => handleUserDetails(e, row)}>
                                                        <Box sx={{ display: 'flex', width: { xs: 220, md: 350, lg: 600, xl: 700 } }}>
                                                            <Typography
                                                                variant={row.isRead ? 'body2' : 'subtitle1'}
                                                                sx={{
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    whiteSpace: 'nowrap',
                                                                    display: 'block'
                                                                }}
                                                            >
                                                                {row.subject} - {row.message}
                                                            </Typography>
                                                            {row.promotions && (
                                                                <Chip
                                                                    label="Promotions"
                                                                    size="small"
                                                                    sx={{
                                                                        color: 'primary.main',
                                                                        bgcolor: 'primary.light'
                                                                    }}
                                                                />
                                                            )}
                                                            {row.forums && (
                                                                <Chip
                                                                    label="Forums"
                                                                    size="small"
                                                                    sx={{
                                                                        ml: row.promotions ? 1 : 0,
                                                                        mr: row.attach ? 1 : 0,
                                                                        color: 'warning.dark',
                                                                        bgcolor: 'warning.light'
                                                                    }}
                                                                />
                                                            )}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {row.attach && (
                                                            <IconButton size="large">
                                                                <AttachmentTwoToneIcon fontSize="small" />
                                                            </IconButton>
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ position: 'relative' }}>
                                                        {format(new Date(row.time), 'd MMM yy HH:mm a')}
                                                        <div>
                                                            <IconButton size="large">
                                                                <ArchiveTwoToneIcon fontSize="small" />
                                                            </IconButton>
                                                            <IconButton size="large">
                                                                <MailTwoToneIcon fontSize="small" />
                                                            </IconButton>
                                                            <IconButton size="large">
                                                                <DeleteTwoToneIcon fontSize="small" />
                                                            </IconButton>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                        {emptyRows > 0 && (
                                            <TableRow sx={{ height: 53 * emptyRows }}>
                                                <TableCell colSpan={6} />
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </MainCard>
                    ) : (
                        <MailEmpty />
                    )}
                </Grid>
                <Grid item xs={12} sx={{ pt: '0 !important', display: { xs: 'block', sm: 'none' } }}>
                    {/* table pagination */}
                    <TablePagination
                        rowsPerPageOptions={[]}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Grid>
            </Grid>
        </>
    );
};

MailList.propTypes = {
    data: PropTypes.array,
    handleDrawerOpen: PropTypes.func,
    handleUserDetails: PropTypes.func,
    handleStarredChange: PropTypes.func,
    handleImportantChange: PropTypes.func,
    handleSearch: PropTypes.func,
    search: PropTypes.string
};

export default MailList;
