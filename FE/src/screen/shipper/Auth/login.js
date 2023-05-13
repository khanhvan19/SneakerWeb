import { Box, Button, Divider, Typography } from "@mui/material";
import SecretField from "components/ui/FormField/secretField";
import { LOGIN } from "constants/validationForm";
import { FastField, Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as image from 'assets/images'
import TextField from "components/ui/FormField/textField";
import { AlternateEmail, VpnKeyOutlined } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { handleShipperLogin } from "redux/slices/shipperAuth.slice";
import { toast } from "react-toastify";
import { TOAST_CENTER_STYLE } from "assets/styles/constantsStyle";
var windowHeight = window.innerHeight;

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const initValue = {
        email: '',
        password: '',
    }

    const handleLogin = (values, {resetForm}) => {
        dispatch(handleShipperLogin(values))
            .unwrap()
            .then((res) => {
                resetForm();
                navigate('/shipper/', {replace: true})
            })
            .catch((err) => {
                toast.error(err.message, {...TOAST_CENTER_STYLE, theme: "colored" })
            })
    }

    return (
        <Box className='content-center' flexDirection='column' height={windowHeight}>
            <Box className='content-bottom-center' mb={4}>
                <Box component='img' src={image.logoLight} alt="" width='50%' />
                <Divider 
                    orientation="vertical"
                    sx={{ 
                        height: '76%', ml: 2, mr: 1, 
                        borderRightWidth: 6, borderColor: 'inherit' 
                    }} 
                />
                <Typography variant="h3" lineHeight={0.8} textTransform='uppercase'>
                    shipper
                </Typography>
            </Box>
            <Formik
                enableReinitialize
                initialValues={initValue}
                validationSchema={LOGIN}
                onSubmit={handleLogin}
            >
                {formikProps => {
                    const { values, errors, touched } = formikProps;
                    console.log({ values, errors, touched })

                    return (
                        <Box component={Form} width='100%'>
                            <Box>
                                <FastField
                                    name="email"
                                    component={TextField}
                                    placeholder="Email"
                                    startLabel={<AlternateEmail />}
                                />
                            </Box>
                            <Box mt={3}>
                                <FastField
                                    name="password"
                                    component={SecretField}
                                    placeholder="Mật khẩu"
                                    startLabel={<VpnKeyOutlined />}
                                />
                            </Box>
                            <Box mt={3}>
                                <Button
                                    type="submit"
                                    fullWidth variant="contained" size="large" color="btnDark"
                                    sx={{ py: 1.5 ,textTransform: "uppercase", fontSize: 18 }}
                                >
                                    Đăng nhập
                                </Button>
                            </Box>
                            <Box mt={3} textAlign='center'>
                                <Typography color='text.secondary'>
                                    Bạn quên mật khẩu?
                                    <Box
                                        pl={0.75} component={Link} to='/shipper/reset-password'
                                        color='text.primary' sx={{ textDecoration: 'underline' }}
                                    >
                                        Khôi phục mật khẩu
                                    </Box>
                                </Typography>
                            </Box>
                        </Box>
                    )
                }}
            </Formik>
        </Box>
    );
}

export default Login;