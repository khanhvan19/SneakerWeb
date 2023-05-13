import { CottageOutlined, Inventory2Outlined, LocalShippingOutlined, MapOutlined, PaymentOutlined, ReceiptLongOutlined } from "@mui/icons-material";
import { Box, Button, Chip, Divider, Paper, RadioGroup, Typography } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import RouterBreadcrumbs from "components/ui/breadcrumbs";
import { BREADCRUMB_CUSTOMER_CART } from "constants/breadcrumb";
import { useEffect, useRef, useState } from "react";
import CheckoutItem from "./checkoutItem";
import axiosClientPrivate from "utils/axiosClientPrivate";
import { useSelector } from "react-redux";
import { DELIVERY_METHOD, PAYMENT_METHOD } from "constants/optionSelectField";
import { formatLocalDate, formatMoney } from "utils/formatters";
import { TOAST_CENTER_STYLE, negativeNumber } from "assets/styles/constantsStyle";
import { totalAmountDiscount, totalInitialPrice } from "utils/calculateMoney";
import RadioItem from "components/ui/FormField/radioItem";
import AddressDrawer from "./addressDrawer";
import { toast } from "react-toastify";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useLocation, useNavigate } from "react-router";
import axiosPublic from "utils/axiosPublic";

function CheckoutScreen() {
    const isLogin = useSelector((state) => state.client?.login?.data);
    const location = useLocation();
    const products = location.state.products;
    const productCount = location.state.productCount;

    const [address, setAddress] = useState([]);
    const [choosedAddress, setChoosedAddress] = useState();
    const [deliverys, setDeliverys] = useState([]);
    const [choosedDelivery, setChoosedDelivery] = useState();
    const [choosedPayment, setChoosedPayment] = useState('cod');
    const [refresh, setRefresh] = useState(0);
    
    var addressDrawerRef = useRef();
    const navigate = useNavigate();
    
    var choosedDeliveryObj = deliverys.find(e => e.service_id === parseInt(choosedDelivery));
    var total = totalInitialPrice(products) - totalAmountDiscount(products) + choosedDeliveryObj?.fee; 
    var totalUSD = total / 23456;

    useEffect(() => {
        axiosClientPrivate
            .get('/address/', { 
                params: { customer: isLogin?._id },
                headers: { token: isLogin?.accessToken },
            })
            .then((res) => {
                setAddress(res)
                const addressDefault = res.find(item => item.isPrimary === true)  
                if(addressDefault) setChoosedAddress(addressDefault)
            })
            .catch((err) => console.log(err))
    }, [refresh, isLogin])

    useEffect(() => {
        choosedAddress && axiosPublic
            .post('shipping/service', {
                fromDistrict: parseInt(process.env.REACT_APP_GHN_CURRENT_DISTRICT),
                fromWard: process.env.REACT_APP_GHN_CURRENT_WARD,
                toDistrict: parseInt(choosedAddress.district),
                toWard: choosedAddress.ward,
                weight: 700 * productCount,
            })
            .then((result) => {
                setDeliverys(result);
                setChoosedDelivery(result[0].service_id);
            })

    }, [choosedAddress, productCount])

    const handleCheckout = () => {
        axiosClientPrivate
            .post('/order/', {
                customer: isLogin._id,
                address: choosedAddress._id,
                deliveryMethodId: choosedDelivery,
                deliveryMethod: choosedDeliveryObj.short_name,
                paymentMethod: choosedPayment,
                estimatedTime: choosedDeliveryObj.time,
                shippingFee: choosedDeliveryObj.fee,
                total: total,
                status: 'new',
            })
            .then((res) => {
                if(res.warning) toast.warn(res.warning, TOAST_CENTER_STYLE);
                else navigate('/checkout-success', { replace: true })
            })
            .catch((err) => {
                toast.error(err.message, TOAST_CENTER_STYLE);
            })
    }

    const createPaypalOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    description: "Thanh toán đơn hàng với Paypal",
                    amount: {
                        currency_code: "USD",
                        value: parseFloat(totalUSD.toFixed(2))
                    },
                },
            ],
            application_context: {
                shipping_preference: 'NO_SHIPPING'
            }
        }).then((orderId) => {
            return orderId;
        })
    }

    const handlePaypalApprove = (data, actions) => {
        return actions.order.capture().then((details) => {
            handleCheckout();
        })
    }

    const handlePaypalError = (data, actions) => {
        toast.error(
            "Rất tiếc! Quá trình thanh toán không thành công!", 
            TOAST_CENTER_STYLE
        );
    }

    const renderButtonCheckout = () => {
        switch(choosedPayment) {
            case 'paypal':
                return (
                    <Box>
                        <PayPalScriptProvider 
                            options={{ 
                                'client-id': process.env.REACT_APP_PAYPAL_CLIENT_ID 
                            }}
                        >
                            <PayPalButtons 
                                style={{ layout: "vertical" }}
                                createOrder={createPaypalOrder}
                                onApprove={handlePaypalApprove}
                                onError={handlePaypalError}
                            />
                        </PayPalScriptProvider>
                    </Box>
                )
            default:
                return (
                    <Button
                        fullWidth size="large" color="btnError" variant="contained"
                        sx={{ textTransform: 'uppercase', borderRadius: 0 }}
                        onClick={handleCheckout}
                    >
                        Đặt hàng
                    </Button>
                );
        }
    }

    return (
        <>
            <Box>
                <RouterBreadcrumbs
                    prevLink={BREADCRUMB_CUSTOMER_CART}
                    homeIcon={<CottageOutlined />}
                    currentPage='Thanh toán'
                />
            </Box>
            <Typography
                variant="h5" textTransform='uppercase' pb={0.5} mt={2} mb={3}
                borderBottom='1px solid' borderColor='divider'
            >
                Thanh toán
            </Typography>
            <Grid container spacing={2}>
                <Grid xs={8}>
                    <Paper elevation={2} sx={{ borderRadius: 0, p: 2 }}>
                        <Box className='content-center-between' mb={2}>
                            <Typography fontWeight={600} color='text.secondary' className='content-left-center'>
                                <MapOutlined sx={{ mr: 0.75, fontSize: '1.2em' }} />
                                Địa chỉ nhận hàng
                            </Typography>
                            <Button
                                color="btnSuccess"
                                onClick={() => addressDrawerRef.current.onToggleDrawer()}
                                sx={{ 
                                    lineHeight: 1, borderRadius: 0, textTransform: 'unset',
                                    '&:hover': { textDecoration: 'underline' }
                                }}
                            >
                                Thay đổi
                            </Button>
                        </Box>
                        {choosedAddress 
                            ? (
                                <>
                                    <Box className='content-left-center' mb={0.5}>
                                        <Typography fontSize={15} fontWeight={600}>{choosedAddress.name}</Typography>
                                        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                                        <Typography fontSize={15} fontWeight={600}>{choosedAddress.phone}</Typography>
                                    </Box>
                                    {(choosedAddress.isPrimary) && (
                                        <Chip size="small" color="chipSuccess" label="Mặc định" sx={{ mr: 1 }} />
                                    )}
                                    <Typography color='text.secondary' component='span'>
                                        {choosedAddress.addressString}
                                    </Typography>
                                </>
                            )
                            : (
                                <Box>Chưa có địa chỉ</Box>
                            )
                        }
                    </Paper>
                    <Paper elevation={2} sx={{ borderRadius: 0, p: 2, mt: 2 }}>
                        <Typography fontWeight={600} color='text.secondary' className='content-left-center' mb={2}>
                            <Inventory2Outlined sx={{ mr: 0.75, fontSize: '1.2em' }} />
                            Sản phẩm
                        </Typography>
                        {products.map((product, idx) => (
                            <Box key={idx}>
                                <CheckoutItem data={product} />
                                {(idx !== products.length - 1) && (<Divider />)}
                            </Box>
                        ))}
                    </Paper>
                </Grid>
                <Grid xs={4}>
                    <Paper elevation={2} sx={{ borderRadius: 0, p: 2 }}>
                        <Typography fontWeight={600} color='text.secondary' className='content-left-center' mb={2}>
                            <LocalShippingOutlined sx={{ mr: 0.75, fontSize: '1.2em' }} />
                            Hình thức giao hàng
                        </Typography>
                        <RadioGroup
                            value={choosedDelivery || ''}
                            onChange={(e) => setChoosedDelivery(e.target.value)}
                        >
                            {(deliverys.length !== 0) 
                                ? deliverys.map((item, idx) => (
                                    <RadioItem 
                                        key={idx} value={item.service_id}
                                        sx={{ mb: (idx !== deliverys.length - 1) ? 2 : 0 }}
                                    >
                                        <Box className="content-center-between">
                                            <Typography fontSize={15} fontWeight={600}>
                                                {item.short_name}
                                            </Typography>
                                            <Typography fontSize={15} fontWeight={600}>
                                                {formatMoney(item.fee)}
                                            </Typography>
                                        </Box>
                                        <Typography variant="caption">
                                            Dự kiến giao hàng ngày {formatLocalDate(new Date(item.time))}
                                        </Typography>
                                    </RadioItem>
                                ))
                                : (
                                    <Box>Chưa có thông tin</Box>
                                )}
                        </RadioGroup>
                    </Paper>
                    <Paper elevation={2} sx={{ borderRadius: 0, p: 2, mt: 2 }}>
                        <Typography fontWeight={600} color='text.secondary' className='content-left-center' mb={2}>
                            <PaymentOutlined sx={{ mr: 0.75, fontSize: '1.2em' }} />
                            Phương thức thanh toán
                        </Typography>
                        <RadioGroup
                            value={choosedPayment}
                            onChange={(e) => setChoosedPayment(e.target.value)}
                        >
                            {PAYMENT_METHOD.map((item, idx) => (
                                <RadioItem 
                                    value={item.value} key={idx}
                                    sx={{ mb: (idx !== DELIVERY_METHOD.length - 1) ? 2 : 0 }}
                                >
                                    <Box className='content-left-center'>
                                        <Box component='img' src={item.logo} alt='' height={32} mr={1} />
                                        <Typography component='span' fontSize={15} fontWeight={500}>{item.label}</Typography>
                                    </Box>
                                </RadioItem>
                            ))}
                        </RadioGroup>
                    </Paper>
                    <Paper elevation={2} sx={{ borderRadius: 0, p: 2, mt: 2 }}>
                        <Typography fontWeight={600} color='text.secondary' className='content-left-center' mb={2}>
                            <ReceiptLongOutlined sx={{ mr: 0.75, fontSize: '1.2em' }} />
                            Đơn hàng
                        </Typography>
                        <Box className='content-center-between' mb={1.5}>
                            <Typography fontSize={15} color='text.secondary'>Tổng tiền hàng</Typography>
                            <Typography fontSize={15} fontWeight={600}>
                                {formatMoney(totalInitialPrice(products))}
                            </Typography>
                        </Box>
                        <Box className='content-center-between' mb={1.5}>
                            <Typography fontSize={15} color='text.secondary'>Giảm giá sản phẩm</Typography>
                            <Typography fontSize={15} fontWeight={600} sx={negativeNumber}>
                                {formatMoney(totalAmountDiscount(products))}
                            </Typography>
                        </Box>
                        <Box className='content-center-between' mb={1.5}>
                            <Typography fontSize={15} color='text.secondary'>Phí vận chuyển</Typography>
                            <Typography fontSize={15} fontWeight={600}>
                                {formatMoney(choosedDeliveryObj?.fee)}
                            </Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box className='content-center-between' color='text.error'>
                            <Typography variant='h6' textTransform='uppercase'>Tổng cộng</Typography>
                            <Typography variant='h6'>
                                {formatMoney(total)}
                            </Typography>
                        </Box>
                        <Box mt={3}>
                            {renderButtonCheckout()}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <AddressDrawer 
                ref={addressDrawerRef} 
                current={choosedAddress}
                addressList={address}
                onChangeAddress={(value) => setChoosedAddress(value)} 
                onRefresh={() => setRefresh(prev => prev + 1)}
            />
        </>
    );
}

export default CheckoutScreen;