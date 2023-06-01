import { DeleteOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { SquareBlock, TOAST_CENTER_STYLE } from "assets/styles/constantsStyle";
import QuantityButton from "components/ui/QuantityButton/quantityButton";
import { memo, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { discountPrice } from "utils";
import axiosClientPrivate from "utils/axiosClientPrivate";
import { formatMoney } from "utils/formatters";

function CartItem({ data , onRefresh, onDelete}) {
    const isLogin = useSelector((state) => state.client?.login?.data);
    
    var basicInfo = useMemo(() => {
        return {
            product: data._id._id,
            version: data.version._id,
            size: data.size,
        }
    }, [data])

    const handleQuantityChange = useCallback( async (quantity) => {
        await axiosClientPrivate
            .put('/cart/', {
                customer: isLogin._id,
                ...basicInfo,
                quantity: quantity,
            })
            .then((res) => onRefresh())
            .catch((err) => {
                toast.error(err.message, TOAST_CENTER_STYLE);
            })
    }, [isLogin, basicInfo, onRefresh])

    return (  
        <Box display="flex" my={1} alignItems='center'>
            <Box 
                flex={3} display='flex'
                component={Link} to={`/product/detail/${data?._id?._id}/${data?.version?._id}`}
            >
                <SquareBlock w={100}>
                    <img src={data.version.images[0].link} alt="" />
                </SquareBlock>
                <Box ml={2}>
                    <Typography variant="h6" textTransform='uppercase'>{data._id.name}</Typography>
                    <Box>
                        <Typography fontSize={15} component='span' color='text.secondary'>Màu sắc: </Typography>
                        <Typography fontSize={15} component='span'>{data.version.name}</Typography>
                        <Typography component='span' mx={1}>/</Typography>
                        <Typography fontSize={15} component='span' color='text.secondary'>Size: </Typography>
                        <Typography fontSize={15} component='span'>{data.size} EU</Typography>
                    </Box>
                    <Typography fontSize={15} fontWeight={500} mt={1}>
                        {formatMoney(discountPrice(data._id.price, data._id.discount))}
                    </Typography>
                </Box>
            </Box>
            <Box flex={2} display='flex' justifyContent='space-between' alignItems='center'>
                <Box>
                    <QuantityButton 
                        quantity={data.quantity} 
                        min={1} max={data.inventoryQuantity}
                        onChange={handleQuantityChange}
                    />
                    {(data.inventoryQuantity <= 10) && (
                        <Typography variant="caption" fontStyle='italic' color='text.error'>
                            Chỉ còn {data.inventoryQuantity} sản phẩm
                        </Typography>
                    )}
                </Box>
                <Box>
                    <Typography fontWeight={700}>
                        {formatMoney(discountPrice(data._id.price, data._id.discount) * data.quantity)}
                    </Typography>
                    {data._id.discount !== 0 && (
                        <Typography 
                            variant='body2' color='text.secondary'
                            sx={{ textDecoration: 'line-through' }} 
                        >
                            {formatMoney(data._id.price * data.quantity)}
                        </Typography>
                    )}
                </Box>
                <Box>
                    <IconButton color="btnError" onClick={() => onDelete(basicInfo)}>
                        <DeleteOutlined />
                    </IconButton>
                </Box>
            </Box>    
        </Box>
    );
}

export default memo(CartItem);