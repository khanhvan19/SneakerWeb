import { Box, Button } from "@mui/material";
import { SIZE_OPTION } from "constants/optionSelectField";

function FilterBySize({filters, onChange}) {

    var stylesActive = (option) => {
        if(parseInt(option) === parseInt(filters.size)) {
            return {
                borderRadius: 'unset',
                borderColor: '#000', 
                zIndex: 3,
            }
        } else {
            return {
                borderRadius: 'unset',
                borderColor: '#d3d7da', 
                '&:hover': {zIndex: 2}
            }
        }
    }

    return (  
        <Box display='flex' flexWrap='wrap'>
            {SIZE_OPTION.map((option, idx) => (
                <Box key={idx} sx={{ m: '0 -0.69px -0.69px 0' }}>
                    <Button 
                        key={idx} 
                        color="btnDark"
                        disableElevation
                        variant='outlined'
                        sx={stylesActive(option.value)}
                        onClick={() => onChange(option.value)}
                    >
                        {option.value} EU
                    </Button>
                </Box>
            ))}
        </Box>
    );
}

export default FilterBySize;