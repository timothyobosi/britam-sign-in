import PropTypes from 'prop-types';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// project imports
import Avatar from 'ui-component/extended/Avatar';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';
import { ThemeMode } from 'config';

// third-party
import { Chance } from 'chance';
import { random } from 'lodash-es';

// assets
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import CachedIcon from '@mui/icons-material/Cached';
import CancelIcon from '@mui/icons-material/Cancel';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import HorizontalRuleOutlinedIcon from '@mui/icons-material/HorizontalRuleOutlined';
import MailTwoToneIcon from '@mui/icons-material/MailTwoTone';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import PendingIcon from '@mui/icons-material/Pending';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';

const chance = new Chance();

// ==============================|| HISTORY - TABLE BODY ||============================== //

const HistoryTableBody = ({ labelId, row, selected, handleClick }) => {
    const theme = useTheme();
    const isSelected = (name) => selected.indexOf(name) !== -1;
    const isItemSelected = isSelected(row.name);

    const date = new Date(new Date().getTime() - random(0, 28) * 24 * 60 * 60 * 1000);

    let icon;
    let subject;
    let label;
    let color;
    let chipcolor;
    let rowStatus;
    let nameStatus;

    switch (Math.floor(Math.random() * 4 + 1)) {
        case 1:
            icon = <CallOutlinedIcon color="info" />;
            nameStatus = <CheckCircleIcon color="success" fontSize="small" />;
            break;
        case 2:
            icon = <MailTwoToneIcon color="primary" />;
            nameStatus = <CancelIcon color="error" fontSize="small" />;
            break;
        case 4:
            icon = <VideocamOutlinedIcon color="success" />;
            nameStatus = <PendingIcon color="warning" fontSize="small" />;
            break;
        case 3:
        default:
            icon = <VideoCameraFrontIcon color="error" />;
            nameStatus = <CachedIcon color="primary" fontSize="small" />;
    }

    switch (row.status) {
        case 1:
            subject = 'Review';
            label = 'High';
            color = 'success.dark';
            chipcolor = alpha(theme.palette.success.light, 0.6);
            rowStatus = (
                <Tooltip title="Completed" placement="right-end" arrow>
                    <CheckCircleIcon color="success" />
                </Tooltip>
            );
            break;
        case 2:
            subject = 'Offer';
            label = 'Medium';
            color = 'warning.dark';
            chipcolor = 'warning.light';
            rowStatus = (
                <Tooltip title="Reopen" placement="right-end" arrow>
                    <AutorenewOutlinedIcon color="disabled" />
                </Tooltip>
            );
            break;
        case 3:
        default:
            subject = 'New Services';
            label = 'Low';
            color = 'orange.dark';
            chipcolor = alpha(theme.palette.orange.light, 0.8);
            rowStatus = (
                <Tooltip title="Pending" placement="right-end" arrow>
                    <AccessTimeOutlinedIcon color="warning" />
                </Tooltip>
            );
    }

    return (
        <TableRow hover role="checkbox" aria-checked={isItemSelected} tabIndex={-1} selected={isItemSelected}>
            <TableCell padding="checkbox" sx={{ pl: 3 }} onClick={() => handleClick(row.name)}>
                <Checkbox
                    color="primary"
                    checked={isItemSelected}
                    inputProps={{
                        'aria-labelledby': labelId
                    }}
                />
            </TableCell>
            <TableCell id={labelId}>#{row.id}</TableCell>
            <TableCell onClick={() => handleClick(row.name)} sx={{ cursor: 'pointer' }}>
                <Stack spacing={1.25} direction="row" alignItems="center">
                    <Avatar alt="User 1" src={getImageUrl(`avatar-${Math.floor(Math.random() * 9) + 1}.png`, ImagePath.USERS)} />
                    <Stack>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Typography variant="h5">{row.name.slice(0, -2)}</Typography>
                            {nameStatus}
                        </Stack>
                        <Typography variant="subtitle2">{row.company}</Typography>
                    </Stack>
                </Stack>
            </TableCell>
            <TableCell align="center">{icon}</TableCell>
            <TableCell>{chance.phone()}</TableCell>
            <TableCell>{subject}</TableCell>
            <TableCell align="center">
                <Stack direction="row" alignItems="center">
                    <Stack direction="row" justifyContent="flex-end" sx={{ width: 72 }}>
                        {date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear()}
                    </Stack>
                    <HorizontalRuleOutlinedIcon sx={{ transform: 'rotate(90deg)', color: 'divider' }} />
                    {chance.hour()}:{chance.minute()}:{chance.millisecond()}
                </Stack>
            </TableCell>
            <TableCell>
                <Chip
                    label={label}
                    size="small"
                    sx={{ bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : chipcolor, color: color, cursor: 'pointer' }}
                />
            </TableCell>
            <TableCell align="center">{rowStatus}</TableCell>
            <TableCell>
                <Link href="#">Instruction.doc</Link>
            </TableCell>
            <TableCell align="center" sx={{ pr: 3 }}>
                <IconButton color="primary" size="large" aria-label="View">
                    <VisibilityTwoToneIcon />
                </IconButton>
                <IconButton color="secondary" size="large" aria-label="View">
                    <EditTwoToneIcon />
                </IconButton>
                <IconButton color="error" size="large" aria-label="View">
                    <DeleteTwoToneIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    );
};

HistoryTableBody.propTypes = {
    labelId: PropTypes.string,
    row: PropTypes.object,
    selected: PropTypes.array,
    handleClick: PropTypes.func
};

export default HistoryTableBody;
