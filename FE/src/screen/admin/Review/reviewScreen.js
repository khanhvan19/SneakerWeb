import { DescriptionOutlined, PhotoOutlined, Search, Speed } from "@mui/icons-material";
import { Box, Button, Chip, FormControl, Input, InputAdornment, Paper, Rating, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Typography } from "@mui/material";
import { SquareBlock, TOAST_DEFAULT_STYLE } from "assets/styles/constantsStyle";
import InfoDialog from "components/ui/Dialog/infoDialog";
import RouterBreadcrumbs from "components/ui/breadcrumbs";
import { BREADCRUMB_ADMIN_REVIEW } from "constants/breadcrumb";
import { TABLE_HEAD_REVIEW } from "constants/tableHeader";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axiosPrivate from "utils/axiosPrivate";
import { formatLocalDateTime } from "utils/formatters";
import { getComparator, stableSort } from "utils/tableSort";

const renderStatusChip = (status) => {
    switch (status) {
        case 'new':
            return (
                <Chip
                    label='Đánh giá mới'
                    size="small" color='chipInfo'
                    sx={{ fontWeight: 600, borderRadius: '8px' }}
                />
            )
        case 'allow':
            return (
                <Chip
                    label='Đã được duyệt'
                    size="small" color='chipSuccess'
                    sx={{ fontWeight: 600, borderRadius: '8px' }}
                />
            )
        case 'deny':
            return (
                <Chip
                    label='Chặn hiển thị'
                    size="small" color='chipError'
                    sx={{ fontWeight: 600, borderRadius: '8px' }}
                />
            )
        default:
    }
}

function ReviewScreen() {
    const employee = useSelector((state) => state.auth?.login?.data);
    const [list, setList] = useState([]);
    const [content, setContent] = useState({ images: [], detail: '' })
    const [refresh, setRefresh] = useState(0)
    const contentDialogRef = useRef();

    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('createdAt');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        axiosPrivate
            .get('/review/', { headers: { token: employee?.accessToken } })
            .then((res) => setList(res))
            .catch((err) => console.log(err))
    }, [employee, refresh])

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
    };

    const handleChangeStatus = (id) => {
        Swal.fire({
            icon: 'question',
            title: 'Cho phép đánh giá này hiển thị với khách hàng hay không?',
            confirmButtonText: 'Cho phép',
            confirmButtonColor: '#00ab55',
            showDenyButton: true,
            denyButtonText: 'Từ chối',
            denyButtonColor: '#ff5630',
            showCancelButton: true,
            cancelButtonText: 'Trở lại',
            cancelButtonColor: '#6c757d'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosPrivate
                    .put(`/review/${id}`, { status: 'allow' },
                        { headers: { token: employee?.accessToken } }
                    )
                    .then((res) => {
                        setRefresh(prev => prev + 1)
                        Swal.fire({
                            icon: 'success',
                            title: res.message,
                            text: 'Đánh giá này sẽ được hiển thị với tất cả khách hàng!',
                            confirmButtonText: 'Hoàn thành',
                            confirmButtonColor: '#00ab55',
                        })
                    })
            } else if (result.isDenied) {
                axiosPrivate
                    .put(`/review/${id}`, { status: 'deny' },
                        { headers: { token: employee?.accessToken } }
                    )
                    .then((res) => {
                        setRefresh(prev => prev + 1)
                        Swal.fire({
                            icon: 'warning',
                            title: res.message,
                            text: 'Đánh giá này sẽ bị ẩn đến khi nào bạn cập nhật lại!',
                            confirmButtonText: 'Hoàn thành',
                            confirmButtonColor: '#00ab55',
                        })
                    })
            }
        })
    }

    return (
        <>
            <Box>
                <Typography variant="h5" gutterBottom>
                    Danh sách đánh giá sản phẩm
                </Typography>
                <RouterBreadcrumbs
                    prevLink={BREADCRUMB_ADMIN_REVIEW}
                    currentPage="Danh sách"
                    homeIcon={<Speed />}
                />
            </Box>
            <Paper sx={{ mt: 3, backgroundImage: "none" }} elevation={4}>
                <FormControl fullWidth color="btnSuccess">
                    <Input
                        sx={{ px: 2, py: 1.5 }}
                        placeholder="Tìm kiếm với "
                        startAdornment={
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <Box sx={{ width: '100%' }}>
                    <TableContainer className="custom-scrollbar">
                        <Table>
                            <TableHead sx={{ bgcolor: "background.highlight" }}>
                                <TableRow>
                                    {TABLE_HEAD_REVIEW.map((item, idx) => (
                                        <TableCell
                                            key={idx}
                                            sortDirection={(orderBy === item.sortBy) ? order : false}
                                            sx={{ whiteSpace: 'nowrap' }}
                                        >
                                            {(item.sortBy)
                                                ? (
                                                    <TableSortLabel
                                                        active={orderBy === item.sortBy}
                                                        direction={orderBy === item.sortBy ? order : 'asc'}
                                                        onClick={() => handleRequestSort(item.sortBy)}
                                                    >
                                                        {item.label}
                                                    </TableSortLabel>
                                                )
                                                : item.label
                                            }
                                        </TableCell>
                                    ))}
                                    <TableCell colSpan={2} align="center">Tác vụ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {stableSort(list, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, idx) => {
                                        return (
                                            <TableRow hover key={idx}>
                                                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                    <Box display='flex' alignItems='center'>
                                                        <SquareBlock w={48} mr={1.5}>
                                                            <img src={row.version.images[0].link} alt="" />
                                                        </SquareBlock>
                                                        <Box>
                                                            <Box textTransform='uppercase'>{row.product.name}</Box>
                                                            <Box>
                                                                <Box component='span' color='text.secondary'>Màu sắc: </Box>
                                                                <Box component='span'>{row.version.name}</Box>
                                                                <Box component='span' mx={0.5}>|</Box>
                                                                <Box component='span' color='text.secondary'>Size: </Box>
                                                                <Box component='span'>{row.size} EU</Box>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                    <Box>{row.customer.name}</Box>
                                                    <Box color='text.secondary'>{row.customer.email}</Box>
                                                </TableCell>
                                                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                    {formatLocalDateTime(row.createdAt)}
                                                </TableCell>
                                                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                    <Box className="content-left-center">
                                                        <Rating value={row.rating} precision={1} readOnly size="small" />
                                                        <Box sx={{ ml: 2, color: "#faaf00", fontWeight: 600 }}>
                                                            {row.rating.toFixed(1)}
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                    {renderStatusChip(row.status)}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        color="success"
                                                        onClick={() => {
                                                            contentDialogRef.current.onShowDialog()
                                                            setContent({ images: row.images, detail: row.content })
                                                        }}
                                                        sx={{
                                                            textTransform: 'unset',
                                                            fontWeight: 600, whiteSpace: 'nowrap',
                                                            '&:hover': { textDecoration: 'underline' }
                                                        }}
                                                    >
                                                        Nội dung
                                                    </Button>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        color="success"
                                                        onClick={() => handleChangeStatus(row._id)}
                                                        sx={{
                                                            textTransform: 'unset',
                                                            fontWeight: 600, whiteSpace: 'nowrap',
                                                            '&:hover': { textDecoration: 'underline' }
                                                        }}
                                                    >
                                                        Cập nhật
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        rowsPerPageOptions={[5, 10, 15]}
                        count={list.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Box>
            </Paper>

            <InfoDialog ref={contentDialogRef} title='Nội dung đánh giá'>
                <Typography
                    fontWeight={600} mb={1.5}
                    className="content-left-center"
                >
                    <PhotoOutlined fontSize="small" sx={{ mr: 0.5 }} />
                    Hình ảnh đánh giá:
                </Typography>
                <Box pl={3}>
                    {(content.images.length !== 0) ? (
                        <Box display='flex'>
                            {content.images.map((item, idx) => (
                                <SquareBlock w={80} mr={1} key={idx}>
                                    <img src={item.link} alt="" />
                                </SquareBlock>
                            ))}
                        </Box>
                    ) : (
                        <Box>Đánh giá này không có hình ảnh</Box>
                    )}
                </Box>
                <Typography
                    fontWeight={600} mb={1.5} mt={3}
                    className="content-left-center"
                >
                    <DescriptionOutlined fontSize="small" sx={{ mr: 0.5 }} />
                    Nội dung chi tiết:
                </Typography>
                <Box pl={3}>{content.detail}</Box>
            </InfoDialog>
        </>
    );
}

export default ReviewScreen;