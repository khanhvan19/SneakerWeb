import { DeleteOutlined } from "@mui/icons-material";
import { Box, Chip, IconButton, Typography } from "@mui/material";
import { SquareBlock } from "assets/styles/constantsStyle";
import { Link } from "react-router-dom";
import { discountPrice } from "utils";
import { formatMoney } from "utils/formatters";

function SoldoutItem({ data, onDelete }) {
    var basicInfo = {
        product: data._id._id,
        version: data.version._id,
        size: data.size,
    }

    return (  
        <Box display="flex" my={1} alignItems='center'>
            <Box 
                flex={3} display='flex'
                component={Link} to={`/product/detail/${data?._id?._id}/${data?.version?._id}`}
            >
                <SquareBlock w={100}>
                    <img src={data.version.images[0].link} alt="" />
                </SquareBlock>
                <Box ml={2}>
                    <Typography variant="h6" textTransform='uppercase'>{data._id.name}</Typography>
                    <Box>
                        <Typography fontSize={15} component='span' color='text.secondary'>Màu sắc: </Typography>
                        <Typography fontSize={15} component='span'>{data.version.name}</Typography>
                        <Typography component='span' mx={1}>/</Typography>
                        <Typography fontSize={15} component='span' color='text.secondary'>Size: </Typography>
                        <Typography fontSize={15} component='span'>{data.size} EU</Typography>
                    </Box>
                    <Typography fontSize={15} fontWeight={500} mt={1}>
                        {data.quantity}
                        <Box px={0.5} component='span'>x</Box>
                        {formatMoney(discountPrice(data._id.price, data._id.discount))}
                    </Typography>
                </Box>
            </Box>
            <Box flex={2} display='flex' justifyContent='space-between'>
                <Chip 
                    label="Hết hàng" 
                    color="chipError" 
                    sx={{
                        fontWeight: 600,
                        borderRadius: 'unset', 
                    }} 
                />
                <Box>
                    <Typography fontWeight={700}>
                        {formatMoney(discountPrice(data._id.price, data._id.discount) * data.quantity)}
                    </Typography>
                    {data._id.discount && (
                        <Typography 
                            variant='body2' color='text.secondary'
                            sx={{ textDecoration: 'line-through' }} 
                        >
                            {formatMoney(data._id.price * data.quantity)}
                        </Typography>
                    )}
                </Box>
                <Box>
                    <IconButton color="btnError" onClick={() => onDelete(basicInfo)}>
                        <DeleteOutlined />
                    </IconButton>
                </Box>
            </Box>    
        </Box>
    );
}

export default SoldoutItem;