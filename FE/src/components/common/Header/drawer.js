import { useNavigate } from "react-router";
import { forwardRef, memo, useImperativeHandle, useState } from "react";
import { Button, Drawer, IconButton, List, ListItem, ListItemButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

function HeaderDrawer({arrData = []}, ref) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState([]);
    const [level, setLevel] = useState(0);
    var navigate = useNavigate()
  
    useImperativeHandle(ref, () => ({
        onToggleDrawer: handleToggleOpen
    }));

    const handleToggleOpen = () => {
        setOpen((prev) => !prev);
        setLevel(0);
        setTitle([]);
    }

    const handleOpenChildLevel = (name, slug) => {
        setLevel(prev => prev + 1);
        setTitle(prev => prev.concat({name: name, slug: slug}));
    }
    
    const handleExitLevel = () => {
        setLevel(prev => prev - 1);
        setTitle(prev => prev.slice(0, prev.length - 1));
    }

    return (  
        <Drawer
            open={open}
            variant="temporary"
            onClose={handleToggleOpen}
            ModalProps={{ keepMounted: true }}
            sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiDrawer-paper': { width: 300 },
            }}
        >
            <List>
                {level > 0 && title.length !== 0 && (
                    <ListItemButton
                        divider
                        fullWidth
                        component={Button}
                        startIcon={<ChevronLeft />}
                        onClick={handleExitLevel}
                    >
                        <b>{title[title.length - 1]?.name}</b>
                    </ListItemButton>
                )}
                {arrData[level]?.map((item, idx) => (
                    <ListItem
                        disableGutters
                        key={idx}
                        secondaryAction={(level !== arrData.length - 1) &&
                            <IconButton 
                                size="large" 
                                onClick={() => handleOpenChildLevel(item.name, item.slug)}
                            >
                                <ChevronRight />
                            </IconButton>
                        }
                    >
                        <ListItemButton 
                            sx={{ 
                                textTransform: 'uppercase', 
                                fontWeight: level === 0 ? 600 : 500, 
                            }}
                            onClick={() => {(level === 0)
                                ? navigate(`product/${item?.slug}`)
                                : navigate(`product/${title[title.length-1]?.slug}/${item?.slug}`)
                            }}
                        >
                            {item.name}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
}

export default memo(forwardRef(HeaderDrawer));