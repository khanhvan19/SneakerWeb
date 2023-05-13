import { DomainAddOutlined } from "@mui/icons-material";
import { Box, Button,  Paper, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axiosClientPrivate from "utils/axiosClientPrivate";
import AddressItem from "./addressItem";
import AddAddressDialog from "./addAddressDialog";

function AddressScreen() {
    const isLogin = useSelector((state) => state.client?.login?.data);
    const [address, setAddress] = useState([]);
    const [refresh, setRefresh] = useState(0);
    const addAddressRef = useRef();

    const primary = address.find(e => e.isPrimary === true);

    useEffect(() => {
        axiosClientPrivate
            .get('/address/', {
                params: { customer: isLogin?._id },
                headers: { token: isLogin?.accessToken },
            })
            .then((res) => setAddress(res))
            .catch((err) => console.log(err))
    }, [refresh, isLogin])

    return (
        <Box flex={1}>
            <Typography variant='h5' mb={2}>Sổ địa chỉ</Typography>
            <Paper elevation={0} sx={{ borderRadius: 0, mb: 1.5 }}>
                <Button
                    fullWidth size="large" color="btnDark"
                    variant="outlined"
                    startIcon={<DomainAddOutlined />}
                    sx={{
                        textTransform: 'uppercase', fontWeight: 600, py: 1.5,
                        borderWidth: 2, borderStyle: 'dashed', borderRadius: 0,
                        '&:hover': { borderWidth: 2, borderStyle: 'dashed' }
                    }}
                    onClick={() => addAddressRef.current.onShowDialog()}
                >
                    Thêm địa chỉ mới
                </Button>
            </Paper>
            {primary && (
                <AddressItem 
                    data={primary} 
                    onSelected={(value) => addAddressRef.current.onShowDialog(value)}
                    onRefresh={() => setRefresh(prev => prev + 1)}
                />
            )}
            {address && address
                .filter(e => e.isPrimary !== true)
                .map((item, idx) => (
                    <AddressItem 
                        key={idx} 
                        data={item} 
                        onSelected={(value) => addAddressRef.current.onShowDialog(value)}
                        onRefresh={() => setRefresh(prev => prev + 1)}
                    />
                ))
            }

            <AddAddressDialog
                ref={addAddressRef}
                onRefresh={() => setRefresh(prev => prev + 1)}
            />
        </Box>
    );
}

export default AddressScreen;