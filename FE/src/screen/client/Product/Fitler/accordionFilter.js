import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";

function AccordionFilter({ children, summary }) {
    return (
        <Accordion 
            square
            elevation={0} 
            disableGutters
            sx={{ 
                borderBottom: '1px solid', 
                borderColor: 'divider',
                '&:before': { display: 'none'} 
            }} 
        >
            <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography textTransform='uppercase' fontWeight={500}>{summary}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {children}
            </AccordionDetails>
        </Accordion>
    );
}

export default AccordionFilter;