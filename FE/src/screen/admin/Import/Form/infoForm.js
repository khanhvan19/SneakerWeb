import TextField from "components/ui/FormField/textField";
import { FastField, Field } from "formik";
import Grid from '@mui/material/Unstable_Grid2';

function InfoForm() {
    return (
        <>
            <Grid container spacing={2} >
                <Grid xs={12}>
                    <Field
                        name="name"
                        component={TextField}
                        label="Tiêu đề phiếu nhập"
                    />
                </Grid>
                <Grid xs={6}>
                    <Field
                        name="warehouse"
                        component={TextField}
                        label="Nhập tại kho"
                    />
                </Grid>
                <Grid xs={6}>
                    <FastField
                        name="supplier"
                        component={TextField}
                        label="Nhà cung cấp"
                    />
                </Grid>
                <Grid xs={12}>
                    <FastField
                        name="description"
                        component={TextField}
                        label="Ghi chú"
                        rows={4}
                    />
                </Grid>
            </Grid>
        </>
    );
}

export default InfoForm;