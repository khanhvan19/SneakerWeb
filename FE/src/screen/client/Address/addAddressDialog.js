import { Clear } from "@mui/icons-material";
import { Box, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { forwardRef, useImperativeHandle, useState } from "react";
import AddEditForm from "./addEditForm";
import axiosClientPrivate from "utils/axiosClientPrivate";
import { toast } from "react-toastify";
import { TOAST_CENTER_STYLE } from "assets/styles/constantsStyle";
import { useSelector } from "react-redux";

function AddAddressDialog({ onRefresh }, ref) {
    const isLogin = useSelector((state) => state.client?.login?.data);
    const [show, setShow] = useState(false);
    const [selected, setSelected] = useState();

    useImperativeHandle(ref, () => ({
        onShowDialog: handleShowDialog,
        onCloseDialog: () => setShow(false)
    }));

    const handleShowDialog = (value) => {
        if(value != null) {
            setSelected(value);
        } else {
            setSelected(null);
        }
        setShow(true)
    }

    const initValue = {
        name: selected?.name || isLogin?.name || '',
        phone: selected?.phone || isLogin?.phone || '',
        province: selected?.province ||  '',
        district: selected?.district || '',
        ward: selected?.ward || '',
        addressDetail: selected?.addressDetail || '',
    }

    const handleSubmit = (values,  {resetForm}) => {
        if(selected == null) {
            axiosClientPrivate
                .post('/address/', 
                    {...values, customer: isLogin._id},
                    { headers: { token: isLogin?.accessToken } }
                )
                .then((res) => {
                    resetForm();
                    toast.success(res.message, TOAST_CENTER_STYLE);
                    onRefresh();
                    setShow(false);
                })
                .catch((err) => toast.err(err.message, TOAST_CENTER_STYLE))

        } else {
            axiosClientPrivate
                .put(`/address/${selected._id}`,
                    { ...values },
                    { headers: { token: isLogin?.accessToken } }
                )
                .then((res) => {
                    toast.success(res.message, TOAST_CENTER_STYLE);
                    onRefresh();
                    setShow(false);
                })
                .catch((err) => toast.err(err.message, TOAST_CENTER_STYLE))
        }
    }

    return (
        <Dialog
            open={show}
            maxWidth='md'
            fullWidth={true}
            PaperProps={{ sx: { borderRadius: 0 } }}
            onClose={() => setShow(false)}
        >
            <DialogTitle 
                className="content-center-between" 
                sx={{ p: 2, fontWeight: 600, fontSize: 20 }}
            >
                {(selected == null) ? 'Thêm địa chỉ nhận hàng' : 'Chỉnh sửa địa chỉ nhận hàng'} 
                <IconButton onClick={() => setShow(false)}>
                    <Clear />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 2 }}>
                <Box py={2}>
                    <AddEditForm 
                        isAddMode={selected == null}
                        initValue={initValue} 
                        onSubmit={handleSubmit}
                    />
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default forwardRef(AddAddressDialog);