import { CottageOutlined } from "@mui/icons-material";
import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import RouterBreadcrumbs from "components/ui/breadcrumbs";
import { BREADCRUMB_CUSTOMER_CART } from "constants/breadcrumb";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosClientPrivate from "utils/axiosClientPrivate";
import CartItem from "./cartItem";
import SoldoutItem from "./soldoutItem";
import { formatMoney } from "utils/formatters";
import { TOAST_CENTER_STYLE, negativeNumber } from "assets/styles/constantsStyle";
import { totalAmountDiscount, totalInitialPrice } from "utils/calculateMoney";
import { updateTotalCart } from "redux/slices/cart.slice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

function CartScreen() {
    const isLogin = useSelector((state) => state.client?.login?.data);
    const [count, setCount] = useState(0);
    const [inventory, setInventory] = useState([]);
    const [inventoryCount, setInventoryCount] = useState(0);
    const [soldout, setSoldout] = useState([]);
    const [refresh, setRefresh] = useState(0);
    var dispatch = useDispatch()
    var navigate = useNavigate()

    useEffect(() => {
        axiosClientPrivate
            .get('/cart/', {
                params: { customer: isLogin?._id },
                headers: { token: isLogin?.accessToken }
            })
            .then((res) => {
                setInventory(res.inventory)
                setInventoryCount(res.inventoryCount)
                setSoldout(res.soldout)
                setCount(res.count)
                dispatch(updateTotalCart(res.count));
            })
            .catch((err) => console.log(err))
    }, [isLogin, refresh, dispatch])

    const handleRefresh = useCallback(() => {
        setRefresh(prev => prev + 1)
    }, [])

    const handleDelete = async (item) => {
        if(window.confirm('Bạn có đồng ý loại bỏ sản phẩm này khỏi giỏ hàng?')) {
            await axiosClientPrivate
                .put('/cart/deleted/', {
                    customer: isLogin._id,
                    ...item,
                })
                .then((res) => {
                    toast.success(res.message, TOAST_CENTER_STYLE);
                    handleRefresh()
                })
                .catch((err) => {
                    toast.error(err.message, TOAST_CENTER_STYLE);
                })
        }
    }

    return (
        <>
            <Box>
                <RouterBreadcrumbs
                    prevLink={BREADCRUMB_CUSTOMER_CART}
                    homeIcon={<CottageOutlined />}
                />
            </Box>
            <Grid container spacing={2} mt={1}>
                <Grid xs={8}>
                    <Typography
                        variant="h5" textTransform='uppercase' pb={0.5} mb={3}
                        borderBottom='1px solid' borderColor='divider'
                    >
                        Giỏ hàng của bạn [{count}]
                    </Typography>
                    <Paper elevation={3} sx={{ borderRadius: 0 }}>
                        <Box px={2} py={1}>
                            <Typography pb={1} pt={0.5} color='text.secondary'>
                                Bạn có
                                <Box component='span' fontWeight={500} color='text.primary' mx={0.5}>
                                    {inventoryCount} sản phẩm
                                </Box>
                                có sẵn hàng trong giỏ hàng
                            </Typography>
                            {inventory && inventory.map((product, idx) => (
                                <Box key={idx}>
                                    <CartItem 
                                        data={product} 
                                        onRefresh={handleRefresh} 
                                        onDelete={handleDelete} 
                                    />
                                    {(idx !== inventory?.length - 1) && (<Divider />)}
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                    {soldout.length !== 0 && (
                        <Box mt={3}>
                            <Typography
                                variant="h6" pb={0.5} mb={3}
                                borderBottom='1px solid' borderColor='divider'
                            >
                                Sản phẩm không có sẵn [{count - inventoryCount}]
                            </Typography>
                            <Paper elevation={2} sx={{ borderRadius: 0 }}>
                                <Box px={2} py={1}>
                                    {soldout && soldout.map((product, idx) => (
                                        <Box key={idx}>
                                            <SoldoutItem 
                                                data={product} 
                                                onDelete={handleDelete} 
                                            />
                                            {(idx !== soldout?.length - 1) && (<Divider />)}
                                        </Box>
                                    ))}
                                </Box>
                            </Paper>
                        </Box>
                    )}
                </Grid>
                <Grid xs={4}>
                    <Box position='sticky' top={24} pl={3.5}>
                        <Typography
                            variant="h5" textTransform='uppercase' pb={0.5} mb={3}
                            borderBottom='1px solid' borderColor='divider'
                        >
                            Thông tin đơn hàng
                        </Typography>
                        <Paper elevation={3} sx={{ p: 2, pt: 1.5, borderRadius: 0 }}>
                            <Box className='content-center-between' mb={1.5}>
                                <Typography color='text.secondary'>Số sản phẩm</Typography>
                                <Typography>{inventoryCount} sản phẩm</Typography>
                            </Box>
                            <Box className='content-center-between' mb={1.5}>
                                <Typography color='text.secondary'>Tổng tiền hàng</Typography>
                                <Typography>{formatMoney(totalInitialPrice(inventory))}</Typography>
                            </Box>
                            <Box className='content-center-between' mb={1.5}>
                                <Typography color='text.secondary'>Giảm giá sản phẩm</Typography>
                                <Typography sx={negativeNumber}>
                                    {formatMoney(totalAmountDiscount(inventory))}
                                </Typography>
                            </Box>
                            <Box className='content-center-between' mb={1.5}>
                                <Typography variant="body2" color='text.secondary' component='i'>
                                    * Phí vận chuyển sẽ được tính ở trang thanh toán
                                </Typography>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Box className='content-center-between' color='text.error'>
                                <Typography variant='h6' textTransform='uppercase'>Tổng cộng</Typography>
                                <Typography variant='h6'>
                                    {formatMoney(totalInitialPrice(inventory) - totalAmountDiscount(inventory))}
                                </Typography>
                            </Box>
                            <Typography variant="body2" textAlign='end' fontStyle='italic'>
                                Đã bao gồm VAT (nếu có)
                            </Typography>
                            <Box mt={3}>
                                <Button
                                    fullWidth size="large" color="btnError" variant="contained"
                                    sx={{ textTransform: 'uppercase', borderRadius: 0 }}
                                    disabled={(inventory.length === 0) ? true : false}
                                    onClick={() => navigate('/checkout', {
                                        state: {
                                            products: inventory,
                                            productCount: inventoryCount,
                                        }
                                    })}
                                >
                                    Thanh toán ({inventoryCount})
                                </Button>
                            </Box>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}


export default CartScreen;

