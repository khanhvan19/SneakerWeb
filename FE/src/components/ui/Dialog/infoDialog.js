import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { forwardRef, useImperativeHandle, useState } from "react";

function InfoDialog({ children, title }, ref) {
    const [show, setShow] = useState(false);

    useImperativeHandle(ref, () => ({
        onShowDialog: () => setShow(true)
    }));

    return (  
        <Dialog 
            open={show} 
            maxWidth='sm'
            fullWidth={true}
            onClose={() => setShow(false)}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent 
                dividers 
                className='custom-scrollbar' 
                sx={{ overflowY: 'scroll' }}
            >
                {children}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setShow(false)}>Hoàn thành</Button>
            </DialogActions>
        </Dialog>
    );
}

export default forwardRef(InfoDialog);