import { Outlet } from "react-router";
import { Container } from "@mui/material";

import Theme from "./theme";
import Header from "components/common/Header/header";
import Footer from "components/common/Footer/footer";

function PublicLayout() {

    return ( 
        <Theme mode='light'>
            <Header />
            <Container maxWidth='xl' sx={{ py: 2 }}>
                <Outlet />
            </Container>
            <Footer />   
        </Theme>      
    );
}

export default PublicLayout;