import * as image from 'assets/images';
import { Box } from '@mui/material';

import styles from './deliveryTruck.module.scss'
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

function DeliveryTruck() {
    return (  
        <div className={cx("loop-wrapper")}>
            <div className={cx("mountain")}></div>
            <div className={cx("mountain")}></div>
            <div className={cx("mountain")}></div>
            <div className={cx("hill")}></div>
            <div className={cx("hill")}></div>
            <div className={cx("hill")}></div>
            <Box component='img' src={image.trees} className={cx("tree")} />
            <Box component='img' src={image.trees} className={cx("tree")} />
            <Box component='img' src={image.trees} className={cx("tree")} />
            <div className={cx("rock")}></div>
            <Box className={cx("truck")}>
               <img alt='' src={image.deliveryTruck} width={'100%'} />
            </Box> 
        </div> 
    );
}

export default DeliveryTruck;