import { useEffect, useState } from 'react';
import { FastField, Field, Form, Formik } from "formik";
import { useSelector } from 'react-redux';

import { Box, Button, Paper } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { ADD_EDIT_PRODUCT } from 'constants/validationForm';
import axiosPrivate from 'utils/axiosPrivate';

import TextField from 'components/ui/FormField/textField';
import SelectField from 'components/ui/FormField/selectField';
import { SIZE_OPTION} from 'constants/optionSelectField';
import FileField from 'components/ui/FormField/fileField';

var SIZE_MAX_OPTION = SIZE_OPTION;

function AddEditForm({ isAddMode, initValue, onSubmit }) {
    const employee = useSelector((state) => state.auth?.login?.data);
    const [samples, setSamples] = useState([])

    useEffect(() => {
        axiosPrivate
            .get("sample/", { headers: { token: employee?.accessToken} })
            .then((res) => setSamples(res))
            .catch((err) => console.log(err))
    }, [employee])
    
    return (  
        <Formik
            enableReinitialize
            initialValues={initValue}
            validationSchema={ADD_EDIT_PRODUCT}
            onSubmit={onSubmit}
        >
            {formikProps => {
                const { values, errors, touched, isSubmitting } = formikProps;
                
                console.log({values, errors, touched});

                const handleSizeChange = (e) => {
                    formikProps.handleChange(e);
                    const idxSizeMin =  SIZE_OPTION.findIndex(
                        (item) => item.value === e.target.value
                    );
                    SIZE_MAX_OPTION = SIZE_OPTION.slice(idxSizeMin);
                    formikProps.setFieldValue('sizeMax', e.target.value)
                }

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
                                            height={120}
                                            width={120}
                                        /> 
                                    </Grid>
                                    <Grid xs={2}>
                                        <FastField
                                            name="imageInner"
                                            component={FileField}
                                            insideLabel="Bên trong"
                                            height={120}
                                            width={120}
                                        /> 
                                    </Grid>
                                    <Grid xs={2}>
                                        <FastField
                                            name="imageFront"
                                            component={FileField}
                                            insideLabel="Phía trước"
                                            height={120}
                                            width={120}
                                        />
                                    </Grid> 
                                    <Grid xs={2}>
                                        <FastField
                                            name="imageBehind"
                                            component={FileField}
                                            insideLabel="Phía sau"
                                            height={120}
                                            width={120}
                                        />
                                    </Grid> 
                                    <Grid xs={2}>
                                        <FastField
                                            name="imageAbove"
                                            component={FileField}
                                            insideLabel="Bên trên"
                                            height={120}
                                            width={120}
                                        />
                                    </Grid> 
                                    <Grid xs={2}>
                                        <FastField
                                            name="imageUnder"
                                            component={FileField}
                                            insideLabel="Bên dưới"
                                            height={120}
                                            width={120}
                                        />
                                    </Grid> 
                                </Grid>
                                <Grid xs={6}>
                                    <Field
                                        name="sample"
                                        component={SelectField}
                                        label="Mẫu sản phẩm"
                                        options={samples}
                                    /> 
                                </Grid>
                                <Grid xs={6}>
                                    <FastField
                                        name="name"
                                        component={TextField}
                                        label="Tên sản phẩm"
                                    /> 
                                </Grid>
                                <Grid xs={6}>
                                    <FastField
                                        name="price"
                                        component={TextField}
                                        type="number"
                                        label="Giá bán"
                                        endLabel="VND"
                                    /> 
                                </Grid>
                                <Grid xs={6}>
                                    <FastField
                                        name="discount"
                                        component={TextField}
                                        label="Mức giảm giá"
                                        type="number"
                                        endLabel="%"
                                    /> 
                                </Grid>
                                <Grid xs={6}>
                                    <Field
                                        name="sizeMin"
                                        component={SelectField}
                                        label="Size nhỏ nhất"
                                        options={SIZE_OPTION}
                                        onChangeOther={handleSizeChange}
                                    /> 
                                </Grid>
                                <Grid xs={6}>
                                    <Field
                                        name="sizeMax"
                                        component={SelectField}
                                        label="Size lớn nhất"
                                        options={values.sizeMin === SIZE_OPTION[0]?.value 
                                            ? SIZE_OPTION
                                            : SIZE_MAX_OPTION
                                        }
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