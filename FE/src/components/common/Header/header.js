import { useEffect, useRef, useState } from 'react';

import { 
    AppBar, 
    Box, 
    Button, 
    Container, 
    Divider, 
    IconButton, 
    MenuItem, 
    Toolbar, 
    Tooltip, 
    Typography, 
} from '@mui/material';
import { 
    AccountCircleOutlined, 
    FavoriteBorderOutlined, 
    LocalMallOutlined, 
    Menu, 
    SearchOutlined 
} from '@mui/icons-material';

import HideOnScroll from 'components/ui/hideOnScroll';
import * as image from 'assets/images'
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ButtonNav } from 'assets/styles/constantsStyle';
import HoverMenu from 'components/ui/hoverMenu';
import HeaderDrawer from './drawer';
import SearchDialog from './searchDialog';
import axiosPublic from 'utils/axiosPublic';

function Header(props) {
    const loginData = useSelector((state) => state.auth?.login?.data);
    const [brands, setBrands] = useState([]);
    const [categorys, setCategorys] = useState([]);
    const searchRef = useRef();
    const navMenuRef = useRef();
    const navDrawerRef = useRef();
    var navigate = useNavigate();

    useEffect(() => {
        axiosPublic
            .get("category/public", { headers: { token: loginData?.accessToken} })
            .then((res) => { setCategorys(res) })
            .catch((err) => { console.log(err) });
        axiosPublic
            .get("brand/public", { headers: { token: loginData?.accessToken} })
            .then((res) => { setBrands(res) })
            .catch((err) => { console.log(err) });
    }, [loginData])

    return ( 
        <>
            <Container maxWidth="xl" id="back-to-top-anchor">
                <Box 
                    pt={0.5}
                    display={{ xs: 'none', md: 'flex' }} 
                    alignItems='center' justifyContent='space-between'
                >
                    <Box display='flex'>
                        <Typography fontSize="small">
                            Hotline: <b>0789111222</b> (8h - 22h)
                        </Typography>
                        <Divider orientation="vertical" flexItem sx={{ mx: 1, borderWidth: 1 }} />
                        <Typography 
                            to="/cooperation" component={Link}
                            fontSize="small" fontWeight={600}
                        >
                            Liên hệ hợp tác
                        </Typography>
                    </Box>
                    <Box display='flex'>
                        <Typography 
                            to="/help" component={Link}
                            fontSize="small" fontWeight={600} 
                        >
                            Trợ giúp
                        </Typography>
                        <Divider orientation="vertical" flexItem sx={{ mx: 1, borderWidth: 1 }} />
                        <Typography 
                            to="/order" component={Link}
                            fontSize="small" fontWeight={600}
                        >
                            Theo dõi đơn hàng
                        </Typography>
                        <Divider orientation="vertical" flexItem sx={{ mx: 1, borderWidth: 1 }} />
                        <Typography fontSize="small" fontWeight={600}>
                            Hi! {loginData?.name}
                        </Typography>
                    </Box>
                </Box>
            </Container>
            <HideOnScroll  {...props}>
                <AppBar 
                    position="sticky"
                    color="headerGlass"
                    sx={{ backdropFilter: 'blur(5px)' }}
                >   
                    <Container maxWidth='xl'>
                        <Toolbar 
                            disableGutters
                            sx={{ py: 0.5, position: 'relative', justifyContent: 'space-between' }}
                        >
                            <Box 
                                to="/" component={Link}
                                alignItems='center' display={{ xs: 'none', md: 'flex' }} 
                            >
                                <img src={image.logoLight} alt='' style={{ height: '48px' }} />
                            </Box> 
                            <Box display={{ xs: 'none', md: 'flex' }}>
                                {categorys?.map((category, idx) => (
                                    <HoverMenu 
                                        key={idx} 
                                        ref={navMenuRef}
                                        button={ButtonNav}
                                        buttonChildren={category.name}
                                        buttonProps={{
                                            disableRipple: true,
                                            disableTouchRipple: true,
                                            disableFocusRipple : true,           
                                        }}
                                        sx={{ mx: {xs: 0, md: 0.5, lg: 1 } }} 
                                        onClick={() => navigate(`product/${category?.slug}`)}
                                    >
                                        {brands?.map((brand, i) => (
                                            <MenuItem
                                                key={i}
                                                sx={{ width: 240, textTransform: 'uppercase' }}
                                                onClick={() => {
                                                    navMenuRef.current.onCloseMenu()
                                                    navigate(`product/${category?.slug}/${brand?.slug}`)
                                                }}
                                            >
                                                {brand.name}
                                            </MenuItem>
                                        ))}
                                    </HoverMenu>
                                ))}
                            </Box>

                {/* RESPONSIVE */} 
                            <Box display={{ xs: 'flex', md: 'none' }} zIndex={2}>
                                <IconButton 
                                    edge="start"
                                    color="inherit"
                                    onClick={() => navDrawerRef.current.onToggleDrawer()}
                                >
                                    <Menu sx={{fontSize: { sm: '1.75rem' }}} />
                                </IconButton>
                                <Tooltip 
                                    arrow title="Tìm kiếm"
                                >
                                    <IconButton onClick={() => searchRef.current.onOpenSearchDialog()}>
                                        <SearchOutlined 
                                            sx={{ color: 'text.primary', fontSize: { sm: '1.75rem' }}} 
                                        />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Box 
                                display={{ xs: 'flex', md: 'none' }} 
                                to="/"
                                zIndex={1}
                                component={Link}
                                position='absolute' 
                                alignItems='center' 
                                justifyContent='center'
                                width='calc(100% - 48px)'
                            >
                                <Box 
                                    component='img' src={image.logoLight} alt=''
                                    height={{ xs: 40, sm: 48 }}
                                />
                            </Box>
                {/* RESPONSIVE */}

                            <Box zIndex={2}>
                                <Button 
                                    disableElevation
                                    color='btnGlassGray'
                                    variant='contained'
                                    onClick={() => searchRef.current.onOpenSearchDialog()}
                                    startIcon={<SearchOutlined />}
                                    sx={{ mr: 1, display: { xs: 'none', md: 'inline-flex' } }}
                                >
                                    <Typography variant="caption" pr={{ md: 2.5, lg: 5 }}>Bạn cần tìm gì...</Typography> 
                                </Button>
                                <Tooltip arrow title="Tài khoản">
                                    <IconButton>
                                        <AccountCircleOutlined 
                                            sx={{ color: 'text.primary', fontSize: { sm: '1.75rem' }}} 
                                        />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip arrow title="Yêu thích">
                                    <IconButton>
                                        <FavoriteBorderOutlined 
                                            sx={{ color: 'text.primary', fontSize: {sm: '1.75rem' }}} 
                                        />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip arrow title="Giỏ hàng">
                                    <IconButton edge='end'>
                                        <LocalMallOutlined 
                                            sx={{ color: 'text.primary', fontSize: { sm: '1.75rem' }}} 
                                        />
                                    </IconButton>
                                </Tooltip>

                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
            </HideOnScroll>

            <HeaderDrawer ref={navDrawerRef} arrData={[categorys, brands]} />
            
            <SearchDialog ref={searchRef} />
            
        </>
    );
}

export default Header;