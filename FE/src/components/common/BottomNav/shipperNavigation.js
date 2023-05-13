import { HistoryOutlined, NotificationsActiveOutlined, PersonOutlineOutlined, ReceiptLongOutlined } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { styled } from "@mui/material/styles"
import { useState } from "react";
import { useNavigate } from "react-router";
import { NavLink } from "react-router-dom";

const NavigationAction = styled(BottomNavigationAction)(({ theme }) => ({
    color:  theme.palette.text.primary,
    '&.Mui-selected': {
        color: theme.palette.text.accent,
    }
}))

const PAGE = [
    { label: 'Đơn hàng', icon: <ReceiptLongOutlined />, linkTo: '/shipper/' },
    { label: 'Lịch sử', icon: <HistoryOutlined />, linkTo: '/shipper/history' },
    { label: 'Thông báo', icon: <NotificationsActiveOutlined />, linkTo: '/shipper/notify' },
    { label: 'Tài khoản', icon: <PersonOutlineOutlined />, linkTo: '/shipper/account' },
]

function ShipperNavigation() {

    return (
        <BottomNavigation
            showLabels
            sx={{ height: 48 }}
        >
            {PAGE.map((page, idx) => (
                <NavigationAction
                    component={NavLink} 
                    to={page.linkTo}
                    key={idx}
                    label={page.label}
                    icon={page.icon}
                    sx={{ 
                        '&.active': {
                            color: 'text.accent',
                            transform: 'scale(1.05)',
                            transition: 'all 0.4 ease-in-out'
                        }
                    }}
                />
            ))}
        </BottomNavigation>
    );
}

export default ShipperNavigation;