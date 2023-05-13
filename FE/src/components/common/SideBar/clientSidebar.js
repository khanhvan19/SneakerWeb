import {
    AssignmentIndOutlined,
    FavoriteBorderOutlined,
    MapOutlined,
    ReceiptLongOutlined,
    VpnKeyOutlined,
} from "@mui/icons-material";
import { Avatar, Box, ListItemIcon, ListItemText, MenuItem, MenuList, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import styles from './Sidebar.module.scss'
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

const SIDEBAR_CONTENT = [
    { icon: <AssignmentIndOutlined />, name: "Thông tin tài khoản", link: '/my-account' },
    { icon: <VpnKeyOutlined />, name: "Đổi mật khẩu", link: '/reset-password' },
    { icon: <ReceiptLongOutlined />, name: "Quản lý đơn hàng", link: '/order' },
    { icon: <MapOutlined />, name: "Sổ địa chỉ", link: '/address' },
    { icon: <FavoriteBorderOutlined />, name: "Sản phẩm yêu thích", link: '/my-favorite' },
];

function ClientSidebar() {
    const isLogin = useSelector((state) => state.client?.login?.data);

    return (
        <Box className={cx('client-sidebar-container')} >
            <Box position='sticky' top={24}>
                <Box className='content-left-center' pl={1} mb={1}>
                    <Avatar src={isLogin?.avatar?.link || "/"} alt={isLogin?.name} sx={{ width: 45, height: 45 }} />
                    <Box sx={{ flex: 1, ml: 1.5 }}>
                        <Typography fontWeight={600}>{isLogin?.name}</Typography>
                        <Typography variant="body2" color='text.secondary'>{isLogin?.email}</Typography>
                    </Box>
                </Box>
                <MenuList className={cx('client-sidebar-menu')}>
                    {SIDEBAR_CONTENT.map((item, idx) => (
                        <MenuItem 
                            key={idx}
                            component={NavLink} 
                            to={item.link}
                            sx={{ mb: 0.5, py: 1 }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText>
                                <Typography fontWeight={500}>{item.name}</Typography>
                            </ListItemText>
                        </MenuItem>
                    ))}
                </MenuList>
            </Box>
        </Box>
    );
}

export default ClientSidebar;