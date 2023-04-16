import {Outlet } from "react-router";

import styles from './Layout.module.scss'
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

function PrivateFormLayout() {
    return ( 
    <div className={cx('private-form-wrapper')}>
        <header>
            <img src="" alt="LOGO"/> 
        </header>
        <Outlet /> 
    </div>
         
    );
}

export default PrivateFormLayout;