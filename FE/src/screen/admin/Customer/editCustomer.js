import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { useSelector } from "react-redux";

import {  
    Typography, 
    Box, 
    Button, 
} from "@mui/material";
import { ArrowBackOutlined, Speed } from "@mui/icons-material";

import axiosPrivate from "utils/axiosPrivate";
import RouterBreadcrumbs from "components/ui/breadcrumbs";
import { TOAST_DEFAULT_STYLE } from "assets/styles/constantsStyle";
import { BREADCRUMB_ADMIN_CUSTOMER } from "constants/breadcrumb";
import EditForm from "./editForm";

function EditCustomer() {
    const employeeLogin = useSelector((state) => state.auth?.login?.data);
    var { id } = useParams();
    var navigate = useNavigate();
    const [customer, setCustomer] = useState({});

    useEffect(() => {
        (id != null) && axiosPrivate
            .get(`customer/${id}`)
            .then((res) => {
                setCustomer(res);
            })
    }, [id])

    const initValue = {
        avatar: customer?.avatar || '',
        email: customer?.email || '',
        name: customer?.name || '',
        phone: customer?.phone || '',
        sex: customer?.sex || '',
        birthday: customer?.birthday || '',
    }

    const handleSubmit = (values) => {
        const formData = new FormData()
        Object.keys(values).forEach((key) => {
            formData.append(key, values[key])
        })
        axiosPrivate
            .put(`customer/${id}`, formData,
                { headers: {
                    token: employeeLogin?.accessToken,
                    "Content-Type": "multipart/form-data",
                }}
            )
            .then((res) => {
                toast.success(res.message, {...TOAST_DEFAULT_STYLE, autoClose: 1500});
                setTimeout(() => {
                    navigate('/admin/customer')
                }, 2000)
            })
            .catch((err) => {
                toast.error(err.message, TOAST_DEFAULT_STYLE);
            })
    }

    return (  
        <>
            <Box className='content-center-between'>
                <Box>
                    <Typography variant="h5" gutterBottom>
                        {"Chỉnh sửa thông tin khách hàng"}
                    </Typography>
                    <RouterBreadcrumbs 
                        prevLink={BREADCRUMB_ADMIN_CUSTOMER}
                        currentPage="Chỉnh sửa thông tin"
                        homeIcon={<Speed />}
                    /> 
                </Box>
                <Button 
                    component={Link}
                    to="/admin/customer"
                    size="large"
                    variant="contained" 
                    color="btnGray" 
                    startIcon={<ArrowBackOutlined />}
                >
                    Trở lại
                </Button>
            </Box>
            <EditForm
                initValue={initValue}
                onSubmit={handleSubmit}
            />
            <ToastContainer />
        </>
    );
}

export default EditCustomer;