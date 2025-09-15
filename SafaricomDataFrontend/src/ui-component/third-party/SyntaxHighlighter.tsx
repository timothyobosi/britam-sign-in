import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';

// third-party
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark, a11yLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// project import
import { ThemeMode } from 'config';

// ==============================|| SYNTAX HIGHLIGHTER ||============================== //

const ReactSyntaxHighlighter = ({ codeString, showLineNumbers = true }) => {
    const theme = useTheme();

    return (
        <Card
            sx={{
                fontSize: '1rem !important',
                overflow: 'hidden',
                '& pre': {
                    margin: 0,
                    padding: '16px !important',
                    fontFamily: theme.typography.fontFamily,
                    bgcolor: theme.palette.mode === ThemeMode.DARK ? 'grey.50 !important' : 'grey.900 !important'
                }
            }}
        >
            <SyntaxHighlighter
                language="javacript"
                showLineNumbers={showLineNumbers}
                style={theme.palette.mode === ThemeMode.DARK ? a11yLight : a11yDark}
            >
                {codeString}
            </SyntaxHighlighter>
        </Card>
    );
};

ReactSyntaxHighlighter.propTypes = {
    codeString: PropTypes.string,
    showLineNumbers: PropTypes.bool
};

export default ReactSyntaxHighlighter;
