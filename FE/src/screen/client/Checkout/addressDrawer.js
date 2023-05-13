import { Box, Button, Chip, Divider, Drawer, RadioGroup, Typography } from "@mui/material";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import AddAddressDialog from "../Address/addAddressDialog";
import RadioItem from "components/ui/FormField/radioItem";

function AddressDrawer({current, addressList, onChangeAddress, onRefresh}, ref) {
    const [open, setOpen] = useState();
    var addAddressRef = useRef();

    useImperativeHandle(ref, () => ({
        onToggleDrawer: handleToggleOpen
    }));

    const handleToggleOpen = () => {
        setOpen((prev) => !prev);
    }

    const handleChange = (e) => {
        var addressData = addressList.find(item => item._id === e.target.value)
        onChangeAddress(addressData)
    }

    return (  
        <Drawer
            open={open}
            anchor="right"
            variant="temporary"
            onClose={handleToggleOpen}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', md: 480 }} }}
        >
            <Box
                px={2} py={1.5}
                zIndex={2} bgcolor='#fff'
                position='sticky' top={0}
                borderBottom='1px solid' borderColor='divider' 
                className='content-center-between' 
            >
                <Typography variant="h5">Địa chỉ nhận hàng</Typography>
                <Button 
                    color="btnDark"
                    onClick={() => addAddressRef.current.onShowDialog()}
                    sx={{ 
                        borderRadius: 0,
                        ':hover': { textDecoration: 'underline' } 
                    }}
                >
                    Thêm địa chỉ mới
                </Button>
            </Box>
            <Box px={2} height='100%' className='custom-scrollbar' sx={{ overflowY: 'scroll' }}>
                <RadioGroup
                    my={2}
                    value={current?._id || ''}
                    onChange={handleChange}
                >
                    {addressList.length !== 0 && addressList.map((item, idx) => (
                        <RadioItem 
                            key={idx} value={item._id}
                            sx={{ 
                                mx: 0, mb: 2, p: 2, pl: 0, alignItems: 'flex-start',
                                border: '1px solid', borderColor: 'text.accent'
                            }}
                        >
                            <Box className='content-left-center' mb={0.5}>
                                <Typography fontSize={15} fontWeight={600}>{item.name}</Typography>
                                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                                <Typography fontSize={15} fontWeight={600}>{item.phone}</Typography>
                                {item.isPrimary && (
                                    <Chip size="small" color="chipSuccess" label="Mặc định" sx={{ ml: 1.5 }} />
                                )}
                            </Box>
                            <Typography fontSize={15} color='text.secondary' component='span'>
                                Địa chỉ: {item.addressString}
                            </Typography>
                        </RadioItem>
                    ))}
                </RadioGroup>
            </Box>
            <Box 
                p={2} bgcolor='#fff' position='sticky' bottom={0} 
                borderTop='1px solid' borderColor='divider'
                className='content-center-between'
            >
                <Button 
                    fullWidth size="large" color="btnGray" variant="contained"
                    sx={{ borderRadius: 0, textTransform: 'uppercase', mr: 2 }} 
                    onClick={handleToggleOpen}
                >
                    Trở lại
                </Button>
                <Button 
                    fullWidth size="large" color="btnDark" variant="contained"
                    sx={{ borderRadius: 0, textTransform: 'uppercase' }} 
                    onClick={handleToggleOpen}
                >
                    Xác nhận
                </Button>
            </Box>

            <AddAddressDialog 
                ref={addAddressRef} 
                onRefresh={onRefresh}
            />
        </Drawer>
    );
}

export default forwardRef(AddressDrawer);