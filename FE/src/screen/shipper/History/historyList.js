import { Paper, Typography } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axiosPublic from "utils/axiosPublic";
import HistoryItem from "./historyItem";

function HistoryList() {
    const shipper = useSelector((state) => state.shipper.login?.data);
    const [orders, setOrders] = useState([]);
    
    useEffect(() => {
        axiosPublic
            .get('/order/shipper/success', {
                params: { shipper: shipper._id }
            })
            .then((res) => setOrders(res))
            .catch((err) => console.log(err));
    }, [shipper])

    return ( 
        <>
            <Paper 
                elevation={2} 
                className='content-center'
                sx={{ 
                    mx: -1.5, mb: 1.5, px: 1.5, height: 48, 
                    borderRadius: 0, position: 'sticky', top: 0
                }}
            >
                <Typography fontSize={18} textTransform='uppercase' fontWeight={500}>
                    Lịch sử giao hàng
                </Typography>
            </Paper>
            <Grid container spacing={1.5}>
                {orders.length !== 0 && orders.map((order, idx) => (
                    <Grid xs={12} key={idx}>
                        <Link to={`/shipper/detail/${order._id}`}>
                            <HistoryItem data={order} />
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}

export default HistoryList;