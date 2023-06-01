import { Box, IconButton, Typography } from "@mui/material";
import { SquareBlock, TOAST_CENTER_STYLE } from "assets/styles/constantsStyle";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { updateFavorite } from "redux/slices/favorite.slice";
import axiosClientPrivate from "utils/axiosClientPrivate";
import { formatMoney } from "utils/formatters";
import { discountPrice } from "utils";
import { FavoriteBorder, FavoriteTwoTone } from "@mui/icons-material";

function ProductHoverImageCard({ data }) {
    const isLogin = useSelector((state) => state.client?.login?.data);
    var favorites = useSelector((state) => state.favorite?.favorites);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    var isFavorite = favorites?.includes(data?._id);

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
                to={`/product/detail/${data._id}/${data.versions[0]._id}`}
                position='relative'
                sx={{
                    '&:hover': {
                        '& #product-info': {
                            opacity: 1,
                            transform: 'translateY(0%)',
                            transition: 'all 400ms ease-in-out'
                        }
                    }
                }}
            >   
                <SquareBlock w='100%'>
                    <img src={data.versions[0].images[0].link} alt='' />
                </SquareBlock> 
                <Box 
                    id='product-info'
                    position='absolute' 
                    bottom={0} left={0} p={1.5}
                    width='100%' height='25%' 
                    bgcolor='#00000096'
                    sx={{ opacity: 0, transform: 'translateY(100%)' }}
                >
                    <Typography  
                        fontWeight={600} 
                        color='background.paper' textTransform='uppercase' 
                        className="text-eclipse one-line"
                    >
                        {data.name}
                    </Typography>
                    <Box display='flex' alignItems='flex-end' pt={0.5}>
                        <Typography fontWeight={600} color='background.paper'>
                            {formatMoney(discountPrice(data.price, data.discount))}
                        </Typography>
                        <Typography 
                            fontSize={14} ml={1} color='background.paper'
                            sx={{ textDecoration: 'line-through' }}
                        >
                            {formatMoney(data?.price)}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Box position='absolute' top={0} right={0}>
                <IconButton
                    color={isFavorite ? 'btnError' : 'btnDark'}
                    onClick={handleToggleFavorite}
                >
                    {isFavorite 
                        ? <FavoriteTwoTone sx={{ fontSize: 28 }} /> 
                        : <FavoriteBorder sx={{ fontSize: 28 }}  />
                    }
                </IconButton>
            </Box>     
        </Box>
    );
}

export default ProductHoverImageCard;