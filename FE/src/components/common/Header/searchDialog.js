import { forwardRef, memo, useEffect, useImperativeHandle, useState } from "react";
import { useTheme } from '@mui/material/styles';
import { Box, Dialog, DialogContent, IconButton, InputAdornment, List, Slide, TextField, useMediaQuery } from "@mui/material";
import { Clear, FavoriteBorder, KeyboardVoiceOutlined, SearchOutlined } from "@mui/icons-material";
import useDebounce from "hooks/useDebounce";
import axiosPublic from "utils/axiosPublic";
import HorizontalCard from "components/ui/Card/horizontalCard";
// import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

function SearchDialog(props, ref) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [openSearch, setOpenSearch] = useState(false);
    const [value, setValue] = useState('');
    const [result, setResult] = useState([]);
    // const { 
    //     transcript, 
    //     listening,
    //     resetTranscript,
    //     browserSupportsSpeechRecognition
    // } = useSpeechRecognition()

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
            .get('/product/search', { params: { q: searchValue } })
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

    // const SpeechToText = window.speechRecognition || window.webkitSpeechRecognition;
    // var speechApi = new SpeechToText();
    // speechApi.continuous = true;
    // speechApi.interimResults = false;
    // speechApi.lang = 'vi-VN'

    // const handleRecord = () => {
    //     SpeechRecognition.startListening
    // }

    return ( 
        <Dialog 
            maxWidth='sm'
            fullScreen={fullScreen}
            open={openSearch} 
            onClose={handleCloseSearchDialog}
            TransitionComponent={Slide}
            TransitionProps={{ 
                direction: 'down',
                timeout: { enter: 700, exit: 400 }
            }}
            PaperProps={{ 
                sx: {width: theme.breakpoints.values.sm },
            }}
        >
            <DialogContent sx={{ p: 0 }}>
                <Box 
                    className='content-center' 
                    sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
                >
                    {/* <Box 
                        pl={2} py={1.5}
                        sx={{ 
                            position: 'relative',
                            '&:after': {
                                content: '""', position: 'absolute',
                                right: 0, bottom: 0, width: '0%', height: '1px',
                                bgcolor: 'divider', transition: 'all 0.2s'
                            },
                            '&:hover': {
                                '&:after': { 
                                    width: '100%', height: '1.5px', bgcolor: 'text.accent'
                                }
                            }
                        }}
                    >
                        <IconButton 
                            onClick={SpeechRecognition.startListening}
                            color='btnSuccess'
                        >
                            <KeyboardVoiceOutlined />
                        </IconButton>
                    </Box> */}
                    <TextField
                        autoFocus
                        fullWidth
                        color="btnSuccess"
                        variant="standard"
                        placeholder="Bạn cần tìm gì..."
                        onChange={handleChange}
                        InputProps={{
                            sx: { py: 1.5, px: 2 },
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
                </Box>
                {/* <div> miro: {listening ? 'on' : 'off'}</div>
                <div>{transcript}</div> */}
                <List 
                    className='custom-scrollbar'
                    sx={{ height: 480, overflowY: 'scroll' }}
                >
                    {result.map((item, idx) => ( 
                        <Box onClick={handleCloseSearchDialog} key={idx}>
                            <HorizontalCard 
                                image={item?.versions[0]?.images[0]?.link}
                                primaryTitle={item.name}
                                secondaryTitle={item?.brand[0]?.name}
                                caption={item?.gender || []}
                                endActionIcon={<FavoriteBorder />}
                                endAction={() => {}}
                                searchValue={searchValue}
                                linkTo={`/product/detail/${item?._id}/${item?.versions[0]?._id}`}
                            />
                        </Box>
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    );
}

export default memo(forwardRef(SearchDialog));