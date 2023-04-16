import { Button, Paper, Step, StepLabel, Stepper } from "@mui/material";
import { CustomStepConnector } from "assets/styles/constantsStyle";
import { Form, Formik } from "formik";
import { forwardRef, useImperativeHandle, useState } from "react";

import { ADD_IMPORT } from 'constants/validationForm';
import InfoForm from "./Form/infoForm";
import ProductForm from "./Form/productForm";
import { Box } from "@mui/system";
const steps = ["Thông tin phiếu nhập", "Danh sách sản phẩm"]

function AddForm({ initValue, onSubmit }, ref) {
    const [activeStep, setActiveStep] = useState(0);
    const selectedValidationSchema =  ADD_IMPORT[activeStep]

    useImperativeHandle(ref, () => ({
        resetSteps: () => setActiveStep(0)
    }));

    const handleSubmit = (values, actions, touched) => {
        if(activeStep === steps.length - 1) {
            onSubmit(values, actions);
        } else {
            setActiveStep((prev) => prev + 1);
            actions.setTouched({ ...touched, products: [{}] })
        }
    }

    return ( 
        <Paper sx={{ backgroundImage: "none", mt: 3, p: 2 }} elevation={4}>
            <Stepper 
                activeStep={activeStep}
                connector={<CustomStepConnector />}
                sx={{ mb: 4, justifyContent: "center"}}
            >
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {activeStep === steps.length ? (
                <div>success</div>
            ) : (
                <Formik 
                    initialValues={initValue}
                    validationSchema={selectedValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {(formikProps) => {
                        const { values, errors, touched, isSubmitting } = formikProps;
            
                        console.log({values, errors, touched});
                        const renderStepContent = (step) => {
                            switch(step) {
                                case 0: 
                                    return <InfoForm />
                                case 1: 
                                    return (
                                        <ProductForm 
                                            data={values.products} 
                                            handleChange={formikProps.handleChange}
                                            setFieldValue={formikProps.setFieldValue}
                                        />
                                    );
                                default: return ;
                            }
                        }

                        return (
                            <Form>
                                {renderStepContent(activeStep)}

                                <Box className="content-center-between" mt={2}>
                                    {activeStep !== 0 && (
                                        <Button
                                            size="large"
                                            color="btnGray"
                                            variant="contained"
                                            onClick={() => setActiveStep((prev) => prev - 1)}
                                        >
                                            Trở lại
                                        </Button>
                                    )}   
                                    <Box sx={{ flex: "1 1 auto" }} />
                                    <Button
                                        size="large"
                                        type="submit"
                                        color="btnSuccess"
                                        variant="contained"
                                    >
                                        {(activeStep === steps.length - 1) ? "Thêm mới" : "Tiếp theo"}
                                    </Button>
                                </Box>
                            </Form>
                        );
                    }}

                </Formik>
            )}
        </Paper>
    );
}

export default forwardRef(AddForm);