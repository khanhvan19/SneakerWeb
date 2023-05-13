import { Alert, Box, Button, Divider, Typography } from "@mui/material";
import { TOAST_NAVIGATE_CENTER_STYLE } from "assets/styles/constantsStyle";
import SecretField from "components/ui/FormField/secretField";
import TextField from "components/ui/FormField/textField";
import { LOGIN } from "constants/validationForm";
import { FastField, Form, Formik } from "formik";
import { gapi } from "gapi-script";
import GoogleLogin from "react-google-login";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updateTotalCart } from "redux/slices/cart.slice";
import { handleCustomerLogin } from "redux/slices/clientAuth.slice";
import { updateFavorite } from "redux/slices/favorite.slice";
import Swal from "sweetalert2";
import axiosPublic from "utils/axiosPublic";
import FacebookLogin from 'react-facebook-login';
import { FacebookOutlined } from "@mui/icons-material";


import styles from './Auth.module.scss'
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

function Login() {
    const status = useSelector((state) => state?.client?.login?.status);
    const error = useSelector((state) => state?.client?.login?.error);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const initValue = {
        email: '',
        password: '',
    }

    gapi.load('client:auth2', () => {
        window.gapi.auth2.init({
            clientId: process.env.REACT_APP_GOOGLE_OAUT_ID,
            plugin_name: "chat"
        })
    })

    const handleLogin = (values, { resetForm }) => {
        dispatch(handleCustomerLogin(values))
            .unwrap()
            .then((res) => {
                resetForm();
                dispatch(updateTotalCart(res.totalCart))
                dispatch(updateFavorite(res.favorites))
                toast.success(res.message, TOAST_NAVIGATE_CENTER_STYLE);
                navigate(-1, { replace: true })
            })
    }

    const handleGGLoginSuccess = async (res) => {
        var data = res.profileObj;
        dispatch(handleCustomerLogin({ email: data.email, password: data.googleId }))
            .unwrap()
            .then((res) => {
                dispatch(updateTotalCart(res.totalCart))
                dispatch(updateFavorite(res.favorites))
                toast.success(res.message, TOAST_NAVIGATE_CENTER_STYLE);
                navigate(-1, { replace: true })
            })
            .catch((err) => {
                axiosPublic
                    .post('customer/register', {
                        name: data.name,
                        email: data.email,
                        password: data.googleId,
                        avatar: { link: data.imageUrl },
                    })
                    .then((res) => {
                        dispatch(handleCustomerLogin({ email: data.email, password: data.googleId }))
                            .unwrap()
                            .then((res) => {
                                dispatch(updateTotalCart(res.totalCart))
                                dispatch(updateFavorite(res.favorites))
                                toast.success(res.message, TOAST_NAVIGATE_CENTER_STYLE);
                                navigate(-1, { replace: true })
                            })
                    })
                    .catch((err) => {
                        Swal.fire({
                            icon: 'error',
                            title: err.message,
                            confirmButtonText: 'Xác nhận',
                            confirmButtonColor: '#ff5630',
                        })
                    })
            })
    }

    const handleFBLoginSuccess = (res) => {
        console.log(res);
        dispatch(handleCustomerLogin({ email: res.email, password: res.id }))
            .unwrap()
            .then((res) => {
                dispatch(updateTotalCart(res.totalCart))
                dispatch(updateFavorite(res.favorites))
                toast.success(res.message, TOAST_NAVIGATE_CENTER_STYLE);
                navigate(-1, { replace: true })
            })
            .catch((err) => {
                axiosPublic
                    .post('customer/register', {
                        name: res.name,
                        email: res.email,
                        password: res.id,
                        avatar: { link: res.picture.data.url },
                    })
                    .then((res) => {
                        dispatch(handleCustomerLogin({ email: res.email, password: res.id }))
                            .unwrap()
                            .then((res) => {
                                dispatch(updateTotalCart(res.totalCart))
                                dispatch(updateFavorite(res.favorites))
                                toast.success(res.message, TOAST_NAVIGATE_CENTER_STYLE);
                                navigate(-1, { replace: true })
                            })
                    })
                    .catch((err) => {
                        Swal.fire({
                            icon: 'error',
                            title: err.message,
                            confirmButtonText: 'Xác nhận',
                            confirmButtonColor: '#ff5630',
                        })
                    })
            })
    }

    const handleSocialLoginFailure = () => {
        Swal.fire({
            icon: 'error',
            title: 'Đăng nhập không thành công!',
            text: 'Đã có lỗi xảy ra trong lúc đăng nhập! Vui lòng thử lại sau.',
            confirmButtonText: 'Xác nhận',
            confirmButtonColor: '#ff5630',
        })
    }

    return (
        <>
            <Box className='content-center' py={4}>
                <Typography variant="h4" textTransform='uppercase'>
                    Đăng nhập
                </Typography>
                <Divider orientation="vertical" flexItem sx={{ mx: 4, borderWidth: '2px' }} />
                <Typography
                    component={Link} to='/register' replace={true}
                    variant="h4" textTransform='uppercase' color='divider'
                >
                    Đăng ký
                </Typography>
            </Box>
            <Box maxWidth={500} mx={'auto'} >
                {(status === 'fail') && (
                    <Alert severity="warning">{error?.message}</Alert>
                )}
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
                            <Form>
                                <Box mt={3}>
                                    <FastField
                                        name="email"
                                        component={TextField}
                                        label="E-mail"
                                        placeholder="Vui lòng nhập Email của bạn"
                                        sx={{ borderRadius: '0px' }}
                                    />
                                </Box>
                                <Box mt={3}>
                                    <FastField
                                        name="password"
                                        component={SecretField}
                                        label="Mật khẩu"
                                        placeholder="Vui lòng nhập mật khẩu của bạn"
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
                                            sx={{ borderRadius: '0px', textTransform: "uppercase" }}
                                        >
                                            Đăng nhập
                                        </Button>
                                    </Box>
                                    <Box ml={2}>
                                        <Typography color='text.secondary' fontSize={14}>
                                            Bạn chưa có tài khoản?
                                            <Box
                                                pl={0.75} component={Link} to='/register' replace={true}
                                                color='text.primary' sx={{ textDecoration: 'underline' }}
                                            >
                                                Đăng ký ngay
                                            </Box>
                                        </Typography>
                                        <Typography color='text.secondary' fontSize={14}>
                                            Bạn quên mật khẩu?
                                            <Box
                                                pl={0.75} component={Link} to='/reset-password' replace={true}
                                                color='text.primary' sx={{ textDecoration: 'underline' }}
                                            >
                                                Khôi phục mật khẩu
                                            </Box>
                                        </Typography>
                                    </Box>
                                </Box>
                            </Form>
                        )
                    }}
                </Formik>
                <Divider textAlign="left" sx={{ mt: 5, mb: 3 }}>
                    <i>Hoặc đăng nhập với:</i>
                </Divider>
                <Box className='content-center'>
                    <Box className={cx('btn-login-facebook')} >
                        <FacebookLogin
                            appId={process.env.REACT_APP_FACEBOOK_AUTH_ID}
                            autoLoad={false}
                            fields="name,email,picture"
                            textButton="Facebook"
                            onFailure={handleSocialLoginFailure}
                            callback={handleFBLoginSuccess}
                            icon={<FacebookOutlined />}
                            size="small"
                        />
                    </Box>
                    <Box className={cx('btn-login-google')}>
                        <GoogleLogin
                            clientId={process.env.REACT_APP_GOOGLE_OAUT_ID}
                            onSuccess={handleGGLoginSuccess}
                            onFailure={handleSocialLoginFailure}
                            buttonText='Google'
                            type='button'
                            
                        />
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default Login;