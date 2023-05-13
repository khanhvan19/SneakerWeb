import store from "redux/store";
import { toast } from "react-toastify";
import { TOAST_DEFAULT_STYLE } from "assets/styles/constantsStyle";
import { AvTimerOutlined, CancelOutlined, CheckCircleOutlined, LocalShippingOutlined } from "@mui/icons-material";
import { Chip } from "@mui/material";


export const checkPermission = (idPermission) => {
    const permissions = store.getState().auth?.login?.data?.permissions;
    if(permissions[idPermission] !== true) {
        toast.warn(
            "Bạn không có quyền thực hiện chức năng này!",
            { ...TOAST_DEFAULT_STYLE, position: "top-center" }
        );
        return false;
    }
    return true;
}

export const discountPrice = (price, discount) => {
    return ( price - (price * (discount / 100)) );
}

export const renderOrderStatus = (orderStatus, size,) => {
    switch(orderStatus) {
        case 'new':
            return (
                <Chip 
                    icon={<AvTimerOutlined />} 
                    label="Đang chờ xác nhận" 
                    color='chipInfo' size={size}
                    sx={{ fontWeight: 600, borderRadius: '4px' }}
                />
            );
        case 'delivery':
            return (
                <Chip 
                    icon={<LocalShippingOutlined />} 
                    label="Đang được vận chuyển" 
                    color='chipWarning' size={size}
                    sx={{ fontWeight: 600, borderRadius: '4px' }} 
                />
            );
        case 'success':
            return (
                <Chip 
                    icon={<CheckCircleOutlined />} 
                    label="Giao hàng thành công" 
                    color='chipSuccess' size={size}
                    sx={{ fontWeight: 600, borderRadius: '4px' }} 
                />
            );
        case 'cancel':
            return (
                <Chip 
                    icon={<CancelOutlined />} 
                    label="Đơn hàng đã hủy" 
                    color='chipError' size={size}
                    sx={{ fontWeight: 600, borderRadius: '4px' }} 
                />
            );
        default:
    }
}

export const addDays = (date, days) => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}