import { useEffect, useState } from 'react';
import { Field, Form, Formik } from "formik";
import { Box, Button, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from 'components/ui/FormField/textField';
import SelectField from 'components/ui/FormField/selectField';
import axiosPublic from 'utils/axiosPublic';
import { ADD_ITINERARY } from 'constants/validationForm';
import { STATUS_ITINERARY } from 'constants/optionSelectField';
import { toast } from 'react-toastify';
import { TOAST_CENTER_STYLE } from 'assets/styles/constantsStyle';
import FileField from 'components/ui/FormField/fileField';

function ItineraryForm({ orderId , onToggleDrawer, onRefresh }) {
    const [provinces, setProvinces] = useState([])
    const [districts, setDistricts] = useState([])

    const initValue = {
        title: '',
        province: '',
        district: '',
        caption: '',
        proof: '',
    }

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

    const handleSubmit = (values, {resetForm}) => {
        var provinceName = '', districtName = '', caption = '';
        if(values.province !== '') {
            provinceName = provinces.find(e => e.value === values.province).label;
        }
        if(values.district !== '') {
            districtName = districts.find(e => e.value === values.district).label;
        }
        if(provinceName === '' && districtName === '') caption = values.caption;
        else caption = `${values.caption} [${districtName}, ${provinceName}].`;

        const dataSubmit = {
            title: values.title, 
            caption: caption,
            proof: values.proof, 
        }

        const formData = new FormData()
        Object.keys(dataSubmit).forEach((key) => {
            formData.append(key, dataSubmit[key])
        })

        axiosPublic
            .put(`/order/itinerary/${orderId}`, formData)
            .then((res) => {
                resetForm();
                toast.success(res.message, {...TOAST_CENTER_STYLE, theme: 'colored'});
                onToggleDrawer();
                onRefresh();
            })
            .catch((err) => {
                toast.error(err.message, {...TOAST_CENTER_STYLE, theme: 'colored'});
            })
    }

    return (  
        <Formik
            initialValues={initValue}
            validationSchema={ADD_ITINERARY}
            onSubmit={handleSubmit}
        >
            {formikProps => {
                const { values, errors, touched } = formikProps;
                
                console.log({values, errors, touched})

                const handleTitleChange = (e) => {
                    formikProps.handleChange(e);
                    var caption = STATUS_ITINERARY.find(
                        item => item.value === e.target.value
                    ).caption;
                    formikProps.setFieldValue('caption', caption)
                    if(e.target.value !== 'Giao hàng thành công') 
                        formikProps.setFieldValue('proof', '');
                }

                const handleProvinceChange = (e) => {
                    formikProps.handleChange(e);
                    formikProps.setFieldValue('district', '')
                    fetchDistricts(e.target.value)
                }
                
                return (
                    <Form>
                        <Box px={1.5} py={2} overflow='hidden'>
                            <Typography 
                                variant='h6' mb={3} textAlign='center' 
                                textTransform='uppercase' fontWeight={600}
                            >
                                Cập nhật hành trình đơn hàng
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid xs={12}>
                                    <Field
                                        name="title"
                                        component={SelectField}
                                        label="Trạng thái vận chuyển"
                                        options={STATUS_ITINERARY}
                                        onChangeOther={handleTitleChange}
                                        sx={{ borderRadius: 0 }}
                                    /> 
                                </Grid>
                                <Grid xs={12}>
                                    <Field
                                        name="province"
                                        component={SelectField}
                                        label="Vị trí (Tỉnh/Thành phố)"
                                        options={provinces}
                                        onChangeOther={handleProvinceChange}
                                        sx={{ borderRadius: 0 }}
                                    /> 
                                </Grid>
                                <Grid xs={12}>
                                    <Field
                                        name="district"
                                        component={SelectField}
                                        label="Vị trí (Quận/Huyện)"
                                        options={districts}
                                        sx={{ borderRadius: 0 }}
                                    /> 
                                </Grid>
                                <Grid xs={12}>
                                    <Field
                                        name="caption"
                                        component={TextField}
                                        label="Mô tả trạng thái"
                                        sx={{ borderRadius: 0 }}
                                        rows={3}
                                    /> 
                                </Grid>
                                {(values.title === 'Giao hàng thành công') && (
                                    <Grid xs={12}>
                                        <Field
                                            name="proof"
                                            component={FileField}
                                            insideLabel="Bằng chứng giao hàng"
                                            height={120}
                                        />
                                    </Grid>
                                )}
                                <Grid xs={12} mt={1} display='flex'>
                                    <Button
                                        type="reset"
                                        fullWidth variant="contained" 
                                        size="large" color="btnGray"
                                        onClick={formikProps.resetForm}
                                        sx={{ py: 1.5, borderRadius: 0 }}
                                    >
                                        Nhập lại
                                    </Button>
                                    <Button
                                        type="submit"
                                        fullWidth variant="contained"
                                        size="large" color="btnDark"
                                        sx={{ py: 1.5, borderRadius: 0, ml: 2 }}
                                    >
                                        Thêm mới 
                                    </Button>
                                </Grid>
                            </Grid>      
                        </Box>
                    </Form>
                )
            }}
        </Formik>
    );
}

export default ItineraryForm;