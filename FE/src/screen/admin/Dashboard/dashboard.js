import { AddBusinessOutlined, CategoryOutlined, CreditScoreOutlined, FaceRetouchingNaturalOutlined, HourglassFullTwoTone, InsightsOutlined, Inventory2TwoTone, LocalFireDepartmentOutlined, PaidTwoTone, PeopleAltTwoTone, PersonAddAltOutlined, ReceiptLongTwoTone, ShoppingCartCheckoutOutlined, WorkspacePremiumTwoTone, } from '@mui/icons-material';
import { Avatar, Box, Chip, Divider, Paper, Rating, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Fragment, useEffect, useState } from 'react';
import axiosPrivate from 'utils/axiosPrivate';
import { formatMoney } from 'utils/formatters';
import moment from 'moment/moment';
import PieChart from './pieChart';
import TwoBarChar from './twoBarChart';
import { SquareBlock } from 'assets/styles/constantsStyle';
import { discountPrice } from 'utils';

const renderRankingOrder = (index) => {
    switch (index) {
        case 1:
            return (
                <Box color='#ffd700'><WorkspacePremiumTwoTone /></Box>
            );
        case 2:
            return (
                <Box color='#e5e4e2'><WorkspacePremiumTwoTone /></Box>
            );
        case 3:
            return (
                <Box color='#b87333'><WorkspacePremiumTwoTone /></Box>
            );
        default:
            return (
                <Typography variant='h6' px={0.875} color='text.secondary'>{index}</Typography>
            );
    }
}

function Dashboard() {
    const [productCount, setProductCount] = useState()
    const [customerCount, setCustomerCount] = useState()
    const [orderCount, setOrderCount] = useState()
    const [revenueOrder, setRevenueOrder] = useState()
    const [productByBrand, setProductByBrand] = useState([])
    const [statisticImport, setStatisticImport] = useState([])
    const [statisticOrder, setStatisticOrder] = useState([])
    const [potentialCustomer, setPotentialCustomer] = useState([])
    const [bestSeller, setBestSeller] = useState([])

    useEffect(() => {
        axiosPrivate
            .get("/dashboard/product-count")
            .then((res) => setProductCount(res))
            .catch((err) => console.log(err))

        axiosPrivate
            .get("/dashboard/customer-count")
            .then((res) => setCustomerCount(res))
            .catch((err) => console.log(err))

        axiosPrivate
            .get("/dashboard/order-count")
            .then((res) => {
                setOrderCount(res.count);
                setRevenueOrder({
                    revenue: res.revenue || 0,
                    waitRevenue: res.waitRevenue || 0
                });
            })
            .catch((err) => console.log(err))

        axiosPrivate
            .get("/dashboard/product-by-brand")
            .then((res) => setProductByBrand(res))
            .catch((err) => console.log(err))

        axiosPrivate
            .get('/dashboard/statistic-import')
            .then((res) => setStatisticImport(res))
            .catch((err) => console.log(err))

        axiosPrivate
            .post('/dashboard/order-by-date', {
                start: startDayMilisecond(-7),
                end: endDayMiliSecond(-1),
                step: 1,
            })
            .then((res) => setStatisticOrder(res))
            .catch((err) => console.log(err))

        axiosPrivate
            .post('/dashboard/potential-customer')
            .then((res) => setPotentialCustomer(res))
            .catch((err) => console.log(err))

        axiosPrivate
            .post('/dashboard/bestseller', {
                limit: 10
            })
            .then((res) => setBestSeller(res))
            .catch((err) => console.log(err))
    }, [])

    const endDayMiliSecond = (date) => {
        return moment().utc()
            .add(date, 'days')
            .endOf('days')
            .valueOf();
    }

    const startDayMilisecond = (date) => {
        return moment().utc()
            .add(date, 'days')
            .startOf('days')
            .valueOf();
    }

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid xs={4}>
                    <Paper sx={{ px: 1.5, pt: 1.5, pb: 1, height: '100%' }}>
                        <Box display='flex' alignItems='flex-start'>
                            <Inventory2TwoTone sx={{ fontSize: 40 }} color='btnWarning' />
                            <Box ml={2} >
                                <Typography fontSize={40} fontWeight={600} lineHeight={1}>
                                    {productCount?.total}
                                </Typography>
                                <Typography fontWeight={600} mt={0.5}>Sản phẩm</Typography>
                            </Box>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Chip
                            size='small' color='chipWarning' sx={{ px: 0.5, fontWeight: 600 }}
                            icon={<ShoppingCartCheckoutOutlined />}
                            label={`Đã bán ${productCount?.inWeek} đôi giày trong tuần qua`}
                        />
                    </Paper>
                </Grid>

                <Grid xs={4}>
                    <Paper sx={{ px: 1.5, pt: 1.5, pb: 1, height: '100%' }}>
                        <Box display='flex' alignItems='flex-start'>
                            <PeopleAltTwoTone sx={{ fontSize: 40 }} color='btnInfo' />
                            <Box ml={2}>
                                <Typography fontSize={40} fontWeight={600} lineHeight={1}>
                                    {customerCount?.total}
                                </Typography>
                                <Typography fontWeight={600} mt={0.5}>Tổng khách hàng</Typography>
                            </Box>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Chip
                            size='small' color='chipInfo' sx={{ px: 0.5, fontWeight: 600 }}
                            icon={<PersonAddAltOutlined />}
                            label={`Có ${customerCount?.inWeek} đăng ký mới trong tuần qua`}
                        />
                    </Paper>
                </Grid>

                <Grid xs={4}>
                    <Paper sx={{ px: 1.5, pt: 1.5, pb: 1, height: '100%' }}>
                        <Box display='flex' alignItems='flex-start'>
                            <ReceiptLongTwoTone sx={{ fontSize: 40 }} color='btnSuccess' />
                            <Box ml={2}>
                                <Typography fontSize={40} fontWeight={600} lineHeight={1}>
                                    {orderCount?.total}
                                </Typography>
                                <Typography fontWeight={600} mt={0.5}>Tổng đơn hàng</Typography>
                            </Box>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Chip
                            size='small' color='chipSuccess' sx={{ px: 0.5, fontWeight: 600 }}
                            icon={<CreditScoreOutlined />}
                            label={`Có ${orderCount?.inWeek} đơn hàng mới trong tuần qua`}
                        />
                    </Paper>
                </Grid>

                <Grid xs={12}>
                    <Paper sx={{ px: 1.5, py: 2, height: '100%' }}>
                        <Grid container>
                            <Grid xs={6}>
                                <Box className='content-top-center' py={2}>
                                    <PaidTwoTone sx={{ fontSize: 40 }} color='btnError' />
                                    <Box ml={2}>
                                        <Typography fontSize={40} fontWeight={600} lineHeight={1}>
                                            {formatMoney(revenueOrder?.revenue)}
                                        </Typography>
                                        <Typography fontWeight={600} mt={0.5}>Tổng doanh thu hiện tại</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid xs={6} borderLeft='1px solid' borderColor='divider'>
                                <Box className='content-top-center' py={2}>
                                    <HourglassFullTwoTone sx={{ fontSize: 40 }} color='btnError' />
                                    <Box ml={2}>
                                        <Typography fontSize={40} fontWeight={600} lineHeight={1}>
                                            {formatMoney(revenueOrder?.waitRevenue)}
                                        </Typography>
                                        <Typography fontWeight={600} mt={0.5}>Tổng doanh thu đang chờ</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* <Grid xs={12}>
                    <Paper sx={{ px: 1.5, pt: 1.5, pb: 1 }}>
                        <Typography variant='h6' className='content-left-center'>
                            <InsightsOutlined sx={{ mr: 1 }} />
                            Tổng quan bán hàng
                        </Typography>
                        <Divider sx={{ my: 0.5 }} />
                    </Paper>
                </Grid> */}


                <Grid xs={4}>
                    <Paper sx={{ px: 1.5, pt: 1.5, pb: 1, height: '100%' }}>
                        <Typography variant='h6' className='content-left-center'>
                            <CategoryOutlined sx={{ mr: 1 }} />
                            Sản phẩm theo thương hiệu
                        </Typography>
                        <Divider sx={{ my: 0.5 }} />
                        {(productByBrand.length !== 0) &&
                            <PieChart
                                data={productByBrand}
                                labelName='brandName'
                                valueName='count'
                                tooltip='Số lượng'
                            />
                        }
                    </Paper>
                </Grid>

                <Grid xs={8}>
                    <Paper sx={{ px: 1.5, pt: 1.5, pb: 1, height: '100%' }}>
                        <Typography variant='h6' className='content-left-center'>
                            <AddBusinessOutlined sx={{ mr: 1 }} />
                            Thống kê nhập hàng
                        </Typography>
                        <Divider sx={{ my: 0.5 }} />
                        {(statisticImport.length !== 0) &&
                            <TwoBarChar
                                data={statisticImport}
                                labelName="date"
                                fristValueName="quantity"
                                fristTooltip="Số lượng nhập"
                                secondValueName="totalMoney"
                                secondTooltip="Tổng tiền"
                                isDate={true}
                            />
                        }
                    </Paper>
                </Grid>

                <Grid xs={8}>
                    <Paper sx={{ px: 1.5, pt: 1.5, pb: 1, height: '100%' }}>
                        <Typography variant='h6' className='content-left-center'>
                            <ShoppingCartCheckoutOutlined sx={{ mr: 1 }} />
                            Thống kê đơn hàng
                        </Typography>
                        <Divider sx={{ my: 0.5 }} />
                        {(statisticOrder.length !== 0) &&
                            <TwoBarChar
                                data={statisticOrder}
                                labelName="date"
                                fristValueName="count"
                                fristTooltip="Số đơn hàng"
                                secondValueName="totalMoney"
                                secondTooltip="Tổng tiền"
                                isDate={true}
                            />
                        }
                    </Paper>
                </Grid>

                <Grid xs={4}>
                    <Paper sx={{ px: 1.5, pt: 1.5, pb: 1, height: '100%' }}>
                        <Typography variant='h6' className='content-left-center'>
                            <CategoryOutlined sx={{ mr: 1 }} />
                            Sản phẩm theo thương hiệu
                        </Typography>
                        <Divider sx={{ my: 0.5 }} />
                        <Box>

                        </Box>
                    </Paper>
                </Grid>

                <Grid xs={6}>
                    <Paper sx={{ px: 1.5, pt: 1.5, pb: 1, height: '100%' }}>
                        <Typography variant='h6' className='content-left-center'>
                            <FaceRetouchingNaturalOutlined sx={{ mr: 1 }} />
                            Khách hàng tiềm năng
                        </Typography>
                        <Divider sx={{ my: 0.5 }} />
                        <Box>
                            {potentialCustomer.length !== 0
                                && potentialCustomer.map((item, idx) => (
                                    <Fragment key={idx} >
                                        <Box py={1.5} className='content-left-center'>
                                            <Box className='content-center' width={40}>
                                                {renderRankingOrder(idx + 1)}
                                            </Box>
                                            <Box className='content-left-center' flex={1}>
                                                <Avatar
                                                    src={item?.customer?.avatar?.link || "/"} alt={item.customer.name}
                                                    sx={{ width: 38, height: 38 }}
                                                />
                                                <Box sx={{ flex: 1, ml: 1 }}>
                                                    <Box className='content-left-center'>
                                                        <Typography variant='subtitle2'>{item.customer.name}</Typography>
                                                        <Chip
                                                            size="small" sx={{ ml: 1.5, fontWeight: 600, height: 20 }}
                                                            label={(item.customer.status === true) ? "Hoạt động" : "Đã khóa"}
                                                            color={(item.customer.status === true) ? "chipSuccess" : "chipError"}
                                                        />
                                                    </Box>
                                                    <Typography variant="body2" color='text.secondary'>
                                                        {item.customer.email}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Typography variant='subtitle2'>
                                                {item.countOrder} đơn hàng
                                            </Typography>
                                        </Box>
                                        {idx < potentialCustomer.length - 1 && (
                                            <Divider sx={{ ml: 1.5, borderStyle: 'dashed' }} />
                                        )}
                                    </Fragment>
                                ))}
                        </Box>
                    </Paper>
                </Grid>

                <Grid xs={6}>
                    <Paper sx={{ px: 1.5, pt: 1.5, pb: 1, height: '100%'}}>
                        <Typography variant='h6' className='content-left-center'>
                            <LocalFireDepartmentOutlined sx={{ mr: 1 }} />
                            Sản phẩm bán chạy
                        </Typography>
                        <Divider sx={{ my: 0.5 }} />
                        <Box>
                            {bestSeller.length !== 0 && bestSeller.map((product, idx) => (
                                <Fragment key={idx} >
                                    <Box py={1} className='content-left-center'>
                                        <Box className='content-center' width={40} mr={2}>
                                            {renderRankingOrder(idx + 1)}
                                        </Box>
                                        <Box flex={1} className='content-center-between'>
                                            <Box display='flex'>
                                                <SquareBlock w={50} height={50}>
                                                    <img src={product.versions[0].images[0].link} alt="" />
                                                </SquareBlock>
                                                <Box ml={2} display='flex' flexDirection='column'>
                                                    <Typography variant="subtitle2" textTransform='uppercase' lineHeight={1}>
                                                        {product.name}
                                                    </Typography>
                                                    <Typography variant="caption" color='text.secondary' lineHeight={1.5}>
                                                        {product.brand.name}
                                                    </Typography>
                                                    <Typography variant='caption' mt='auto' lineHeight={1} component='div'>
                                                        {formatMoney(discountPrice(product.price, product.discount))}
                                                        <Box ml={1.5} component='span' color='text.secondary'>
                                                            -{product.discount}%
                                                        </Box>
                                                    </Typography>
                                                </Box> 
                                            </Box>
                                            <Box>
                                                <Rating value={product?.star}  precision={0.1} readOnly size="small" />
                                                <Typography variant='body2' textAlign='end'>{product.sold}
                                                    <Box component='span' color='text.secondary' ml={0.75}>sp đã bán</Box>
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    {idx < bestSeller.length - 1 && (
                                        <Divider sx={{ ml: 1.5, borderStyle: 'dashed' }} />
                                    )}
                                </Fragment>
                            ))}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Dashboard;