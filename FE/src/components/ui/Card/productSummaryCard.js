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
import { Favorite, FavoriteBorder, FavoriteTwoTone } from "@mui/icons-material";

function ProductSummaryCard({ data }) {
    const isLogin = useSelector((state) => state.client?.login?.data);
    var favorites = useSelector((state) => state.favorite?.favorites);
    const navigate = useNavigate()
    const dispatch = useDispatch()
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
                to={`/product/detail/${data._id}/${data.versions[0]._id}`}
                display='flex' flexDirection='column' height='100%'
            >   
                <SquareBlock w='100%'>
                    <img src={data.versions[0].images[0].link} alt='' />
                </SquareBlock> 
                <Typography  
                    mt={0.5} fontWeight={500} color='text.primary' textTransform='uppercase' 
                    className="text-eclipse one-line"
                >
                    {data.name}
                </Typography>
                <Typography color='text.secondary'>{data.brand.name}</Typography>
                <Box display='flex' alignItems='flex-end' py={1}>
                    <Typography fontWeight={600} >
                        {formatMoney(discountPrice(data.price, data.discount))}
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
                        : <FavoriteBorder sx={{ fontSize: 28 }} />
                    }
                </IconButton>
            </Box>     
        </Box>
    );
}

export default ProductSummaryCard;