import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { formatMoney } from "utils/formatters";

import styles from './Card.module.scss'
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import { SquareBlock } from "assets/styles/constantsStyle";
const cx = classNames.bind(styles);

function ProductCard({data}) {
    const [hover, setHover] = useState(0);
    const [isHover, setIsHover] = useState(false);
    const numHoverList = 4;

    return ( 
        <Box 
            component={Link}
            to={`/product/detail/${data?.products[hover]?._id}`}
            className={cx('product-card-container')}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            display='flex' flexDirection='column' height='100%'
        >   
            <SquareBlock w='100%'>
                <img src={data?.products[hover]?.images[0]?.link} alt='' />
            </SquareBlock>
            {(isHover === false || data?.products?.length <= 1) && ( 
                <>  
                    <Box mt={1.5}>
                        {data?.gender?.map((item, idx) => (
                            <Typography 
                                key={idx} 
                                variant='body2' component='i' 
                                color='text.accent'
                            >
                                {item}
                                {(idx !== data?.gender?.length - 1) && (
                                    <Box component='span' px={0.5}>•</Box>
                                )} 
                            </Typography>
                        ))}
                    </Box>
                    <Typography 
                        color='text.primary' 
                        textTransform='uppercase' 
                        className="text-eclipse two-line"
                    >
                        {data.name}
                    </Typography>
                    <Typography color='text.secondary'>
                        {data?.brand?.name}
                    </Typography>
                    <Typography pt={0.5} variant='body2' color='text.secondary'>
                        {data?.products?.length} màu sắc
                    </Typography>
                    <Typography fontWeight={600} marginTop='auto' py={2}>
                        {formatMoney(data?.products[hover]?.price)}
                    </Typography>
                </>
            )}

            {(isHover === true && data?.products?.length > 1) && (
                <>
                    <Box display="flex" py={0.5}>
                        {data?.products?.slice(0, numHoverList).map((product, idx) => (
                            <SquareBlock 
                                key={idx} w={64} mr={0.5} 
                                onMouseOver={() => setHover(idx)}
                                sx={{
                                    borderBottom: '2px solid',
                                    borderColor: (hover === idx) ? 'text.primary' : 'transparent'
                                }}
                            >
                                <img src={product?.images[0].link} alt="" />
                            </SquareBlock>
                        ))}
                        {(data?.products?.length > numHoverList) && (
                            <Typography className='content-center' fontSize='20px' pl={1}>
                                +{data?.products?.length - numHoverList}
                            </Typography>
                        )}
                    </Box>
                    <Typography pt={0.5} variant='body2' color='text.secondary'>
                        {data?.products?.length} màu sắc
                    </Typography>
                    <Typography fontWeight={600} marginTop='auto' py={2}>
                        {formatMoney(data?.products[hover]?.price)}
                    </Typography>
                </>
            )}
        </Box>
    );
}

export default ProductCard;