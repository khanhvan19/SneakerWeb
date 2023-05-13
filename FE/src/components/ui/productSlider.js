import Slider from "react-slick";
import { Box } from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";

function ProductSlider({ children, tile }) {

    const customSlickArrow = {
        top: '50%',
        px: 1, py: 2,
        width: 'unset',
        height: 'unset',
        position: 'absolute',
        transform: 'translate(0, -50%)',
        cursor: 'pointer',
        zIndex: 9,
        '&:before': { display: 'none' },
        '&.btnCtrlProductSlider:hover': { color: 'text.primary' }
    }

    const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
        <Box 
            {...props}
            color='text.primary'
            className='btnCtrlProductSlider'
            sx={{ ...customSlickArrow, left: 0 }}
        >
            <ArrowBackIosNew sx={{ fontSize: 24 }} />
        </Box>
    );

    const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
        <Box 
            {...props}
            color='text.primary'
            className='btnCtrlProductSlider' 
            sx={{ ...customSlickArrow, right: 0 }}
        >
            <ArrowForwardIos sx={{ fontSize: 24 }} />
        </Box>
    );

    const settings = {
        speed: 400,
        dots: false,
        infinite: true,
        slidesToShow: tile,
        slidesToScroll: 1,
        prevArrow: <SlickArrowLeft />,
        nextArrow: <SlickArrowRight />
    }

    return (  
        <Slider {...settings}>
            {children}
        </Slider>
    );
}

export default ProductSlider;