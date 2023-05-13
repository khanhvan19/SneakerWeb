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
    const [titlePage, setTitlePage] = useState([])

    var totalPages = Math.ceil(pagination?.total / pagination?.limit);

    const queryParams = useMemo(() => {
        const params = queryString.parse(location.search)
        return {
            ...params,
            page: parseInt(params.page) || 1,
            limit: parseInt(params.limit) || 10,
            sort: params.sort || SORT_OPTION[0].value,
        }
    }, [location.search])

    useEffect(() => {
        var title = [];
        axiosPublic
            .post('/product/search', queryParams)
            .then((res) => {
                setProducts(res.data)
                setPagination(res.pagination)
                if(res.category) title.push(res.category);
                if(res.brand) title.push(res.brand)
            })
            .catch((err) => console.log(err))

        setTitlePage(title)
    }, [queryParams])

    const updateURL = (searchParams) => {
        navigate({
            pathname: location.pathname,
            search: queryString.stringify(searchParams)
        })
    }

    const handlePageChange = (e, newValue) => {
        const filter = { ...queryParams, page: newValue }
        updateURL(filter);
    };

    const handleSortChange = (e) => {
        const filter = { ...queryParams, sort: e.target.value, page: 1 };
        updateURL(filter);
    }

    const handleFilterDrawerChange = (newFilter) => {
        const filter = { ...queryParams, ...newFilter, page: 1 };
        updateURL(filter);
    }
    
    const handleFilterChipChange = (newFilter) => {
        const filter = { ...newFilter, page: 1 };
        updateURL(filter);
    }

    const handleResetFilter = () => {
        const filter = { 
            page: 1,
            limit: queryParams.limit,
            sort: queryParams.sort,
        }
        updateURL(filter)
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
                <Box className='content-bottom-center'>
                    {(titlePage.length === 0) 
                        ?   <Typography variant='h4' textTransform='uppercase' fontStyle='italic'>
                                Tất cả sản phẩm
                            </Typography>
                        :   <Typography variant='h4' textTransform='uppercase' fontStyle='italic'>
                                {titlePage.map((item, idx) => (
                                    <Box key={idx} component='span'>
                                        {item}
                                        {(idx !== titlePage.length - 1) && (
                                            <Box component='span' px={1}>•</Box>
                                        )}
                                    </Box>
                                ))}
                            </Typography>
                    }      
                    <Typography variant='h6' fontWeight={400} ml={2}>[{products.length}]</Typography>                    
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
                        value={queryParams.sort}
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
                {products && products.map((item, idx) => (
                    <Grid xs={4} key={idx}>
                        <ProductCard data={item} />
                    </Grid>
                ))}
            </Grid>
            {(pagination && totalPages > 1) && (
                <Box className='content-center' pt={3} pb={2}>
                    <Pagination 
                        size='large' color='btnDark'
                        showFirstButton showLastButton
                        count={totalPages} page={pagination.page} 
                        onChange={handlePageChange} 
                        renderItem={(item) => (
                            <PaginationItem 
                                {...item}
                                shape='rounded'
                                sx={{ borderRadius: 'unset' }}
                            />
                        )}
                    />
                </Box>
            )}

            <FilterDrawer 
                ref={filterRef} 
                filters={queryParams} 
                onChange={handleFilterDrawerChange} 
                onChipChange={handleFilterChipChange}
                onResetFilter={handleResetFilter}
            />
        </>
    );
}

export default ProductList;