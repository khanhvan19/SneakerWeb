import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";

import {  
    Typography, 
    Box, 
    Button, 
} from "@mui/material";
import { ArrowBackOutlined, Speed } from "@mui/icons-material";
import { toast } from 'react-toastify';

import axiosPrivate from "utils/axiosPrivate";
import RouterBreadcrumbs from "components/ui/breadcrumbs";
import AddEditForm from "./addEditForm";
import { TOAST_DEFAULT_STYLE } from "assets/styles/constantsStyle";
import { BREADCRUMB_ADMIN_VOUCHER } from "constants/breadcrumb";


function AddEditVoucher() {
    const employee = useSelector((state) => state.auth?.login?.data);
    var { id } = useParams();
    var navigate = useNavigate();

    const [voucher, setVoucher] = useState({});
    const isAddMode = !id;

    useEffect(() => {
        (id != null) && axiosPrivate
            .get(`voucher/${id}`)
            .then((res) => {
                setVoucher(res);
            })
    }, [id])

    const initValue = {
        name: voucher?.name || '',
        type: voucher?.type || '',
        start: voucher?.start || '',
        end: voucher?.end || '',
        discountRate: voucher?.discountRate || '',
        discountPrice: voucher?.discountPrice || '',
        minPriceCondition: voucher?.minPriceCondition || '',
        brandCondition: voucher?.brandCondition || '',
        description: voucher?.description || '',
    }

    const handleSubmit = (values, {resetForm}) => {
        
        if(isAddMode) {
            axiosPrivate
                .post('/voucher', values, 
                    { headers: { token: employee?.accessToken }}
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
                .put(`voucher/${id}`, values,
                    { headers: { token: employee?.accessToken }}
                )
                .then((res) => {
                    toast.success(res.message, {...TOAST_DEFAULT_STYLE, autoClose: 1500});
                    setTimeout(() => {
                        navigate('/admin/voucher', { replace: true })
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
                        {(id == null) ? "Thêm phiếu giảm giá" : "Chỉnh sửa phiếu giảm giá"}
                    </Typography>
                    <RouterBreadcrumbs 
                        prevLink={BREADCRUMB_ADMIN_VOUCHER}
                        currentPage={(id == null) ? "Thêm phiếu giảm giá" : "Chỉnh sửa phiếu giảm giá"}
                        homeIcon={<Speed />}
                    /> 
                </Box>
                <Button 
                    component={Link}
                    to="/admin/voucher"
                    size="large"
                    variant="contained" 
                    color="btnGray" 
                    startIcon={<ArrowBackOutlined />}
                >
                    Trở lại
                </Button>
            </Box>
            <AddEditForm
                isAddMode={isAddMode}
                initValue={initValue}
                onSubmit={handleSubmit}
            />
        </>
    );
}

export default AddEditVoucher;