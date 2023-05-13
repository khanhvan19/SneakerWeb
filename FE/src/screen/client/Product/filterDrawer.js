import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Box, Button, Checkbox, Drawer, FormControlLabel, IconButton, Typography } from "@mui/material";
import { Clear, East } from "@mui/icons-material";
import AccordionFilter from "./Fitler/accordionFilter";
import axiosPublic from "utils/axiosPublic";
import FilterByRating from "./Fitler/filterByRating";
import FilterBySize from "./Fitler/filterBySize";
import FilterByPrice from "./Fitler/filterByPrice";
import { SquareChip } from "assets/styles/constantsStyle";
import { formatMoney } from "utils/formatters";

function FilterDrawer({ filters, onChange, onChipChange, onResetFilter }, ref) {
    const [open, setOpen] = useState();
    const [brands, setBrands] = useState([]);
    const [categorys, setCategorys] = useState([]);
    const filterPriceRef = useRef();

    useImperativeHandle(ref, () => ({
        onToggleDrawer: handleToggleOpen
    }));

    const handleToggleOpen = () => {
        setOpen((prev) => !prev);
    }

    useEffect(() => {
        axiosPublic
            .get('/brand/public')
            .then((res) => setBrands(res));
        axiosPublic
            .get('/category/public')
            .then((res) => setCategorys(res));
    }, [])

    const handleFilterRatingChange = (star) => {
        const newFilter = { star: star }
        onChange(newFilter)
    }

    const handleFilterSizeChange = (size) => {
        const newFilter = { size: size }
        onChange(newFilter)
    }

    const handleFilterPriceChange = (price) => {
        const newFilter = {
            priceMin: price[0],
            priceMax: price[1],
        }
        onChange(newFilter)
    }

    var FILTERS_CHIP = [
        {
            isShow: (obj) => !!(obj.brand),
            label: brands.find((item) => item._id === filters.brand)?.name,
            handleRemove: (obj) => {
                const newFilters = {...obj};
                delete newFilters.brand;
                return newFilters;
            }
        },
        {
            isShow: (obj) => !!(obj.category),
            label: categorys.find((item) => item._id === filters.category)?.name,
            handleRemove: (obj) => {
                const newFilters = {...obj};
                delete newFilters.category;
                return newFilters;
            }
        },
        {
            isShow: (obj) => !!(obj.size),
            label: `Size ${filters.size} EU`,
            handleRemove: (obj) => {
                const newFilters = {...obj};
                delete newFilters.size;
                return newFilters;
            }
        },
        {
            isShow: (obj) => !!(obj.star),
            label: `Từ ${filters.star} sao`,
            handleRemove: (obj) => {
                const newFilters = {...obj};
                delete newFilters.star;
                return newFilters;
            }
        },
        {
            isShow: (obj) => !!(obj.priceMin && obj.priceMax),
            label: `Từ ${formatMoney(parseInt(filters.priceMin))} 
                đến ${formatMoney(parseInt(filters.priceMax))} `,
            handleRemove: (obj) => {
                const newFilters = {...obj};
                delete newFilters.priceMin;
                delete newFilters.priceMax;
                filterPriceRef.current.resetSlider();
                return newFilters;
            }
        },
    ];

    return (  
        <Drawer
            open={open}
            anchor="right"
            variant="temporary"
            onClose={handleToggleOpen}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', md: 388 }} }}
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
                    <Button color="btnOutlinedDark" onClick={onResetFilter}>Đặt lại</Button>
                    <IconButton onClick={handleToggleOpen}><Clear /></IconButton>
                </Box>
            </Box>
            <Box height='100%' className='custom-scrollbar' sx={{ overflowY: 'scroll' }}>
                <Box px={2} py={1.5} borderBottom='1px solid' borderColor='divider'>
                    <Typography fontWeight='600' marginBottom={1}>
                        Bộ lọc được áp dụng:
                    </Typography>
                    {(categorys.length !== 0 && brands.length !== 0) && (
                        <Box display='flex' flexWrap='wrap'>
                            {FILTERS_CHIP
                                .filter((chip) => chip.isShow(filters))
                                .map((item, idx) => (
                                    <SquareChip 
                                        key={idx}
                                        sx={{ mr: 1, mb: 1}}
                                        variant='filled'
                                        label={item.label}
                                        deleteIcon={<Clear />} 
                                        onDelete={() => onChipChange(item.handleRemove(filters))}
                                    />
                                ))
                            }
                        </Box>
                    )}
                </Box>
                <AccordionFilter summary={"Danh mục"}>
                    {categorys.map((category, idx) => (
                        <Box key={idx}>
                            <FormControlLabel  
                                label={category.name}
                                sx={{ textTransform: "uppercase" }}
                                control={
                                    <Checkbox 
                                        color="btnDark" 
                                        checked={category._id === filters.category} 
                                    />
                                } 
                                onClick={() => onChange({ category: category._id })}
                            />
                        </Box>
                    ))}
                </AccordionFilter>
                <AccordionFilter summary={"Thương hiệu"}>
                    {brands.map((brand, idx) => (
                        <Box key={idx}>
                            <FormControlLabel     
                                label={brand.name}
                                sx={{ textTransform: "uppercase" }}
                                control={<Checkbox checked={brand._id === filters.brand} color="btnDark" />} 
                                onClick={() => onChange({ brand: brand._id })}
                            />
                        </Box>
                    ))}
                </AccordionFilter>
                <AccordionFilter summary={"Kích cỡ"} expanded={true}>
                    <FilterBySize 
                        filters={filters} 
                        onChange={handleFilterSizeChange}
                    />
                </AccordionFilter>
                <AccordionFilter summary={"Đánh giá"}>
                    <FilterByRating 
                        filters={filters} 
                        onChange={handleFilterRatingChange}
                    />
                </AccordionFilter>
                <AccordionFilter summary={"Giá bán"} expanded={true}>
                    <FilterByPrice 
                        ref={filterPriceRef}
                        filters={filters} 
                        onChange={handleFilterPriceChange} 
                    />
                </AccordionFilter>
            </Box>
            <Box 
                p={2} bgcolor='#fff'
                borderTop='1px solid'
                borderColor='divider' 
                position='sticky' bottom={0} 
            >
                <Button 
                    fullWidth
                    size="large"
                    color="btnDark"
                    variant="contained"
                    endIcon={<East />}
                    sx={{ 
                        borderRadius: 'unset',
                        textTransform: 'uppercase',
                        justifyContent: 'space-between',
                    }} 
                    onClick={handleToggleOpen}
                >
                    Áp dụng
                </Button>
            </Box>
        </Drawer>
    );
}

export default forwardRef(FilterDrawer);