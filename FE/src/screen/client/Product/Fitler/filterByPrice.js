import { Box, Slider, Typography } from "@mui/material";
import useDebounce from "hooks/useDebounce";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { formatMoney } from "utils/formatters";

const MIN = 750000;
const MAX = 10000000;

function FilterByPrice({ filters, onChange }, ref) {
    const [changed, setChanged] = useState(false)
    const [value, setValue] = useState([
        parseInt(filters.priceMin) || MIN, 
        parseInt(filters.priceMax) || MAX,
    ]);

    var priceValue = useDebounce(value, 750);

    useEffect(() => {
        if((priceValue[0] !== MIN || priceValue[1] !== MAX) || changed === true) {
            onChange(priceValue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [priceValue]);

    useImperativeHandle(ref, () => ({
        resetSlider : () => {
            setValue([MIN, MAX]); 
            setChanged(false)
        } 
    }));

    return (  
        <Box mx={1.5} pb={1}>
            <Typography align="center" fontWeight={500} marginBottom={2}>
                {formatMoney(value[0])} - {formatMoney(value[1])}
            </Typography>
            <Slider
                value={value}
                size="small"
                min={750000}
                max={10000000}
                color="btnDark"
                onChange={(e, value) => {
                    setValue(value);
                    setChanged(true);
                }}
                sx={{
                    '& .MuiSlider-thumb': {
                        height: 24,
                        width: 24,
                        backgroundColor: '#fff',
                        border: '2px solid currentColor',
                    },
                }}
            />
        </Box>
    );
}

export default forwardRef(FilterByPrice);