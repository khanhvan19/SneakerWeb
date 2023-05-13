import { Box, Button, Paper, Typography } from "@mui/material";
import { ADMIN_CHANGE_PASSWORD } from "constants/validationForm";
import { FastField, Form, Formik } from "formik";
import SecretField from "components/ui/FormField/secretField";
import axiosClientPrivate from "utils/axiosClientPrivate";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

function ResetPassword() {
    const loginData = useSelector((state) => state.client?.login?.data);
    const navigate = useNavigate();

    const initValue = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    }

    const handleSubmit = (values) => {
        console.log(values);
        axiosClientPrivate
            .put(`/customer/change-password/${loginData._id}`, values,
                { headers: { token: loginData?.accessToken }}
            )
            .then((res) => {
                Swal.fire({
                    icon: 'success',
                    title: res.message,
                    confirmButtonText: 'Xác nhận',
                    confirmButtonColor: '#00ab55',
                }).then((result) => {
                    navigate('/my-account')
                })
            })
            .catch((err) => {
                Swal.fire({
                    icon: 'error',
                    title: err.message,
                    html: 
                        '<p>Chưa thể thay đổi do nhập sai mật khẩu hiện tại!</p>'+
                        '<p>Vui lòng nhập lại đúng mật khẩu hiện tại khi đóng hộp thoại</p>',
                    confirmButtonText: 'Xác nhận',
                    confirmButtonColor: '#ff5630',
                })
            })
    }

    return (
        <Box flex={1}>
            <Typography variant='h5' mb={2}>Đổi mật khẩu</Typography>
            <Paper elevation={2} sx={{ borderRadius: 0, mb: 1.5, py: 4 }}>
                <Box width='40%' mx='auto'>
                    <Formik
                        initialValues={initValue}
                        validationSchema={ADMIN_CHANGE_PASSWORD}
                        onSubmit={handleSubmit}
                    >
                        {formikProps => {
                            const { values, errors, touched, isSubmitting } = formikProps;

                            console.log({ values, errors, touched })

                            return (
                                <Form>
                                    <Box mt={2}>
                                        <Typography mb={0.25} color='text.secondary'>
                                            Mật khẩu hiện tại
                                        </Typography>
                                        <FastField
                                            name="currentPassword"
                                            component={SecretField}
                                            size='small' sx={{ borderRadius: 0 }}
                                            placeholder="Nhập mật khẩu hiện tại"
                                        />
                                    </Box>
                                    <Box mt={2}>
                                        <Typography mb={0.25} color='text.secondary'>
                                            Mật khẩu mới
                                        </Typography>
                                        <FastField
                                            name="newPassword"
                                            component={SecretField}
                                            size='small' sx={{ borderRadius: 0 }}
                                            placeholder="Nhập mật khẩu mới"
                                        />
                                    </Box>
                                    <Box mt={2}>
                                        <Typography mb={0.25} color='text.secondary'>
                                            Nhập lại mật khẩu mới
                                        </Typography>
                                        <FastField
                                            name="confirmPassword"
                                            component={SecretField}
                                            size='small' sx={{ borderRadius: 0 }}
                                            placeholder="Nhập lại mật khẩu mới"
                                        />
                                    </Box>
                                    <Box mt={3} mb={2}>
                                        <Button
                                            type="submit"
                                            fullWidth variant="contained"
                                            size="large" color="btnDark"
                                            sx={{ borderRadius: 0 }}
                                        >
                                            Lưu thay đổi
                                        </Button>
                                    </Box>
                                </Form>
                            )
                        }}
                    </Formik>
                </Box>
            </Paper>
        </Box>
    );
}

export default ResetPassword;