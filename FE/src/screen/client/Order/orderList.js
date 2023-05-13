import { Box, Button, Paper, Tab, Tabs, Typography } from "@mui/material";
import { CLIENT_CANCEL_ORDER_REASON, STATUS_ORDER } from "constants/optionSelectField";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosClientPrivate from "utils/axiosClientPrivate";
import { formatMoney } from "utils/formatters";
import OrderItem from "./orderItem";
import { toast } from "react-toastify";
import { TOAST_CENTER_STYLE } from "assets/styles/constantsStyle";
import { Link } from "react-router-dom";
import { renderOrderStatus } from "utils";
import Swal from "sweetalert2";

function OrderList() {
    const isLogin = useSelector((state) => state.client?.login?.data);
    const [statusTab, setStatusTab] = useState('');
    const [orders, setOrders] = useState([]);
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        axiosClientPrivate
            .get('/order/customer', {
                params: { customer: isLogin?._id },
                headers: { token: isLogin?.accessToken }
            })
            .then((res) => setOrders(res))
            .catch((err) => console.log(err))
    }, [refresh, isLogin])

    const handleCancelOrder = (id) => {
        Swal.fire({
            title: 'Bạn muốn hủy đơn hàng này?',
            text: 'Vui lòng cho biết lý do bạn muốn hủy:',
            input: 'radio',
            inputOptions: CLIENT_CANCEL_ORDER_REASON,
            showCancelButton: true,
            cancelButtonText: "Không phải bây giờ",
            confirmButtonText: "Hủy đơn hàng",
            confirmButtonColor: '#ff5630',
            reverseButtons: true,
            inputValidator: (value) => {
                return new Promise((resolve) => {
                    if (value) resolve();
                    else resolve('Vui lòng cho biết lý do!')
                })
            }
        }).then((result) => {
            if (result.isConfirmed) {
                axiosClientPrivate
                    .put(`/order/cancel/${id}`,
                        {
                            reason: CLIENT_CANCEL_ORDER_REASON[result.value],
                            partian: 'Khách hàng',
                        },
                        { headers: { token: isLogin?.accessToken } }
                    )
                    .then((res) => {
                        toast.warn(res.message, TOAST_CENTER_STYLE)
                        setRefresh(prev => prev + 1);
                    })
                    .catch((err) => console.log(err))
            }
        })
    }

    const handleConfirmCompleted = (id) => {
        Swal.fire({
            icon: 'success',
            title: 'Xác nhận đã nhận hàng!',
            text: 'Bạn đã nhận được kiện hàng và đồng ý thanh toán tiền mua hàng cho THE SNEAK?',
            confirmButtonText: "Đã nhận hàng",
            confirmButtonColor: '#00ab55',
        }).then((result) => {
            if (result.isConfirmed) {
                axiosClientPrivate
                    .put(`/order/success/${id}`, {})
                    .then((res) => {
                        setRefresh(prev => prev + 1);
                    })
                    .catch((err) => console.log(err))
            }
        })
    }

    const filterOrderByStatus = () => {
        if (statusTab !== '') {
            return orders.filter(order => order.status === statusTab);
        }
        return orders;
    }

    return (
        <Box flex={1}>
            <Typography variant='h5' mb={2}>Quản lý đơn hàng</Typography>
            <Paper elevation={2} sx={{ borderRadius: 0, mb: 1.5 }}>
                <Tabs
                    value={statusTab}
                    onChange={(e, value) => setStatusTab(value)}
                    variant='fullWidth'
                    textColor="inherit"
                    TabIndicatorProps={{
                        sx: {
                            height: 4,
                            bgcolor: 'text.primary',
                        }
                    }}
                >
                    {STATUS_ORDER.map((item, idx) => (
                        <Tab
                            key={idx}
                            value={item.value} label={item.label}
                            sx={{ fontSize: 16, fontWeight: 600 }}
                        />
                    ))}
                </Tabs>
            </Paper>
            {orders.length !== 0 && filterOrderByStatus().map((order, idx) => (
                <Paper elevation={2} sx={{ borderRadius: 0, px: 2, mb: 1.5 }} key={idx}>
                    <Box
                        pt={1.5} pb={1}
                        sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
                    >
                        {renderOrderStatus(order.status, 'small')}
                    </Box>
                    <Box>
                        {order.products.map((product, i) => (
                            <OrderItem  key={i}  data={product} />
                        ))}
                    </Box>
                    <Box pt={0.5} pb={1.5} sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                        <Box className='content-right-center'>
                            <Typography color='text.secondary' fontSize={16} mr={1}>Giá trị đơn hàng:</Typography>
                            <Typography color='text.error' fontWeight={600} fontSize={19}>
                                {formatMoney(order.total)}
                            </Typography>
                        </Box>
                        <Box mt={1} display='flex' justifyContent='flex-end'>
                            {(order.status === 'new') && (
                                <Button
                                    variant='contained' color='btnError' disableElevation
                                    sx={{ mr: 1, borderRadius: 0, lineHeight: 1.5 }}
                                    onClick={() => handleCancelOrder(order._id)}
                                >
                                    Hủy đơn
                                </Button>
                            )}
                            {(order.status === 'delivery' && !!order.successProof) && (
                                <Button
                                    variant='contained' color='btnSuccess' disableElevation
                                    sx={{ mr: 1, borderRadius: 0, lineHeight: 1.5 }}
                                    onClick={() => handleConfirmCompleted(order._id)}
                                >
                                    Đã nhận hàng
                                </Button>
                            )}
                            <Button
                                component={Link} to={`/order/${order._id}`}
                                variant='outlined' color='btnDark'
                                sx={{ borderRadius: 0, lineHeight: 1.5 }}
                            >
                                {(order.status === 'cancel') ? 'Chi tiết đơn hủy' : 'Xem chi tiết'}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            ))}

        </Box>
    );
}

export default OrderList;