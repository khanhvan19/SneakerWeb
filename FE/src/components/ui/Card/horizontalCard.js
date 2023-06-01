import { Link } from "react-router-dom";
// import { Marker } from "react-mark.js";
import { Box, IconButton, ListItemButton, Typography } from "@mui/material";
import { SquareBlock } from "assets/styles/constantsStyle";

function HorizontalCard(props) {
    const {
        image , primaryTitle, secondaryTitle, caption,
        endAction, endActionIcon, activeAction, linkTo
    } = props

    return (  
        <Box position='relative'>
            <Box component={(linkTo) ? Link : Box} to={linkTo}>
                <ListItemButton display='flex' alignItems='flex-start'>
                    <SquareBlock w={72}>
                        <img src={image} alt='' />
                    </SquareBlock>  
                    <Box pl={2} flex={1} display='flex' flexDirection='column' height={72} >
                        <Typography 
                            component='div' 
                            textTransform="uppercase" pr={4}
                            className="text-eclipse one-line" 
                        >
                            {/* <Marker 
                                mark={searchValue}
                                options={{ className: 'highlighter' }}
                            > */}
                                {primaryTitle}
                            {/* </Marker>  */}
                        </Typography>
                        <Typography component='div' color="text.secondary" lineHeight={1.25}>
                            {/* <Marker 
                                mark={searchValue}
                                options={{ className: 'highlighter' }}
                            > */}
                                {secondaryTitle}
                            {/* </Marker>  */}
                        </Typography>
                        <Typography component='div' variant='body2' color='text.secondary' marginTop='auto'>
                            {/* <Marker 
                                mark={searchValue}
                                options={{ className: 'highlighter' }}
                            > */}
                            {caption.length !== 0 && caption.map((item, idx) => (
                                <span key={idx}>
                                    {item}
                                    {idx !== caption.length - 1 && <span> • </span>}
                                </span>
                            ))}
                            {/* </Marker> */}
                        </Typography>
                    </Box>
                </ListItemButton>
            </Box>
            <IconButton 
                color={activeAction === true ? 'btnError': 'btnDark' }
                onClick={endAction} 
                sx={{ position: 'absolute', top: 0 , right: 10 }}
            >
                {endActionIcon}
            </IconButton>
        </Box>
    );
}

export default HorizontalCard;