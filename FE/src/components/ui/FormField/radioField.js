import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";

function RadioField(props) {
    const {
        field, form,
        label, disabled, size, options
    } = props

    const { name, value, onChange, onBlur } = field;
    const { errors, touched } = form;
    const showError = errors[name] && touched[name];

    return (
        <FormControl
            variant="outlined" margin="none" color="success" size={size} fullWidth
            error={showError}
            disabled={disabled}
        >
            <FormLabel>{label}</FormLabel>
            <RadioGroup
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                row
            >
                {options?.map((item, idx) => (
                    <FormControlLabel 
                        key={idx}
                        value={item.value} 
                        control={<Radio color="btnSuccess" />} 
                        label={item.label} 
                    />
                ))}
            </RadioGroup>
        </FormControl>
    );
}

export default RadioField;