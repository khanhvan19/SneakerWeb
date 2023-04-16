import { FastField, Form, Formik } from "formik";
import { ADMIN_CHANGE_PASSWORD } from 'constants/validationForm';

import Grid from '@mui/material/Unstable_Grid2';

import SecretField from 'components/ui/FormField/secretField';
import { Button, Paper } from "@mui/material";

function ChangePasswordForm({ initValue, onSubmit }) {

    return (  
        <Formik
            enableReinitialize
            initialValues={initValue}
            validationSchema={ADMIN_CHANGE_PASSWORD}
            onSubmit={onSubmit}
        >
            {formikProps => {
                const { values, errors, touched, isSubmitting } = formikProps;
                
                console.log({values, errors, touched})

                return (
                    <Form>
                        <Paper 
                            elevation={4}
                            sx={{ 
                                mt: 3, pt: 6, pb: 12 , px: 2, 
                                backgroundImage: "none", 
                            }} 
                        >
                            <Grid container spacing={2}>
                                <Grid xs={6} xsOffset={3}>
                                    <FastField
                                        name="currentPassword"
                                        component={SecretField}
                                        label="Mật khẩu hiện tại"
                                    /> 
                                </Grid>
                                <Grid xs={6} xsOffset={3}>
                                    <FastField
                                        name="newPassword"
                                        component={SecretField}
                                        label="Mật khẩu mới"
                                    /> 
                                </Grid>
                                <Grid xs={6} xsOffset={3}>
                                    <FastField
                                        name="confirmPassword"
                                        component={SecretField}
                                        label="Nhập lại mật khẩu mới"
                                    /> 
                                </Grid>
                                <Grid xs={3} xsOffset={3}>
                                    <Button
                                        type="reset"
                                        fullWidth variant="contained" 
                                        size="large" color="btnGray"
                                        onClick={formikProps.resetForm}
                                    >
                                        Tạo lại
                                    </Button>
                                </Grid>
                                <Grid xs={3}>
                                    <Button
                                        type="submit"
                                        fullWidth variant="contained"
                                        size="large" color="btnSuccess"
                                    >
                                        Lưu thay đổi
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Form>
                )
            }}
        </Formik>
    );
}

export default ChangePasswordForm;