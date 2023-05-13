import { useEffect, useState } from 'react';
import { FastField, Field, Form, Formik } from "formik";

import { Box, Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import TextField from 'components/ui/FormField/textField';
import SelectField from 'components/ui/FormField/selectField';
import axiosPublic from 'utils/axiosPublic';
import { ADD_EDIT_ADDRESS_CUSTOMER } from 'constants/validationForm';

function AddEditForm({ isAddMode, initValue, onSubmit }, ref) {
    const [provinces, setProvinces] = useState([])
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])

    useEffect(() => {
        var newData = [];
        axiosPublic
            .get("shipping/province")
            .then((res) => {
                res.forEach(item => {
                    newData.push({
                            value: item.ProvinceID, 
                            label: item.ProvinceName
                        })
                });
                setProvinces(newData);
            })
            .catch((err) => { console.log(err) });
    }, [])

    useEffect(() => {
        initValue.province !== '' && fetchDistricts(initValue?.province);
        initValue.district !== '' && fetchWards(initValue?.district);
    }, [initValue])

    const fetchDistricts = (provinceId) => {
        var newData = [];
        axiosPublic
            .post('shipping/district', { province: provinceId })
            .then((res) => {
                res.forEach(item => {
                    newData.push({
                            value: item.DistrictID, 
                            label: item.DistrictName
                        })
                });
                setDistricts(newData);
            })
    }

    const fetchWards = (districtId) => {
        var newData = [];
        axiosPublic
            .post('shipping/ward', { district: districtId })
            .then((res) => {
                res.forEach(item => {
                    newData.push({
                        value: item.WardCode, 
                        label: item.WardName
                    })
                });
                setWards(newData);
            })
    }

    return (  
        <Formik
            enableReinitialize
            initialValues={initValue}
            validationSchema={ADD_EDIT_ADDRESS_CUSTOMER}
            onSubmit={onSubmit}
        >
            {formikProps => {
                const { values, errors, touched, isSubmitting } = formikProps;
                
                console.log({values, errors, touched})

                const handleProvinceChange = (e) => {
                    formikProps.handleChange(e);
                    formikProps.setFieldValue('district', '')
                    formikProps.setFieldValue('ward', '')
                    fetchDistricts(e.target.value)
                }

                const handleDistrictChange = (e) => {
                    formikProps.handleChange(e);
                    formikProps.setFieldValue('ward', '')
                    fetchWards(e.target.value)
                }
                
                return (
                    <Form>
                        <Grid container spacing={2}>
                            <Grid xs={6}>
                                <Box>
                                    <Grid container spacing={2}>
                                        <Grid xs={12}>
                                            <FastField
                                                name="name"
                                                component={TextField}
                                                label="Họ tên"
                                                sx={{ borderRadius: 0 }}
                                            /> 
                                        </Grid>
                                        <Grid xs={12}>
                                            <FastField
                                                name="phone"
                                                component={TextField}
                                                label="Số điện thoại"
                                                sx={{ borderRadius: 0 }}
                                            /> 
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                            <Grid xs={6}>
                                <Box>
                                    <Grid container spacing={2}>
                                        <Grid xs={12}>
                                            <Field
                                                name="province"
                                                component={SelectField}
                                                label="Tỉnh/Thành phố"
                                                options={provinces}
                                                onChangeOther={handleProvinceChange}
                                                sx={{ borderRadius: 0 }}
                                            /> 
                                        </Grid>
                                        <Grid xs={12}>
                                            <Field
                                                name="district"
                                                component={SelectField}
                                                label="Quận/Huyện"
                                                options={districts}
                                                onChangeOther={handleDistrictChange}
                                                sx={{ borderRadius: 0 }}
                                            /> 
                                        </Grid>
                                        <Grid xs={12}>
                                            <Field
                                                name="ward"
                                                component={SelectField}
                                                label="Phường/Xã"
                                                options={wards}
                                                sx={{ borderRadius: 0 }}
                                            /> 
                                        </Grid>
                                        <Grid xs={12}>
                                            <FastField
                                                name="addressDetail"
                                                component={TextField}
                                                label="Địa chỉ chi tiết"
                                                sx={{ borderRadius: 0 }}
                                            /> 
                                        </Grid>   
                                    </Grid>
                                </Box>
                            </Grid>
                            <Grid xs={6} xsOffset={6} mt={1}>
                                <Box>
                                    <Grid container spacing={2}>
                                        <Grid xs={6}>
                                            <Button
                                                type="reset"
                                                fullWidth variant="contained" 
                                                size="large" color="btnGray"
                                                onClick={formikProps.resetForm}
                                                sx={{ borderRadius: 0 }}
                                            >
                                                Tạo lại
                                            </Button>
                                        </Grid>
                                        <Grid xs={6}>
                                            <Button
                                                type="submit"
                                                fullWidth variant="contained"
                                                size="large" color="btnDark"
                                                sx={{ borderRadius: 0 }}
                                            >
                                                {(isAddMode) ? "Thêm mới" : "Chỉnh sửa"} 
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>      
                    </Form>
                )
            }}
        </Formik>
    );
}

export default AddEditForm;