import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';

import Grid from '@mui/material/Unstable_Grid2';
import { 
    Box, 
    Button, 
    InputAdornment, 
    MenuItem, 
    Pagination, 
    PaginationItem, 
    TextField, 
    Typography 
} from '@mui/material';
import { 
    CottageOutlined, 
    Tune 
} from '@mui/icons-material';

import axiosPublic from 'utils/axiosPublic';
import RouterBreadcrumbs from 'components/ui/breadcrumbs';
import ProductCard from 'components/ui/Card/productCard';
import FilterDrawer from './filterDrawer';
import { BREADCRUMB_CUSTOMER_PRODUCT } from 'constants/breadcrumb';
import { SORT_OPTION } from 'constants/optionSelectField';


function ProductList() {
    const filterRef = useRef();
    const location = useLocation();
    var navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState();

    var totalPages = Math.ceil(pagination?.total / pagination?.limit)

    const queryParams = useMemo(() => {
        const params = queryString.parse(location.search)
        return {
            ...params,
            page: parseInt(params.page) || 1,
            limit: parseInt(params.limit) || 10,
        }
    }, [location.search])

    useEffect(() => {
        axiosPublic
            .post('/sample/search', queryParams)
            .then((res) => {
                console.log(res);
                setProducts(res.data)
                setPagination(res.pagination)
            })
            .catch((err) => console.log(err))
    }, [queryParams])

    const handlePageChange = (e, newValue) => {
        const filter = { ...queryParams, page: newValue }
        navigate({
            pathname: location.pathname,
            search: queryString.stringify(filter)
        })
    };

    const handleSortChange = (e) => {
        // const filter = { ...queryParams, sort: }
        console.log(e.target.value);
    }

    return (  
        <>  
            <Box>
                <RouterBreadcrumbs 
                    prevLink={BREADCRUMB_CUSTOMER_PRODUCT}
                    homeIcon={<CottageOutlined />}
                /> 
            </Box>
            <Box mt={2} mb={2.5} className='content-center-between'>
                <Box>
                    <Typography variant='h5' textTransform='uppercase'>Tất cả sản phẩm</Typography>
                </Box>
                <Box>
                    <Button 
                        size='large'
                        color='btnOutlinedDark'
                        endIcon={<Tune />}
                        onClick={() => filterRef.current.onToggleDrawer()}
                        sx={{ mr: 0.5, textTransform: 'none', fontSize: '1rem' }}
                    >
                        Lọc sản phẩm
                    </Button>
                    <TextField
                        select
                        size="small"
                        defaultValue="new"
                        sx={{ "& fieldset": { border: 'none' } }}
                        SelectProps={{ 
                            sx: { fontWeight: 500 },
                            startAdornment: (
                                <InputAdornment position="end" sx={{ mr: 1 }}>
                                    Sort By: 
                                </InputAdornment>
                            ),
                        }}
                        onChange={handleSortChange}
                    >
                        {SORT_OPTION.map((option, idx) => (
                            <MenuItem key={idx} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            </Box>
            <Grid container spacing={2} columns={16}>
                {products && products
                    .filter(item => item.products.length !== 0)
                    .map((item, idx) => (
                        <Grid xs={4} key={idx}>
                            <ProductCard data={item}/>
                        </Grid>
                    ))
                }
            </Grid>
            <Box className='content-center'>
                {pagination && (
                    <Pagination 
                        size="large"
                        showLastButton
                        showFirstButton
                        count={totalPages} 
                        page={pagination.page} 
                        onChange={handlePageChange} 
                        renderItem={(item) => (
                            <PaginationItem 
                                {...item}
                                shape='rounded'
                                sx={{ borderRadius: 'unset' }}
                            />
                        )}
                    />
                )}
            </Box>

            <FilterDrawer ref={filterRef}/>
        </>
    );
}

export default ProductList;