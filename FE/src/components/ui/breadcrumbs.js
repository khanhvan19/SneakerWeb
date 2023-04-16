import { Link } from "react-router-dom";
import { Box, Breadcrumbs, Link as MuiLink, Typography } from "@mui/material";

function RouterBreadcrumbs({ prevLink = [], currentPage , homeIcon }) {

    return (  
        <Breadcrumbs aria-label="breadcrumb">  
            {prevLink.map((item, idx) => (
                <MuiLink 
                    key={idx}
                    component={Link}
                    to={item.link} 
                    className='content-center'
                    underline='hover'
                    color={currentPage ? 'inherit' : 'text.primary'} 
                    sx={{ 
                        fontSize: '0.875rem', 
                        fontWeight: 500,
                        '& span svg' : {
                            fontSize: '1.25rem',
                            mr: 0.5
                        },
                        '&:hover': {
                            color: currentPage ? "inherit" : "#000",
                        }
                    }}
                >
                    {(idx === 0) && (
                        <Box component="span" className="content-center">{homeIcon}</Box>
                    )}
                    {item.label}
                </MuiLink>
            ))}
            {currentPage && (
                <Typography 
                    color="text.disabled"
                    sx={{ 
                        fontSize: '0.825rem', 
                        fontWeight: 500 
                    }} 
                >
                    {currentPage}
                </Typography>
            )}
        </Breadcrumbs>
    );
}

export default RouterBreadcrumbs;
