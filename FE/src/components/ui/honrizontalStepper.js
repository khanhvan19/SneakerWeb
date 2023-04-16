import { useState } from "react";
import { 
    Box, 
    Button, 
    Step, 
    StepIcon, 
    StepLabel, 
    Stepper, 
} from "@mui/material";
import { CustomStepConnector } from "assets/styles/constantsStyle";
import { color } from "@mui/system";


function HonrizontalStepper({ stepsTitle = [] , content = [] }) {
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Stepper 
                activeStep={activeStep} 
                connector={<CustomStepConnector />}
                sx={{ mb: 4, justifyContent: "center"}}
            >
                {stepsTitle.map((label, idx) => {
                    const stepProps = {};
                    const labelProps = {};
                    return (
                        <Step key={idx} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>

            <>
                { content[activeStep] }
                <Box display={"flex"} mt={2}>
                    { activeStep !== 0 && (
                        <Button 
                            size="large" 
                            variant="contained" 
                            color="btnGray" 
                            onClick={handleBack}
                        >
                            Trở lại
                        </Button>
                    )} 
                    <Box sx={{ flex: "1 1 auto" }} />
                    <Button 
                        size="large" 
                        variant="contained" 
                        color="btnSuccess"
                        onClick={handleNext}
                    >
                        { (activeStep !== stepsTitle.length - 1) ? "Tiếp tục" : "Submit" }
                    </Button>
                </Box>
            </>
        </Box>
    );
}

export default HonrizontalStepper;