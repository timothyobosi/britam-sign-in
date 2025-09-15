// material-ui
import Box from '@mui/material/Box';

// project imports
import ContactCard from './ContactCard';
import AppBar from 'ui-component/extended/AppBar';

// assets
import headerBackground from 'assets/images/landing/bg-header.jpg';

// ============================|| CONTACT US MAIN ||============================ //

const ContactUsPage = () => (
    <Box
        sx={{
            backgroundImage: `url(${headerBackground})`,
            backgroundSize: '100% 600px',
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat',
            textAlign: 'center',
            pt: { xs: 2, md: 3.75 }
        }}
    >
        <AppBar />
        <ContactCard />
    </Box>
);

export default ContactUsPage;
