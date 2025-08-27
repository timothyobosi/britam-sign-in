import {createTheme} from '@mui/material/styles'

export const theme = createTheme({
    palette:{
        primary:{main:'#0865ce'},
        secondary:{main:'#4CAF50'},
        error:{main:'#d32f2f'},
        background:{default:'#1a1a1a'}
    },
    components:{
        MuiButton:{
            styleOverrides:{
                root:{
                    borderRadius: '8px',
                    textTransform:'none',
                    fontSize:'1rem',
                    padding:'0.5rem 1rem'
                },
            },
        },

    },
    MuiTextField:{
        styleOverrides:{
            root:{
                '& .MuiOutlinedInput-root':{
                    borderRadius:'4px'
                },
            },
        },
    }
});