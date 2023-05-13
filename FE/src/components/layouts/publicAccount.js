import { Outlet } from "react-router";
import { Box } from '@mui/material';
import ClientSidebar from 'components/common/SideBar/clientSidebar';

function PublicAccountLayout() {
    return ( 
        <>
            <Box display='flex' mt={2}>
                <ClientSidebar />
                <Outlet />   
            </Box>
        </>
    );
}

export default PublicAccountLayout;