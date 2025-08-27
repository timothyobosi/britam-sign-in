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
                    borderRadius: '',
                    textTransform:'',
                    fontSize:'',
                    padding:''
                },
            },
        },

    },
    MuiTextField:{
        styleOverrides:{
            root:{

            }
        }

    }
})