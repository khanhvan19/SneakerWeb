import { Box, Button, Container, Typography } from "@mui/material";
import CheckSuccess from "components/ui/Animation/checkSuccess";
import DeliveryTruck from "components/ui/Animation/deliveryTruck";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { updateTotalCart } from "redux/slices/cart.slice";
import axiosClientPrivate from "utils/axiosClientPrivate";

function CheckoutSuccess() {
    const isLogin = useSelector((state) => state.client?.login?.data);
    const dispatch = useDispatch()

    useEffect(() => {
        axiosClientPrivate
            .get('/cart/', {
                params: { customer: isLogin._id },
                headers: { token: isLogin?.accessToken }
            })
            .then((res) => dispatch(updateTotalCart(res.count)))
            .catch((err) => console.log(err))
    }, [isLogin, dispatch])

    return ( 
        <Box position='relative'>
            <Container 
                maxWidth='sm' 
                sx={{ 
                    mx: 'auto', pt: 5, pb: 20, 
                    position: 'relative', zIndex: 2 
                }}
            >
                <CheckSuccess />
                <Typography variant="h5" align="center" mb={1.5}>Đặt hàng thành công!</Typography>
                <Typography align="center" component='div'>
                    Cảm ơn quý khách đã mua hàng tại <Box fontWeight={500} display='inline'>THE SNEAK</Box>!
                </Typography>
                <Typography align="center">
                    Đơn hàng của quý khách đang được xử lý và sẽ tiến hành vận chuyển sớm nhất có thể. 
                </Typography>
                <Box display='flex' mt={2}>
                    <Button
                        fullWidth 
                        variant='contained' color="btnDark"
                        component={Link} to='/product' replace={true}
                        sx={{ mr: 2, borderRadius: 0, textDecoration: 'uppercase', boxShadow: 1 }}
                    >
                        Tiếp tục mua hàng
                    </Button>
                    <Button
                        fullWidth 
                        variant='contained' color="btnSuccess"
                        component={Link} to='/order' replace={true}
                        sx={{ borderRadius: 0, textDecoration: 'uppercase' }}
                    >
                        Kiểm tra đơn hàng
                    </Button>
                </Box>
            </Container>
            <Box position='absolute' right={0} left={0} bottom={0} zIndex={1}>
                <DeliveryTruck />
            </Box>
        </Box> 
    );
}

export default CheckoutSuccess;