import { Box, Divider, Typography } from "@mui/material";
import SliderBanner from "./sliderBanner";
import { Fragment, useEffect, useState } from "react";
import { FavoriteTwoTone, LocalFireDepartmentTwoTone } from "@mui/icons-material";
import axiosPublic from "utils/axiosPublic";
import ProductSlider from "components/ui/productSlider";
import ProductSummaryCard from "components/ui/Card/productSummaryCard";
import axiosClientPrivate from "utils/axiosClientPrivate";
import { useSelector } from "react-redux";
import * as video from 'assets/video'
import BrandTile from "./brandTile";

function HomePage() {
    const isLogin = useSelector((state) => state.client?.login?.data);
    const [bestSeller, setBestSeller] = useState([])
    const [favorite, setFavorites] = useState([])
    const [productAdidas, setProductAdidas] = useState([])
    const [productNike, setProductNike] = useState([])
    const [productPuma, setProductPuma] = useState([])
    const [productReebok, setProductReebok] = useState([])
    const [productConverse, setProductConverse] = useState([])
    
    useEffect(() => {
        axiosPublic
            .post('/dashboard/bestseller',{ limit: 12 })
            .then((res) => setBestSeller(res))
            .catch((err) => console.log(err))

        axiosPublic
            .get('/product/distribute-brand')
            .then((res) => {
                console.log(res);
                setProductAdidas(res.find(e => e.brandName === 'Adidas').products)
                setProductNike(res.find(e => e.brandName === 'Nike').products)
                setProductPuma(res.find(e => e.brandName === 'Puma').products)
                setProductConverse(res.find(e => e.brandName === 'Converse').products)
                setProductReebok(res.find(e => e.brandName === 'Reebok').products)
            })
            .catch((err) => console.log(err))
    }, [])

    useEffect(() => {
        isLogin && axiosClientPrivate
            .get('/favorite/', {
                params: { customer: isLogin?._id }, 
                headers: { token: isLogin?.accessToken }
            })

            .then((res) => setFavorites(res))
            .catch((err) => console.log(err))
    }, [isLogin])

    return ( 
        <Fragment>
            <Box 
                mt={-2} mx={-3}
                sx={{ 
                    '& #btnCtrlSlider': { opacity: 0, color: 'text.secondary' },
                    '&:hover': { '& #btnCtrlSlider': { opacity: 1 } },
                }}
            >
                <SliderBanner />
            </Box>

            <Box mt={6}>
                <Box className='content-center'>
                    <LocalFireDepartmentTwoTone sx={{ mr: 1.5, fontSize: 32 }} /> 
                    <Typography variant="h4" textTransform='uppercase' fontWeight={700} >
                        Sản phẩm nổi bật
                    </Typography>
                    <LocalFireDepartmentTwoTone sx={{ ml: 1.5, fontSize: 32 }} /> 
                </Box>
                <Divider sx={{ width: '33%', mx: 'auto', mt: 0.5 }} />
                <Box 
                    mt={3} mx={-1}
                    sx={{ 
                        '& .btnCtrlProductSlider': {
                            opacity: 0, color: 'text.secondary', bgcolor: '#00ab5532', 
                        },
                        '&:hover': { '& .btnCtrlProductSlider': { opacity: 1 } },
                    }}
                >
                    <ProductSlider tile={4}>
                        {bestSeller.length !== 0 && bestSeller.map((product, idx) => (
                            <Box key={idx} px={1}>
                                <ProductSummaryCard data={product} />
                            </Box>
                        ))}
                    </ProductSlider>
                </Box>
            </Box>
            
            {(productAdidas.length >= 2) && (
                <Box mt={8}>
                    <BrandTile 
                        video={video.adidasVideo} 
                        products={productAdidas}
                        title="Adidas's Sneaker bestseller"
                    />
                </Box>
            )}

            {(productNike.length >= 2) && (
                <Box mt={8}>
                    <BrandTile 
                        video={video.nikeVideo} 
                        products={productNike}
                        title="Nike's Sneaker bestseller"
                        reverse={true}
                    />
                </Box>
            )}

            {(productReebok.length >= 2) && (
                <Box mt={8}>
                    <BrandTile 
                        video={video.reebokVideo} 
                        products={productReebok}
                        title="Reebok's Sneaker bestseller"
                    />
                </Box>
            )}

            {(productPuma.length >= 2) && (
                <Box mt={8}>
                    <BrandTile 
                        video={video.pumaVideo} 
                        products={productPuma}
                        title="Puma's Sneaker bestseller"
                        reverse={true}
                    />
                </Box>
            )}

            {(productConverse.length >= 2) && (
                <Box mt={8}>
                    <BrandTile 
                        video={video.converseVideo} 
                        products={productConverse}
                        title="Converse's Sneaker bestseller"
                    />
                </Box>
            )}

            {(favorite.length >= 4 && (
                <Box mt={8}>
                    <Box className='content-center'>
                        <FavoriteTwoTone sx={{ mr: 1.5, fontSize: 32 }} /> 
                        <Typography variant="h4" textTransform='uppercase' fontWeight={700} >
                            Bạn đã yêu thích
                        </Typography>
                        <FavoriteTwoTone sx={{ ml: 1.5, fontSize: 32 }} /> 
                    </Box>
                    <Divider sx={{ width: '33%', mx: 'auto', mt: 0.5 }} />
                    <Box 
                        mt={3} mx={-1}
                        sx={{ 
                            '& .btnCtrlProductSlider': {
                                opacity: 0, color: 'text.secondary', bgcolor: '#00ab5532', 
                            },
                            '&:hover': { '& .btnCtrlProductSlider': { opacity: 1 } },
                        }}
                    >
                        <ProductSlider tile={4}>
                            {favorite.map((product, idx) => (
                                <Box key={idx} px={1}>
                                    <ProductSummaryCard data={product} />
                                </Box>
                            ))}
                        </ProductSlider>
                    </Box>
                </Box>
            ))} 
        </Fragment>
    );
}

export default HomePage;