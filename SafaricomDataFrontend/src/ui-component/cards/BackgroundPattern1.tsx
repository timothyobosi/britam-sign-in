import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';

// project imports
import { ThemeMode } from 'config';

// assets
import AuthPattern from 'assets/images/auth/auth-pattern.svg';
import AuthPatternDark from 'assets/images/auth/auth-pattern-dark.svg';

// ===========================|| BACKGROUND GRID PATTERN 1 ||=========================== //

const BackgroundPattern1 = ({ children }) => {
    const theme = useTheme();

    return (
        <Box
            component="span"
            sx={{
                display: 'flex',
                minHeight: '100vh',
                bgcolor: 'background.paper',
                position: 'absolute',
                overflow: 'hidden',
                m: '0 0 0 auto',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: theme.palette.mode === ThemeMode.DARK ? 0.85 : 0.9
            }}
        >
            {children}
            <CardMedia
                component="img"
                sx={{ zIndex: -1, position: 'absolute', bottom: 0, right: 0, width: 1 }}
                src={theme.palette.mode === ThemeMode.DARK ? AuthPatternDark : AuthPattern}
                alt="pattern1"
            />
        </Box>
    );
};

BackgroundPattern1.propTypes = {
    children: PropTypes.node
};

export default BackgroundPattern1;
