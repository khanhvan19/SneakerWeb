import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from 'yup';
import { useFormik } from 'formik';
import * as image from 'assets/images'

import { 
    Box, 
    Button, 
    FilledInput, 
    FormControl, 
    FormHelperText, 
    IconButton, 
    InputAdornment, 
    InputLabel, 
    LinearProgress, 
    Typography,
} from "@mui/material";
import { 
    VisibilityOffOutlined, 
    VisibilityOutlined,
    ReportOutlined,
    Report,
} from "@mui/icons-material";

import { handleEmployeeLogin } from "redux/slices/employeeAuth.slice";

import styles from './Login.module.scss'
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

function AdminLogin() {
    const status = useSelector((state) => state.auth.login?.status);
    const error = useSelector((state) => state.auth.login?.error);
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClickShowPassword = (e) => {
        e.preventDefault()
        setShowPassword((show) => !show);
    }

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object().shape({
            email: Yup.string()
                .max(50, "Email có tối đa 50 ký tự!")
                .email("Vui lòng nhập đúng định dạng của email")
                .required("Vui lòng nhập vào trường này!"),
            password: Yup.string()
                .min(8, "Mật khẩu có tối thiểu 8 ký tự!")
                .max(30, "Mật khẩu có tối đa 30 ký tự!")
                .required("Vui lòng nhập vào trường này!"),
        }),
        onSubmit: (values) => {
            dispatch(handleEmployeeLogin(values))
                .unwrap()
                .then((res) => {
                    navigate("/admin/", {replace: true});
                })     
        }
    })

    return (  
        <div className={cx('form-wrapper')}>     
            <div className={cx('login-form-container')}>
                {(status === 'loading') && (
                    <div className={cx('loading-bar')}>
                        <LinearProgress color="success" />
                    </div>
                )}
                <Box className={cx('logo')} sx={{ mb: 2}} display='flex' alignItems='end'>
                    <Box component='img' src={image.logoLight} alt="Logo" height={40} />
                    <Box component='span' lineHeight={1}>ADMINISTRATOR</Box>
                </Box>
                <Typography variant="h4" sx={{ mb: 2, fontSize: "2rem" }}>
                        Welcome Back!
                </Typography>
                <Box component="form" noValidate onSubmit={formik.handleSubmit}>
                    <FormControl 
                        variant="filled" margin="normal" color="success" fullWidth
                        error={(formik.errors.email && formik.touched.email) ? true : false}
                    >
                        <InputLabel htmlFor="email">E-mail</InputLabel>
                        <FilledInput 
                            error={formik.errors.email ? true : false}
                            id="email" size="small"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                        />
                        { formik.errors.email && formik.touched.email && (
                            <FormHelperText className={cx('content-left-center')} sx={{ mx: 0 }}>
                                <ReportOutlined sx={{ fontSize: "1rem", lineHeight: 1, mr: 0.5 }}/>
                                {formik.errors.email}
                            </FormHelperText>
                        )}
                    </FormControl>
                    <FormControl 
                        variant="filled" margin="normal" color="success" fullWidth
                        error={(formik.errors.password && formik.touched.password) ? true : false}
                    >
                        <InputLabel htmlFor="pass">Password</InputLabel>
                        <FilledInput 
                            sx={{ px: 0 }}
                            id="pass" size="small"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        >
                                        {showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            />
                        { formik.errors.password && formik.touched.password && (
                            <FormHelperText className={cx('content-left-center')} sx={{ mx: 0 }}>
                                <ReportOutlined sx={{ fontSize: "1rem", lineHeight: 1, mr: 0.5 }}/>
                                {formik.errors.password}
                            </FormHelperText>
                        )}
                    </FormControl>
                    <div className={cx('btn-forgot-password')} >
                        <Link to={'/admin/forgot_password'}>Forgot Password?</Link>
                    </div>
                    <FormControl margin="normal" fullWidth>
                        {(status === 'fail') && (
                            <div className={cx('error-message')}>
                                <Report sx={{ fontSize: "1.25rem", lineHeight: 1, mr: 0.5 }}/>
                                {error?.message}
                            </div>
                        )}
                        <Button type="submit" variant="contained" size="large" color="success">sign in</Button>
                    </FormControl>
                </Box>
                <div>
                    &#169; Copyright ...
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;