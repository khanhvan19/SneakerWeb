import { FormControlLabel, Radio } from "@mui/material";

function RadioItem({ children, value, sx, disabled }) {
    return ( 
        <FormControlLabel
            value={value}
            disabled={disabled}
            control={<Radio color="btnSuccess"/>}
            sx={[sx, { '& .MuiFormControlLabel-label': { flex: 1 } }]}
            label={children}
        />
    );
}

export default RadioItem;