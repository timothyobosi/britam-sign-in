// material-ui
import { useTheme } from '@mui/material/styles';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import { gridSpacing } from 'store/constant';
import { ThemeMode } from 'config';

// assets
import imageEmpty from 'assets/images/e-commerce/empty.svg';
import imageDarkEmpty from 'assets/images/e-commerce/empty-dark.svg';

// ==============================|| CHECKOUT CART - NO/EMPTY CART ITEMS ||============================== //

const CartEmpty = () => {
    const theme = useTheme();
    const downLG = useMediaQuery(theme.breakpoints.down('lg'));

    return (
        <Grid container justifyContent="center" spacing={gridSpacing} sx={{ my: 3 }}>
            <Grid item xs={12} sm={8} md={6}>
                <CardMedia
                    component="img"
                    image={theme.palette.mode === ThemeMode.DARK ? imageDarkEmpty : imageEmpty}
                    title="Slider5 image"
                />
            </Grid>
            <Grid item xs={12} sm={8}>
                <Grid container direction="column" alignItems="center" spacing={1}>
                    <Grid item>
                        <Typography variant={downLG ? 'h3' : 'h1'} color="inherit">
                            Cart is Empty
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2" align="center">
                            Look like you have no items in your shopping cart.
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default CartEmpty;
