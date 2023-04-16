import { forwardRef, memo, useEffect, useImperativeHandle, useState } from "react";
import { useTheme } from '@mui/material/styles';
import { Dialog, DialogContent, IconButton, InputAdornment, List, Slide, TextField, useMediaQuery } from "@mui/material";
import { Clear, FavoriteBorder, SearchOutlined } from "@mui/icons-material";
import useDebounce from "hooks/useDebounce";
import axiosPublic from "utils/axiosPublic";
import HorizontalCard from "components/ui/Card/horizontalCard";

function SearchDialog(props, ref) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [openSearch, setOpenSearch] = useState(false);
    const [value, setValue] = useState('');
    const [result, setResult] = useState([]);

    const searchValue = useDebounce(value, 500)

    useImperativeHandle(ref, () => ({
        onOpenSearchDialog: () => setOpenSearch(true)
    }));

    useEffect(() => {
        if(!searchValue.trim()) {
            setResult([]);
            return;
        }
        axiosPublic
            .get('/sample/search', { params: { q: searchValue } })
            .then((res) => setResult(res))
            .catch((err) => console.log(err));
    }, [searchValue])

    const handleChange = (e) => {
        const inputValue = e.target.value;
        if(!inputValue.startsWith(' ')) {
            setValue(inputValue);
        }
    }

    const handleCloseSearchDialog = () => {
        setValue('');
        setResult([]);
        setOpenSearch(false)
    }

    return ( 
        <Dialog 
            maxWidth='sm'
            fullScreen={fullScreen}
            open={openSearch} 
            onClose={handleCloseSearchDialog}
            TransitionComponent={Slide}
            TransitionProps={{ 
                direction: 'down',
                timeout: { enter: 700, exit: 500 }
            }}
            PaperProps={{ 
                sx: {width: theme.breakpoints.values.sm },
            }}
        >
            <DialogContent sx={{ p: 0 }}>
                <TextField
                    autoFocus
                    fullWidth
                    color="btnSuccess"
                    variant="standard"
                    placeholder="Bạn cần tìm gì..."
                    onChange={handleChange}
                    InputProps={{
                        sx: { p: 2 },
                        autoComplete: 'off',
                        startAdornment: 
                            <InputAdornment position="start">
                                <SearchOutlined color="btnSuccess"/>
                            </InputAdornment>,
                        endAdornment: 
                            <IconButton 
                                color="btnSuccess"
                                sx={{ bgcolor: "background.accent", "&:hover" : {bgcolor: "background.accent"} }} 
                                onClick={handleCloseSearchDialog}
                            >
                                <Clear />
                            </IconButton>
                    }}
                />
                <List 
                    className='custom-scrollbar'
                    sx={{ height: 480, overflowY: 'scroll' }}
                >
                    {result.map((item, idx) => ( 
                        <HorizontalCard 
                            key={idx}
                            image={item.images[0]}
                            primaryTitle={item.name}
                            secondaryTitle={item?.brand[0]?.name}
                            caption={item?.gender}
                            endActionIcon={<FavoriteBorder />}
                            endAction={() => {}}
                            searchValue={searchValue}
                        />
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    );
}

export default memo(forwardRef(SearchDialog));