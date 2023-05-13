import { Check } from "@mui/icons-material";
import { Box, Checkbox, FormControlLabel, Rating } from "@mui/material";

function FilterByRating({ filters, onChange }) {
    const options = [5, 4, 3, 2, 1];

    return (  
        <>
            {options.map((option, idx) => (
                <Box key={idx}>
                    <FormControlLabel     
                        label={
                            <Box className='content-center-between'>
                                <Rating 
                                    readOnly 
                                    value={option}  
                                    precision={1} 
                                />
                                <Box component='span' ml={2} color='text.secondary'>
                                    Từ {option} sao
                                </Box>
                            </Box>
                        }
                        control={
                            <Checkbox 
                                checked={parseInt(filters.star) === option} 
                                checkedIcon={<Check />} 
                                icon={<Box width='1.5rem' height='1.5rem' />} 
                                color="btnDark" 
                            />
                        } 
                        onClick={() => onChange(option)}
                    />
                </Box>
            ))}
        </>
    );
}

export default FilterByRating;