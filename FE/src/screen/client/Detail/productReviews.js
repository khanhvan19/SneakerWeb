import { Avatar, Box, Button, Divider, Pagination, PaginationItem, Rating, Slider, Typography } from "@mui/material";
import AccordionFilter from "../Product/Fitler/accordionFilter";
import Grid from '@mui/material/Unstable_Grid2';
import { Fragment, useEffect, useState } from "react";
import axiosPublic from "utils/axiosPublic";
import { formatLocalDateTime } from "utils/formatters";
import { SquareBlock } from "assets/styles/constantsStyle";
import { FilterAltOutlined, StarBorderOutlined } from "@mui/icons-material";

const styleReadOnlyStarSlider = {
    height: 8, p: 0,
    '& .MuiSlider-rail': { bgcolor: 'text.disabled' },
    '& .MuiSlider-track': { borderWidth: 0, bgcolor: '#faaf00' },
    '& .MuiSlider-thumb': { height: 0, width: 0 },
}

function ProductReviews({ productId, version }) {
    const [total, setTotal] = useState(0)
    const [totalByLevels, setTotalByLevels] = useState([])
    const [reviews, setReviews] = useState([]);
    const [pagination, setPagination] = useState()
    const [params, setParams] = useState({ page: 1, limit: 5, star: [] })

    const FILTER_RATING = [
        {value: 'content_', label: 'Có bình luận', endIcon: false},
        {value: 'images_', label: 'Có hình ảnh', endIcon: false},
        {value: 'star_5', label: 'Đánh giá 5', endIcon: true},
        {value: 'star_4', label: 'Đánh giá 4', endIcon: true},
        {value: 'star_3', label: 'Đánh giá 3', endIcon: true},
        {value: 'star_2', label: 'Đánh giá 2', endIcon: true},
        {value: 'star_1', label: 'Đánh giá 1', endIcon: true},
    ]

    var totalPages = Math.ceil(pagination?.total / pagination?.limit);

    useEffect(() => {
        axiosPublic
            .get(`/review/product/${productId}`)
            .then((res) => {
                setTotalByLevels(res.totalByLevels)
                setTotal(res.total);
            })
    }, [productId])

    useEffect(() => {
        axiosPublic
            .post(`/review/product/${productId}`, params)
            .then((res) => {
                setReviews(res.data);
                setPagination(res.pagination);
            })
            .catch((err) => console.log(err))
    }, [params, productId])

    const handlePageChange = (e, newValue) => {
        const filter = { ...params, page: newValue }
        setParams(filter)
    };

    const handleFilterChange = (value) => {
        const cond = value.split('_');
        const keyParams = Object.keys(params)
        if(cond[0] !== 'star') {
            if(keyParams.includes(cond[0])) {
                var newFilter = {...params}
                delete newFilter[cond[0]]
                setParams(newFilter);
            } else {
                setParams({ ...params, [cond[0]]: true })
            }
        } else {
            const starCond = parseInt(cond[1])
            if(params.star.includes(starCond)) {
                const starParam = params.star.filter(e => e !== starCond)
                setParams({ ...params, star: starParam });
            } else {
                const current = params.star;
                current.push(starCond)
                setParams({ ...params, star: current });
            }
        }
    }

    const checkSelectedFilter = (value) => {
        const cond = value.split('_');
        const keyParams = Object.keys(params)
        if(cond[0] !== 'star') {
            if(keyParams.includes(cond[0])) return true;
        } else {
            if(params.star.includes(parseInt(cond[1]))) return true;
        }
        return false;
    }

    return (
        <Box mt={4} borderTop='1px solid' borderColor='divider'>
            <AccordionFilter summary={<Box py={1}>Mô tả chi tiết</Box>}>
                <Box
                    pt={2} pl={2}
                    dangerouslySetInnerHTML={{ __html: version?.product?.description }}
                />
            </AccordionFilter>
            <AccordionFilter
                summary={
                    <Box className="content-center-between" pr={1} py={1}>
                        {`Đánh giá [${total}]`}
                        <Box className="content-center">
                            <Box sx={{ mr: 1 }}>{version?.product?.star}</Box>
                            <Rating readOnly value={version?.product?.star || 0} precision={0.1} size="small" />
                        </Box>
                    </Box>
                }
            >
                <Grid container spacing={2} mt={1}>
                    <Grid xs={4}>
                        <Box className='content-center-between'>
                            <Box>
                                <Typography component='span' fontSize={48}>{version?.product?.star || 0}</Typography>
                                <Typography component='span' color='text.secondary' fontSize={32}>/5</Typography>
                            </Box>
                            <Box>
                                <Rating readOnly value={version?.product?.star || 0} precision={0.1} size='large' />
                                <Box pl={0.25}>{total} đánh giá</Box>
                            </Box>
                        </Box>
                        <Box mt={3}>
                            {totalByLevels.map((level, idx) => (
                                <Box className='content-left-center' mb={1} key={idx}>
                                    <Rating readOnly value={level._id} precision={1} size='small' sx={{ mr: 1 }} />
                                    <Slider value={level.count} max={total} sx={styleReadOnlyStarSlider} />
                                    {console.log(level.count)}
                                    <Typography variant='caption' fontWeight={500} ml={1}>{level.count}</Typography>
                                </Box>
                            ))}
                        </Box>
                        {(total > 0) && (
                            <Box mt={4}>
                                <Typography fontWeight={500} mb={1.5} className='content-left-center'>
                                    <FilterAltOutlined fontSize="small" sx={{ mr: 0.25 }} />
                                    Lọc đánh giá theo:
                                </Typography>
                                <Grid container spacing={1}>
                                    {FILTER_RATING.map((item, idx) => (
                                        <Grid xs={6} key={idx}>
                                            <Button 
                                                fullWidth size="small" color="btnDark"
                                                variant={checkSelectedFilter(item.value) ? 'contained' : 'outlined'}
                                                endIcon={(item.endIcon) ? <StarBorderOutlined /> : null}
                                                sx={{ lineHeight: 1.5, borderRadius: 0, '& .MuiButton-endIcon': { ml: 0.25 } }}
                                                onClick={() => handleFilterChange(item.value)}
                                            >
                                                {item.label}
                                            </Button>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )}
                    </Grid>
                    <Grid xs={8} display='flex' flexDirection='column'>
                        <Box>
                            <Grid container spacing={2} flexDirection='column'>
                                {reviews.length !== 0 && reviews.map((review, idx) => (
                                    <Fragment key={idx}>
                                        <Grid xs={12} px={2}>
                                            <Box display='flex' alignItems='flex-start'>
                                                <Avatar
                                                    src={review.customer?.avatar?.link || "/"}
                                                    alt={review.customer.name}
                                                />
                                                <Box flex={1} ml={1.5}>
                                                    <Typography py={1} fontWeight={600}>{review.customer.name}</Typography>
                                                    <Box display='flex' alignItems='flex-end'>
                                                        <Rating readOnly value={review.rating} precision={1} size="small" />
                                                        <Typography variant="caption" ml={2} mb={0.125} lineHeight={1}>
                                                            {formatLocalDateTime(review.createdAt)}
                                                        </Typography>
                                                    </Box>
                                                    {review.content && <Typography variant="body2" mt={1}>{review.content}</Typography>}
                                                    {review.images.length !== 0 && (
                                                        <Box display='flex' mt={1}>
                                                            {review.images.map((image, i) => (
                                                                <SquareBlock w={72} mr={1} key={i}>
                                                                    <img src={image.link} alt='' />
                                                                </SquareBlock>
                                                            ))}
                                                        </Box>
                                                    )}
                                                    <Typography variant="body2" color='text.secondary' mt={1}>
                                                        Phiên bản màu: {review.version.name}, Size: {review.size}.
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                        {(idx !== reviews.length - 1) && (<Divider sx={{ ml: 2 }} />)}
                                    </Fragment>
                                ))}
                            </Grid>
                        </Box>
                        <Box className='content-right-center' pt={2} marginTop='auto'>
                            {(pagination && totalPages > 1) && (
                                <Pagination
                                    size="small" color="btnDark"
                                    count={totalPages} page={pagination.page}
                                    onChange={handlePageChange}
                                    renderItem={(item) => (
                                        <PaginationItem
                                            {...item}
                                            shape='rounded'
                                            sx={{ borderRadius: 'unset' }}
                                        />
                                    )}
                                />
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </AccordionFilter>
        </Box>
    );
}

export default ProductReviews;