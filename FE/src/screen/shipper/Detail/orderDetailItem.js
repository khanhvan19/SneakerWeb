import { Box, Typography } from "@mui/material";
import { SquareBlock } from "assets/styles/constantsStyle";
import { discountPrice } from "utils";
import { formatMoney } from "utils/formatters";

function OrderDetailItem({ data }) {
    return (  
        <Box display='flex'>
            <SquareBlock w={70}>
                <img src={data.version.images[0].link} alt="" />
            </SquareBlock>
            <Box ml={2} display='flex' flexDirection='column'>
                <Typography textTransform='uppercase'>{data._id.name}</Typography>
                <Typography 
                    variant='body2' component='div' 
                    className='content-left-center' lineHeight={1.25}
                >
                    <Box color='text.secondary'>Màu sắc: </Box>
                    <Box ml={0.5}>{data.version.name}</Box>
                    <Box mx={1}>/</Box>
                    <Box color='text.secondary'>Size: </Box>
                    <Box ml={0.5}>{data.size} EU</Box>
                </Typography>
                <Typography fontSize={15} fontWeight={500} mt='auto'>
                    {data.quantity} sản phẩm
                    <Box px={0.5} component='span'>x</Box>
                    {formatMoney(discountPrice(data?.price, data?.discount))}
                </Typography>
            </Box>
        </Box>
    );
}

export default OrderDetailItem;