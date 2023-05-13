import { Alert, Snackbar } from "@mui/material";
import { forwardRef, useImperativeHandle, useState } from "react";

function CustomSnackbar({ message, alertType }, ref) {
    const [open, setOpen] = useState(false)

    useImperativeHandle(ref, () => ({
        onShowSnackbar: () => setOpen(true)
    }));

    return (  
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={() => setOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert 
                onClose={() => setOpen(false)} 
                severity={alertType} 
                variant="filled"
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}

export default forwardRef(CustomSnackbar);