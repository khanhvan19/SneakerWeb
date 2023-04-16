import { forwardRef, useImperativeHandle, useState } from "react";
import { Box, Menu } from "@mui/material";

function HoverMenu({ children, button, buttonChildren, buttonProps, sx, onClick }, ref) {
    const [anchorEl, setAnchorEl] = useState(null);
    var menuHovering = false;

    useImperativeHandle(ref, () => ({
        onCloseMenu: handleCloseMenu
    }));

    const handleShowMenu = (e) => {
        if (anchorEl !== e.currentTarget) {
            setAnchorEl(e.currentTarget);
        }
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleEnterMenu = () => {
        menuHovering = true;
    }

    const handleLeaveMenu = () => {
        menuHovering = false;
        setTimeout(() => {
            if(!menuHovering) handleCloseMenu();
        }, 1)
    }

    return (
        <div>
            <Box
                sx={sx}
                component={button}  {...buttonProps}
                onClick={onClick}
                onMouseEnter={handleShowMenu}
                onMouseLeave={handleLeaveMenu}
            >
                {buttonChildren}
            </Box>
            <Menu
                autoFocus={false}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                MenuListProps={{
                    onMouseEnter: handleEnterMenu,
                    onMouseLeave: handleLeaveMenu,
                    style: { pointerEvents: "auto" }
                }}
                PopoverClasses={{
                    root: 'popover-class'
                }}
            >
                {children}
            </Menu>
        </div>
    );
}

export default forwardRef(HoverMenu);