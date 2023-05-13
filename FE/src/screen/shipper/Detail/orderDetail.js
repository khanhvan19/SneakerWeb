import { ArrowBackIosNewOutlined } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, IconButton, Paper, Tab, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axiosPublic from "utils/axiosPublic";
import OrderDetailInfo from "./orderDetailInfo";
import OrderDetailItinerary from "./orderDetailItinerary";

function OrderDetail() {
    const { id } = useParams();
    const [order, setOrder] = useState();
    const [itinerary, setItinerary] = useState([])
    const [tab, setTab] = useState('info')
    const [refresh, setRefresh] = useState(0)
    const navigate = useNavigate();
    
    useEffect(() => {
        axiosPublic
            .get(`/order/${id}`)
            .then((res) => {
                setOrder(res)
                setItinerary(res.itinerary.reverse())
            })
            .catch((err) => console.log(err))
    }, [id, refresh])
        
    if (!order) {
        return (
            <Box>ijsi</Box>
        )
    } else return (
        <>
            {console.log(order)}
            <Paper
                elevation={2}
                sx={{
                    mx: -1.5, px: 1.5, height: 48, zIndex: 9,
                    borderRadius: 0, position: 'sticky', top: 0,
                }}
            >

                <Box
                    className='content-center'
                    height='100%' position='relative'
                >
                    <Typography fontSize={18} textTransform='uppercase' fontWeight={500}>
                        {order._id}
                    </Typography>
                    <IconButton
                        edge='start'
                        sx={{ position: 'absolute', left: 0 }}
                        onClick={() => navigate(-1) }
                    >
                        <ArrowBackIosNewOutlined />
                    </IconButton>
                </Box>
            </Paper>
            <TabContext value={tab}>
                <Paper
                    sx={{
                        mx: -1.5, mb: 1.5, borderRadius: 0,
                        position: 'sticky', top: 48, zIndex: 7
                    }}
                >
                    <TabList
                        variant='fullWidth' textColor="inherit"
                        TabIndicatorProps={{ sx: { bgcolor: 'text.primary' } }}
                        onChange={(e, value) => setTab(value)}
                    >
                        <Tab
                            label="Thông tin" value='info'
                            sx={{ textTransform: 'unset', fontSize: 16 }}
                        />
                        <Tab
                            label="Hành trình" value='trip'
                            sx={{ textTransform: 'unset', fontSize: 16 }}
                        />
                    </TabList>
                </Paper>
                <TabPanel value='info' sx={{ p: 0 }}>
                    <OrderDetailInfo order={order} /> 
                </TabPanel>
                <TabPanel value='trip' sx={{ p: 0 }}>
                    <OrderDetailItinerary 
                        orderId={order._id} 
                        itinerary={itinerary} 
                        onRefresh={() => setRefresh(prev => prev + 1)}
                        isDeliverySuccess={!!order.successProof}
                    />
                </TabPanel>
            </TabContext>
        </>
    );
}

export default OrderDetail;