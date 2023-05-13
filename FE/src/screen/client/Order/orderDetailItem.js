import { AddShoppingCartOutlined, RateReviewOutlined } from "@mui/icons-material";
import { Badge, Box, Button, Typography } from "@mui/material";
import { SquareBlock, TOAST_CENTER_STYLE, TOAST_NAVIGATE_CENTER_STYLE } from "assets/styles/constantsStyle";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updateTotalCart } from "redux/slices/cart.slice";
import { discountPrice } from "utils";
import axiosClientPrivate from "utils/axiosClientPrivate";
import { formatMoney } from "utils/formatters";

function OrderDetailItem({ data, status, onShowReview }) {
    const isLogin = useSelector((state) => state.client?.login?.data);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleReOrder = () => {
        const inventory = data.version.sizes.find(e => e.sku === data.size).quantity
        if(data._id.isDeleted === true || data.version.isDeleted === true
            || data._id.status === false || data.version.status === false
        ) {
            toast.error('Rất tiếc! Sản phẩm này đã ngừng kinh doanh!', TOAST_CENTER_STYLE);
        } else if(inventory < data.quantity) {
            toast.error('Rất tiếc! Sản phẩm đã hết hàng hoặc không đủ số lượng yêu cầu! ', TOAST_CENTER_STYLE);
        } else {
            axiosClientPrivate
                .post('/cart/', {
                    customer: isLogin._id,
                    product: data._id._id,
                    version: data.version._id,
                    size: data.size,
                    quantity: data.quantity,
                })
                .then((res) => {
                    if (res.count) dispatch(updateTotalCart(res.count))
                    if (res.message) {
                        toast.success(res.message, TOAST_NAVIGATE_CENTER_STYLE);
                        setTimeout(() => navigate('/cart'), 2000)
                    } 
                    if (res.warning) toast.warn(res.warning, TOAST_CENTER_STYLE);
                })
                .catch((err) => {
                    toast.error(err.message, TOAST_CENTER_STYLE);
                })
        }

    }

    return (
        <Box display="flex" my={1}>
            <Box
                flex={3} display='flex'
                component={Link} to={`/product/detail/${data._id._id}/${data.version._id}`}
            >
                <SquareBlock w={80} mr={1.5}>
                    <img src={data.version.images[0].link} alt="" />
                </SquareBlock>
                <Box>
                    <Typography textTransform='uppercase'>{data._id.name}</Typography>
                    <Box>
                        <Typography variant='body2' component='span' color='text.secondary'>Màu sắc: </Typography>
                        <Typography variant='body2' component='span'>{data.version.name}</Typography>
                        <Typography component='span' mx={1}>/</Typography>
                        <Typography variant='body2' component='span' color='text.secondary'>Size: </Typography>
                        <Typography variant='body2' component='span'>{data.size} EU</Typography>
                    </Box>
                </Box>
            </Box>
            <Box flex={2} display='flex' flexDirection='column'>
                <Box display='flex' justifyContent='space-between'>
                    <Box>
                        <Box color='text.secondary' mr={1} component='span'>số lượng:</Box>
                        {data.quantity}
                    </Box>
                    <Box display='flex' alignItems='center'>
                        {data.discount && (
                            <Typography
                                mr={1} variant='body2' color='text.secondary'
                                sx={{ textDecoration: 'line-through' }}
                            >
                                {formatMoney(discountPrice(data.price, data.discount))}
                            </Typography>
                        )}
                        <Typography fontWeight={500}>{formatMoney(data.price)}</Typography>
                    </Box>
                </Box>
                <Box textAlign='right' mt={1}>
                    {(status === 'success') && (
                        <Badge
                            invisible={!!data.review}
                            color='btnError' variant='dot'
                            sx={{ '& .MuiBadge-dot': { p: 0.75, borderRadius: '50%' } }}
                        >
                            <Button
                                variant='outlined' size='small' color='btnDark'
                                startIcon={<RateReviewOutlined />}
                                sx={{ borderRadius: 0 }}
                                onClick={onShowReview}
                            >
                                {(!!data.review) ? 'Xem đánh giá' : 'Đánh giá'}
                            </Button>
                        </Badge>
                    )}
                    {(status === 'success' || status === 'cancel') && (
                        <Button
                            variant='outlined' size='small' color='btnDark'
                            startIcon={<AddShoppingCartOutlined />}
                            sx={{ borderRadius: 0, ml: 2 }}
                            onClick={handleReOrder}
                        >
                            Mua lại
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default OrderDetailItem;