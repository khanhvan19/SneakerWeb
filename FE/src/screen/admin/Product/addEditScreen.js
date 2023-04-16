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
        imageOuter: product?.imageOuter || '',
        imageInner: product?.imageInner || '',
        imageFront: product?.imageFront || '',
        imageBehind: product?.imageBehind || '',
        imageAbove: product?.imageAbove || '',
        imageUnder: product?.imageUnder || '',
        sample: product?.sample || '',
        name: product?.colorName || '',
        price: product?.price || '',
        discount: product?.discount || 0,
        sizeMin: product?.sizeMin || SIZE_OPTION[0].value,
        sizeMax: product?.sizeMax || SIZE_OPTION[0].value,
    }

    const handleSubmit = (values, {resetForm}) => {
        const formData = new FormData()
        Object.keys(values).forEach((key) => {
            if(Array.isArray(values[key])) {
                values[key].forEach(item => {
                    formData.append(key, item);
                });
            } else {
                formData.append(key, values[key]);
            }
        })
        
        if(isAddMode) {
            axiosPrivate
                .post('product/', formData, 
                    { headers: {
                        token: employee?.accessToken,
                        "Content-Type": "multipart/form-data",
                    }}
                )
                .then((res) => {
                    resetForm();
                    toast.success(res.message, TOAST_DEFAULT_STYLE);
                })
                .catch((err) => {
                    toast.error(err.message, TOAST_DEFAULT_STYLE);
                })
        } else {

            console.log('d');
            axiosPrivate
                .put(`product/${id}`, formData,
                    { headers: {
                        token: employee?.accessToken,
                        "Content-Type": "multipart/form-data",
                    }}
                )
                .then((res) => {
                    toast.success(res.message, {...TOAST_DEFAULT_STYLE, autoClose: 1500});
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
                        to="/admin/product-sample/add"
                        size="large"
                        variant="contained" 
                        color="btnInfo" 
                        sx={{ ml: 2 }}
                    >
                        Thêm mẫu giày
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

export default AddEditProduct;