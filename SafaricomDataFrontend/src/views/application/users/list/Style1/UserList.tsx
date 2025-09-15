import React from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// project imports
import Avatar from 'ui-component/extended/Avatar';
import { ThemeMode } from 'config';

import { dispatch, useSelector } from 'store';
import { getUsersListStyle1 } from 'store/slices/user';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';

// assets
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';
import BlockTwoToneIcon from '@mui/icons-material/BlockTwoTone';

// ==============================|| USER LIST 1 ||============================== //

const UserList = () => {
    const theme = useTheme();

    const [data, setData] = React.useState([]);
    const { usersS1 } = useSelector((state) => state.user);

    React.useEffect(() => {
        setData(usersS1);
    }, [usersS1]);

    React.useEffect(() => {
        dispatch(getUsersListStyle1());
    }, []);

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ pl: 3 }}>#</TableCell>
                        <TableCell>User Profile</TableCell>
                        <TableCell>Country</TableCell>
                        <TableCell>Friends</TableCell>
                        <TableCell>Followers</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="center" sx={{ pr: 3 }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data &&
                        data.map((row, index) => (
                            <TableRow hover key={index}>
                                <TableCell sx={{ pl: 3 }}>{row.id}</TableCell>
                                <TableCell>
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        <Avatar alt="User 1" src={getImageUrl(`${row.avatar}`, ImagePath.USERS)} />
                                        <Stack>
                                            <Stack direction="row" alignItems="center" spacing={0.25}>
                                                <Typography variant="subtitle1">{row.name}</Typography>
                                                {row.status === 'Active' && (
                                                    <CheckCircleIcon sx={{ color: 'success.dark', width: 14, height: 14 }} />
                                                )}
                                            </Stack>
                                            <Typography variant="subtitle2" noWrap>
                                                {row.email}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </TableCell>
                                <TableCell>{row.location}</TableCell>
                                <TableCell>{row.friends}</TableCell>
                                <TableCell>{row.followers}</TableCell>
                                <TableCell>
                                    {row.status === 'Active' && (
                                        <Chip
                                            label="Active"
                                            size="small"
                                            sx={{
                                                bgcolor:
                                                    theme.palette.mode === ThemeMode.DARK
                                                        ? 'dark.main'
                                                        : alpha(theme.palette.success.light, 0.6),
                                                color: 'success.dark'
                                            }}
                                        />
                                    )}
                                    {row.status === 'Rejected' && (
                                        <Chip
                                            label="Rejected"
                                            size="small"
                                            sx={{
                                                bgcolor:
                                                    theme.palette.mode === ThemeMode.DARK
                                                        ? 'dark.main'
                                                        : alpha(theme.palette.orange.light, 0.8),
                                                color: 'orange.dark'
                                            }}
                                        />
                                    )}
                                    {row.status === 'Pending' && (
                                        <Chip
                                            label="Pending"
                                            size="small"
                                            sx={{
                                                bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'warning.light',
                                                color: 'warning.dark'
                                            }}
                                        />
                                    )}
                                </TableCell>
                                <TableCell align="center" sx={{ pr: 3 }}>
                                    <Stack direction="row" justifyContent="center" alignItems="center">
                                        <Tooltip placement="top" title="Message">
                                            <IconButton color="primary" aria-label="delete" size="large">
                                                <ChatBubbleTwoToneIcon sx={{ fontSize: '1.1rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip placement="top" title="Block">
                                            <IconButton
                                                color="primary"
                                                sx={{
                                                    color: 'orange.dark',
                                                    borderColor: 'orange.main',
                                                    '&:hover ': { bgcolor: 'orange.light' }
                                                }}
                                                size="large"
                                            >
                                                <BlockTwoToneIcon sx={{ fontSize: '1.1rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UserList;
