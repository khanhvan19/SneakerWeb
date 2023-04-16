import { useEffect, useState } from 'react';
import { FastField, Field, Form, Formik } from "formik";
import { ADD_EMPLOYEE, EDIT_EMPLOYEE, EDIT_PROFILE_EMPLOYEE } from 'constants/validationForm';

import { Button, Paper } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import TextField from 'components/ui/FormField/textField';
import SelectField from 'components/ui/FormField/selectField';
import SecretField from 'components/ui/FormField/secretField';
import FileField from 'components/ui/FormField/fileField';
import axiosPublic from 'utils/axiosPublic';
import { ROLE_OPTION, SEX_OPTION } from 'constants/optionSelectField';

function AddEditForm({ isProfile, isAddMode, initValue, onSubmit }) {
    const [provinces, setProvinces] = useState([])
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])

    useEffect(() => {
        var newData = [];
        axiosPublic
            .get("region/province")
            .then((res) => {
                res.forEach(item => {
                    newData.push({
                            value: item.province_id, 
                            label: item.province_name
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
            .get(`region/district/${provinceId}`)
            .then((res) => {
                res.forEach(item => {
                    newData.push({
                            value: item.district_id, 
                            label: item.district_name
                        })
                });
                setDistricts(newData);
            })
    }

    const fetchWards = (districtId) => {
        var newData = [];
        axiosPublic
            .get(`region/ward/${districtId}`)
            .then((res) => {
                res.forEach(item => {
                    newData.push({
                            value: item.ward_id, 
                            label: item.ward_name
                        })
                });
                setWards(newData);
            })
    }

    return (  
        <Formik
            enableReinitialize
            initialValues={initValue}
            validationSchema={(isAddMode) 
                ? ADD_EMPLOYEE 
                : (!isProfile)
                    ? EDIT_EMPLOYEE
                    : EDIT_PROFILE_EMPLOYEE
            }
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
                        <Grid container spacing={2} mt={3}>
                            <Grid xs={4}>
                                <Paper 
                                    elevation={4}
                                    className="content-center"
                                    sx={{ 
                                        flexDirection: "column",
                                        p: 2, height: "100%", 
                                        position: "relative",
                                        backgroundImage: "none",
                                    }} 
                                >
                                    <FastField
                                        name="avatar"
                                        component={FileField}
                                        label="Hình đại diện"
                                        height={200}
                                        width={200}
                                        shape="circle"
                                    /> 
                                </Paper>
                            </Grid>
                            <Grid xs={8}>
                                <Paper sx={{ backgroundImage: "none" }} elevation={4}>
                                    <Grid container m={0}>
                                        <Grid xs={6}>
                                            <FastField
                                                name="name"
                                                component={TextField}
                                                label="Họ tên"
                                            /> 
                                        </Grid>
                                        {(!isProfile) && ( 
                                            <Grid xs={6}>
                                                <FastField
                                                    name="role"
                                                    component={SelectField}
                                                    label="Chức vụ"
                                                    options={ROLE_OPTION}
                                                /> 
                                            </Grid>
                                        )}
                                        {(isAddMode || isProfile) && (   
                                            <Grid xs={6}>
                                                <FastField
                                                    name="email"
                                                    component={TextField}
                                                    label="Email"
                                                    /> 
                                            </Grid>
                                        )}
                                        {(isAddMode) && (
                                            <Grid xs={6}>
                                                <FastField
                                                    name="password"
                                                    component={SecretField}
                                                    label="Mật khẩu"
                                                /> 
                                            </Grid>
                                        )}
                                        <Grid xs={6}>
                                            <FastField
                                                name="sex"
                                                component={SelectField}
                                                label="Giới tính"
                                                options={SEX_OPTION}
                                            /> 
                                        </Grid>
                                        <Grid xs={6}>
                                            <FastField
                                                name="birthday"
                                                component={TextField}
                                                label="Ngày sinh"
                                                type="date"
                                            /> 
                                        </Grid>
                                        <Grid xs={6}>
                                            <FastField
                                                name="phone"
                                                component={TextField}
                                                label="Số điện thoại"
                                            /> 
                                        </Grid>
                                        <Grid xs={6}>
                                            <Field
                                                name="province"
                                                component={SelectField}
                                                label="Tỉnh/Thành phố"
                                                options={provinces}
                                                onChangeOther={handleProvinceChange}
                                            /> 
                                        </Grid>
                                        <Grid xs={6}>
                                            <Field
                                                name="district"
                                                component={SelectField}
                                                label="Quận/Huyện"
                                                options={districts}
                                                onChangeOther={handleDistrictChange}
                                            /> 
                                        </Grid>
                                        <Grid xs={6}>
                                            <Field
                                                name="ward"
                                                component={SelectField}
                                                label="Phường/Xã"
                                                options={wards}
                                            /> 
                                        </Grid>
                                        <Grid xs={12}>
                                            <FastField
                                                name="addressDetail"
                                                component={TextField}
                                                label="Địa chỉ chi tiết"
                                            /> 
                                        </Grid>
                                        <Grid xs={6} xsOffset={6} container>
                                            <Grid xs={6}>
                                                <Button
                                                    type="reset"
                                                    fullWidth variant="contained" 
                                                    size="large" color="btnGray"
                                                    onClick={formikProps.resetForm}
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
                            </Grid>
                        </Grid>
                    </Form>
                )
            }}
        </Formik>
    );
}

export default AddEditForm;