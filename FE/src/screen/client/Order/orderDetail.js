import { InfoOutlined, Inventory2Outlined, KeyboardArrowLeft, LocalShippingOutlined, MapOutlined } from "@mui/icons-material";
import { Box, Button, Chip, Divider, Paper, Step, StepContent, StepLabel, Stepper, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import Grid from '@mui/material/Unstable_Grid2';
import { useEffect, useRef, useState } from "react";
import axiosClientPrivate from "utils/axiosClientPrivate";
import { renderOrderStatus } from "utils";
import { PAYMENT_METHOD } from "constants/optionSelectField";
import { formatLocalDate, formatLocalDateTime, formatMoney } from "utils/formatters";
import OrderDetailItem from "./orderDetailItem";
import { totalAmountDiscount, totalCount, totalInitialPrice } from "utils/calculateMoney";
import { negativeNumber } from "assets/styles/constantsStyle";
import ReadOnlyStepIcon, { ReadOnlyStepConnector } from "components/ui/readOnlyStep";
import ReviewDialog from "./reviewDialog";

const stylesTitle = {
    px: 2, py: 1,
    color: 'background.paper',
    bgcolor: 'text.primary',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
}

function OrderDetail() {
    const { id } = useParams();
    const [order, setOrder] = useState();
    const reviewDialogRef = useRef()
    const [refresh, setRefresh] = useState(0)

    useEffect(() => {
        axiosClientPrivate
            .get(`/order/${id}`)
            .then((res) => setOrder(res))
            .catch((err) => console.log(err))
    }, [id, refresh])

    return (
        <Box flex={1}>
            {order && (
                <>
                    <Box className='content-center-between' mb={2}>
                        <Button
                            component={Link} to='/order'
                            startIcon={<KeyboardArrowLeft />}
                            color='btnGray' sx={{ borderRadius: 0 }}
                        >
                            Trở lại
                        </Button>
                        <Box>
                            {renderOrderStatus(order.status, 'medium')}
                        </Box>
                    </Box>
                    <Grid container spacing={2} mb={2}>
                        <Grid xs={6}>
                            <Paper elevation={3} sx={{ borderRadius: 0, height: '100%' }}>
                                <Box sx={stylesTitle}>
                                    <MapOutlined sx={{ mr: 0.75, fontSize: '1.2em' }} />
                                    Địa chỉ nhận hàng
                                </Box>
                                <Box px={2} py={1}>
                                    <Box className='content-left-center' mb={0.5}>
                                        <Typography fontWeight={600}>{order.address.name}</Typography>
                                        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                                        <Typography fontWeight={600}>{order.address.phone}</Typography>
                                    </Box>
                                    {order.address.isPrimary && (
                                        <Chip size="small" color="chipSuccess" label="Mặc định" sx={{ mr: 1 }} />
                                    )}
                                    <Typography color='text.secondary' component='span'>{order.address.addressString}</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid xs={6}>
                            <Paper elevation={3} sx={{ borderRadius: 0 }}>
                                <Box sx={stylesTitle}>
                                    <InfoOutlined sx={{ mr: 0.75, fontSize: '1.2em' }} />
                                    Thông tin đơn hàng
                                </Box>
                                <Box px={2} py={1}>
                                    <Box className='content-left-center' mb={0.25}>
                                        <Typography color='text.secondary' mr={1}>Mã đơn hàng:</Typography>
                                        <Typography textTransform='uppercase'>{order._id}</Typography>
                                    </Box>
                                    <Box className='content-left-center' mb={0.25}>
                                        <Typography color='text.secondary' mr={1}>Ngày đặt hàng:</Typography>
                                        <Typography>{formatLocalDateTime(order.createdAt)}</Typography>
                                    </Box>
                                    <Box className='content-left-center' mb={0.25}>
                                        <Typography color='text.secondary' mr={1}>Hình thức giao hàng:</Typography>
                                        <Typography>{order.deliveryMethod}</Typography>
                                    </Box>
                                    <Box className='content-left-center'>
                                        <Typography color='text.secondary' mr={1}>Phương thức thanh toán:</Typography>
                                        <Typography>
                                            {PAYMENT_METHOD.find(e => e.value === order.paymentMethod).label}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Paper elevation={3} sx={{ borderRadius: 0, mb: 2 }}>
                        <Box sx={stylesTitle}>
                            <LocalShippingOutlined sx={{ mr: 0.75, fontSize: '1.2em' }} />
                            Hành trình vận chuyển
                        </Box>
                        <Box py={1} px={2}>
                            {(order.status === 'delivery' || order.status === 'success') && (
                                <Box
                                    pl={2} mb={2}
                                    sx={{ fontStyle: 'italic', borderLeft: '4px solid', borderColor: 'text.primary' }}
                                >
                                    <Box className='content-left-center'>
                                        Giao hàng bởi
                                        <Typography fontWeight={600} mx={0.75}>{order.shipper.name}</Typography>
                                        số điện thoại
                                        <Typography fontWeight={600} mx={0.75}>{order.shipper.phone}</Typography>
                                    </Box>
                                    <Box className='content-left-center'>
                                        Đơn hàng dự kiến sẽ được giao đến khách hàng vào ngày
                                        <Typography fontWeight={600} ml={0.75}>
                                            {formatLocalDate(new Date(order.estimatedTime))}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                            <Stepper
                                activeStep={0}
                                orientation="vertical"
                                connector={<ReadOnlyStepConnector />}
                                sx={{ px: 2, mb: 2 }}
                            >
                                {order.itinerary.reverse().map((step, idx) => (
                                    <Step key={idx}>
                                        <StepLabel sx={{ pb: 0.5 }} StepIconComponent={ReadOnlyStepIcon}>
                                            <Typography
                                                component='div' fontWeight={500}
                                                color={(idx === 0) ? 'text.accent' : 'text.primary'}
                                            >
                                                {formatLocalDateTime(step.time)}
                                            </Typography>
                                        </StepLabel>
                                        <StepContent
                                            TransitionProps={{ in: true }}
                                            sx={{ borderLeftWidth: 4, borderColor: 'background.secondary' }}
                                        >
                                            <Typography fontWeight={500}>{step.title}</Typography>
                                            <Typography variant='body2' color='text.secondary'>
                                                {step.caption}
                                            </Typography>
                                        </StepContent>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>
                    </Paper>
                    <Paper elevation={3} sx={{ borderRadius: 0 }}>
                        <Box sx={stylesTitle}>
                            <Inventory2Outlined sx={{ mr: 0.75, fontSize: '1.2em' }} />
                            Danh sách sản phẩm
                        </Box>
                        <Box px={2} py={1}>
                            {order.products.map((product, i) => (
                                <OrderDetailItem 
                                    key={i} 
                                    data={product} 
                                    status={order.status} 
                                    onShowReview={() => {
                                        reviewDialogRef.current.onShowReviewDialog({
                                            product: product, 
                                            orderId: order._id
                                        })
                                    }}
                                />
                            ))}
                            <Divider sx={{ mt: 1, mb: 2 }} />
                            <Grid container spacing={1} xsOffset={6} alignItems='flex-end' mb={0.5}>
                                <Grid xs={6} color='text.secondary'>
                                    Tổng tiền hàng ({totalCount(order.products)} sản phẩm)
                                </Grid>
                                <Grid xs={6} textAlign='end' fontWeight={500}>
                                    {formatMoney(totalInitialPrice(order.products))}
                                </Grid>
                                <Grid xs={6} color='text.secondary'>Giảm giá sản phẩm</Grid>
                                <Grid xs={6} textAlign='end' fontWeight={500}>
                                    <Box sx={negativeNumber} display='inline-block'>
                                        {formatMoney(totalAmountDiscount(order.products))}
                                    </Box>
                                </Grid>
                                <Grid xs={6} color='text.secondary'>Phí vận chuyển</Grid>
                                <Grid xs={6} textAlign='end' fontWeight={500}>
                                    {formatMoney(order.shippingFee)}
                                </Grid>
                                <Grid xs={6} color='text.secondary' lineHeight={1.75}>Tổng cộng (Bao gồm VAT)</Grid>
                                <Grid xs={6} textAlign='end' fontWeight={600} fontSize={20} color='text.error'>
                                    {formatMoney(order.total)}
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </>
            )}

            <ReviewDialog 
                ref={reviewDialogRef} 
                onRefresh={() => setRefresh(prev => prev + 1)} 
            />
        </Box>
    );
}

export default OrderDetail;