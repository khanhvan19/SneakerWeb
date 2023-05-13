import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useSelector } from "react-redux";

import {  
    Typography, 
    Box,  
} from "@mui/material";
import { Speed } from "@mui/icons-material";

import axiosPrivate from "utils/axiosPrivate";
import RouterBreadcrumbs from "components/ui/breadcrumbs";
import ChangePasswordForm from "./changePasswordForm";
import { TOAST_DEFAULT_STYLE } from "assets/styles/constantsStyle";
import { BREADCRUMB_ADMIN_PROFILE } from "constants/breadcrumb";

function ChangePasswordScreen() {
    const employeeLogin = useSelector((state) => state.auth?.login?.data);
    var navigate = useNavigate();

    useEffect(() => {
  
    }, [])

    const initValue = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    }

    const handleSubmit = (values, {resetForm}) => {
        console.log(values);
        axiosPrivate
            .put(`employee/reset-password/${employeeLogin._id}`, values,
                { headers: { token: employeeLogin?.accessToken }}
            )
            .then((res) => {
                resetForm()
                toast.success(res.message, {...TOAST_DEFAULT_STYLE, autoClose: 1500});
                setTimeout(() => {
                    navigate('/admin', { replace: true })
                }, 2000)
            })
            .catch((err) => {
                toast.error(err.message, TOAST_DEFAULT_STYLE);
            })
    }

    return (  
        <>
            <Box>
                <Typography variant="h5" gutterBottom>
                    Đổi mật khẩu
                </Typography>
                <RouterBreadcrumbs 
                    prevLink={BREADCRUMB_ADMIN_PROFILE}
                    currentPage="Đổi mật khẩu"
                    homeIcon={<Speed />}
                /> 
            </Box>
            <ChangePasswordForm
                initValue={initValue}
                onSubmit={handleSubmit}
            />
        </>
    );
}

export default ChangePasswordScreen;