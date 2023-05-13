import { ContentCopyOutlined, FmdGoodOutlined, Inventory2Outlined, LocalShippingOutlined, PaymentOutlined, ReceiptLongOutlined } from "@mui/icons-material";
import { Box, Divider, IconButton, Paper, Typography } from "@mui/material";
import { renderOrderStatus } from "utils";
import { formatLocalDateTime, formatMoney } from "utils/formatters";
import OrderDetailItem from "./orderDetailItem";
import { totalAmountDiscount, totalCount, totalInitialPrice } from "utils/calculateMoney";
import { negativeNumber } from "assets/styles/constantsStyle";
import { PAYMENT_METHOD } from "constants/optionSelectField";
import CustomSnackbar from "components/ui/Alert/snackbar";
import { useRef } from "react";

function OrderDetailInfo({ order }) {
    const snackbarRef = useRef()
    const paymentMethod = PAYMENT_METHOD.find(e => e.value === order?.paymentMethod)
    
    const handleCopyPhone = () => {
        navigator.clipboard.writeText(order.address.phone)
        snackbarRef.current.onShowSnackbar();
    }

    return (  
        <>
            <Paper sx={{ px: 1.5, py: 1, mx: -1.5, mb: 1.5, borderRadius: 0 }}>
                <Box display='flex' alignItems='flex-start' my={0.75}>
                    <ReceiptLongOutlined sx={{ mr: 1 }} />
                    <Box>
                        <Typography fontWeight={600} textTransform='uppercase' mb={0.5}>
                            Mã ĐH: {order._id}
                        </Typography>
                        <Typography variant='body2' color='text.secondary' mb={0.75}>
                            Ngày đặt hàng: {formatLocalDateTime(order.createdAt)}
                        </Typography>
                        {renderOrderStatus(order.status)}
                    </Box>
                </Box>
            </Paper>
            <Paper sx={{ p: 1.5, mx: -1.5, mb: 1.5, borderRadius: 0 }}>
                <Box display='flex' alignItems='flex-start' position='relative'>
                    <FmdGoodOutlined sx={{ mr: 1 }} />
                    <Box>
                        <Typography fontWeight={600} mb={0.5}>Địa chỉ giao hàng</Typography>
                        <Typography mb={0.5}>{order.address.name} - {order.address.phone}</Typography>
                        <Typography color='text.secondary' mb={0.75}>
                            {order.address.addressString}
                        </Typography>
                    </Box>
                    <IconButton
                        size='small' edge='end'
                        sx={{ position: 'absolute', top: 0, right: 0 }}
                        onClick={handleCopyPhone}
                    >
                        <ContentCopyOutlined />
                    </IconButton>
                </Box>
            </Paper>
            <Paper sx={{ p: 1.5, mx: -1.5, mb: 1.5, borderRadius: 0 }}>
                <Box display='flex' alignItems='flex-start' mb={1}>
                    <Inventory2Outlined sx={{ mr: 1 }} />
                    <Typography fontWeight={600}>Danh sách sản phẩm</Typography>
                </Box>
                <Box>
                    {order.products.map((product, idx) => (
                        <Box key={idx}>
                            <OrderDetailItem data={product} />
                            {idx !== order.products.length - 1 && <Divider sx={{ my: 1 }} />}
                        </Box>
                    ))}
                </Box>
            </Paper>
            <Paper sx={{ p: 1.5, mx: -1.5, mb: 1.5, borderRadius: 0 }}>
                <Box display='flex' alignItems='flex-start'>
                    <LocalShippingOutlined sx={{ mr: 1 }} />
                    <Box>
                        <Typography fontWeight={600} mb={0.5}>Hình thức giao hàng</Typography>
                        <Typography>{order.deliveryMethod}</Typography>
                    </Box>
                </Box>
            </Paper>
            <Paper sx={{ p: 1.5, mx: -1.5, mb: 1.5, borderRadius: 0 }}>
                <Box display='flex' alignItems='flex-start'>
                    <PaymentOutlined sx={{ mr: 1 }} />
                    <Box>
                        <Typography fontWeight={600} mb={1}>Phương thức thanh toán</Typography>
                        <Box className='content-left-center'>
                            <Box component='img' src={paymentMethod.logo} alt='' height={24} />
                            <Typography ml={1}>{paymentMethod.label}</Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper>
            <Paper sx={{ p: 1.5, mx: -1.5, mb: 1.5, borderRadius: 0 }}>
                <Box className='content-center-between' mb={0.5}>
                    <Typography color='text.secondary'>Số lượng</Typography>
                    <Typography fontWeight={500}>{totalCount(order.products)} sản phẩm</Typography>
                </Box>
                <Box className='content-center-between' mb={0.5}>
                    <Typography color='text.secondary'>Tổng tiền hàng</Typography>
                    <Typography fontWeight={500}>{formatMoney(totalInitialPrice(order.products))}</Typography>
                </Box>
                <Box className='content-center-between' mb={0.5}>
                    <Typography color='text.secondary'>Giảm giá sản phẩm</Typography>
                    <Typography fontWeight={500} sx={negativeNumber}>{formatMoney(totalAmountDiscount(order.products))}</Typography>
                </Box>
                <Box className='content-center-between' mb={0.5}>
                    <Typography color='text.secondary'>Phí vận chuyển</Typography>
                    <Typography fontWeight={500}>{formatMoney(order.shippingFee)}</Typography>
                </Box>
                <Divider sx={{ my: 0.5 }} />
                <Box display='flex' justifyContent='space-between' alignItems='flex-end'>
                    <Typography>Thành tiền</Typography>
                    <Typography fontSize={18} fontWeight={600} color='text.error'>
                        {formatMoney(order.total)}
                    </Typography>
                </Box>
                <Typography variant='body2' textAlign='end'>
                    Đã bao gồm VAT (nếu có)
                </Typography>
            </Paper>

            <CustomSnackbar
                ref={snackbarRef}
                message='Đã sao chép vào Clipboard!'
                alertType='success'
            />
        </>
    );
}

export default OrderDetailInfo;