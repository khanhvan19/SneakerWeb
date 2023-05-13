import { BorderColorOutlined, CheckCircleOutlined, DeleteOutlined, PhoneAndroidTwoTone, PinDropTwoTone } from "@mui/icons-material";
import { Box, Button, Chip, Paper, Typography } from "@mui/material";
import { TOAST_CENTER_STYLE } from "assets/styles/constantsStyle";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axiosClientPrivate from "utils/axiosClientPrivate";

function AddressItem({ data, onSelected, onRefresh }) {
    const isLogin = useSelector((state) => state.client?.login?.data);

    const handleDeleteAddress = () => {
        Swal.fire({
            icon: 'question',
            title: 'Bạn có chắc muốn xóa địa chỉ này?',
            confirmButtonText: 'Tiếp tục',
            confirmButtonColor: '#ff5630',
            showCancelButton: true,
            cancelButtonText: 'Trở lại',
            cancelButtonColor: '#6c757d',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                axiosClientPrivate 
                    .delete(`/address/${data._id}`,  
                        { headers: { token: isLogin?.accessToken } }
                    )
                    .then((res) => {
                        toast.success(res.message, TOAST_CENTER_STYLE)
                        onRefresh()
                    })
                    .catch((err) => console.log(err))
            }
        })
    }

    const handleChangeDefault = () => {
        Swal.fire({
            icon: 'question',
            title: 'Thiết lập địa chỉ vừa chọn thành địa chỉ mặc định?',
            confirmButtonText: 'Tiếp tục',
            confirmButtonColor: '#00ab55',
            showCancelButton: true,
            cancelButtonText: 'Trở lại',
            cancelButtonColor: '#6c757d',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                axiosClientPrivate 
                    .put(`/address/default/${data._id}`, 
                        { customer: isLogin._id },
                        { headers: { token: isLogin?.accessToken } }
                    )
                    .then((res) => {
                        toast.success(res.message, TOAST_CENTER_STYLE)
                        onRefresh()
                    })
                    .catch((err) => console.log(err))
            }
        })
    }

    return (
        <Paper
            elevation={3}
            className="content-center-between"
            sx={{ alignItems: "flex-start", borderRadius: 0, mb: 1.5, p: 2 }}
        >
            <Box>
                <Box className='content-left-center' mb={1.5}>
                    <Typography textTransform='uppercase' fontWeight={600}>
                        {data.name}
                    </Typography>
                    {data.isPrimary && (
                        <Chip
                            icon={<CheckCircleOutlined />}
                            label="Địa chỉ mặc định"
                            color='chipSuccess' size='small'
                            sx={{ ml: 2, fontWeight: 500 }}
                        />
                    )}
                </Box>
                <Box className='content-left-center' mb={0.5}>
                    <PhoneAndroidTwoTone fontSize="small" sx={{ mr: 1 }} />
                    <Typography fontSize={15} color='text.secondary'>Số điện thoại:</Typography>
                    <Typography fontSize={15} ml={1}>{data.phone}</Typography>
                </Box>
                <Box className='content-left-center' mb={0.5}>
                    <PinDropTwoTone fontSize="small" sx={{ mr: 1 }} />
                    <Typography fontSize={15} color='text.secondary'>Địa chỉ nhận hàng:</Typography>
                    <Typography fontSize={15} ml={1}>{data.addressString}</Typography>
                </Box>
            </Box>
            <Box>
                <Box>
                    <Button
                        startIcon={<BorderColorOutlined />}
                        variant="outlined" color="btnInfo" size="small"
                        sx={{ borderRadius: 0, mr: 1 }}
                        onClick={() => onSelected(data)}
                    >
                        Chỉnh sửa
                    </Button>
                    {!data.isPrimary && (
                        <Button
                            startIcon={<DeleteOutlined />}
                            variant="outlined" color="btnError" size="small"
                            sx={{ borderRadius: 0 }}
                            onClick={handleDeleteAddress}
                        >
                            Xóa
                        </Button>
                    )}
                </Box>
                {!data.isPrimary && (
                    <Button
                        startIcon={<CheckCircleOutlined />}
                        fullWidth size="small"
                        variant="outlined" color="btnSuccess"
                        sx={{ borderRadius: 0, mt: 1 }}
                        onClick={handleChangeDefault}
                    >
                        Thiết lập mặc định
                    </Button>
                )}
            </Box>
        </Paper>
    );
}

export default AddressItem;