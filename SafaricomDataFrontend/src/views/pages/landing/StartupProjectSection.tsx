// material-ui
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import Slider from 'react-slick';

// assets
import BackgroundImag from 'assets/images/landing/bg-heand.png';

// =============================|| LANDING - STARTUP PROJECT ||============================= //

const RtlInfoSection = () => {
    const settings = {
        className: 'center',
        dots: false,
        arrows: false,
        centerPadding: '0',
        centerMode: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        vertical: true,
        verticalSwiping: true,
        focusOnSelect: true,
        autoplay: true,
        autoplaySpeed: 2000
    };

    return (
        <Box
            className="project-info"
            sx={{
                bgcolor: 'dark.900',
                height: { xs: 150, sm: 200, md: 340, lg: 450, xl: 520 },
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            <Container sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ mt: { xs: 4, md: 6, lg: 12, xl: 15 }, zIndex: 2 }}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-start"
                        spacing={2}
                        sx={{
                            '& .slick-slide.slick-current': {
                                opacity: 1,
                                '.MuiTypography-root': { color: 'primary.main' }
                            },
                            '& .slick-slider': {
                                textAlign: 'left',
                                '.MuiTypography-root': {
                                    fontSize: { xs: '1rem', sm: '1.563rem', md: '2.5rem', xl: '3.125rem' },
                                    cursor: 'pointer'
                                }
                            }
                        }}
                    >
                        <Box
                            sx={{
                                marginTop: { sm: '5%', lg: '4%' },
                                width: { xs: '38%', md: '100%' },
                                paddingLeft: { xs: 2, md: 0, xl: 0 }
                            }}
                        >
                            <Typography
                                variant="h2"
                                sx={{
                                    color: '#fff',
                                    width: { xs: '150px', sm: 'max-content', xl: 'max-content' },
                                    fontSize: { xs: '1rem', sm: '1.563rem', md: '2.5rem', xl: '3.125rem' },
                                    mt: { xs: 2, sm: 3.75, md: 5.5, xl: 7 }
                                }}
                            >
                                Choose Berry for
                            </Typography>
                        </Box>
                        <Slider {...settings}>
                            <Typography color="text.hint" variant="h2">
                                Easy Customizability
                            </Typography>
                            <Typography color="text.hint" variant="h2">
                                Highly Responsive
                            </Typography>
                            <Typography color="text.hint" variant="h2">
                                Design Consistency
                            </Typography>
                            <Typography color="text.hint" variant="h2">
                                Effective Support
                            </Typography>
                            <Typography color="text.hint" variant="h2">
                                Standardization
                            </Typography>
                            <Typography color="text.hint" variant="h2">
                                Compatibility
                            </Typography>
                        </Slider>
                    </Stack>
                </Box>
            </Container>
            <CardMedia
                component="img"
                image={BackgroundImag}
                alt="Berry"
                sx={{
                    position: 'absolute',
                    bottom: { sm: -40, md: -80 },
                    right: { sm: 30, md: 50, lg: 80 },
                    width: { xl: 240, lg: 220, md: 150, sm: 100, xs: 0 },
                    maxWidth: '100%',
                    filter: 'drop-shadow(0px 0px 50px rgb(33 150 243 / 30%))'
                }}
            />
        </Box>
    );
};

export default RtlInfoSection;
