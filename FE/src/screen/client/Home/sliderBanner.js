import { Box, Button, Typography } from "@mui/material";
import Slider from "react-slick";
import * as image from "assets/images";
import { ArrowBackIosNew, ArrowForwardIos, DoubleArrowOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import queryString from 'query-string';
import { useEffect, useState } from "react";
import axiosPublic from "utils/axiosPublic";

function SliderBanner() {
    const navigate= useNavigate();
    const [brands, setBrands] = useState([])

    useEffect(() => {
        axiosPublic
            .get("brand/public")
            .then((res) => { setBrands(res) })
            .catch((err) => { console.log(err) });
    }, [])

    const findIdByName = (name) => {
        return brands?.find(item => item.name === name)?._id
    }

    const customSlickArrow = {
        top: '50%',
        width: 'unset',
        height: 'unset',
        position: 'absolute',
        transform: 'translate(0, -50%)',
        cursor: 'pointer',
        zIndex: 9,
        '&:before': { display: 'none'},
        '&#btnCtrlSlider:hover': { color: 'text.primary' }
    }

    const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
        <Box 
            {...props}
            id='btnCtrlSlider'
            color='text.primary'
            sx={{ ...customSlickArrow, left: 0 }}
        >
            <ArrowBackIosNew sx={{ fontSize: 64 }} />
        </Box>
    );

    const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
        <Box 
            {...props}
            id='btnCtrlSlider' 
            color='text.primary'
            sx={{ ...customSlickArrow, right: 0 }}
        >
            <ArrowForwardIos sx={{ fontSize: 64 }} />
        </Box>
    );

    var settings = {
        speed: 400,
        dots: false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 4000,
        slidesToShow: 1,
        slidesToScroll: 1,
        pauseOnFocus: false,
        pauseOnHover: false,
        prevArrow: <SlickArrowLeft />,
        nextArrow: <SlickArrowRight />
    };

    return (
        <Slider {...settings}>
            <Box position='relative'>
                <img src={image.adidasBanner} width='100%' alt="" />
                <Box  
                    top={0} right={0}
                    position='absolute' 
                    height='100%' width='44%' 
                    bgcolor='#FFFFFF80' 
                    pl={6} pr={8} pt={12} zIndex={8} 
                >
                    <img src={image.adidasLogo} alt="" height={120}/>
                    <Box 
                        mt={4} pl={2}
                        sx={{ borderLeft: '8px solid', borderColor: 'text.primary' }}
                    > 
                        <Typography fontSize={18}>
                            <b>Adidas</b> - Thương hiệu giày thể thao nổi tiếng thế giới của Đức từ năm 1949.
                        </Typography>
                        <Typography fontSize={18}>
                            Với các công nghệ hàng đầu trong sản xuất giày như BOOST, Springblade, Primeknit,... 
                            Giày Adidas mang đến thiết kế tinh xảo, nhẹ, bền giúp người mang đến cho người dùng 
                            sự thoải mái vận động và phù hợp với mọi đối tượng khách hàng.
                        </Typography>
                        <Typography fontStyle='italic' fontWeight={600} textAlign='end' mt={0.5}>
                            "Impossible Is Nothing"
                        </Typography>
                    </Box>
                    <Box textAlign='end'>
                        <Button
                            variant="contained" color="btnDark"
                            endIcon={<DoubleArrowOutlined />} 
                            sx={{ mt: 2, borderRadius: 0 }}
                            onClick={() => navigate({
                                    pathname: '/product/',
                                    search: queryString.stringify({ brand: findIdByName('Adidas') })
                            })}

                        >
                            Xem sản phẩm
                        </Button>
                    </Box>
                </Box>
            </Box>
            <Box position='relative'>
                <img src={image.nikeBanner} width='100%' alt="" />
                <Box 
                    top={0} left={0}
                    position='absolute' 
                    height='100%' width='44%' 
                    bgcolor='#FFFFFF80' 
                    pl={8} pr={6} pt={12} zIndex={8} 
                >
                    <img src={image.nikeLogo} alt="" height={120}/>
                    {/* <Box 
                        mt={4} pl={2}
                        sx={{ borderLeft: '8px solid', borderColor: 'text.primary' }}
                    > 
                        <Typography fontSize={18}>
                            <b>Adidas</b> Thương hiệu giày thể thao nổi tiếng thế giới của Đức từ năm 1949.
                        </Typography>
                        <Typography fontSize={18}>
                            Với các công nghệ hàng đầu trong sản xuất giày như BOOST, Springblade, Primeknit,... 
                            Giày Adidas mang đến thiết kế tinh xảo, nhẹ, bền giúp người mang đến cho người dùng 
                            sự thoải mái vận động và phù hợp với mọi đối tượng khách hàng.
                        </Typography>
                        <Typography fontStyle='italic' fontWeight={600} textAlign='end' mt={0.5}>
                            "Impossible Is Nothing"
                        </Typography>
                    </Box> */}
                </Box>
            </Box>
            <Box position='relative'>
                <img src={image.pumaBanner} width='100%' alt="" />
                <Box 
                    top={0} right={0}
                    position='absolute' 
                    height='100%' width='44%' 
                    bgcolor='#FFFFFF80' 
                    pl={6} pr={8} pt={12} zIndex={8} 
                >
                    <img src={image.pumaLogo} alt="" height={120}/>
                    <Box 
                        mt={4} pl={2}
                        sx={{ borderLeft: '8px solid', borderColor: 'text.primary' }}
                    > 
                        <Typography fontSize={18}>
                            <b>Adidas</b> Thương hiệu giày thể thao nổi tiếng thế giới của Đức từ năm 1949.
                        </Typography>
                        <Typography fontSize={18}>
                            Với các công nghệ hàng đầu trong sản xuất giày như BOOST, Springblade, Primeknit,... 
                            Giày Adidas mang đến thiết kế tinh xảo, nhẹ, bền giúp người mang đến cho người dùng 
                            sự thoải mái vận động và phù hợp với mọi đối tượng khách hàng.
                        </Typography>
                        <Typography fontStyle='italic' fontWeight={600} textAlign='end' mt={0.5}>
                            "Impossible Is Nothing"
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box position='relative'>
                <img src={image.reebokBanner} width='100%' alt="" />
                <Box 
                    top={0} left={0}
                    position='absolute' 
                    height='100%' width='44%' 
                    bgcolor='#FFFFFF80' 
                    pl={8} pr={6} pt={12} zIndex={8} 
                >
                    <img src={image.reebokLogo} alt="" height={120}/>
                    <Box 
                        mt={4} pl={2}
                        sx={{ borderLeft: '8px solid', borderColor: 'text.primary' }}
                    > 
                        <Typography fontSize={18}>
                            <b>Adidas</b> Thương hiệu giày thể thao nổi tiếng thế giới của Đức từ năm 1949.
                        </Typography>
                        <Typography fontSize={18}>
                            Với các công nghệ hàng đầu trong sản xuất giày như BOOST, Springblade, Primeknit,... 
                            Giày Adidas mang đến thiết kế tinh xảo, nhẹ, bền giúp người mang đến cho người dùng 
                            sự thoải mái vận động và phù hợp với mọi đối tượng khách hàng.
                        </Typography>
                        <Typography fontStyle='italic' fontWeight={600} textAlign='end' mt={0.5}>
                            "Impossible Is Nothing"
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box position='relative'>
                <img src={image.vansBanner} width='100%' alt="" />
                <Box  
                    top={0} right={0}
                    position='absolute' 
                    height='100%' width='44%' 
                    bgcolor='#FFFFFF80' 
                    pl={6} pr={8} pt={12} zIndex={8} 
                >
                    <img src={image.vansLogo} alt="" height={120}/>
                    <Box 
                        mt={4} pl={2}
                        sx={{ borderLeft: '8px solid', borderColor: 'text.primary' }}
                    > 
                        <Typography fontSize={18}>
                            <b>Adidas</b> Thương hiệu giày thể thao nổi tiếng thế giới của Đức từ năm 1949.
                        </Typography>
                        <Typography fontSize={18}>
                            Với các công nghệ hàng đầu trong sản xuất giày như BOOST, Springblade, Primeknit,... 
                            Giày Adidas mang đến thiết kế tinh xảo, nhẹ, bền giúp người mang đến cho người dùng 
                            sự thoải mái vận động và phù hợp với mọi đối tượng khách hàng.
                        </Typography>
                        <Typography fontStyle='italic' fontWeight={600} textAlign='end' mt={0.5}>
                            "Impossible Is Nothing"
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box position='relative'>
                <img src={image.converseBanner} width='100%' alt="" />
                <Box  
                    top={0} left={0}
                    position='absolute' 
                    height='100%' width='44%' 
                    bgcolor='#FFFFFF80' 
                    pl={8} pr={6} pt={12} zIndex={8} 
                >
                    <img src={image.converseLogo} alt="" height={120}/>
                    <Box 
                        mt={4} pl={2}
                        sx={{ borderLeft: '8px solid', borderColor: 'text.primary' }}
                    > 
                        <Typography fontSize={18}>
                            <b>Adidas</b> Thương hiệu giày thể thao nổi tiếng thế giới của Đức từ năm 1949.
                        </Typography>
                        <Typography fontSize={18}>
                            Với các công nghệ hàng đầu trong sản xuất giày như BOOST, Springblade, Primeknit,... 
                            Giày Adidas mang đến thiết kế tinh xảo, nhẹ, bền giúp người mang đến cho người dùng 
                            sự thoải mái vận động và phù hợp với mọi đối tượng khách hàng.
                        </Typography>
                        <Typography fontStyle='italic' fontWeight={600} textAlign='end' mt={0.5}>
                            "Impossible Is Nothing"
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box position='relative'>
                <img src={image.filaBanner} width='100%' alt="" />
                <Box 
                    top={0} right={0}
                    position='absolute' 
                    height='100%' width='44%' 
                    bgcolor='#FFFFFF80' 
                    pl={6} pr={8} pt={12} zIndex={8} 
                >
                    <img src={image.filaLogo} alt="" height={120}/>
                    <Box 
                        mt={4} pl={2}
                        sx={{ borderLeft: '8px solid', borderColor: 'text.primary' }}
                    > 
                        <Typography fontSize={18}>
                            <b>Adidas</b> Thương hiệu giày thể thao nổi tiếng thế giới của Đức từ năm 1949.
                        </Typography>
                        <Typography fontSize={18}>
                            Với các công nghệ hàng đầu trong sản xuất giày như BOOST, Springblade, Primeknit,... 
                            Giày Adidas mang đến thiết kế tinh xảo, nhẹ, bền giúp người mang đến cho người dùng 
                            sự thoải mái vận động và phù hợp với mọi đối tượng khách hàng.
                        </Typography>
                        <Typography fontStyle='italic' fontWeight={600} textAlign='end' mt={0.5}>
                            "Impossible Is Nothing"
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Slider>
    );
}

export default SliderBanner;