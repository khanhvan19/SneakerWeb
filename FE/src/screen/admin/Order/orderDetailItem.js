import { Box, Typography } from "@mui/material";
import { SquareBlock } from "assets/styles/constantsStyle";
import { Link } from "react-router-dom";
import { discountPrice } from "utils";
import { formatMoney } from "utils/formatters";

function OrderDetailItem({ data }) {
    
    return (
        <Box display="flex" my={1} alignItems='center'>
            <Box
                flex={3} display='flex'
                component={Link} to={`/product/detail/${data._id._id}/${data.version._id}`}
            >
                <SquareBlock w={80} mr={1.5}>
                    <img src={data.version.images[0].link} alt="" />
                </SquareBlock>
                <Box>
                    <Typography textTransform='uppercase'>{data._id.name}</Typography>
                    <Box>
                        <Typography variant='body2' component='span' color='text.secondary'>Màu sắc: </Typography>
                        <Typography variant='body2' component='span'>{data.version.name}</Typography>
                        <Typography component='span' mx={1}>/</Typography>
                        <Typography variant='body2' component='span' color='text.secondary'>Size: </Typography>
                        <Typography variant='body2' component='span'>{data.size} EU</Typography>
                    </Box>
                </Box>
            </Box>
            <Box flex={2} display='flex' justifyContent='space-between'> 
                <Box>
                    <Box color='text.secondary' mr={1} component='span'>số lượng:</Box> 
                    {data.quantity}
                </Box>
                <Box display='flex' alignItems='center'>
                    {data.discount && (
                        <Typography
                            mr={1} variant='body2' color='text.secondary'
                            sx={{ textDecoration: 'line-through' }}
                        >
                            {formatMoney(data.price)}
                        </Typography>
                    )}
                    <Typography fontWeight={500}>
                        {formatMoney(discountPrice(data.price, data.discount))}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

export default OrderDetailItem;