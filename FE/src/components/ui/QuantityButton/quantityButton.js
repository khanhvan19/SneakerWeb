import { Add, Remove } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { memo, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TOAST_CENTER_STYLE } from "assets/styles/constantsStyle";
import useDebounce from "hooks/useDebounce";

import styles from './QuantityButton.module.scss'
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

function QuantityButton({ quantity, min, max, onChange }) {
    const [value, setValue] = useState(quantity);
    const [isChange, setIsChange] = useState(0);

    var newQuantity = useDebounce(value, 500);
    
    useEffect(() => {
        if(isChange !== 0 && newQuantity >= min && newQuantity <= max) {
            onChange(+newQuantity);
        } 

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newQuantity])

    const handleDecrease = () => {
        if(value > min) {
            setValue(prev => prev - 1)
            setIsChange(prev => prev + 1)
        } 
    }
    
    const handleIncrease = () => {
        if(value < max) {
            setValue(prev => prev + 1)
            setIsChange(prev => prev + 1)
        } 
    }

    const handleBlur = () => {
        setIsChange(prev => prev + 1)
        if(value === '' ) setValue(parseInt(quantity))
        else if(value < min) setValue(min)
        else if(value > max) { 
            setValue(max)
            toast.warn(
                `Rất tiếc! Bạn chỉ có thể đặt mua tối đa ${max} sản phẩm`, 
                TOAST_CENTER_STYLE
            );
        }
    }

    return (  
        <Box className={cx('quantity-button-container')}>
            <Button 
                color='btnDark'
                onClick={handleDecrease}
                sx={{ borderColor: 'divider' }}
            >
                <Remove />
            </Button>
            <input 
                type='number'
                value={value} 
                min={min} max={max}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleBlur}            
            />
            <Button 
                color='btnDark' 
                onClick={handleIncrease}
                sx={{ borderColor: 'divider' }}
            >
                <Add />
            </Button>
        </Box>
    );
}

export default memo(QuantityButton);