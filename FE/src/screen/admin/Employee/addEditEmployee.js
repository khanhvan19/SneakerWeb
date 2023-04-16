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
import AddEditForm from "./addEditForm";
import { TOAST_DEFAULT_STYLE } from "assets/styles/constantsStyle";
import { BREADCRUMB_ADMIN_EMPLOYEE, BREADCRUMB_ADMIN_PROFILE } from "constants/breadcrumb";

function AddEditEmployee() {
    const employeeLogin = useSelector((state) => state.auth?.login?.data);
    var { id, page } = useParams();
    var navigate = useNavigate();
    const [employee, setEmployee] = useState({});
    const isAddMode = !id;
    const isProfile = (page === "profile")

    useEffect(() => {
        (id != null) && axiosPrivate
            .get(`employee/${id}`)
            .then((res) => {
                setEmployee(res);
            })
    }, [id])

    const initValue = {
        avatar: employee?.avatar || '',
        name: employee?.name || '',
        role: employee?.role || '',
        email: employee?.email || '',
        password: employee?.password || '',
        sex: employee?.sex || '',
        birthday: employee?.birthday || '',
        phone: employee?.phone || '',
        province: employee?.province || '',
        district: employee?.district || '',
        ward: employee?.ward || '',
        addressDetail: employee?.addressDetail || '',
    }
    if(!isAddMode) {
        delete initValue.password;
        if(isProfile) {
            delete initValue.role
        } else {
            delete initValue.email;
        }
    }


    const handleSubmit = (values, {resetForm}) => {
        const formData = new FormData()
        Object.keys(values).forEach((key) => {
            formData.append(key, values[key])
        })
      
        if(isAddMode) {
            axiosPrivate
                .post('employee/', formData, 
                    { headers: {
                        token: employeeLogin?.accessToken,
                        "Content-Type": "multipart/form-data",
                    }}
                )
                .then((res) => {
                    resetForm();
                    toast.success(res.message, TOAST_DEFAULT_STYLE);
                    console.log(res.data._id);
                    navigate(`/admin/employee/permission/${res.data._id}`, {replace: true})
                })
                .catch((err) => {
                    toast.error(err.message, TOAST_DEFAULT_STYLE);
                })
        } else {
            axiosPrivate
                .put(`employee/${id}`, formData,
                    { headers: {
                        token: employeeLogin?.accessToken,
                        "Content-Type": "multipart/form-data",
                    }}
                )
                .then((res) => {
                    toast.success(res.message, {...TOAST_DEFAULT_STYLE, autoClose: 1500});
                    setTimeout(() => {
                        navigate('/admin/employee', { replace: true })
                    }, 2000)
                })
                .catch((err) => {
                    toast.error(err.message, TOAST_DEFAULT_STYLE);
                })
        }
    }

    return (  
        <>
            <Box className='content-center-between'>
                <Box>
                    <Typography variant="h5" gutterBottom>
                        {(id == null) 
                            ? "Thêm nhân viên" 
                            : (page !== "profile") 
                                ? "Chỉnh sửa nhân viên"
                                : "Hồ sơ của tôi"
                        }
                    </Typography>
                    <RouterBreadcrumbs 
                        prevLink={(page !== "profile") 
                            ? BREADCRUMB_ADMIN_EMPLOYEE 
                            : BREADCRUMB_ADMIN_PROFILE
                        }
                        currentPage={(id == null) 
                            ? "Thêm nhân viên" 
                            : (page !== "profile") 
                                ? "Chỉnh sửa nhân viên"
                                : "Hồ sơ của tôi"
                        }
                        homeIcon={<Speed />}
                    /> 
                </Box>
                {page !== "profile" && (
                    <Button 
                        component={Link}
                        to="/admin/employee"
                        size="large"
                        variant="contained" 
                        color="btnGray" 
                        startIcon={<ArrowBackOutlined />}
                    >
                        Trở lại
                    </Button>
                )}
            </Box>
            <AddEditForm
                isProfile={isProfile}
                isAddMode={isAddMode}
                initValue={initValue}
                onSubmit={handleSubmit}
            />
            <ToastContainer />
        </>
    );
}

export default AddEditEmployee;