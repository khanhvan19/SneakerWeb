import { Box, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import { formatMoney } from "utils/formatters";
import { Link, useNavigate } from "react-router-dom";
import { SquareBlock, TOAST_CENTER_STYLE } from "assets/styles/constantsStyle";
import { discountPrice } from "utils";
import { ColorLensOutlined, DesignServicesOutlined, Favorite, FavoriteBorder, FavoriteTwoTone} from "@mui/icons-material";
import axiosClientPrivate from "utils/axiosClientPrivate";
import { useDispatch, useSelector } from "react-redux";
import { updateFavorite } from "redux/slices/favorite.slice";
import { toast } from "react-toastify";

function ProductCard({data}) {
    const isLogin = useSelector((state) => state.client?.login?.data);
    var favorites = useSelector((state) => state.favorite?.favorites);
    const [hover, setHover] = useState(0);
    const [isHover, setIsHover] = useState(false);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const numHoverList = 4;
    var isFavorite = favorites?.includes(data._id);

    const handleToggleFavorite = () => {
        if(!isLogin) {
            navigate("/login");
        } else {
            axiosClientPrivate
                .post('/favorite/', { 
                    product: data._id, 
                    customer: isLogin?._id 
                }, {
                    headers: { token: isLogin?.accessToken } 
                })
                .then((res) => {
                    dispatch(updateFavorite(res.favorites)) 
                    toast.success(res.message, TOAST_CENTER_STYLE);
                })
                .catch((err) => {
                    toast.error(err.message, TOAST_CENTER_STYLE);
                })
        }
    }

    return ( 
        <Box height='100%' position='relative'>
            <Box 
                component={Link}
                to={`/product/detail/${data?._id}/${data.versions[hover]?._id}`}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                display='flex' flexDirection='column' height='100%'
            >   
                <SquareBlock w='100%'>
                    <img src={data?.versions[hover]?.images[0]?.link} alt='' />
                </SquareBlock>
                <Typography 
                    className="content-left-center"
                    fontSize={14} component='i' marginTop={1.5} 
                >
                    <Box className='content-left-center' mr={2}>
                        <ColorLensOutlined sx={{ fontSize: '1.25em', mr: 0.25 }} />
                        {data?.versions?.length} màu sắc
                    </Box>
                    <Box className='content-left-center'>
                        <DesignServicesOutlined sx={{ fontSize: '1.25em', mr: 0.25 }} />
                        {data.sizeMax - data.sizeMin} size
                    </Box>
                </Typography>
                {(isHover === false || data?.versions?.length <= 1) && ( 
                    <>  
                        <Typography 
                            fontWeight={500}
                            color='text.primary' 
                            textTransform='uppercase' 
                            className="text-eclipse one-line"
                        >
                            {data.name}
                        </Typography>
                        <Typography color='text.secondary'>
                            {data?.brand?.name}
                        </Typography>
                        <Box mt={0.25}>
                            {data?.gender?.map((item, idx) => (
                                <Typography 
                                    key={idx} 
                                    variant='body2' component='i' 
                                    color='text.secondary'
                                >
                                    {item}
                                    {(idx !== data?.gender?.length - 1) && (
                                        <Box component='span' px={0.5}>•</Box>
                                    )} 
                                </Typography>
                            ))}
                        </Box>
                    </>
                )}

                {(isHover === true && data?.versions?.length > 1) && (
                    <>
                        <Box display="flex" py={0.5}>
                            {data?.versions?.slice(0, numHoverList).map((item, idx) => (
                                <SquareBlock 
                                    key={idx} w={64} mr={0.5} 
                                    onMouseOver={() => setHover(idx)}
                                    sx={{
                                        borderBottom: '2px solid',
                                        borderColor: (hover === idx) ? 'text.primary' : 'transparent'
                                    }}
                                >
                                    <img src={item?.images[0].link} alt="" />
                                </SquareBlock>
                            ))}
                            {(data?.versions?.length > numHoverList) && (
                                <Typography 
                                    className='content-center' 
                                    fontSize='20px' pl={0.5} color='text.secondary'
                                >
                                    +{data?.versions?.length - numHoverList}
                                </Typography>
                            )}
                        </Box>
                    </>
                )}
                <Box display='flex' alignItems='flex-end' marginTop='auto' pt={3} pb={2}>
                    <Typography fontWeight={600} >
                        {formatMoney(discountPrice(data?.price, data?.discount))}
                    </Typography>
                    <Typography fontSize={14} ml={1} sx={{ textDecoration: 'line-through' }}>
                        {formatMoney(data?.price)}
                    </Typography>
                </Box>
            </Box>
            <Box position='absolute' top={0} right={0}>
                <IconButton
                    color={isFavorite ? 'btnError' : 'btnDark'}
                    onClick={handleToggleFavorite}
                >
                    {isFavorite 
                        ? <FavoriteTwoTone sx={{ fontSize: 28 }}  /> 
                        : <FavoriteBorder sx={{ fontSize: 28 }}  />
                    }
                </IconButton>
            </Box>     
        </Box>
    );
}

export default ProductCard;