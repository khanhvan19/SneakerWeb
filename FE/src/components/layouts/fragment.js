import Theme from "./theme";
import { Outlet } from "react-router";
import { Container } from "@mui/material";

function FragmentLayout() {
    return ( 
        <Theme mode='light'>
            <Container>
                <Outlet />
            </Container>
        </Theme>
    );
}

export default FragmentLayout;