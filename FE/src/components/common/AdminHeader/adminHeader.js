import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
    NotificationsActiveOutlined,
    LightModeOutlined,
    DarkModeOutlined,
    VpnKeyOutlined,
    FolderSharedOutlined,
    Logout,
} from "@mui/icons-material";
import {
    Avatar,
    Box,
    Divider,
    Tooltip,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
} from "@mui/material";

import * as constantsStyle from 'assets/styles/constantsStyle'

import { handleEmployeeLogout } from "redux/slices/auth.slice";
import { toggleAdminMode } from "redux/slices/theme.slices";

import styles from "./Header.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

function AdminHeader() {
    const mode = useSelector((state) => state.theme?.adminMode);
    const employee = useSelector((state) => state.auth.login?.data);
    const [btnNotify, setBtnNotify] = useState(null);
    const [btnAccount, setBtnAccount] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const openNotifyMenu = Boolean(btnNotify);
    const openAccountMenu = Boolean(btnAccount);

    const handleChangeMode = () => {
        dispatch(toggleAdminMode())
    }

    const handleLogout = () => {
        dispatch(handleEmployeeLogout(employee?._id))
            .unwrap()
            .then((res) => {
                navigate("/admin/login", {replace: true});
            })
        setBtnAccount(null);
    }

    return (
        <Box 
            component="header"
            className={cx("header-wrapper")}
            sx={{ bgcolor: "background.glass" }}
        >
            <Box className={cx("adheader-container")} sx={{px: 2}}>
                <Box sx={{ mx: 2 }}>    
                    <Tooltip title="Thông báo" arrow>
                        <IconButton
                            onClick={(e) => setBtnNotify(e.currentTarget)}
                            aria-haspopup="true"
                            aria-controls={openNotifyMenu ? "notify-menu" : undefined}
                            aria-expanded={openNotifyMenu ? "true" : undefined}
                            sx={ openNotifyMenu ? { color: "text.accent", bgcolor: "background.accent" } : {}}
                        >
                            <NotificationsActiveOutlined />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        anchorEl={btnNotify}
                        id="notify-menu"
                        open={openNotifyMenu}
                        onClose={() => setBtnNotify(null)}
                        transformOrigin={{ horizontal: "right", vertical: "top" }}
                        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                        PaperProps={{ elevation: 0, sx: constantsStyle.DROPDOWN_ARROW_MENU,}}
                    >
                        <MenuItem onClick={() => setBtnNotify(null)}>
                            chua viet
                        </MenuItem>
                    </Menu>
                </Box>
                
                <Box sx={{ mr: 2 }}>
                    <Tooltip title="Giao diện sáng" arrow>
                        <IconButton onClick={handleChangeMode}>
                            {(mode === 'light') ? <DarkModeOutlined /> : <LightModeOutlined />}
                        </IconButton>
                    </Tooltip>
                </Box>
                
                <Box>
                    <Tooltip title="Thiết lập tài khoản" arrow>
                        <IconButton
                            size="small"
                            onClick={(e) => setBtnAccount(e.currentTarget)}
                            aria-haspopup="true"
                            aria-controls={openAccountMenu ? "account-menu" : undefined}
                            aria-expanded={openAccountMenu ? "true" : undefined}
                            sx={ openAccountMenu ? { color: "text.accent", bgcolor: "background.accent" } : {}}
                        >
                            <Avatar src={employee?.avatar?.link} alt="" />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        anchorEl={btnAccount}
                        id="account-menu"
                        open={openAccountMenu}
                        onClose={() => setBtnAccount(null)}
                        transformOrigin={{ horizontal: "right", vertical: "top" }}
                        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                        PaperProps={{ elevation: 0, sx: constantsStyle.DROPDOWN_ARROW_MENU,}}
                    >
                        <MenuItem>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Avatar src={employee?.avatar?.link} alt="" />
                                <Box sx={{ ml : 1.5 }}>
                                    <div>{ employee?.name }</div>
                                    <small>{ employee?.email }</small>
                                </Box>
                            </Box>
                        </MenuItem>
                        <Divider />
                        <MenuItem 
                            onClick={() => {
                                setBtnAccount(null);
                                navigate(`/admin/profile/${employee._id}`);
                            }}
                        >
                            <ListItemIcon><FolderSharedOutlined fontSize="small" /></ListItemIcon>
                            Hồ sơ của tôi
                        </MenuItem>
                        <MenuItem 
                            onClick={() => {
                                setBtnAccount(null);
                                navigate('/admin/change-password');
                            }}
                        >
                            <ListItemIcon><VpnKeyOutlined fontSize="small" /></ListItemIcon>
                            Đổi mật khẩu
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                            Đăng xuất
                        </MenuItem>
                    </Menu>
                </Box>
            </Box>
        </Box>
    );
}

export default AdminHeader;
