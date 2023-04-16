import { FastField, Form, Formik } from "formik";
import { ADD_EDIT_CATEGORY } from 'constants/validationForm';

import { 
    Box,
    Button, 
    DialogActions, 
    DialogContent, 
    DialogTitle,
} from '@mui/material';

import TextField from 'components/ui/FormField/textField';

function AddEditForm({ isEditMode, initValue, onSubmit, onCancel }) {

    return (  
        <Formik
            enableReinitialize
            initialValues={initValue}
            validationSchema={ADD_EDIT_CATEGORY}
            onSubmit={onSubmit}
        >
            {formikProps => {
                const { values, errors, touched, isSubmitting } = formikProps;

                console.log({values, errors, touched})
                
                return (
                    <>
                        <DialogTitle variant="h5">
                            {(!isEditMode) ? "Thêm danh mục" : "Chỉnh sửa danh mục"}
                        </DialogTitle>
                        <Form>
                            <DialogContent>
                                <Box>
                                    <FastField
                                        name="name"
                                        component={TextField}
                                        label="Tên danh mục"
                                    /> 
                                </Box>
                                <Box mt={3}>
                                    <FastField
                                        name="slug"
                                        component={TextField}
                                        label="Chuỗi Slug"
                                    /> 
                                </Box>
                            </DialogContent>
                            <DialogActions sx={{px: 3, py: 2}}>
                                <Button
                                    type="reset"
                                    variant="contained" 
                                    size="large" color="btnGray"
                                    onClick={(e) => {
                                        formikProps.resetForm(e);
                                        onCancel()
                                    }}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large" color="btnSuccess"
                                >
                                    {(!isEditMode) ? "Thêm mới" : "Chỉnh sửa"} 
                                </Button>
                            </DialogActions>
                        </Form>
                    </>
                )
            }}
        </Formik>
    );
}

export default AddEditForm;