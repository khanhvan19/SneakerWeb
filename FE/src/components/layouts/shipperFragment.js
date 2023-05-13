import Theme from "./theme";
import { Outlet } from "react-router";
import { Container } from "@mui/material";

function ShipperFragmentLayout() {
    var windowHeight = window.innerHeight;

    return ( 
        <Theme mode='light'>
            <Container
                sx={{ 
                    px: 1.5, 
                    minHeight: windowHeight,
                    bgcolor: 'background.deepest' 
                }}
            >
                <Outlet />
            </Container>
        </Theme>
    );
}

export default ShipperFragmentLayout;