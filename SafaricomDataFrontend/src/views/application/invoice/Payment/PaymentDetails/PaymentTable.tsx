import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

// project imports
import { gridSpacing } from 'store/constant';
import { ThemeMode } from 'config';

// ==============================|| PAYMENT DETAILS - TABLE ||============================== //

const PaymentTable = ({ rows, randomAmount }) => {
    const theme = useTheme();

    const initialValue = 0;
    const totalPayAmount = rows.reduce((accumulator, currentValue) => accumulator + currentValue?.quantity, initialValue) - randomAmount;
    const totalDueAmount = rows.reduce((accumulator, currentValue) => accumulator + currentValue?.quantity, initialValue) - totalPayAmount;

    return (
        <>
            <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead sx={{ bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'grey.200' }}>
                        <TableRow>
                            <TableCell align="center">Issue Date</TableCell>
                            <TableCell>Invoice No.</TableCell>
                            <TableCell align="center">Due Date</TableCell>
                            <TableCell align="right">Due Amount</TableCell>
                            <TableCell align="right">Payment Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell align="center">{row.date}</TableCell>
                                    <TableCell>#{row.invoice_id}</TableCell>
                                    <TableCell align="center">{row.due_date}</TableCell>
                                    <TableCell align="right">${row.quantity}</TableCell>
                                    <TableCell align="right">
                                        ${rows.length === index + 1 ? row.quantity - randomAmount : row.quantity}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ px: 2.5, py: 2, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'primary.light' }}>
                <Grid container spacing={1}>
                    <Grid item xs={10}>
                        <Typography align="right" variant="subtitle1">
                            Total Payment Amount :
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography align="right" variant="body2">
                            ${totalPayAmount}
                        </Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <Typography align="right" variant="subtitle1">
                            Total Due Amount :
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography align="right" variant="body2">
                            ${totalDueAmount}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
            <Divider />
            <Box sx={{ p: 2.5 }}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                            <Typography variant="h5">Notes</Typography>
                            <Typography variant="subtitle2">
                                We appreciate your business. Should you need us to add VAT or extra notes let us know!
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Stack spacing={1} alignItems="flex-end">
                            <Typography variant="h5">Have Question?</Typography>
                            <Typography variant="subtitle2">Support@Berrytheme.com</Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

PaymentTable.propTypes = {
    rows: PropTypes.array,
    randomAmount: PropTypes.number
};

export default PaymentTable;
