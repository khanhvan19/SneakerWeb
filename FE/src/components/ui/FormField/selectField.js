import { ReportOutlined } from "@mui/icons-material";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";

function SelectField(props) {
    const { 
        field, form,
        options, label, disabled, size, sx, onChangeOther
    } = props;

    const { name, value, onChange, onBlur } = field;
    const { errors, touched } = form;
    const showError = errors[name] && touched[name];

    return (  
        <FormControl
            variant="outlined" margin="none" color="success" size={size} fullWidth
            error={showError}
            disabled={disabled}
        >
            <InputLabel>{label}</InputLabel>
            <Select
                name={name}
                label={label}
                value={value}
                onBlur={onBlur}
                onChange={(onChangeOther != null) ? onChangeOther : onChange}
                disabled={disabled}
                sx={sx}
            >
                {options.map((item, idx) => (
                    <MenuItem key={idx} value={ item._id || item.value  }>
                        {item.name || item.label }
                    </MenuItem>
                ))}
            </Select>

            {showError && (
                <FormHelperText className='content-left-center' sx={{ mx: 0 }}>
                    <ReportOutlined sx={{ fontSize: "1rem", lineHeight: 1, mr: 0.5 }} />
                    {errors[name]}
                </FormHelperText>
            )}
        </FormControl>
    );
}



export default  SelectField;