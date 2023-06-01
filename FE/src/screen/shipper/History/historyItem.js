import { PaidOutlined, ReceiptLongOutlined, WhereToVoteOutlined } from "@mui/icons-material";
import { Box, Divider, Paper, Typography } from "@mui/material";
import { PAYMENT_METHOD } from "constants/optionSelectField";
import { renderOrderStatus } from "utils";
import { formatLocalDateTime, formatMoney } from "utils/formatters";

function HistoryItem({ data }) {
    var paymentLogo = PAYMENT_METHOD.find(e => e.value === data.paymentMethod).logo;

    return (  
        <Paper elevation={1} sx={{ p: 1 }}>
            <Box className='content-center-between'>
                <Box component='img' src={paymentLogo} alt="" height={32} />
                {renderOrderStatus(data.status)}
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box display='flex' alignItems='flex-start' my={0.5}>
                <ReceiptLongOutlined sx={{ mr: 1.5 }} />
                <Typography textTransform='uppercase' fontWeight={500}>{data._id}</Typography>
            </Box>
            <Box display='flex' alignItems='flex-start'  my={0.5}>
                <WhereToVoteOutlined sx={{ mr: 1.5 }} />
                <Box className='content-left-center'>
                    <Typography>
                        {data.address.name} - {data.address.phone}
                    </Typography>
                </Box>
            </Box>
            <Box className='content-left-center' my={0.5}>
                <PaidOutlined sx={{ mr: 1.5 }} />
                <Box className='content-left-center'>
                    <Typography mr={1} color='text.secondary'>Đã thu:</Typography>
                    <Typography color='text.error'>
                        {formatMoney(data.paymentMethod === 'cod' ? data.total : 0)}
                    </Typography>
                </Box>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Typography color='text.success'>
                Đã giao thành công lúc {formatLocalDateTime(data.itinerary.slice(-1)[0].time)}
            </Typography>
        </Paper>
    );
}

export default HistoryItem;