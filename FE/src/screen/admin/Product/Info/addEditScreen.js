import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";

import {  
    Typography, 
    Box, 
    Button,
} from "@mui/material";
import { 
    ArrowBackOutlined, 
    Speed 
} from "@mui/icons-material";
import { toast } from 'react-toastify';

import axiosPrivate from "utils/axiosPrivate";
import RouterBreadcrumbs from "components/ui/breadcrumbs";
import AddEditForm from "./addEditForm";
import { TOAST_DEFAULT_STYLE, TOAST_NAVIGATE_STYLE } from "assets/styles/constantsStyle";
import { BREADCRUMB_ADMIN_PRODUCT } from "constants/breadcrumb";
import { SIZE_OPTION } from "constants/optionSelectField";


function AddEditProduct() {
    const employee = useSelector((state) => state.auth?.login?.data);
    var { id } = useParams();
    var navigate = useNavigate();

    const [product, setProduct] = useState({});
    const isAddMode = !id;

    useEffect(() => {
        (id != null) && axiosPrivate
            .get(`product/${id}`)
            .then((res) => {
                setProduct(res);
            })
    }, [id])

    const initValue = {
        name: product?.name || '',
        brand: product?.brand || '',
        category: product?.category || [],
        price: product?.price || '',
        discount: product?.discount || '',
        sizeMin: product?.sizeMin || SIZE_OPTION[0].value,
        sizeMax: product?.sizeMax || SIZE_OPTION[0].value,
        gender: product?.gender || [],
        description: product?.description || '',
    }

    const handleSubmit = (values, {resetForm}) => {
        
        if(isAddMode) {
            axiosPrivate
                .post('product/', values, 
                    { headers: { token: employee?.accessToken }}
                )
                .then((res) => {
                    console.log(res);
                    resetForm();
                    toast.success(res.message, TOAST_NAVIGATE_STYLE);
                    setTimeout(() => {
                        navigate('/admin/product/version/add', { state: res.data._id, replace: true,})
                    }, 2000)
                })
                .catch((err) => {
                    toast.error(err.message, TOAST_DEFAULT_STYLE);
                })
        } else {
            axiosPrivate
                .put(`product/${id}`, values,
                    { headers: { token: employee?.accessToken }}
                )
                .then((res) => {
                    toast.success(res.message, TOAST_NAVIGATE_STYLE);
                    setTimeout(() => {
                        navigate('/admin/product', { replace: true })
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
                        {(id == null) ? "Thêm sản phẩm" : "Chỉnh sửa sản phẩm"}
                    </Typography>
                    <RouterBreadcrumbs 
                        prevLink={BREADCRUMB_ADMIN_PRODUCT}
                        currentPage={(id == null) ? "Thêm sản phẩm" : "Chỉnh sửa sản phẩm"}
                        homeIcon={<Speed />}
                    /> 
                </Box>
                <Box>
                    <Button   
                        component={Link}
                        to="/admin/product"
                        size="large"
                        variant="contained" 
                        color="btnGray" 
                        startIcon={<ArrowBackOutlined />}
                    >
                        Trở lại
                    </Button>
                    <Button 
                        component={Link}
                        to="/admin/product/version/add"
                        size="large"
                        variant="contained" 
                        color="btnInfo" 
                        sx={{ ml: 2 }}
                    >
                        Thêm phiên bản
                    </Button>
                </Box>
            </Box>
            <AddEditForm
                isAddMode={isAddMode}
                initValue={initValue}
                onSubmit={handleSubmit}
            />
        </>
    );
}

export default AddEditProduct;