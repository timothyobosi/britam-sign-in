import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { ThemeMode } from 'config';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import ReceiptTwoTone from '@mui/icons-material/ReceiptTwoTone';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PersonAddTwoTone from '@mui/icons-material/PersonAddTwoTone';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import BugReportIcon from '@mui/icons-material/BugReport';

// tab content customize
function TabPanel({ children, value, index, ...other }) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && <Box>{children}</Box>}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number,
    value: PropTypes.number
};

// ================================|| SUPPORT & HELP TABS ||================================ //

function SupportTabs() {
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const tipsData = [
        { name: 'Invoice detail', icon: <ReceiptTwoTone color="success" />, background: alpha(theme.palette.success.dark, 0.1) },
        { name: 'How to add client', icon: <PersonAddTwoTone color="primary" />, background: alpha(theme.palette.primary.dark, 0.1) },
        { name: 'How to add bill', icon: <ReceiptLongIcon color="secondary" />, background: alpha(theme.palette.secondary.dark, 0.1) },
        { name: 'Create invoice', icon: <InsertChartIcon color="warning" />, background: alpha(theme.palette.warning.dark, 0.1) },
        { name: 'Generate Error', icon: <BugReportIcon color="error" />, background: alpha(theme.palette.orange.dark, 0.1) }
    ];

    return (
        <>
            <Tabs
                value={value}
                variant="scrollable"
                onChange={handleChange}
                sx={{
                    mb: 3,
                    '& a': {
                        minHeight: 'auto',
                        minWidth: 10,
                        py: 1.5,
                        px: 1,
                        mr: 2.2,
                        color: theme.palette.mode === ThemeMode.DARK ? 'grey.600' : 'grey.500',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    },
                    '& .MuiTabs-indicator': {
                        bottom: 'inherit'
                    },
                    '& a.Mui-selected': {
                        color: 'primary.main'
                    },
                    '& a > svg': {
                        mb: '0px !important',
                        mr: 1.1
                    }
                }}
            >
                <Tab component={Link} to="#" label="Quick Tips" {...a11yProps(0)} />
                <Tab component={Link} to="#" label="Request for demo" {...a11yProps(1)} />
                <Tab component={Link} to="#" label="How to make invoice?" {...a11yProps(2)} />
            </Tabs>
            <TabPanel value={value} index={0}>
                <Grid container spacing={2}>
                    {tipsData.map((data, index) => (
                        <Grid item xs={12} key={index}>
                            <Grid container item direction="row" justifyContent="space-between" alignItems="center">
                                <Grid item>
                                    <Grid container spacing={1.5} direction="row" alignItems="center" justifyContent="space-between">
                                        <Grid item>
                                            <Avatar
                                                variant="rounded"
                                                sx={{
                                                    ...theme.typography.commonAvatar,
                                                    ...theme.typography.largeAvatar,
                                                    bgcolor: data.background
                                                }}
                                            >
                                                {data.icon}
                                            </Avatar>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="h5" color="inherit">
                                                {data.name}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Button variant="text">View</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
                <CardActions sx={{ p: 1.5, pb: 0, justifyContent: 'center' }}>
                    <Button size="small" disableElevation endIcon={<ChevronRightOutlinedIcon />}>
                        View All
                    </Button>
                </CardActions>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField fullWidth maxRows={4} id="outlined-textarea" label="Name" placeholder="Name" defaultValue="Robin" />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            maxRows={4}
                            id="outlined-textarea"
                            label="Phone number"
                            placeholder="Phone number"
                            defaultValue="000 000 0000"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth id="outlined-multiline-static" label="Email ID" defaultValue="codedthemes@gmail.com" />
                    </Grid>
                    <Grid item xs={12}>
                        <Stack spacing={2} alignItems="flex-end">
                            <TextField
                                fullWidth
                                id="outlined-multiline-flexible"
                                label="Description"
                                multiline
                                rows={2}
                                defaultValue="Silver Business Point, nr. VIP Circle, Uttran, Surat, Gujarat 394105"
                            />
                            <Button variant="contained" size="small">
                                Request a demo
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <CardMedia
                    sx={{ width: '100%', height: 320, borderRadius: 2 }}
                    component="iframe"
                    src="https://www.youtube.com/embed/IXdBDo3URuw?si=js-VZNTkVBS_h6N0"
                    title="image"
                />
            </TabPanel>
        </>
    );
}

// ==============================|| SUPPORT HELP ||============================== //

const SupportHelp = ({ isLoading }) => {
    return (
        <>
            {isLoading ? (
                <SkeletonPopularCard />
            ) : (
                <MainCard content={false}>
                    <CardContent sx={{ p: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Grid container>
                                    <Typography variant="h4">Support & Help</Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <SupportTabs />
                            </Grid>
                        </Grid>
                    </CardContent>
                </MainCard>
            )}
        </>
    );
};

SupportHelp.propTypes = {
    isLoading: PropTypes.bool
};

export default SupportHelp;
