import { ReportOutlined, VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import { useState } from "react";

function SecretField(props) {
    const {
        field, form,
        label, disabled, sx, placeholder, startLabel, size
    } = props

    const { name, value, onChange, onBlur } = field;
    const { errors, touched } = form;
    const showError = errors[name] && touched[name];

    const [show, setShow] = useState(false);

    return (  
        <FormControl
            variant="outlined" margin="none" color="success" fullWidth size={size}
            error={showError}
        >
            {(label) && <InputLabel>{label}</InputLabel>} 
            <OutlinedInput
                label={label}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
                sx={[sx, { pr: 0 }]}
                placeholder={placeholder}
                type={show ? 'text' : 'password'}
                startAdornment={startLabel && (
                    <InputAdornment position="start">
                        {startLabel}
                    </InputAdornment>
                )}
                endAdornment={
                    <InputAdornment position="start">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={(e) => setShow((prev) => !prev)}
                        >
                            {show ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                        </IconButton>
                    </InputAdornment>
                }
                
            />
            {showError && (
                <FormHelperText className='content-left-center' sx={{ mx: 0 }}>
                    <ReportOutlined sx={{ fontSize: "1rem", lineHeight: 1, mr: 0.5 }} />
                    {errors[name]}
                </FormHelperText>
            )}
        </FormControl>
    );
}

export default SecretField;