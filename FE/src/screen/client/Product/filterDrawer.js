import { forwardRef, useImperativeHandle, useState } from "react";
import { Box, Button, Divider, Drawer, IconButton, Typography } from "@mui/material";
import { Clear, East } from "@mui/icons-material";
import { SquareChip } from "assets/styles/constantsStyle";
import AccordionFilter from "./Fitler/accordionFilter";

function FilterDrawer(props, ref) {
    const [open, setOpen] = useState();

    useImperativeHandle(ref, () => ({
        onToggleDrawer: handleToggleOpen
    }));

    const handleToggleOpen = () => {
        setOpen((prev) => !prev);
    }

    return (  
        <Drawer
            open={open}
            anchor="right"
            variant="temporary"
            onClose={handleToggleOpen}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', md: 384 }} }}
        >
            <Box
                px={2} py={1.5}
                borderBottom='1px solid'
                borderColor='divider' 
                zIndex={2} bgcolor='#fff'
                position='sticky' top={0}
                className='content-center-between' 
            >
                <Typography variant="h5">Lọc sản phẩm</Typography>
                <Box>
                    <Button color="btnOutlinedDark">
                        Đặt lại
                    </Button>
                    <IconButton onClick={handleToggleOpen}>
                        <Clear />
                    </IconButton>
                </Box>
            </Box>
            <Box height='100%' className='custom-scrollbar' sx={{ overflowY: 'scroll' }}>
                <Box px={2} py={1.5} borderBottom='1px solid' borderColor='divider'>
                    <Typography fontWeight='600'>Bộ lọc được áp dụng:</Typography>
                    <Box display='flex' py={1}>
                        <SquareChip 
                            sx={{ mr: 1 }}
                            label='Test chip'
                            variant='filled'
                            deleteIcon={<Clear />} 
                            onDelete={() => {}}
                        />
                    </Box>
                </Box>
                <AccordionFilter summary={"Danh mục"}>
                    <Typography>
                        cecece
                    </Typography>
                </AccordionFilter>
                <AccordionFilter summary={"Thương hiệu"}>
                    <Typography>
                        cecece
                    </Typography>
                </AccordionFilter>
                <AccordionFilter summary={"Loại sản phẩm"}>
                    <Typography>
                        cecece
                    </Typography>
                </AccordionFilter>
                <AccordionFilter summary={"Kích cỡ"}>
                    <Typography>
                        cecece
                    </Typography>
                </AccordionFilter>
                <AccordionFilter summary={"Đánh giá"}>
                    <Typography>
                        cecece
                    </Typography>
                </AccordionFilter>
                <AccordionFilter summary={"Giá bán"}>
                    <Typography>
                        cecece
                    </Typography>
                </AccordionFilter>
            </Box>
            <Box 
                p={2} bgcolor='#fff'
                borderTop='1px solid'
                borderColor='divider' 
                position='sticky' bottom={0} 
            >
                <Button 
                    size="large"
                    color="btnDark"
                    variant="contained"
                    endIcon={<East />}
                    fullWidth
                    sx={{ 
                        borderRadius: 'unset',
                        textTransform: 'uppercase',
                        justifyContent: 'space-between',
                    }} 
                >
                    Áp dụng
                </Button>
            </Box>
        </Drawer>
    );
}

export default forwardRef(FilterDrawer);