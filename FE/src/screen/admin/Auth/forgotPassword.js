import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';

import { 
    Box, 
    Button,
    Card, 
    CardActions, 
    CardContent, 
    CardHeader,
    Divider,
    FormControl,
    FormHelperText,
    InputLabel,
    LinearProgress,
    OutlinedInput,
} from '@mui/material';
import { 
    ReportOutlined,
} from '@mui/icons-material';

import styles from './Login.module.scss'
import classNames from "classnames/bind";
import { useState } from 'react';

import axiosPublic from 'utils/axiosPublic';
import Swal from 'sweetalert2';
const cx = classNames.bind(styles);

function ForgotPasword() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object().shape({
            email: Yup.string()
                .max(50, "Email có tối đa 50 ký tự!")
                .email("Vui lòng nhập đúng định dạng của Email")
                .required("Vui lòng nhập vào Email của bạn!"),
        }),
        onSubmit: (values) => {
            setLoading(true);
            axiosPublic
                .post("employee/forgot-password", values)
                .then((res) => {
                    setLoading(false);
                    Swal.fire({
                        icon: 'success',
                        title: 'Email xác minh đã được gửi!',
                        text: 'Email chỉ có hiệu lực trong 15 phút. Vui lòng xác minh để thực hiện tạo lại mật khẩu!',
                        confirmButtonText: "Hoàn thành",
                        confirmButtonColor: '#00ab55',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.replace('https://mail.google.com/');
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
    });

    return (  
        <div className={cx('form-wrapper')}>     
            <div className={cx('forgot-password-form-container')}>
                {(loading === true) && (
                    <div className={cx('loading-bar')}>
                        <LinearProgress color="success"  />
                    </div>
                )}
                <Box component="form" noValidate onSubmit={formik.handleSubmit}> 
                    <Card sx={{ borderRadius: 0 }}>
                        <CardHeader title="Tìm tài khoản của bạn." sx={{ color: "success.main" }}/>
                        <Divider />
                        <CardContent>
                            <p>Vui lòng nhập email để tìm kiếm tài khoản của bạn.</p>
                            <FormControl 
                                variant="outlined" margin='normal' color="success" fullWidth
                                error={(formik.errors.email && formik.touched.email) ? true : false}
                            >
                                <InputLabel htmlFor="email">E-mail</InputLabel>
                                <OutlinedInput 
                                    label="email"
                                    id="email" 
                                    name="email"
                                    value={formik.values.email}
                                    error={formik.errors.email ? true : false}
                                    onChange={formik.handleChange}
                                />
                                { formik.errors.email && formik.touched.email && (
                                    <FormHelperText className={cx('content-left-center')} sx={{ mx: 0 }}>
                                        <ReportOutlined sx={{ fontSize: "1rem", lineHeight: 1, mr: 0.5 }}/>
                                        {formik.errors.email}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </CardContent>
                        <Divider />
                        <CardActions sx={{ p: 2, justifyContent: "right" }}>
                            <Link to="/admin/login">
                                <Button 
                                    variant="contained" 
                                    sx={{ bgcolor: "GrayText", '&:hover': { bgcolor: 'GrayText', color: 'white' }}}
                                >
                                    Hủy
                                </Button>
                            </Link>
                            <Button type="submit" variant="contained" sx={{ ml: 2 }} color="success">
                                Xác minh
                            </Button>
                        </CardActions>
                    </Card>
                </Box>

                <ToastContainer style={{ width: '400px' }}/>
            </div>
        </div>
    );
}

export default ForgotPasword;