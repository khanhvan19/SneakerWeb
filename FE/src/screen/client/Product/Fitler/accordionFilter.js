import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material";

function AccordionFilter({ children, summary, expanded }) {
    return (
        <Accordion 
            square
            elevation={0} 
            expanded={expanded}
            disableGutters
            sx={{ 
                borderBottom: '1px solid', 
                borderColor: 'divider',
                '&:before': { display: 'none'} 
            }} 
        >
            <AccordionSummary expandIcon={<ExpandMore />}>
                <Box textTransform='uppercase' fontWeight={500} flexGrow={1}>{summary}</Box>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
                {children}
            </AccordionDetails>
        </Accordion>
    );
}

export default AccordionFilter;