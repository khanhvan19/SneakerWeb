import store from "redux/store";
import { toast } from "react-toastify";
import { TOAST_DEFAULT_STYLE } from "assets/styles/constantsStyle";


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