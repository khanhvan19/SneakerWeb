import { useRef } from "react";
import { Link } from "react-router-dom";
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
import AddForm from "./addForm";
import { TOAST_DEFAULT_STYLE } from "assets/styles/constantsStyle";
import { BREADCRUMB_ADMIN_IMPORT } from "constants/breadcrumb";

function AddImport() {
    const employee = useSelector((state) => state.auth?.login?.data);
    const addFormRef = useRef()

    const initValue = {
        name: '',
        warehouse: '',
        supplier: '',
        description: '',
        products: [{
            product: '', 
            price: '', 
            detail: [{
                version: '',
                size: '',
                quantity: '',
            }],  
        }],
    }

    const handleSubmit = (values, actions) => {
        console.log('submit', values, actions)
  
        axiosPrivate
            .post('import/', {...values, employee: employee?._id}, 
                { headers: { token: employee?.accessToken }}
            )
            .then((res) => {
                actions.resetForm();
                addFormRef.current.resetSteps();
                toast.success(res.message, TOAST_DEFAULT_STYLE);
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
                        Thêm phiếu nhập
                    </Typography>
                    <RouterBreadcrumbs 
                        prevLink={BREADCRUMB_ADMIN_IMPORT}
                        currentPage="Thêm phiếu nhập"
                        homeIcon={<Speed />}
                    /> 
                </Box>
                <Box>
                    <Button 
                        component={Link}
                        to="/admin/import"
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
                        Thêm sản phẩm
                    </Button>
                </Box>
            </Box>
            <AddForm
                initValue={initValue}
                onSubmit={handleSubmit}
                ref={addFormRef}
            />
        </>
    );
}

export default AddImport;