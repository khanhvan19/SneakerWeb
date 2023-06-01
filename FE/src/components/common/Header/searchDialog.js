import { forwardRef, memo, useEffect, useImperativeHandle, useState } from "react";
import { useTheme } from '@mui/material/styles';
import { Box, Dialog, DialogContent, IconButton, InputAdornment, List, Slide, TextField, useMediaQuery } from "@mui/material";
import { Clear, FavoriteBorder, FavoriteTwoTone, KeyboardVoiceOutlined, SearchOutlined } from "@mui/icons-material";
import useDebounce from "hooks/useDebounce";
import axiosPublic from "utils/axiosPublic";
import HorizontalCard from "components/ui/Card/horizontalCard";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axiosClientPrivate from "utils/axiosClientPrivate";
import { updateFavorite } from "redux/slices/favorite.slice";
import { toast } from "react-toastify";
import { TOAST_CENTER_STYLE } from "assets/styles/constantsStyle";

function SearchDialog(props, ref) {
    const theme = useTheme();
    const isLogin = useSelector((state) => state.client?.login?.data);
    var favorites = useSelector((state) => state.favorite?.favorites);
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [openSearch, setOpenSearch] = useState(false);
    const [value, setValue] = useState('');
    const [result, setResult] = useState([]);
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const searchValue = useDebounce(value, 500)

    useImperativeHandle(ref, () => ({
        onOpenSearchDialog: () => setOpenSearch(true)
    }));

    useEffect(() => {
        if (!searchValue.trim()) {
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
        if (!inputValue.startsWith(' ')) {
            setValue(inputValue);
        }
    }

    const handleCloseSearchDialog = () => {
        setValue('');
        setResult([]);
        setOpenSearch(false)
    }

    const SpeechToText = window.speechRecognition || window.webkitSpeechRecognition;
    var speechApi = new SpeechToText();
    var status = 0
    speechApi.continuous = true;
    speechApi.interimResults = false;
    speechApi.lang = 'vi-VN'
    const voiceSpeedone = () => {
        if (status === 1) {
            status = 0;
            return speechApi.stop();
        }
        speechApi.start();
        status = 1;
        speechApi.onresult = function (event) {
            console.log(event.results[0][0].transcript);
            setValue(event.results[0][0].transcript)
            speechApi.stop()
            status = 0
        };
        speechApi.onspeechend = function () {
            speechApi.stop();
            status = 0
        };
    }

    const handleToggleFavorite = (id) => {
        if(!isLogin) {
            navigate("/login");
        } else {
            axiosClientPrivate
                .post('/favorite/', { 
                    product: id, 
                    customer: isLogin?._id 
                }, {
                    headers: { token: isLogin?.accessToken } 
                })
                .then((res) => {
                    dispatch(updateFavorite(res.favorites)) 
                    toast.success(res.message, TOAST_CENTER_STYLE);
                })
                .catch((err) => {
                    toast.error(err.message, TOAST_CENTER_STYLE);
                })
        }
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
                timeout: { enter: 700, exit: 400 }
            }}
            PaperProps={{
                sx: { width: theme.breakpoints.values.sm },
            }}
        >
            <DialogContent sx={{ p: 0 }}>
                <Box
                    className='content-center'
                    sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
                >
                    <Box
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
                            onClick={(e) => voiceSpeedone(e)}
                            color='btnSuccess'
                        >
                            <KeyboardVoiceOutlined />
                        </IconButton>
                    </Box>
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
                                    <SearchOutlined color="btnSuccess" />
                                </InputAdornment>,
                            endAdornment:
                                <IconButton
                                    color="btnSuccess"
                                    sx={{ bgcolor: "background.accent", "&:hover": { bgcolor: "background.accent" } }}
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
                                endActionIcon={favorites?.includes(item._id) 
                                    ? <FavoriteTwoTone sx={{ fontSize: 24 }} /> 
                                    : <FavoriteBorder sx={{ fontSize: 24 }}  />
                                }
                                endAction={() => handleToggleFavorite(item._id)}
                                activeAction={favorites?.includes(item._id)}
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