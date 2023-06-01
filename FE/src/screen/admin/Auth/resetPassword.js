import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';

import { 
    Box, 
    Button, 
    Card, 
    CardContent, 
    CardHeader, 
    Divider, 
    FormControl, 
    FormHelperText, 
    IconButton, 
    InputAdornment, 
    InputLabel, 
    LinearProgress, 
    OutlinedInput, 
} from "@mui/material";
import { 
    VisibilityOffOutlined, 
    VisibilityOutlined,
    ReportOutlined,
} from "@mui/icons-material";

import styles from './Login.module.scss'
import classNames from "classnames/bind";
import axiosPublic from "utils/axiosPublic";
import Swal from "sweetalert2";
const cx = classNames.bind(styles);

function ResetPassword() {
    const { id, token } = useParams();
    const [dataVerify, setDataVerify] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const handleClickShowPassword = (e) => {
        e.preventDefault()
        setShowPassword((show) => !show);
    }

    useEffect(() => {
        axiosPublic
            .get(`employee/reset-password/${id}/${token}`)
            .then((res) => {
                setDataVerify(res)
            })
            .catch((err) => {
                setDataVerify(err)
                Swal.fire({
                    icon: 'error',
                    title: 'Email xác minh đã hết hạn!',
                    text: 'Email xác minh người dùng của bạn đã hết thời gian hiệu lực, vui lòng thực hiện lại quá trình xác minh!',
                    confirmButtonText: "Thực hiện lại",
                    confirmButtonColor: '#ff5630',
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate("/admin/forgot_password", {replace: true})
                    }
                })
            })
    }, [id, token])

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object().shape({
            password: Yup.string()
                .min(8, "Mật khẩu có tối thiểu 8 ký tự!")
                .max(30, "Mật khẩu có tối đa 30 ký tự!")
                .required("Vui lòng nhập vào trường này!"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Nhập lại mật khẩu không trùng khớp!')
                .max(30, "Mật khẩu có tối đa 30 ký tự!")
                .required("Vui lòng nhập vào trường này!"),
        }),
        onSubmit: (values) => {
            setLoading(true);
            axiosPublic
                .post(`employee/reset-password/${id}`, {password: values.password})
                .then((res) => {
                    setLoading(false);
                    Swal.fire({
                        icon: 'success',
                        title: res.message,
                        text: 'Mật khẩu đăng nhập của bạn đã đặt lại thành công, vui lòng tiến hành đăng nhập!',
                        confirmButtonText: "Xác nhận",
                        confirmButtonColor: '#00ab55',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate("/admin/login", {replace: true})
                        }
                    })
                })
                .catch((err) => {
                    toast.error(err.message, {
                        position: "top-center",
                        autoClose: 2500,
                        closeOnClick: false,
                        pauseOnHover: false,
                        draggable: true,
                    });
                })
        }
    })

    return (  
        <div className={cx('form-wrapper')}>   
            {(dataVerify.status === 'success') 
            && (
                <div className={cx('reset-password-form-container')}>
                    {(loading === true) && (
                        <div className={cx('loading-bar')}>
                            <LinearProgress color="success"  />
                        </div>
                    )}
                    <Card sx={{ borderRadius: 0 }}>
                        <CardHeader title="Tạo lại mật khẩu mới." sx={{ color: "success.main" }}/>
                        <Divider />
                        <CardContent>
                            <Box component="form" noValidate onSubmit={formik.handleSubmit}>
                                <FormControl 
                                    variant="outlined" margin="normal" color="success" fullWidth
                                    error={(formik.errors.password && formik.touched.password) ? true : false}
                                >
                                    <InputLabel htmlFor="pass">Mật khẩu</InputLabel>
                                    <OutlinedInput 
                                        label="Mật khẩu"
                                        sx={{ px: 0 }}
                                        id="pass"
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
                                <FormControl 
                                    variant="outlined" margin="normal" color="success" fullWidth
                                    error={(formik.errors.confirmPassword && formik.touched.confirmPassword) ? true : false}
                                >
                                    <InputLabel htmlFor="confirm">Nhập lại mật khẩu</InputLabel>
                                    <OutlinedInput 
                                        label="Nhập lại mật khẩu"
                                        sx={{ px: 0 }}
                                        id="confirm"
                                        type={showPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formik.values.confirmPassword}
                                        onChange={formik.handleChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle confirmPassword visibility"
                                                    onClick={handleClickShowPassword}
                                                >
                                                    {showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                    { formik.errors.confirmPassword && formik.touched.confirmPassword && (
                                        <FormHelperText className={cx('content-left-center')} sx={{ mx: 0 }}>
                                            <ReportOutlined sx={{ fontSize: "1rem", lineHeight: 1, mr: 0.5 }}/>
                                            {formik.errors.confirmPassword}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                                <FormControl margin="normal" fullWidth>
                                    <Button type="submit" variant="contained" size="large" color="success">
                                        Đặt lại mật khẩu
                                    </Button>
                                </FormControl>
                            </Box>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default ResetPassword;