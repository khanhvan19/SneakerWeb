import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { 
    Accordion, 
    AccordionDetails, 
    AccordionSummary, 
    Avatar, 
    Box,
    Button,
    Card,
    CardContent,
    Typography
} from '@mui/material';
import {
    ExpandMore,
    Speed,
    CategoryOutlined,
    Inventory2Outlined,
    LocalMallOutlined,
    PeopleAltOutlined,
    BadgeOutlined,
    ReceiptLongOutlined,
    ConfirmationNumberOutlined,
    ArrowRight,
} from '@mui/icons-material';
import { styled } from "@mui/material/styles"

import * as image from 'assets/images'

import styles from './Sidebar.module.scss'
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

const SIDEBAR_CONTENT = [
    {icon: <Speed />, name: "Dashboard", link: '/admin'},
    {icon: <CategoryOutlined />, name: "Danh mục", child: [
        {name: "Danh mục", link: '/admin/category', permit: 'P1_1'},
        {name: "Thương hiệu", link: '/admin/brand', permit: 'P2_1'}
    ]},
    {icon: <Inventory2Outlined />, name: "Sản phẩm", child: [
        {name: "Mẫu sản phẩm", link: '/admin/product-sample', permit: 'P3_1'},
        {name: "Sản phẩm", link: '/admin/product', permit: 'P4_1'}
    ]},
    {icon: <LocalMallOutlined />, name: "Đơn hàng", link: '/admin', permit: 'P5_1'},
    {icon: <PeopleAltOutlined />, name: "Khách hàng", link: '/admin/customer', permit: 'P6_1'},
    {icon: <BadgeOutlined />, name: "Nhân viên", link: '/admin/employee', permit: 'P7_1'},
    {icon: <ReceiptLongOutlined />, name: "Nhập hàng", link: '/admin/import', permit: 'P8_1'},
    {icon: <ConfirmationNumberOutlined />, name: "Phiếu giảm giá", link: '/admin/voucher', permit: 'P9_1'},
];

const CustomButton = styled(Button)(({ theme }) => ({
    width: '100%',
    padding: 0,
    fontWeight: 400,
    textTransform: 'none',
    justifyContent: 'left',
    marginBottom: '4px',
    borderRadius: '8px',
    overflow: 'hidden',
    color: theme.palette.text.primary,
    transition: "all 0.2s ease-in-out",
    '&:hover': {
        bgcolor: '#919eab14'
    },
    '& .MuiButton-startIcon': {
        display: 'flex !important',
        alignItems: 'center !important',
        '>*:nth-of-type(1)': {
            fontSize: '1.5rem'
        }
    }
}))

function AdminSidebar() {
    const mode = useSelector((state) => state.theme?.adminMode);
    const employee = useSelector((state) => state.auth.login?.data);
    const [expanded, setExpanded] = useState(false);
    const [active, setActive] = useState({ parent: "p0", children: "" })
    var navigate = useNavigate();

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const checkDisabled = (permit) => {
        if(permit === undefined) return false;
        if(employee?.permissions[permit] === false 
        || employee?.permissions[permit] === undefined ) {
            return true;
        }
        return false;
    }

    return (
        <Box className={cx('adsidebar-wrapper')} sx={{ borderColor: 'divider' }}>
            <Box className={cx('adsidebar-container', 'custom-scrollbar')}>
                <Typography align="center" mb={2}> 
                    <img 
                        src={(mode === 'light') ? image.logoLight : image.logoDark} 
                        height='50' alt="LOGO" 
                    />
                </Typography>
                <Card 
                    elevation={0}
                    sx={{ 
                        mb: 2, 
                        display: 'flex', 
                        alignItems: 'center',
                        bgcolor: "background.highlight",
                    }}
                >
                    <CardContent>
                        <Avatar src={employee?.avatar?.link}  alt='' />
                    </CardContent>
                    <CardContent 
                        sx={{ 
                            flex: 1, px: 0, 
                            '&:last-child' : {pb: '16px'}
                        }}
                    >
                        <Typography variant="subtitle2">{employee?.name}</Typography>
                        <Typography variant="caption" color='text.secondary'>{employee?.email}</Typography>
                    </CardContent>
                </Card>

                <Box className={cx('adsidebar-content')}>
                    {SIDEBAR_CONTENT.map((item, idx) => (    
                        <Accordion 
                            key={idx}
                            disableGutters
                            expanded={expanded === `p${idx}`} 
                            onChange={handleChange(`p${idx}`)}
                        >     
                            <CustomButton
                                component={AccordionSummary}
                                expandIcon={item.child && <ExpandMore />}
                                startIcon={item.icon}
                                disabled={ checkDisabled(item?.permit) }
                                onClick={() => {
                                    navigate(item?.link)
                                    setActive({ parent: `p${idx}`, children: ""})
                                }}
                                sx={{ 
                                    px: 2, fontSize: '16px',
                                    fontWeight: (active.parent === `p${idx}`) ? 600 : 400,
                                    color: (active.parent ===  `p${idx}`) 
                                        ? 'text.accent' 
                                        : 'text.primary',
                                    bgcolor: (active.parent ===  `p${idx}`) 
                                        ? 'background.accent' 
                                        : 'transparent',
                                }}
                            > 
                                {item.name}
                            </CustomButton> 
                            {item.child && (
                                <AccordionDetails sx={{ py: 1, px: 0 }} >
                                    {item.child.map((child, i) => ( 
                                        <CustomButton
                                            key={i}
                                            startIcon={<ArrowRight/>}
                                            fullWidth
                                            component={Link}
                                            to={child.link} 
                                            disabled={ checkDisabled(child?.permit) }
                                            onClick={() => setActive(prev =>
                                                ({...prev, children: `c${i}`})
                                            )}
                                            sx={{ 
                                                pl: 3, py: 1, mb: 0.5,
                                                fontWeight: (active.children === `c${i}`) ? 600 : 400,
                                                color: (active.children ===  `c${i}`) 
                                                    ? 'text.accent' 
                                                    : 'text.primary',
                                            }}
                                        >
                                            {child.name}
                                        </CustomButton>
                                    ))}
                                </AccordionDetails>
                            )}
                        </Accordion>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

export default AdminSidebar;