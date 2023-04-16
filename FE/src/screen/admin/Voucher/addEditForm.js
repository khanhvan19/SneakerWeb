import { useEffect, useState } from 'react';
import { FastField, Field, Form, Formik } from "formik";
import { useSelector } from 'react-redux';

import { Button, Paper } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { ADD_EDIT_VOUCHER } from 'constants/validationForm';
import axiosPrivate from 'utils/axiosPrivate';

import TextField from 'components/ui/FormField/textField';
import SelectField from 'components/ui/FormField/selectField';
import { TYPE_VOUCHER_OPTION} from 'constants/optionSelectField';
import TextAreaField from 'components/ui/FormField/textAreaField';

function AddEditForm({ isAddMode, initValue, onSubmit }) {
    const employee = useSelector((state) => state.auth?.login?.data);
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        axiosPrivate
            .get("brand/", { headers: { token: employee?.accessToken} })
            .then((res) => {
                res.unshift({value: "", label: "Bỏ chọn"});
                setBrands(res)
            })
            .catch((err) => console.log(err))
    }, [employee])

    return (  
        <Formik
            enableReinitialize
            initialValues={initValue}
            validationSchema={ADD_EDIT_VOUCHER}
            onSubmit={onSubmit}
        >
            {formikProps => {
                const { values, errors, touched, isSubmitting } = formikProps;
                
                console.log({values, errors, touched});

                return (
                    <Form>
                        <Paper sx={{ backgroundImage: "none", mt: 3, p: 2 }} elevation={4}>
                            <Grid container spacing={2} >
                                <Grid xs={6}>
                                    <Field
                                        name="name"
                                        component={TextField}
                                        label="Tên Voucher"
                                    /> 
                                </Grid>
                                <Grid xs={6}>
                                    <FastField
                                        name="type"
                                        component={SelectField}
                                        label="Loại Voucher"
                                        options={TYPE_VOUCHER_OPTION}
                                    /> 
                                </Grid>
                                <Grid xs={6}>
                                    <FastField
                                        name="start"
                                        component={TextField}
                                        label="Ngày bắt đầu"
                                        type="datetime-local"
                                    /> 
                                </Grid>
                                <Grid xs={6}>
                                    <FastField
                                        name="end"
                                        component={TextField}
                                        label="Ngày kết thúc"
                                        type="datetime-local"
                                    /> 
                                </Grid>
                                <Grid xs={6}>
                                    <Field
                                        name="discountRate"
                                        component={TextField}
                                        label="Tỉ lệ giảm"
                                        type="number"
                                        endLabel="%"
                                        disabled={values.discountPrice ? true : false}
                                    /> 
                                </Grid>
                                <Grid xs={6}>
                                    <Field
                                        name="discountPrice"
                                        component={TextField}
                                        label="Mức giảm giá"
                                        type="number"
                                        endLabel="VND"
                                        disabled={values.discountRate ? true : false}
                                    /> 
                                </Grid>
                                <Grid xs={6}>
                                    <Field
                                        name="minPriceCondition"
                                        component={TextField}
                                        label="Đơn hàng tối thiểu"
                                        type="number"
                                        endLabel="VND"
                                    /> 
                                </Grid>
                                <Grid xs={6}>
                                    <Field
                                        name="brandCondition"
                                        component={SelectField}
                                        label="Thương hiệu giảm"
                                        options={brands}
                                    /> 
                                </Grid>
                                <Grid xs={12}>
                                    <FastField
                                        name="description"
                                        component={TextAreaField}
                                        label="Mô tả chi tiết"
                                        rows={3}
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