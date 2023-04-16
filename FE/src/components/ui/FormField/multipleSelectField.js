import { ReportOutlined } from "@mui/icons-material";
import { 
    Box, 
    Checkbox, 
    Chip, 
    FormControl, 
    FormHelperText, 
    InputLabel, 
    MenuItem, 
    Select 
} from "@mui/material";

function MultipleSelectField(props) {
    const { 
        field, form,
        options, label, disabled
    } = props;

    const { name, value, onChange, onBlur } = field;
    const { errors, touched } = form;
    const showError = errors[name] && (!!touched[name]);

    const getNamebyId = (array, id) => {
        const result = array.find((item) => (item._id || item.value) === id);
        return result.name || result.label
    }

    return (  
        <FormControl
            variant="outlined" margin="none" color="success" fullWidth
            error={showError}
        >
            <InputLabel>{label}</InputLabel>
            <Select
                multiple
                name={name}
                label={label}
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                disabled={disabled}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((item, idx) => (
                            <Chip key={idx} label={getNamebyId(options, item)} size="small" />
                        ))}
                    </Box>
                )}
            >
                {options.map((item, idx) => (
                    <MenuItem key={idx} value={item._id || item.value}>
                        <Checkbox checked={value.indexOf(item._id || item.value) > -1} />
                        {item.name || item.label}
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

export default  MultipleSelectField;