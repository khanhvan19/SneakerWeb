import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";

import {  
    Typography, 
    Box, 
    Button, 
} from "@mui/material";
import { ArrowBackOutlined, Speed } from "@mui/icons-material";
import { ToastContainer, toast } from 'react-toastify';

import axiosPrivate from "utils/axiosPrivate";
import RouterBreadcrumbs from "components/ui/breadcrumbs";
import AddEditForm from "./addEditForm";
import { TOAST_DEFAULT_STYLE } from "assets/styles/constantsStyle";
import { BREADCRUMB_ADMIN_PRODUCT_SAMPLE } from "constants/breadcrumb";


function AddEditProductSample() {
    const employeeLogin = useSelector((state) => state.auth?.login?.data);
    var { id } = useParams();
    var navigate = useNavigate();

    const [productSample, setProductSample] = useState({});
    const isAddMode = !id;

    useEffect(() => {
        (id != null) && axiosPrivate
            .get(`sample/${id}`)
            .then((res) => {
                setProductSample(res);
            })
    }, [id])

    const initValue = {
        name: productSample?.name || '',
        brand: productSample?.brand|| '',
        category: productSample?.category || [],
        gender: productSample?.gender || [],
        description: productSample?.description || '',
    }

    const handleSubmit = (values, {resetForm}) => {
        console.log('submit:', values);
        
        if(isAddMode) {
            axiosPrivate
                .post('sample/', values, 
                    { headers: { token: employeeLogin?.accessToken }}
                )
                .then((res) => {
                    resetForm();
                    toast.success(res.message, TOAST_DEFAULT_STYLE);
                    // if state navigate ? return product page
                })
                .catch((err) => {
                    toast.error(err.message, TOAST_DEFAULT_STYLE);
                })
        } else {
            axiosPrivate
                .put(`sample/${id}`, values,
                    { headers: { token: employeeLogin?.accessToken }}
                )
                .then((res) => {
                    toast.success(res.message, {...TOAST_DEFAULT_STYLE, autoClose: 1500});
                    setTimeout(() => {
                        navigate('/admin/product-sample', { replace: true })
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
                        {(id == null) ? "Thêm mẫu sản phẩm" : "Chỉnh sửa mẫu sản phẩm"}
                    </Typography>
                    <RouterBreadcrumbs 
                        prevLink={BREADCRUMB_ADMIN_PRODUCT_SAMPLE}
                        currentPage={(id == null) ? "Thêm mẫu sản phẩm" : "Chỉnh sửa mẫu sản phẩm"}
                        homeIcon={<Speed />}
                    /> 
                </Box>
                <Box>
                    <Button 
                        component={Link}
                        to="/admin/product-sample"
                        size="large"
                        variant="contained" 
                        color="btnGray" 
                        startIcon={<ArrowBackOutlined />}
                    >
                        Trở lại
                    </Button>
                    <Button 
                        component={Link}
                        to="/admin/product/add"
                        size="large"
                        variant="contained" 
                        color="btnInfo" 
                        sx={{ ml: 2 }}
                    >
                        Thêm sản phẩm
                    </Button>
                </Box>
            </Box>
            <AddEditForm
                isAddMode={isAddMode}
                initValue={initValue}
                onSubmit={handleSubmit}
            />
            <ToastContainer />
        </>
    );
}

export default AddEditProductSample;