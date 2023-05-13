import { ArrowBackOutlined, Speed } from "@mui/icons-material";
import { Box, Button, Divider, Paper, Step, StepContent, StepLabel, Stepper, Typography } from "@mui/material";
import RouterBreadcrumbs from "components/ui/breadcrumbs";
import { BREADCRUMB_ADMIN_ORDER } from "constants/breadcrumb";
import { ADMIN_CANCEL_ORDER_REASON, PAYMENT_METHOD, ROLE_OPTION } from "constants/optionSelectField";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { renderOrderStatus } from "utils";
import axiosPrivate from "utils/axiosPrivate";
import { formatLocalDateTime, formatMoney } from "utils/formatters";
import OrderDetailItem from "./orderDetailItem";
import Grid from '@mui/material/Unstable_Grid2';
import { totalAmountDiscount, totalCount, totalInitialPrice } from "utils/calculateMoney";
import { TOAST_DEFAULT_STYLE, negativeNumber } from "assets/styles/constantsStyle";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import SelectShipper from "./selectShipper";
import ReadOnlyStepIcon, { ReadOnlyStepConnector } from "components/ui/readOnlyStep";

const stylesTableCell = {
    px: 1,
    display: 'table-cell',
}

const stylesTitle = {
    ...stylesTableCell,
    whiteSpace: 'nowrap',
    color: 'text.secondary'
}

function OrderDetail() {
    const employee = useSelector((state) => state.auth?.login?.data);
    const { id } = useParams();
    const [order, setOrder] = useState();
    const [refresh, setRefresh] = useState(0);
    const selectShipperRef = useRef();

    useEffect(() => {
        axiosPrivate
            .get(`/order/${id}`)
            .then((res) => setOrder(res))
            .catch((err) => console.log(err))
    }, [refresh, id])

    const handleComfirmOrder = (shipperId) => {
        Swal.fire({
            icon: 'success',
            title: 'Xác nhận đã xử lý đơn hàng!',
            text: 'Phân công nhân viên giao hàng thành công và sẵn sàng tiến hành giao đơn hàng',
            confirmButtonText: "Hoàn thành",
            confirmButtonColor: '#00ab55',
        }).then((result) => {
            if(result.isConfirmed) {
                axiosPrivate
                    .put(`/order/comfirm/${id}`,
                        { shipper: shipperId },
                        { headers: { token: employee?.accessToken } }
                    )
                    .then((res) => {
                        selectShipperRef.current.onCloseDialog()
                        setRefresh(prev => prev + 1);
                    }) 
                    .catch((err) => console.log(err))
            }
        })
    }

    const handleCancelOrderByAdmin = () => {
        Swal.fire({
            title: 'Bạn muốn hủy đơn hàng này?',
            text: 'Vui lòng cho biết lý do bạn muốn hủy:',
            input: 'radio',
            inputOptions: ADMIN_CANCEL_ORDER_REASON,
            showCancelButton: true,
            cancelButtonText: "Không phải bây giờ",
            confirmButtonText: "Hủy đơn hàng",
            confirmButtonColor: '#ff5630',
            reverseButtons: true,
            inputValidator: (value) => {
                return new Promise((resolve) => {
                    if(value) resolve();
                    else resolve('Vui lòng cho biết lý do!')
                })
            }
        }).then((result) => {
            if(result.isConfirmed) {
                axiosPrivate
                    .put(`/order/cancel/${id}`,
                        { 
                            reason: ADMIN_CANCEL_ORDER_REASON[result.value],
                            partian: 'The Sneaker',
                        },
                        { headers: { token: employee?.accessToken } }
                    )
                    .then((res) => {
                        toast.warn(res.message, TOAST_DEFAULT_STYLE)
                        setRefresh(prev => prev + 1);
                    }) 
                    .catch((err) => console.log(err))
            }
        })
    }

    const handleConfirmCompleted = () => {
        axiosPrivate
            .put(`/order/success/${id}`, {})
            .then((res) => {
                toast.success(res.message, TOAST_DEFAULT_STYLE)
                setRefresh(prev => prev + 1);
            })
            .catch((err) => console.log(err))
    }

    const checkTimeoutLastUpdateItinerary = () => {
        // const timeout = 1000 * 60 * 60 * 24 * 3; //3d 
        const timeout = 1000 * 60 * 3; //3m 
        if(order.status === 'delivery' && !!order.successProof) {
            const lastUpdate = order.itinerary.slice(-1)[0];
            var now = new Date().getTime();
            var lastUpdateTime = new Date(lastUpdate.time).getTime();
            if((now - lastUpdateTime) >= timeout) return true;
            else return false;
        }
        return false;
    }

    return (
        <>
            <Box className='content-center-between'>
                <Box> 
                    <Typography variant="h5" gutterBottom>
                        Chi tiết đơn hàng
                    </Typography>
                    <RouterBreadcrumbs
                        prevLink={BREADCRUMB_ADMIN_ORDER}
                        currentPage="Chi tiết đơn hàng"
                        homeIcon={<Speed />}
                    />
                </Box>
                <Box>
                    <Button 
                        component={Link} to="/admin/order"
                        variant="contained" color="btnGray" 
                        startIcon={<ArrowBackOutlined />}
                    >
                        Trở lại
                    </Button>
                </Box>
            </Box>
            {order && (
                <>
                    <Paper elevation={3} sx={{ p: 2, mt: 3, backgroundImage: 'none' }}>
                        <Box display='table'>
                            <Box display='table-row'>
                                <Typography sx={stylesTitle}>Đơn hàng:</Typography>
                                <Typography sx={stylesTableCell} component='div' >
                                    <Typography component='span' mr={2} textTransform='uppercase'>
                                        {order._id}
                                    </Typography> 
                                    {renderOrderStatus(order.status, 'small')}
                                </Typography>
                            </Box>
                            <Box display='table-row' mt={0.5}>
                                <Typography sx={stylesTitle}>Ngày đặt hàng:</Typography>
                                <Typography sx={stylesTableCell}>{formatLocalDateTime(order.createdAt)}</Typography>
                            </Box>
                            <Box display='table-row' mt={0.5}>
                                <Typography sx={stylesTitle}>Phương thức thanh toán:</Typography>
                                <Typography sx={stylesTableCell}>
                                    {PAYMENT_METHOD.find(e => e.value === order.paymentMethod).label}
                                </Typography>
                            </Box>
                            <Box display='table-row' mt={0.5}>
                                <Typography sx={stylesTitle}>Hình thức vận chuyển:</Typography>
                                <Typography sx={stylesTableCell}>{order.deliveryMethod}</Typography>
                            </Box>
                        </Box>
                    </Paper>
                    <Grid container spacing={2} mt={1}>
                        <Grid xs>
                            <Paper elevation={3} sx={{ p: 2, backgroundImage: 'none' }}>
                                <Typography color='text.secondary' textTransform='uppercase'>
                                    Địa chỉ giao hàng
                                </Typography>
                                <Divider sx={{ my: 1 }} />
                                <Box display='table'>
                                    <Box display='table-row' mt={0.5}>
                                        <Typography sx={stylesTitle}>Người nhận:</Typography>
                                        <Typography sx={stylesTableCell}>{order.address.name}</Typography>
                                    </Box>
                                    <Box display='table-row' mt={0.5}>
                                        <Typography sx={stylesTitle}>Điện thoại:</Typography>
                                        <Typography sx={stylesTableCell}>{order.address.phone}</Typography>
                                    </Box>
                                    <Box display='table-row' mt={0.5}>
                                        <Typography sx={stylesTitle}>Địa chỉ:</Typography>
                                        <Typography sx={stylesTableCell}>{order.address.addressString}</Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                        {(order.status === 'delivery' || order.status === 'success') && (
                            <Grid xs={6}>
                                <Paper elevation={3} sx={{ p: 2, backgroundImage: 'none', height: '100%' }}>
                                    <Typography color='text.secondary' textTransform='uppercase'>
                                        Nhân viên vận chuyển
                                    </Typography>
                                    <Divider sx={{ my: 1 }} />
                                    <Box display='table'>
                                        <Box display='table-row'>
                                            <Typography sx={stylesTitle}>Nhân viên:</Typography>
                                            <Typography sx={stylesTableCell}>{order.shipper.name}</Typography>
                                        </Box>
                                        <Box display='table-row'>
                                            <Typography sx={stylesTitle}>Chức vụ:</Typography>
                                            <Typography sx={stylesTableCell}>
                                                {ROLE_OPTION.find(e => e.value === order.shipper.role).label}
                                            </Typography>
                                        </Box>
                                        <Box display='table-row'>
                                            <Typography sx={stylesTitle}>Điện thoại:</Typography>
                                            <Typography sx={stylesTableCell}>{order.shipper.phone}</Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                    <Paper elevation={3} sx={{ p: 2, mt: 2, backgroundImage: 'none' }}>
                        <Typography color='text.secondary' textTransform='uppercase'>
                            Hành trình vận chuyển
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Box>
                        <Stepper
                                activeStep={0}
                                orientation="vertical"
                                connector={<ReadOnlyStepConnector />}
                                sx={{ px: 2, mb: 2 }}
                            >
                                {order.itinerary.map((step, idx) => (
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
                    <Paper elevation={3} sx={{ p: 2, mt: 2, backgroundImage: 'none' }}>
                        <Typography color='text.secondary' textTransform='uppercase'>
                            Danh sách sản phẩm
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Box>
                            {order.products.map((product, i) => (
                                <OrderDetailItem key={i} data={product} status={order.status} />
                            ))}
                        </Box>
                        <Divider sx={{ mt: 1, mb: 2 }} />
                        <Grid container xsOffset={6} alignItems='flex-end'>
                            <Grid xs={6} color='text.secondary' mt={0.5}>Số lượng</Grid>
                            <Grid xs={6} textAlign='end' mt={0.5}>{totalCount(order.products)} sản phẩm</Grid>
                            <Grid xs={6} color='text.secondary' mt={0.5}>Tổng tiền hàng</Grid>
                            <Grid xs={6} textAlign='end' mt={0.5}>{formatMoney(totalInitialPrice(order.products))}</Grid>
                            <Grid xs={6} color='text.secondary' mt={0.5}>Giảm giá sản phẩm</Grid>
                            <Grid xs={6} textAlign='end' mt={0.5}>
                                <Box sx={negativeNumber} display='inline-block'>
                                    {formatMoney(totalAmountDiscount(order.products))}
                                </Box>
                            </Grid>
                            <Grid xs={6} color='text.secondary' mt={0.5}>Phí vận chuyển</Grid>
                            <Grid xs={6} textAlign='end' mt={0.5}>{formatMoney(order.shippingFee)}</Grid>  
                            <Grid xs={12} mt={1}><Divider /></Grid>   
                            <Grid xs={6} color='text.secondary' mt={0.5} lineHeight={1.75}>Tổng cộng (Bao gồm VAT)</Grid>
                            <Grid xs={6} textAlign='end' mt={0.5} fontWeight={600} fontSize={20} color='text.error'>
                                {formatMoney(order.total)}
                            </Grid>     
                        </Grid>
                        <Box className='content-right-center' mt={2}>
                            {order.status === 'new' && (
                                <>
                                    <Button
                                        variant='contained' size='large' color='btnError' sx={{ mr: 2 }}
                                        onClick={handleCancelOrderByAdmin}
                                    >
                                        Hủy đơn hàng
                                    </Button>
                                    <Button
                                        variant='contained' size='large' color='btnSuccess'
                                        onClick={() => selectShipperRef.current.onShowDialog()}
                                    >
                                        Xác nhận đơn hàng
                                    </Button>
                                </>
                            )}
                            {( order.status === 'delivery' 
                                    && !!order.successProof 
                                    && checkTimeoutLastUpdateItinerary()
                            ) && (
                                <Button
                                    variant='contained' size='large' color='btnSuccess'
                                    onClick={handleConfirmCompleted}
                                >
                                    Hoàn tất đơn hàng
                                </Button>
                            )}
                        </Box>
                    </Paper>
                </>
            )}

            <SelectShipper 
                ref={selectShipperRef} 
                onSelected={handleComfirmOrder}
            />
        </>
    );
}

export default OrderDetail;