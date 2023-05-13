import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
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
import { TOAST_DEFAULT_STYLE } from "assets/styles/constantsStyle";
import { BREADCRUMB_ADMIN_PRODUCT } from "constants/breadcrumb";

function AddEditProduct() {
    const employee = useSelector((state) => state.auth?.login?.data);
    const navigate = useNavigate();
    const location = useLocation();
    var { id } = useParams();
    var idAddInfo = location.state;
    const isAddMode = !id;
    
    const [version, setVersion] = useState({});

    useEffect(() => {
        (id != null) && axiosPrivate
            .get(`version/${id}`)
            .then((res) => {
                setVersion(res);
            })
    }, [id])

    const initValue = {
        product: version?.product || idAddInfo || '',
        name: version?.name || '',
        imageOuter: version?.imageOuter || '',
        imageInner: version?.imageInner || '',
        imageFront: version?.imageFront || '',
        imageBehind: version?.imageBehind || '',
        imageAbove: version?.imageAbove || '',
        imageUnder: version?.imageUnder || '',
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
                .post('version/', formData, 
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
            axiosPrivate
                .put(`version/${id}`, formData,
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
                        {(id == null) ? "Thêm phiên bản" : "Chỉnh sửa phiên bản"}
                    </Typography>
                    <RouterBreadcrumbs 
                        prevLink={BREADCRUMB_ADMIN_PRODUCT}
                        currentPage={(id == null) ? "Thêm phiên bản" : "Chỉnh sửa phiên bản"}
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
                        to="/admin/product/info/add"
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
        </>
    );
}

export default AddEditProduct;