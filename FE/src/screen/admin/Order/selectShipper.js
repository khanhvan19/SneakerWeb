import { Clear } from "@mui/icons-material";
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, IconButton, RadioGroup, Typography } from "@mui/material";
import { forwardRef, memo, useEffect, useImperativeHandle, useState } from "react";
import { useSelector } from "react-redux";
import axiosPrivate from "utils/axiosPrivate";
import RadioItem from "components/ui/FormField/radioItem";
import Swal from "sweetalert2";

function SelectShiper({ onSelected }, ref) {
    const employee = useSelector((state) => state.auth?.login?.data);
    const [show, setShow] = useState(false);
    const [shippers, setShippers] = useState([]);
    const [selected, setSelected] = useState('')

    useImperativeHandle(ref, () => ({
        onShowDialog: () => setShow(true),
        onCloseDialog: () => setShow(false)
    }));

    useEffect(() => {
        axiosPrivate
            .get('/employee/role', {
                params: { role: 'role_4' },
                headers: { token: employee?.accessToken }
            })
            .then((res) => setShippers(res))
            .catch((err) => console.log(err))
    }, [employee])

    const handleApprove = () => {
        if(selected === '') {
            Swal.fire({
                icon: 'error',
                title: 'Vui lòng chọn nhân viên giao hàng!',
                confirmButtonText: "Trở lại",
                confirmButtonColor: '#6c757d',
            })
        } else {
            onSelected(selected)
        }
    }

    return (
        <Dialog
            open={show}
            maxWidth='sm'
            fullWidth={true}
            onClose={() => setShow(false)}
            sx={{ zIndex: 1050 }}
        >
            <DialogTitle
                className="content-center-between"
            >
                Chọn nhân viên giao hàng
                <IconButton onClick={() => setShow(false)}>
                    <Clear />
                </IconButton>
            </DialogTitle>
            <DialogContent
                dividers
                className='custom-scrollbar'
                sx={{ overflowY: 'scroll' }}
            >
                <FormControl sx={{ width: '100%' }}>
                    <RadioGroup
                        value={selected}
                        onChange={(e) => setSelected(e.target.value)}
                    >
                        {shippers.length !== 0 && shippers.map((shipper, idx) => (
                            <Box key={idx}>
                                <RadioItem  
                                    value={shipper._id}
                                    // disabled={shipper.shipping === true}
                                    sx={{ my: 1, py: 1 }}
                                >
                                    <Box className='content-left-center' ml={1}>
                                        <Avatar 
                                            src={shipper?.avatar?.link || "/"} alt={shipper.name} 
                                            sx={{ 
                                                mr: 2, border: '2px solid', 
                                                // borderColor: shipper.shipping ? 'text.secondary' : 'text.accent',
                                                // opacity : shipper.shipping ? 0.6 : 1
                                            }}
                                        />
                                        <Box>
                                            <Typography variant="subtitle1" className="content-left-center">
                                                {shipper.name}
                                            </Typography>
                                            <Typography variant="body2">{shipper.address.addressString}</Typography>
                                        </Box>
                                    </Box>
                                </RadioItem>
                                {idx !== shippers.length - 1 && <Divider sx={{ borderStyle: 'dashed' }} />}
                            </Box>
                        ))}
                    </RadioGroup>
                </FormControl>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button 
                    variant='contained' color="btnGray" size="large" sx={{ mr: 1 }}
                    onClick={() => setShow(false)} 
                >
                    Trở lại
                </Button>
                <Button 
                    variant='contained' color="btnSuccess" size="large"
                    onClick={handleApprove}
                >
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default memo(forwardRef(SelectShiper));