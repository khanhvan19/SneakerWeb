import { Box, Container } from "@mui/material";

import Theme from "./theme";
import ShipperNavigation from "components/common/BottomNav/shipperNavigation";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

function ShipperLayout() {
    const shipper = useSelector((state) => state.shipper.login?.data);
    var windowHeight = window.innerHeight;

    if(!shipper || shipper.role !== 'role_4') {
        return <Navigate replace to="/shipper/login" />;
    } else return (  
        <Theme mode='light'>
            <Container 
                sx={{ 
                    px: 1.5, pb: 7.5,
                    minHeight: windowHeight,
                    position: 'relative',
                    bgcolor: 'background.deepest' 
                }}
            >
                <Outlet />
                <Box position='fixed' bottom={0} right={0} left={0}>
                    <ShipperNavigation />
                </Box>
            </Container>
        </Theme>
    );
}

export default ShipperLayout;