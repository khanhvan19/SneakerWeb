import { useEffect, useState } from 'react';
import { FastField, Field, Form, Formik } from "formik";
import { useSelector } from 'react-redux';

import { Box, Button, Paper } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { ADD_EDIT_VERSION_PRODUCT } from 'constants/validationForm';
import axiosPrivate from 'utils/axiosPrivate';

import TextField from 'components/ui/FormField/textField';
import SelectField from 'components/ui/FormField/selectField';
import FileField from 'components/ui/FormField/fileField';

function AddEditForm({ isAddMode, initValue, onSubmit }) {
    const employee = useSelector((state) => state.auth?.login?.data);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axiosPrivate
            .get("product/name", { headers: { token: employee?.accessToken} })
            .then((res) => setProducts(res))
            .catch((err) => console.log(err))
    }, [employee])
    

    return (  
        <Formik
            enableReinitialize
            initialValues={initValue}
            validationSchema={ADD_EDIT_VERSION_PRODUCT}
            onSubmit={onSubmit}
        >
            {formikProps => {
                const { values, errors, touched, isSubmitting } = formikProps;
                
                console.log({values, errors, touched});

                return (
                    <Form>
                        <Paper sx={{ backgroundImage: "none", mt: 3, p: 2 }} elevation={4}>
                            <Grid container spacing={2} >
                                <Grid xs={12} container>
                                    <Grid xs={12}>
                                        <Box color="text.secondary" lineHeight={1}>Hình ảnh sản phẩm</Box>
                                    </Grid>
                                    <Grid xs={2}>
                                        <FastField
                                            name="imageOuter"
                                            component={FileField}
                                            insideLabel="Bên ngoài"
                                            height={140}
                                            width={140}
                                        /> 
                                    </Grid>
                                    <Grid xs={2}>
                                        <FastField
                                            name="imageInner"
                                            component={FileField}
                                            insideLabel="Bên trong"
                                            height={140}
                                            width={140}
                                        /> 
                                    </Grid>
                                    <Grid xs={2}>
                                        <FastField
                                            name="imageFront"
                                            component={FileField}
                                            insideLabel="Phía trước"
                                            height={140}
                                            width={140}
                                        />
                                    </Grid> 
                                    <Grid xs={2}>
                                        <FastField
                                            name="imageBehind"
                                            component={FileField}
                                            insideLabel="Phía sau"
                                            height={140}
                                            width={140}
                                        />
                                    </Grid> 
                                    <Grid xs={2}>
                                        <FastField
                                            name="imageAbove"
                                            component={FileField}
                                            insideLabel="Bên trên"
                                            height={140}
                                            width={140}
                                        />
                                    </Grid> 
                                    <Grid xs={2}>
                                        <FastField
                                            name="imageUnder"
                                            component={FileField}
                                            insideLabel="Bên dưới"
                                            height={140}
                                            width={140}
                                        />
                                    </Grid> 
                                </Grid>
                                <Grid xs={12}>
                                    <Field
                                        name="product"
                                        component={SelectField}
                                        label="Sản phẩm"
                                        options={products}
                                    /> 
                                </Grid>
                                <Grid xs={12}>
                                    <FastField
                                        name="name"
                                        component={TextField}
                                        label="Tên phiên bản"
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