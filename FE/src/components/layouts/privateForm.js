import {Outlet } from "react-router";
import * as image from 'assets/images'
import styles from './Layout.module.scss'
import classNames from "classnames/bind";
import { Box, Container } from "@mui/material";
const cx = classNames.bind(styles);

function PrivateFormLayout() {
    return ( 
    <div className={cx('private-form-wrapper')}>
        <Container maxWidth='xl' component='header' sx={{ py: 0.5 }}>
            <Box component='img' src={image.logoLight} alt="LOGO" height={48} /> 
        </Container>
        <Outlet /> 
    </div>
         
    );
}

export default PrivateFormLayout;