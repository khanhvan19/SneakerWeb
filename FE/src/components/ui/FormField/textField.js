import { ReportOutlined } from "@mui/icons-material";
import { FormControl, FormHelperText, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";

function TextField(props) {
    const {
        field, form,
        type, label, disabled, endLabel, rows, size, placeholder, sx, startLabel
    } = props

    const { name, value, onChange, onBlur } = field;
    const { errors, touched } = form;
    const showError = errors[name] && touched[name];

    const styleDateField = (type === 'date' || type === 'datetime-local') 
        ? { '& legend': { maxWidth: 'none' }} : {}

    return (  
        <FormControl
            variant="outlined" margin="none" color="success" size={size} fullWidth
            error={showError}
            disabled={disabled}
        >
            {(type === 'date' || type === 'datetime-local') ? (
                <InputLabel shrink>{label}</InputLabel>
            ) : (
                <InputLabel>{label}</InputLabel>
            )}
            <OutlinedInput
                label={label}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                type={type}
                rows={rows}
                multiline={rows ? true : false}
                sx={[styleDateField , {...sx}]}
                placeholder={placeholder}
                startAdornment={startLabel && 
                    <InputAdornment position="start">
                        {startLabel}
                    </InputAdornment>
                }
                endAdornment={endLabel && 
                    <InputAdornment position="end">
                        {endLabel}
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

export default TextField;