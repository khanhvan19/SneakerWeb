import { Outlet } from "react-router";
import { Container } from "@mui/material";

import Theme from "./theme";
import Header from "components/common/Header/header";
import Footer from "components/common/Footer/footer";
import { ToastContainer } from "react-toastify";
import ChatBot from "components/common/Chatbot/chatbot";

function PublicLayout() {

    return ( 
        <Theme mode='light'>
            <Header />
            <Container 
                maxWidth='xl' 
                sx={{ py: 2 }}
            >
                <Outlet />
            </Container>
            <Footer />   

            <ChatBot />
            <ToastContainer theme='dark' />
        </Theme>      
    );
}

export default PublicLayout;