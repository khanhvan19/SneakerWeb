import { AddAPhotoOutlined, Clear, ReportOutlined, SendOutlined, Star, StarBorder } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, IconButton, Rating, Slide, TextField, Typography } from "@mui/material";
import { SquareBlock, TOAST_CENTER_STYLE } from "assets/styles/constantsStyle";
import { forwardRef, memo, useImperativeHandle, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axiosClientPrivate from "utils/axiosClientPrivate";

const LABEL_RATING = [
    { 
        label : 'Vui lòng cho biết đánh giá', 
        placeholder: 'Hãy chia sẽ cảm nhận, đánh giá của bạn về sản phẩm này!'
    },
    { 
        label : 'Rất không hài lòng',
        placeholder: 'Hãy chia sẽ lý do vì sao sản phẩm này không tốt nhé!'
    },
    { 
        label : 'Không hài lòng',
        placeholder: 'Hãy chia sẽ vì sao bạn không hài lòng về sản phẩm nhé!'
    },
    {
        label : 'Bình thường',
        placeholder: 'Hãy chia sẽ vì sao bạn chưa thực sự thích sản phẩm này nhé!'
    }, 
    {
        label : 'Hài lòng',
        placeholder: 'Hãy chia sẽ vì sao bạn thích sản phẩm này nhé!'
    }, 
    {
        label : 'Rất hài lòng',
        placeholder: 'Hãy chia sẽ những điều bạn thích về sản phẩm này nhé!'
    } 
]

function ReviewDialog({ onRefresh }, ref) {
    const isLogin = useSelector((state) => state.client?.login?.data);
    const [openDialog, setOpenDialog] = useState(false);
    const [product, setProduct] = useState();
    const [orderId, setOrderId] = useState();
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('')
    const [images, setImages] = useState([])
    const [hoverRating, setHoverRating] = useState(-1);
    const [reviewImages, setReviewImages] = useState([]);
    const [error, setError] = useState('')

    useImperativeHandle(ref, () => ({
        onShowReviewDialog: handleShowDialog
    }));

    const handleShowDialog = (value) => {
        setOpenDialog(true);
        setProduct(value.product)
        setOrderId(value.orderId)
        if(value.product.review != null) {
            const review = value.product.review
            setRating(review.rating)
            setContent(review.content)
            setReviewImages(review.images.map(item => { return item.link }))
        }
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setRating(0);
        setContent('');
        setImages([]);
        setReviewImages([]);
    }

    const handleChangeImage = e => {
        var fileArr = [], fileURLArr = [];
        var files = e.target.files;
        for (const file of files) {
            fileArr.push(file)
            fileURLArr.push(URL.createObjectURL(file))
            URL.revokeObjectURL(file)
        }
        
        if(images.length + fileArr.length > 6) {
            toast.warn('Vui lòng chỉ chọn 6 ảnh để tải lên!', TOAST_CENTER_STYLE)
            setImages(prev => prev.concat(fileArr.slice(0, 6 - images.length))) 
            setReviewImages(prev => prev.concat(fileURLArr.slice(0, 6 - images.length)))
        } else {
            setImages(prev => prev.concat(fileArr))
            setReviewImages(prev => prev.concat(fileURLArr))
        }
    }

    const handleRemoveImage = (idx) => {
        setImages(prev => prev.filter((e, i) => i !== idx))
        setReviewImages(prev => prev.filter((e, i) => i !== idx))
    }
    
    const handleSubmit = () => {
        console.log(rating, content, images);
        if(rating === 0) setError('Bạn cần đánh giá trước khi gửi!');
        else {
            const formData = new FormData()
            const data = { 
                customer: isLogin._id,
                product: product._id._id,
                version: product.version._id,
                size: product.size,
                order: orderId,
                rating: rating, 
                content: content, 
                images: images, 
            };

            Object.keys(data).forEach((key) => {
                if(Array.isArray(data[key])) {
                    data[key].forEach(item => {
                        formData.append(key, item);
                    });
                } else {
                    formData.append(key, data[key]);
                }
            })

            axiosClientPrivate
                .post('/review/', formData, {
                    headers: {
                        token: isLogin?.accessToken,
                        "Content-Type": "multipart/form-data",
                    }
                })
                .then((res) => {
                    handleCloseDialog()
                    onRefresh()
                    Swal.fire({
                        icon: 'success',
                        title: 'Cảm ơn bạn đã gửi đánh giá!',
                        text: `Đánh giá của bạn sẽ hiển thị khi được duyệt
                            ! Đánh giá này sẽ giúp việc mua hàng trở nên dễ dàng hơn.`,
                        confirmButtonText: "Hoàn thành",
                        confirmButtonColor: '#00ab55',
                    })
                })
                .catch((err) => {
                    toast.error(err.message, TOAST_CENTER_STYLE);
                })
        }
    }

    return (
        <Dialog
            maxWidth='sm'
            fullWidth={true}
            open={openDialog}
            onClose={handleCloseDialog}
            TransitionComponent={Slide}
            TransitionProps={{
                direction: 'down',
                timeout: { enter: 600, exit: 400 }
            }}
            PaperProps={{
                sx: { borderRadius: 0 }
            }}
        >
            {product && (
                <>
                    <DialogContent sx={{ p: 2, position: 'relative' }}>
                        <Box position='absolute' right={8} top={8}>
                            <IconButton onClick={handleCloseDialog}>
                                <Clear />
                            </IconButton>
                        </Box>
                        <Box display='flex'>
                            <SquareBlock w={64}>
                                <img src={product.version.images[0].link} alt="" />
                            </SquareBlock>
                            <Box ml={2}>
                                <Typography textTransform='uppercase' fontWeight={600}>{product._id.name}</Typography>
                                <Box>
                                    <Typography variant='body2' component='span' color='text.secondary'>Màu sắc: </Typography>
                                    <Typography variant='body2' component='span'>{product.version.name}</Typography>
                                    <Typography component='span' mx={1}>/</Typography>
                                    <Typography variant='body2' component='span' color='text.secondary'>Size: </Typography>
                                    <Typography variant='body2' component='span'>{product.size} EU</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box textAlign='center'>
                            {rating !== null && (
                                <Typography variant="h6" fontWeight={600} textAlign='center' pb={1}>
                                    {LABEL_RATING[hoverRating !== -1 ? hoverRating : rating].label}
                                </Typography>
                            )}
                            <Box className='content-center'>
                                <Rating
                                    readOnly={!!product.review}
                                    value={rating} precision={1}
                                    icon={<Star sx={{ fontSize: 40 }} />}
                                    emptyIcon={<StarBorder sx={{ fontSize: 40 }} />}
                                    onChangeActive={(e, hover) => setHoverRating(hover)}
                                    onChange={(e, value) => {
                                        setRating(value);
                                        setError('');  
                                    }}
                                />
                            </Box>
                            {(error !== '') && (
                                <Typography variant="caption" color='text.error' className='content-center'>
                                    <ReportOutlined sx={{ fontSize: '1.2em', mr: 0.25 }} /> {error}
                                </Typography>
                            )}
                        </Box>
                        <Box my={1}>
                            <TextField
                                disabled={!!product.review}
                                fullWidth 
                                color='btnDark'
                                value={content}
                                multiline rows={5}
                                placeholder={LABEL_RATING[hoverRating !== -1 ? hoverRating : rating].placeholder}
                                InputProps={{ 
                                    sx: { p: 1.5, fontSize: 14, borderRadius: 0 } 
                                }}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </Box>
                        <Box className='content-left-center' mt={2}>
                            {reviewImages.map((image, idx) => (
                                <SquareBlock w={70} mr={1.5} key={idx}>
                                    <img src={image} alt=""/>
                                    {(!product.review) && (
                                        <Box 
                                            position='absolute' className='content-center'
                                            sx={{ '&:hover>*': { opacity: 1, transition: 'all 300ms' } }}
                                        >
                                            <IconButton 
                                                sx={{ 
                                                    position: 'absolute', opacity: 0,
                                                    bgcolor: '#FFFFFFB3', '&:hover': { bgcolor: '#FFFFFFB3' },
                                                }} 
                                                onClick={() => handleRemoveImage(idx)}
                                            >
                                                <Clear />
                                            </IconButton>
                                        </Box>
                                    )}  
                                </SquareBlock>
                            ))}
                        </Box>
                    </DialogContent>     
                    <DialogActions sx={{ p: 2, pt: 1 }}>
                        <Button
                            disabled={!!product.review}
                            component="label"
                            startIcon={<AddAPhotoOutlined />}
                            fullWidth variant='outlined' color='btnDark'
                            sx={{ mr: 2, borderRadius: 0, boxShadow: 1 }}
                        >
                            Thêm hình ảnh
                            <input 
                                hidden multiple type="file"
                                onChange={handleChangeImage} 
                            />
                        </Button>
                        <Button
                            disabled={!!product.review}
                            startIcon={<SendOutlined />}
                            fullWidth variant='contained' color='btnDark'
                            sx={{ borderRadius: 0 }}
                            onClick={handleSubmit}
                        >
                            Gửi đánh giá
                        </Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
}

export default memo(forwardRef(ReviewDialog));