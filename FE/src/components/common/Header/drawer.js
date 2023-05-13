import { useNavigate } from "react-router";
import { forwardRef, memo, useImperativeHandle, useState } from "react";
import { Button, Drawer, IconButton, List, ListItem, ListItemButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import queryString from 'query-string';

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

    const handleOpenChildLevel = (name, id) => {
        setLevel(prev => prev + 1);
        setTitle(prev => prev.concat({name: name, id: id}));
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
                                onClick={() => handleOpenChildLevel(item.name, item._id)}
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
                                ? navigate({
                                    pathname: '/product/',
                                    search: queryString.stringify({ category: item?._id })
                                })
                                : navigate({
                                    pathname: '/product/',
                                    search: queryString.stringify({ category: title[title.length-1]?.id, brand: item?._id })
                                })
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