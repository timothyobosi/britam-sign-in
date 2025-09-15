import { useEffect, useState, Fragment } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';

// third-party
import { isEmpty } from 'lodash-es';

// project imports
import UserDetails from '../UserDetails';
import UserEdit from '../UserEdit';
import ContactCard from 'ui-component/cards/ContactCard';
import MainCard from 'ui-component/cards/MainCard';
import User1 from 'assets/images/users/avatar-1.png';

import { gridSpacing } from 'store/constant';
import { dispatch, useSelector } from 'store';
import { getContacts, modifyContact } from 'store/slices/contact';

// assets
import { IconSearch } from '@tabler/icons-react';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

// ==============================|| CONTACT CARD ||============================== //

const ContactCardPage = () => {
    const [user, setUser] = useState({});
    const [data, setData] = useState({});

    // get all users details
    const { contacts } = useSelector((state) => state.contact);
    const convertData = (userData) =>
        userData.reduce((a, curr) => {
            const firstLetter = curr.name[0]?.toUpperCase();
            if (Object.prototype.hasOwnProperty.call(a, firstLetter)) {
                a[firstLetter].push(curr);
            } else {
                a[firstLetter] = [curr];
            }
            return a;
        }, {});

    useEffect(() => {
        setData(convertData(contacts));
        if (!isEmpty(user)) {
            const idx = contacts.findIndex((item) => item.id === user.id);
            if (idx > -1) setUser(contacts[idx]);
        }
    }, [contacts, user]);

    useEffect(() => {
        dispatch(getContacts());
    }, []);

    // edit selected user and modify users data
    const modifyUser = async (u) => {
        await dispatch(modifyContact(u));
    };

    // handle new user insert action
    const [userDetails, setUserDetails] = useState(false);
    const [userEdit, setUserEdit] = useState(false);
    const handleOnAdd = () => {
        setUser({
            name: '',
            company: '',
            role: '',
            work_email: '',
            personal_email: '',
            work_phone: '',
            personal_phone: '',
            location: 'USA',
            image: User1,
            status: 'I am online',
            lastMessage: '2h ago',
            birthdayText: ''
        });
        setUserDetails(false);
        setUserEdit(true);
    };

    return (
        <MainCard title="Contact Cards">
            <Grid container spacing={gridSpacing}>
                <Grid
                    className="block"
                    item
                    xs
                    zeroMinWidth
                    sx={{ display: userDetails || userEdit ? { xs: 'none', md: 'flex' } : 'flex' }}
                >
                    <Grid container alignItems="center" spacing={gridSpacing}>
                        <Grid item xs zeroMinWidth>
                            <OutlinedInput
                                id="input-search-card-style1"
                                placeholder="Search Contact"
                                fullWidth
                                startAdornment={
                                    <InputAdornment position="start">
                                        <IconSearch stroke={1.5} size="16px" />
                                    </InputAdornment>
                                }
                            />
                        </Grid>
                        <Grid item>
                            <Button variant="contained" size="large" startIcon={<AddCircleOutlineOutlinedIcon />} onClick={handleOnAdd}>
                                Add
                            </Button>
                        </Grid>

                        {Object.keys(data).map((key, index) => (
                            <Fragment key={index}>
                                <Grid item xs={12}>
                                    <Typography variant="h4" color="primary" sx={{ fontSize: '1rem' }}>
                                        {key.toUpperCase()}
                                    </Typography>
                                    <Divider sx={{ borderColor: 'divider', mt: 1.875, mb: 0.625 }} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container direction="row" spacing={gridSpacing}>
                                        {data[key].map((userRow, i) => (
                                            <Grid item xs={12} md={userEdit ? 12 : 6} lg={userEdit ? 6 : 4} xl={3} key={i}>
                                                <ContactCard
                                                    avatar={userRow.avatar}
                                                    name={userRow.name}
                                                    role={userRow.role}
                                                    email={userRow.work_email}
                                                    contact={userRow.phone}
                                                    location={userRow.location}
                                                    onActive={() => {
                                                        setUser(userRow);
                                                        setUserDetails(true);
                                                        setUserEdit(false);
                                                    }}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>
                            </Fragment>
                        ))}
                    </Grid>
                </Grid>

                {userDetails && (
                    <Grid item sx={{ width: 342, margin: { xs: '0 auto', md: 'initial' } }}>
                        <UserDetails
                            user={user}
                            onEditClick={() => {
                                setUserDetails(false);
                                setUserEdit(true);
                            }}
                            onClose={() => {
                                setUserDetails(false);
                                setUserEdit(false);
                            }}
                        />
                    </Grid>
                )}

                {userEdit && (
                    <Grid item sx={{ width: 342, margin: { xs: '0 auto', md: 'initial' } }}>
                        <UserEdit
                            user={user}
                            onSave={(u) => {
                                if (u.id) setUserDetails(true);
                                setUserEdit(false);
                                modifyUser(u);
                            }}
                            onCancel={(u) => {
                                if (u.id) setUserDetails(true);
                                setUserEdit(false);
                            }}
                        />
                    </Grid>
                )}
            </Grid>
        </MainCard>
    );
};

export default ContactCardPage;
