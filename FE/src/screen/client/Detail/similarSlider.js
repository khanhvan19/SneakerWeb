import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import ProductCard from "components/ui/Card/productCard";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import axiosPublic from "utils/axiosPublic";

const customSlickArrow = {
    top: -24,
    width: 'unset', 
    height: 'unset',
    position: 'absolute',
    transform: 'translate(0, -100%)',
    color: 'inherit',
    '&::before': { display: 'none' },
    '&:hover': { color: 'inherit' },
    '&:focus': { color: 'inherit' }
}


var settings = {
    speed: 400,
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 1200,
            settings: { slidesToShow: 3 }
        },
        {
            breakpoint: 900,
            settings: { slidesToShow: 2 }
        },
        {
            breakpoint: 600,
            settings: { slidesToShow: 1 }
        },
    ],
    prevArrow: (
        <IconButton sx={{...customSlickArrow, right: 40, left: 'unset'}}>
            <ArrowBack />
        </IconButton>
    ),
    nextArrow: (
        <IconButton sx={{...customSlickArrow, right: 0}}>
            <ArrowForward />
        </IconButton>
    )
};

function SimilarSlider({ brand, productId }) {
    const [similar, setSimilar] = useState([]);

    useEffect(() => {
        (brand && productId) && axiosPublic
            .get('/product/same-brand', {
                params: {
                    brand: brand,
                    product: productId,
                }
            })
            .then((res) => setSimilar(res))
            .catch((err) => console.log(err))
    }, [brand, productId])
    
    return (
        <>
            <Box>
                <Typography 
                    variant='h5' textTransform='uppercase' pb={0.5}
                    borderBottom='1px solid' borderColor='divider'
                >
                    Có thể bạn cũng thích
                </Typography>
                <Box mt={3}>
                    <Slider {...settings}>
                        {similar && similar.map((item, idx) => (
                            <Box key={idx} px={1}>
                                <ProductCard data={item} />
                            </Box>
                        ))}
                    </Slider>
                </Box>
            </Box>
        </>
    );
}

export default SimilarSlider;