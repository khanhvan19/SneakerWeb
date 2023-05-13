import { useEffect, useRef, useState } from 'react';
import queryString from 'query-string';

import { 
    AppBar, 
    Badge, 
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
import { useDispatch, useSelector } from 'react-redux';
import { ButtonNav } from 'assets/styles/constantsStyle';
import HoverMenu from 'components/ui/Menu/hoverMenu';
import HeaderDrawer from './drawer';
import SearchDialog from './searchDialog';
import axiosPublic from 'utils/axiosPublic';
import ClickMenu from 'components/ui/Menu/clickMenu';
import { handleCustomerLogout } from 'redux/slices/clientAuth.slice';
import { updateTotalCart } from 'redux/slices/cart.slice';
import { updateFavorite } from 'redux/slices/favorite.slice';

function Header(props) {
    const isLogin = useSelector((state) => state.client?.login?.data);
    var cartCount = useSelector((state) => state.cart?.totalCart);
    var favorites = useSelector((state) => state.favorite?.favorites);
    const [brands, setBrands] = useState([]);
    const [categorys, setCategorys] = useState([]);
    const searchRef = useRef();
    const navMenuRef = useRef();
    const navDrawerRef = useRef();
    const accountMenuRef = useRef();
    var navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        axiosPublic
            .get("category/public")
            .then((res) => { setCategorys(res) })
            .catch((err) => { console.log(err) });
        axiosPublic
            .get("brand/public")
            .then((res) => { setBrands(res) })
            .catch((err) => { console.log(err) });
    }, [])

    const handleLogout = () => {
        dispatch(handleCustomerLogout(isLogin?._id))
            .unwrap()
            .then((res) => {
                dispatch(updateTotalCart(0))
                dispatch(updateFavorite([]))
                navigate("/login");
            })
    }

    var accountMenuItems = (!isLogin) 
        ? [
            {label: 'Đăng nhập', link: '/login'},
            {label: 'Đăng ký tài khoản', link: '/register'},
        ] 
        : [
            {label: 'Hồ sơ của tôi', link: '/my-account'},
            {label: 'Danh sách địa chỉ', link: '/address'},
            {label: 'Đổi mật khẩu', link: '/reset-password', divider: true},
            {label: 'Đăng xuất', action: handleLogout},
        ];

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
                            sx={{ '&:hover': {textDecoration: 'underline'} }}
                        >
                            Liên hệ hợp tác
                        </Typography>
                    </Box>
                    <Box display='flex'>
                        <Typography 
                            to="/help" component={Link}
                            fontSize="small" fontWeight={600} 
                            sx={{ '&:hover': {textDecoration: 'underline'} }}
                        >
                            Trợ giúp
                        </Typography>
                        <Divider orientation="vertical" flexItem sx={{ mx: 1, borderWidth: 1 }} />
                        <Typography 
                            component={Link} to={isLogin ? "/order" : "/login"} 
                            fontSize="small" fontWeight={600}
                            sx={{ '&:hover': {textDecoration: 'underline'} }}
                        >
                            Theo dõi đơn hàng
                        </Typography>
                        <Divider orientation="vertical" flexItem sx={{ mx: 1, borderWidth: 1 }} />
                        {isLogin 
                            ? (
                                <Typography fontSize="small" fontWeight={600}>
                                    Hi! {isLogin?.name}
                                </Typography>
                            )
                            : (
                                <Typography 
                                    to="/login" component={Link}
                                    fontSize="small" fontWeight={600}
                                    sx={{ '&:hover': {textDecoration: 'underline'} }}
                                >
                                    Đăng nhập
                                </Typography>
                            )
                        }
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
                                        onClick={() => navigate({
                                            pathname: '/product/',
                                            search: queryString.stringify({ category: category._id })
                                        })}
                                    >
                                        {brands?.map((brand, i) => (
                                            <MenuItem
                                                key={i}
                                                sx={{ width: 240, textTransform: 'uppercase' }}
                                                onClick={() => {
                                                    navMenuRef.current.onCloseMenu();
                                                    navigate({
                                                        pathname: '/product/',
                                                        search: queryString.stringify({ category: category._id, brand: brand._id })
                                                    })
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
                                <ClickMenu 
                                    ref={accountMenuRef}
                                    button={IconButton}
                                    buttonChildren={
                                        <AccountCircleOutlined 
                                            sx={{ color: 'text.primary', fontSize: { sm: '1.75rem' } }} 
                                        />
                                    }
                                    tooltipTitle="Tài khoản"
                                >
                                    {accountMenuItems.map((item, idx) => (
                                        <MenuItem
                                            key={idx}
                                            divider={item.divider}
                                            onClick={() => {
                                                if(item.link) navigate(item.link);
                                                else item.action();
                                                accountMenuRef.current.onCloseMenu();
                                            }}
                                        >
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </ClickMenu>
                                <Tooltip arrow title="Yêu thích">
                                    <IconButton 
                                        component={Link} to={isLogin ? "/my-favorite" : "/login"} 
                                    >
                                        <Badge color="error" badgeContent={favorites?.length}>
                                            <FavoriteBorderOutlined 
                                                sx={{ color: 'text.primary', fontSize: {sm: '1.75rem' } }} 
                                            />
                                        </Badge>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip arrow title="Giỏ hàng">
                                        <IconButton 
                                            edge='end' 
                                            component={Link} to={isLogin ? "/cart" : "/login"} 
                                        >
                                            <Badge color="error" badgeContent={cartCount}>
                                                <LocalMallOutlined 
                                                    sx={{ color: 'text.primary', fontSize: { sm: '1.75rem' } }} 
                                                />
                                            </Badge>
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