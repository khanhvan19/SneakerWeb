import { FastField, Form, Formik } from "formik";
import { EDIT_CUSTOMER } from 'constants/validationForm';

import { Button, Paper } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import TextField from 'components/ui/FormField/textField';
import SelectField from 'components/ui/FormField/selectField';
import FileField from 'components/ui/FormField/fileField';
import { SEX_OPTION } from 'constants/optionSelectField';

function EditForm({ initValue, onSubmit }) {

    return (  
        <Formik
            enableReinitialize
            initialValues={initValue}
            validationSchema={EDIT_CUSTOMER}
            onSubmit={onSubmit}
        >
            {formikProps => {
                const { values, errors, touched, isSubmitting } = formikProps;
                
                console.log({values, errors, touched})

                return (
                    <Form>
                        <Grid container spacing={2} mt={3}>
                            <Grid xs={4}>
                                <Paper 
                                    elevation={4}
                                    className="content-center"
                                    sx={{ 
                                        flexDirection: "column",
                                        p: 2, height: "100%", 
                                        backgroundImage: "none",
                                    }} 
                                >
                                    <FastField
                                        name="avatar"
                                        component={FileField}
                                        label="Hình đại diện"
                                        height={200}
                                        width={200}
                                        shape="circle"
                                    /> 
                                </Paper>
                            </Grid>
                            <Grid xs={8}>
                                <Paper sx={{ backgroundImage: "none" }} elevation={4}>
                                    <Grid container m={0}>
                                        <Grid xs={12}>
                                            <FastField
                                                name="name"
                                                component={TextField}
                                                label="Họ tên"
                                            /> 
                                        </Grid>
                                        <Grid xs={12}>
                                            <FastField
                                                name="email"
                                                component={TextField}
                                                label="Email"
                                            /> 
                                        </Grid>
                                        <Grid xs={12}>
                                            <FastField
                                                name="phone"
                                                component={TextField}
                                                label="Số điện thoại"
                                            /> 
                                        </Grid>
                                        <Grid xs={12}>
                                            <FastField
                                                name="sex"
                                                component={SelectField}
                                                label="Giới tính"
                                                options={SEX_OPTION}
                                            /> 
                                        </Grid>
                                        <Grid xs={12}>
                                            <FastField
                                                name="birthday"
                                                component={TextField}
                                                label="Ngày sinh"
                                                type="date"
                                            /> 
                                        </Grid>
                                        <Grid xs={6} xsOffset={6} container>
                                            <Grid xs={6}>
                                                <Button
                                                    type="reset"
                                                    fullWidth variant="contained" 
                                                    size="large" color="btnGray"
                                                    onClick={formikProps.resetForm}
                                                >
                                                    Tạo lại
                                                </Button>
                                            </Grid>
                                            <Grid xs={6}>
                                                <Button
                                                    type="submit"
                                                    fullWidth variant="contained"
                                                    size="large" color="btnSuccess"
                                                >
                                                    Chỉnh sửa
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Form>
                )
            }}
        </Formik>
    );
}

export default EditForm;