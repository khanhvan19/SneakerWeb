import { Box, Button, Paper, Typography } from "@mui/material";
import { FastField, Form, Formik } from "formik";
import Grid from '@mui/material/Unstable_Grid2';
import { useDispatch, useSelector } from "react-redux";
import FileField from "components/ui/FormField/fileField";
import TextField from "components/ui/FormField/textField";
import RadioField from "components/ui/FormField/radioField";
import { SEX_OPTION } from "constants/optionSelectField";
import { toast } from "react-toastify";
import { TOAST_CENTER_STYLE } from "assets/styles/constantsStyle";
import { handleCustomerChangeInfo } from "redux/slices/clientAuth.slice";

function UpdateProfile() {
    const loginData = useSelector((state) => state.client?.login?.data);
    const dispatch = useDispatch()
    
    const initValue = {
        name: loginData?.name || '',
        phone: loginData?.phone || '',
        sex: loginData?.sex || '',
        birthday: loginData?.birthday?.slice(0, 10) || '',
        avatar: loginData?.avatar || ''
    }

    const handleSubmit = (values) => {
        const formData = new FormData()
        Object.keys(values).forEach((key) => {
            formData.append(key, values[key])
        })
        dispatch(handleCustomerChangeInfo({
                id: loginData?._id,
                formData: formData
            }))
            .unwrap()
            .then((res) => {
                toast.success('Lưu thay đổi thành công', TOAST_CENTER_STYLE);
            })    
            .catch((err) => {
                toast.error(err.message, TOAST_CENTER_STYLE);
            })
    }

    return (
        <Box flex={1}>
            <Typography variant='h5' mb={2}>Thông tin tài khoản</Typography>
            <Paper elevation={2} sx={{ borderRadius: 0, mb: 1.5, py: 7 }}>
                <Formik
                    enableReinitialize
                    initialValues={initValue}
                    onSubmit={handleSubmit}
                >
                    {formikProps => {
                        const { values, errors, touched, isSubmitting } = formikProps;

                        console.log({ values, errors, touched });

                        return (
                            <Form>
                                <Grid container spacing={2.5}>
                                    <Grid xs={8} container alignItems='center'>
                                        <Grid xs={4}>
                                            <Typography textAlign='end' color='text.secondary'>
                                                Email đăng nhập
                                            </Typography>
                                        </Grid>
                                        <Grid xs={8} height={40}>
                                            {loginData?.email}
                                        </Grid>
                                        <Grid xs={4} textAlign='end' color='text.secondary'>
                                            Họ và tên
                                        </Grid>
                                        <Grid xs={8}>
                                            <FastField 
                                                name="name"
                                                component={TextField}
                                                size='small' sx={{ borderRadius: 0 }}
                                            />
                                        </Grid>
                                        <Grid xs={4} textAlign='end' color='text.secondary'>
                                            Số điện thoại
                                        </Grid>
                                        <Grid xs={8}>
                                            <FastField 
                                                name='phone'
                                                component={TextField}
                                                size='small' sx={{ borderRadius: 0 }}
                                            />
                                        </Grid>
                                        <Grid xs={4} textAlign='end' color='text.secondary'>
                                            Giới tính
                                        </Grid>
                                        <Grid xs={8}>
                                            <FastField 
                                                name='sex'
                                                component={RadioField}
                                                size='small' sx={{ borderRadius: 0 }}
                                                options={SEX_OPTION}
                                            />
                                        </Grid>
                                        <Grid xs={4} textAlign='end' color='text.secondary'>
                                            Ngày sinh
                                        </Grid>
                                        <Grid xs={8}>
                                            <FastField 
                                                name='birthday'
                                                component={TextField}
                                                size='small' sx={{ borderRadius: 0 }}
                                                type='date'
                                            />
                                        </Grid>
                                        <Grid xs={8} xsOffset={4}>
                                            <Button
                                                type="reset"
                                                variant="contained" 
                                                size="large" color="btnGray"
                                                onClick={formikProps.resetForm}
                                                sx={{ borderRadius: 0, mr: 2 }}
                                            >
                                                Nhập lại
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                size="large" color="btnDark"
                                                sx={{ borderRadius: 0 }}
                                            >
                                                Lưu chỉnh sửa
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Grid xs={4} sx={{ borderLeft: '1px solid', borderColor: 'divider' }}>
                                        <Box className="content-center" height='100%'>
                                            <FastField
                                                name="avatar"
                                                component={FileField}
                                                insideLabel="Hình đại diện"
                                                height={200}
                                                width={200}
                                                shape="circle"
                                            
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Form>
                        )
                    }}
                </Formik>
            </Paper>
        </Box>
    );
}

export default UpdateProfile;