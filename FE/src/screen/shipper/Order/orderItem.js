import { LocalAtmTwoTone, LocalShippingTwoTone, ReceiptLongTwoTone } from "@mui/icons-material";
import { Box, Divider, Paper, Typography } from "@mui/material";
import { PAYMENT_METHOD } from "constants/optionSelectField";
import { renderOrderStatus } from "utils";
import { totalCount } from "utils/calculateMoney";
import { formatLocalDate, formatMoney } from "utils/formatters";

function OrderItem({ data }) {
    var paymentLogo = PAYMENT_METHOD.find(e => e.value === data.paymentMethod).logo;

    return (  
        <Paper elevation={1} sx={{ p: 1 }}>
            <Box className='content-center-between'>
                <Box component='img' src={paymentLogo} alt="" height={32} />
                {renderOrderStatus(data.status)}
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box display='flex' alignItems='flex-start' my={0.75}>
                <ReceiptLongTwoTone sx={{ mr: 1.5, fontSize: '1.75rem' }} />
                <Box>
                    <Typography textTransform='uppercase'>{data._id}</Typography>
                    <Typography variant="body2">
                        Dự kiến giao hàng {formatLocalDate(new Date(data.estimatedTime))}
                    </Typography>
                </Box>
            </Box>
            <Box className='content-left-center' my={0.75}>
                <LocalAtmTwoTone sx={{ mr: 1.5, fontSize: '1.75rem' }} />
                <Box display='flex'>
                    <Typography>{totalCount(data.products)} sản phẩm</Typography>
                    <Typography mx={1}> - </Typography>
                    <Typography fontWeight={600} color='text.error'>
                        {formatMoney(data.paymentMethod === 'cod' ? data.total : 0)}
                    </Typography>
                    {data.paymentMethod !== 'cod' && (
                        <Typography ml={1}>(đã thanh toán)</Typography>
                    )}
                </Box>
            </Box>
            <Box display='flex' alignItems='flex-start'  my={0.75}>
                <LocalShippingTwoTone sx={{ mr: 1.5, fontSize: '1.75rem' }} />
                <Box>
                    <Box className='content-left-center'>
                        <Typography fontWeight={600}>
                            {data.address.name} - {data.address.phone}
                        </Typography>
                    </Box>
                    <Typography fontSize={15}>{data.address.addressString}</Typography>
                </Box>
            </Box>
        </Paper>
    );
}

export default OrderItem;