import { memo, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useSelector } from "react-redux";

import { Box } from "@mui/material";

import Theme from "./theme";
import AdminHeader from "components/common/AdminHeader/adminHeader";
import AdminSidebar from "components/common/SideBar/adminSidebar";

import styles from './Layout.module.scss'
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

function PrivateLayout() {
    const mode = useSelector((state) => state.theme?.adminMode);
    const employee = useSelector((state) => state.auth.login?.data);
    const navigate = useNavigate();

    useEffect(() => {
        if(!employee) {
            navigate("/admin/login", {replace: true});
        } 
    // eslint-disable-next-line    
    }, [navigate, employee])

    return ( 
        <Theme mode={mode}>
            <div className={cx('private-layout-content')}>
                <div className={cx('leftside-wrapper')}>
                    <AdminSidebar />     
                </div>
                <Box 
                    className={cx('rightside-wrapper')}
                    sx={{ bgcolor: "background.default", color: "text.primary" }}
                >
                    <AdminHeader />
                    <div className={cx('rightside-content')}>
                        <Outlet />
                    </div>
                </Box>
            </div>
        </Theme>
    );
}

export default memo(PrivateLayout);