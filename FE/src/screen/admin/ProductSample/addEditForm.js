import { useEffect, useState } from 'react';
import { FastField, Field, Form, Formik } from "formik";
import { useSelector } from 'react-redux';

import { Button, Paper } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { ADD_EDIT_PRODUCT_SAMPLE } from 'constants/validationForm';
import axiosPrivate from 'utils/axiosPrivate';

import TextField from 'components/ui/FormField/textField';
import SelectField from 'components/ui/FormField/selectField';
import MultipleSelectField from 'components/ui/FormField/multipleSelectField';
import MultipleTextField from 'components/ui/FormField/multipleTextField';
import TextAreaField from 'components/ui/FormField/textAreaField';

function AddEditForm({ isAddMode, initValue, onSubmit }) {
    const employee = useSelector((state) => state.auth?.login?.data);
    const [brands, setBrands] = useState([])
    const [categorys, setCategorys] = useState([])

    useEffect(() => {
        axiosPrivate
            .get("brand/", { headers: { token: employee?.accessToken} })
            .then((res) => setBrands(res))
            .catch((err) => console.log(err))
        axiosPrivate
            .get("category/", { headers: { token: employee?.accessToken} })
            .then((res) => setCategorys(res))
            .catch((err) => console.log(err))
    }, [employee])

    return (  
        <Formik
            enableReinitialize
            initialValues={initValue}
            validationSchema={ADD_EDIT_PRODUCT_SAMPLE}
            onSubmit={onSubmit}
        >
            {formikProps => {
                const { values, errors, touched, isSubmitting } = formikProps;
                
                console.log({values, errors, touched})

                return (
                    <Form>
                        <Paper sx={{ backgroundImage: "none", mt: 3, p: 2 }} elevation={4}>
                            <Grid container spacing={2} >
                                <Grid xs={6}>
                                    <FastField
                                        name="name"
                                        component={TextField}
                                        label="Tên mẫu sản phẩm"
                                    /> 
                                </Grid>
                                <Grid xs={6}>
                                    <Field
                                        name="brand"
                                        component={SelectField}
                                        label="Thương hiệu"
                                        options={brands}
                                    /> 
                                </Grid>
                                <Grid xs={12}>
                                    <Field
                                        name="category"
                                        component={MultipleSelectField}
                                        label="Danh mục"
                                        options={categorys}
                                    /> 
                                </Grid>
                                <Grid xs={12}>
                                    <Field
                                        name="gender"
                                        component={MultipleTextField}
                                        label="Loại"
                                        options={[]}
                                    /> 
                                </Grid>
                                <Grid xs={12}>
                                    <FastField
                                        name="description"
                                        component={TextAreaField}
                                    /> 
                                </Grid>
                                <Grid xs={6} xsOffset={6} container>
                                    <Grid xs={6}>
                                        <Button
                                            type="reset"
                                            fullWidth variant="contained" 
                                            size="large" color="btnGray"
                                            onClick={() => formikProps.resetForm({ values: initValue })}
                                        >
                                            Tạo lại
                                        </Button>
                                    </Grid>
                                    <Grid xs={6}>
                                        <Button
                                            type="submit"
                                            fullWidth variant="contained"
                                            size="large" color="btnSuccess"
                                        >
                                            {(isAddMode) ? "Thêm mới" : "Chỉnh sửa"} 
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Form>
                )
            }}
        </Formik>
    );
}

export default AddEditForm;