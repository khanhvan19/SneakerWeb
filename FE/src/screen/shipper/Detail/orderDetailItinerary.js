import {
    Box,
    Button,
    Drawer,
    Step,
    StepContent,
    StepLabel,
    Stepper,
    Typography
} from "@mui/material";
import ReadOnlyStepIcon, { ReadOnlyStepConnector } from "components/ui/readOnlyStep";
import { useState } from "react";
import { formatLocalDateTime } from "utils/formatters";
import ItineraryForm from "./ItineraryForm";

function OrderDetailItinerary({ orderId, isDeliverySuccess, itinerary, onRefresh }) {
    const [openDrawer, setOpenDrawer] = useState()

    const handleToggleOpen = () => {
        setOpenDrawer((prev) => !prev);
    }

    return (
        <>
            <Stepper
                activeStep={0}
                orientation="vertical"
                connector={<ReadOnlyStepConnector />}
                sx={{ mb: 6, pb: 2 }}
            >
                {itinerary.map((step, idx) => (
                    <Step key={idx}>
                        <StepLabel sx={{ pb: 0.5 }} StepIconComponent={ReadOnlyStepIcon}>
                            <Typography
                                component='div' fontWeight={500}
                                color={(idx === 0) ? 'text.accent' : 'text.primary'}
                            >
                                {formatLocalDateTime(step.time)}
                            </Typography>
                        </StepLabel>
                        <StepContent
                            TransitionProps={{ in: true }}
                            sx={{ borderLeftWidth: 4, borderColor: 'background.secondary' }}
                        >
                            <Typography fontWeight={500}>{step.title}</Typography>
                            <Typography variant='body2' color='text.secondary'>
                                {step.caption}
                            </Typography>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            <Box 
                position='fixed' bottom={0} left={0} right={0} 
                bgcolor='background.paper'
            >
                <Button
                    fullWidth
                    variant='contained' size='large' color='btnSuccess'
                    disabled={isDeliverySuccess}
                    onClick={handleToggleOpen}
                    sx={{ py: 1.5, borderRadius: 0, fontSize: 16 }}
                >
                    Cập nhật trạng thái
                </Button>
            </Box>

            <Drawer
                open={openDrawer}
                anchor="bottom"
                variant="temporary"
                onClose={handleToggleOpen}
                ModalProps={{ keepMounted: true }}
                // sx={{ '& .MuiDrawer-paper': { width: '100%'} }}
            >
                <ItineraryForm 
                    orderId={orderId} 
                    onToggleDrawer={handleToggleOpen} 
                    onRefresh={onRefresh}
                />
            </Drawer>
        </>
    );
}

export default OrderDetailItinerary;