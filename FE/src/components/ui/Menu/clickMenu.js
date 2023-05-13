import { Box, ClickAwayListener, Grow, MenuList, Paper, Popper, Tooltip } from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

function ClickMenu({ children, button, buttonChildren, buttonProps, tooltipTitle }, ref) {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    useImperativeHandle(ref, () => ({
        onCloseMenu: handleClose
    }));

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleListKeyDown = (event) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === 'Escape') {
            setOpen(false);
        }
    }

    return (
        <>
            <Tooltip arrow title={tooltipTitle}>
                <Box 
                    ref={anchorRef} 
                    onClick={handleToggle} 
                    component={button} {...buttonProps}
                >
                    {buttonChildren}
                </Box>
            </Tooltip>
            <Popper
                open={open}
                role={undefined}
                anchorEl={anchorRef.current}
                placement="bottom-start"
                disablePortal
                transition
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: 'left top' }}
                    >
                        <Paper elevation={8}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList
                                    autoFocusItem={open}
                                    onKeyDown={handleListKeyDown}
                                >
                                    {children}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    );
}

export default forwardRef(ClickMenu);