import { Box, Button, Divider, Typography } from "@mui/material";
import { TOAST_CENTER_STYLE, TOAST_NAVIGATE_CENTER_STYLE } from "assets/styles/constantsStyle";
import SecretField from "components/ui/FormField/secretField";
import TextField from "components/ui/FormField/textField";
import { REGISTER } from "constants/validationForm";
import { FastField, Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosPublic from "utils/axiosPublic";

function Login() {
    const navigate = useNavigate();

    const initValue = {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    }

    const handleRegister = (values, {resetForm}) => {
        axiosPublic
            .post('customer/register', {
                name: values.name, 
                email: values.email,
                password: values.password
            })
            .then((res) => {
                resetForm();
                toast.success(res.message, TOAST_NAVIGATE_CENTER_STYLE);
                setTimeout(() => {
                    navigate('/login', {replace: true})
                }, 2000)
            })
            .catch((err) => {
                toast.error(err.message, TOAST_CENTER_STYLE);
            })
    }

    return (  
        <>
            <Box className='content-center' py={4}>
                <Typography 
                    component={Link} to='/login'  replace={true}
                    variant="h4" textTransform='uppercase' color='divider'
                >
                    Đăng nhập
                </Typography>
                <Divider orientation="vertical" flexItem sx={{ mx: 4, borderWidth: '2px' }} />
                <Typography variant="h4" textTransform='uppercase'>
                    Đăng ký
                </Typography>
            </Box>
            <Box maxWidth={500} mx={'auto'} > 
                <Formik
                    enableReinitialize
                    initialValues={initValue}
                    validationSchema={REGISTER}
                    onSubmit={handleRegister}
                >
                    {formikProps => {
                        const { values, errors, touched, isSubmitting } = formikProps;
                        console.log({values, errors, touched})
                        
                        return (
                            <Form>
                                <Box mt={3}>
                                    <FastField
                                        name="name"
                                        component={TextField}
                                        label="Họ & tên"
                                        placeholder="Vui lòng nhập Họ & tên"
                                        sx={{ borderRadius: '0px' }}
                                    /> 
                                </Box>
                                <Box mt={3}>
                                    <FastField
                                        name="email"
                                        component={TextField}
                                        label="E-mail"
                                        placeholder="Vui lòng nhập Email"
                                        sx={{ borderRadius: '0px' }}
                                    /> 
                                </Box>
                                <Box mt={3}>
                                    <FastField
                                        name="password"
                                        component={SecretField}
                                        label="Mật khẩu"
                                        placeholder="Vui lòng nhập mật khẩu"
                                        sx={{ borderRadius: '0px' }}
                                    /> 
                                </Box>
                                <Box mt={3}>
                                    <FastField
                                        name="confirmPassword"
                                        component={SecretField}
                                        label="Mật khẩu"
                                        placeholder="Vui lòng nhập trùng khớp mật khẩu"
                                        sx={{ borderRadius: '0px' }}
                                    /> 
                                </Box>
                                <Box mt={3} className='content-left-center'>
                                    <Box flex={1}>
                                        <Button
                                            fullWidth
                                            type="submit"
                                            variant="contained"
                                            size="large" color="btnDark"
                                            sx={{ 
                                                borderRadius: '0px', 
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            Đăng ký
                                        </Button>
                                    </Box>
                                    <Box ml={2}>
                                        <Typography color='text.secondary' fontSize={14}>
                                            Bạn đã có tài khoản?
                                            <Box 
                                                pl={0.75} component={Link} to='/login'  replace={true}
                                                color='text.primary' sx={{ textDecoration: 'underline' }}
                                            >
                                                Đăng nhập ngay
                                            </Box>
                                        </Typography>
                                    </Box>
                                </Box>
                            </Form>
                        )}}
                </Formik>
            </Box>
        </>
    );
}

export default Login;