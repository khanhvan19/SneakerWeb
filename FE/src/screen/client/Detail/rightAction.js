import { ExpandCircleDownOutlined, FavoriteBorderOutlined, ShoppingCartOutlined, Straighten } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography } from "@mui/material";
import { SquareBlock, TOAST_CENTER_STYLE } from "assets/styles/constantsStyle";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updateTotalCart } from "redux/slices/cart.slice";
import { discountPrice } from "utils";
import axiosClientPrivate from "utils/axiosClientPrivate";
import { formatMoney } from "utils/formatters";

function RightAction({ versionId, version, versions }) {
    const isLogin = useSelector((state) => state.client?.login?.data);
    const [chooseSize, setChooseSize] = useState({ sku: '', quantity: '' });

    const dispatch = useDispatch();
    var navigate = useNavigate()

    const handleAddCart = () => {
        if(!isLogin) {
            // dispatch(addHistoryRoute(`/product/detail/${version.product._id}/${version._id}`))
            navigate("/login");
        } else if(chooseSize.sku === '') {
            toast.error('Vui lòng chọn một size!', TOAST_CENTER_STYLE);
        } else {
            axiosClientPrivate
                .post('/cart/', {
                    customer: isLogin?._id,
                    product: version.product._id,
                    version: version._id,
                    size: chooseSize.sku,
                    quantity: 1,
                })
                .then((res) => {
                    dispatch(updateTotalCart(res.count))
                    if(res.message) toast.success(res.message, TOAST_CENTER_STYLE);
                    if(res.warning) toast.warn(res.warning, TOAST_CENTER_STYLE);
                })
                .catch((err) => {
                    toast.error(err.message, TOAST_CENTER_STYLE);
                })
        }
    }

    return (
        <>
            <Typography textTransform="uppercase" color='text.secondary' fontStyle="italic">
                {version?.product?.brand?.name}
            </Typography>
            <Typography variant="h3" textTransform="uppercase">
                {version?.product?.name}
            </Typography>
            <Typography variant="h6" textTransform="uppercase">
                {version?.name}
            </Typography>
            <Box mt={2} display="flex" alignItems="flex-end">
                <Typography lineHeight={1.55} sx={{ textDecoration: "line-through" }} mr={1}>
                    {formatMoney(version?.product?.price)}
                </Typography>
                <Typography variant="h5" color='text.error'>
                    {formatMoney(discountPrice(version?.product?.price, version?.product?.discount))}
                </Typography>
            </Box>
            <Box display="flex" mt={3}>
                {versions.map((item, idx) => (
                    <SquareBlock
                        key={idx}
                        w={70} mr={1}
                        border="2px solid"
                        borderColor={(item._id === versionId) ? 'text.primary' : 'transparent'}
                        component={Link} to={`/product/detail/${item?.product?._id}/${item?._id}`}
                        preventScrollReset={true} replace={true}
                    >
                        <img src={item?.images[0]?.link} alt="" />
                    </SquareBlock>
                ))}
            </Box>
            <Box mt={3} mb={chooseSize.sku !== '' ? 3.5 : 6.5}>
                <Typography mb={0.5}>Kích cỡ:</Typography>
                <Box>
                    {version?.sizes?.map((size, idx) => (
                        <Button
                            key={idx}
                            color="btnDark"
                            disableElevation
                            variant='outlined'
                            sx={{
                                mr: 1, mb: 1,
                                borderRadius: 'unset',
                                borderColor: (size.sku === chooseSize.sku) ? 'black' : '#d3d7da'
                            }}
                            onClick={() => setChooseSize({ sku: size.sku, quantity: size.quantity })}
                            disabled={size.quantity === 0 ? true : false}
                        >
                            {size.sku} EU
                        </Button>
                    ))}
                </Box>
                <Box
                    className="content-left-center"
                    onClick={() => { }}
                    sx={{ textDecoration: "underline", cursor: "pointer" }}
                >
                    <Straighten sx={{ mr: 0.5 }} />Hướng dẫn chọn size
                </Box>
            </Box>
            {chooseSize.sku !== '' && (
                <Typography color='text.secondary' mb={1} lineHeight={1}>
                    Tình trạng: 
                    <Box color='text.accent' component='span' mx={0.5}>
                        Còn hàng ({ chooseSize.quantity || 0 })
                    </Box>
                </Typography>
            )}
            <Box display='flex'>
                <Button
                    fullWidth
                    size="large"
                    color="btnDark"
                    variant="contained"
                    startIcon={<ShoppingCartOutlined />}
                    sx={{ py: 1.5, borderRadius: 'unset', textTransform: 'uppercase' }}
                    onClick={handleAddCart}
                >
                    Thêm vào giỏ hàng
                </Button>
                <Button
                    size="large"
                    color="btnDark"
                    variant="outlined"
                    sx={{ ml: 1.5, py: 1.5, borderRadius: 'unset' }}
                >
                    <FavoriteBorderOutlined fontSize="large" />
                </Button>
            </Box>
            <Accordion
                disableGutters
                square elevation={0}
                sx={{ mt: 2, '&:before': { display: 'none' } }}
            >
                <AccordionSummary
                    expandIcon={<ExpandCircleDownOutlined />}
                    sx={{ px: 0, flexDirection: 'row-reverse' }}
                >
                    <Typography ml={0.5}>
                        Vận chuyển và Trả hàng
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                    <ul>
                        <Typography variant='body2' component='li' mb={1}>
                            Thời gian giao hàng tiêu chuẩn từ 4-6 ngày kể từ ngày đơn hàng được xác nhận.
                        </Typography>
                        <Typography variant='body2' component='li' mb={1}>
                            Đơn hàng hỏa tốc được giao trong ngày hoặc chậm nhất vào buổi sáng ngày hôm sau.
                        </Typography>
                        <Typography variant='body2' component='li' mb={2}>
                            Hoàn trả trong vòng 30 ngày nếu sản phẩm có lỗi từ nhà sản xuất. 
                        </Typography>
                    </ul>
                </AccordionDetails>
            </Accordion>
        </>
    );
}

export default RightAction;