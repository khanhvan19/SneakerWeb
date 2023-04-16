import { Autocomplete, Chip, TextField } from "@mui/material";

function MultipleTextField(props) {
    const {
        field, form,
        label, options, disabled,
    } = props

    const { name, value } = field;
    const { setFieldValue } = form;

    const handlePushValue = (e) => {
        if(e.target.value != null) {
            setFieldValue(name, [...value, e.target.value]);
        }
    }

    const handleRemoveValue = (item) => {
        setFieldValue(name, value.filter((e) => e !== item))
    }

    return (   
        <Autocomplete 
            multiple
            freeSolo
            value={value}
            options={options}
            onChange={handlePushValue}
            renderTags={(value, getTagProps) => 
                value.map((item, idx) => (
                    <Chip 
                        key={idx}
                        label={item} {...getTagProps({ idx })} 
                        onDelete={() => handleRemoveValue(item)}
                    />
                )
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    name={name}
                    disabled={disabled}
                    color="success"
                    variant="outlined"
                />
            )}
        />
    );
}

export default MultipleTextField;