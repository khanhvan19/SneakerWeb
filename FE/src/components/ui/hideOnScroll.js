import * as React from "react";
import { Box, Fab, Fade, Slide, Tooltip, useScrollTrigger } from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";

function HideOnScroll(props) {
    const { children, window } = props;
    
    const trigger = useScrollTrigger({
      target: window ? window() : undefined,
    });
    
    const childrenTrigger = useScrollTrigger({
      disableHysteresis: true,
      threshold: 0,
      target: window ? window() : undefined,
    });
    
    const scrollTopTrigger = useScrollTrigger({
      disableHysteresis: true,
      threshold: 100,
      target: window ? window() : undefined,
    });

    const handleScrollTop = (event) => {
      const anchor = (event.target.ownerDocument || document).querySelector(
        '#back-to-top-anchor',
      );
  
      if (anchor) {
        anchor.scrollIntoView({
            block: 'center',
        });
      }
    };

    return (
      <>
        <Slide appear={false} direction="down" in={!trigger}>
          {React.cloneElement(children, {
              elevation: childrenTrigger ? 3 : 0,
          })}
        </Slide>
        <Fade in={scrollTopTrigger}>
          <Tooltip title="Về đầu trang" arrow>
            <Box
                zIndex={9999}
                onClick={handleScrollTop}
                sx={{ position: 'fixed', bottom: 88, right: 42 }}
            >
                <Fab size="small" color="btnGlassSuccess">
                    <KeyboardArrowUp />
                </Fab>
            </Box>
          </Tooltip>
        </Fade>
    </>
    );
}

export default HideOnScroll;