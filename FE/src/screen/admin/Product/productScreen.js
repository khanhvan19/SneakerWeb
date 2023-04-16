import { 
    BorderColorOutlined, 
    DeleteOutlined, 
    PlaylistAdd, 
    Search, 
    Speed, 
    VisibilityOffOutlined, 
    VisibilityOutlined 
} from "@mui/icons-material";
import { 
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    Input,
    InputAdornment,
    Paper,
    Rating,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Tooltip,
    Typography
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import RouterBreadcrumbs from "components/ui/breadcrumbs";
import { BREADCRUMB_ADMIN_PRODUCT } from "constants/breadcrumb";
import { SIZE_OPTION } from "constants/optionSelectField";
import { TABLE_HEAD_PRODUCT } from "constants/tableHeader";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosPrivate from "utils/axiosPrivate";
import { formatLocalDateTime, formatMoney } from "utils/formatters";
import { getComparator, stableSort } from "utils/tableSort";
import { TOAST_DEFAULT_STYLE } from "assets/styles/constantsStyle";
import { checkPermission } from "utils";

function ProductScreen() {
    const employee = useSelector((state) => state.auth?.login?.data);
    const [list, setList] = useState([]);

    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('createdAt');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [refresh, setRefresh] = useState(0);
    const [dialog, setDialog] = useState({show: false, id: ''});
    const navigate = useNavigate();

    useEffect(() => {
        axiosPrivate
        .get("product/", { headers: { token: employee?.accessToken} })
        .then((res) => { setList(res) })
        .catch((err) => { console.log(err) })
    // eslint-disable-next-line
    }, [refresh])

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

    const handleDeleteProduct = (id) => {
        if(checkPermission("P4_5") === true) {
            alert('Bạn có chắc muốn xóa?');
            axiosPrivate
                .delete(`product/${id}`, { headers: { token: employee?.accessToken} })
                .then((res) => {
                    toast.success(res.message, TOAST_DEFAULT_STYLE);
                    setRefresh((prev) => prev + 1);
                })
                .catch((err) => {
                    toast.error(err.message, TOAST_DEFAULT_STYLE);
                })
        }
    }

    const handleToggleStatus = (id, status) => {
        if(checkPermission("P4_4") === true) {
            alert(`Bạn có chắc muốn ${status === true ? "ẩn" : "hiển thị"} sản phẩm này?`);
            axiosPrivate
                .put(`product/hide/${id}`, { headers: { token: employee?.accessToken} })
                .then((res) => {
                    toast.success(res.message, TOAST_DEFAULT_STYLE);
                    setRefresh((prev) => prev + 1);
                }) 
                .catch((err) => {
                    toast.error(err.message, TOAST_DEFAULT_STYLE);
                })
        }
    }

    return (  
        <>
            <Box className='content-center-between'>
                <Box>
                    <Typography variant="h5" gutterBottom>
                        Danh sách sản phẩm
                    </Typography>
                    <RouterBreadcrumbs 
                        prevLink={BREADCRUMB_ADMIN_PRODUCT}
                        currentPage="Danh sách"
                        homeIcon={<Speed />}
                    /> 
                </Box>
                <Button 
                    size="large"
                    variant="contained" 
                    color="btnSuccess" 
                    startIcon={<PlaylistAdd />}
                    onClick={() => {
                        if(checkPermission("P4_2") === true) {
                            navigate('/admin/product/add')
                        }
                    }}
                >
                    Thêm sản phẩm
                </Button>
            </Box>
            <Paper sx={{ mt: 3, backgroundImage: "none" }} elevation={4}>
                <FormControl fullWidth color="btnSuccess">
                    <Input 
                        sx={{ px: 2, py: 1.5}}
                        placeholder="Tìm kiếm với tên sản phẩm"
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
                                    {TABLE_HEAD_PRODUCT.map((item, idx) => (
                                        <TableCell 
                                        key={idx}
                                        sortDirection={(orderBy === item.field) ? order : false}
                                        >
                                            <TableSortLabel
                                                active={orderBy === item.field}
                                                direction={orderBy === item.field ? order : 'asc'}
                                                onClick={() => handleRequestSort(item.field)}
                                                sx={{ whiteSpace: 'nowrap' }}
                                            >
                                                {item.label}
                                            </TableSortLabel>
                                        </TableCell>
                                    ))}
                                    <TableCell colSpan={4} align="center">Tác vụ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {stableSort(list, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, idx) => {
                                    return (
                                        <TableRow hover key={idx}>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                <Box className="content-left-center">
                                                    { row?.images?.map((image, i) => (
                                                        <img 
                                                            key={i} 
                                                            src={image?.link} alt="" 
                                                            height={50} style={{ marginRight: "4px" }}
                                                        />
                                                    ))}
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                { row?.sample?.name + ' - ' + row.colorName }
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                               { formatMoney(row.price) }
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                { formatLocalDateTime(row?.createdAt) }
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                { row?.discount + ' %'}
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                { row?.sold }
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                <Box className="content-left-center">
                                                    <Rating value={row?.star}  precision={0.1} readOnly size="small" />
                                                    <Box sx={{ml: 2, color: "#faaf00", fontWeight: 600}}>{row?.star}</Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                <Chip 
                                                    size="small"
                                                    label={(row.status === true) ? "Active" : "Banned"} 
                                                    sx={{ fontWeight: 600, borderRadius: '8px' }}
                                                    color={(row.status === true) ? "chipSuccess" : "chipError"} 
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title="Xem số lượng còn lại" arrow>
                                                    <Button 
                                                        color="success"
                                                        onClick={() => setDialog({show: true, id: row._id})}
                                                        sx={{
                                                            whiteSpace: 'nowrap', 
                                                            fontWeight: 600, 
                                                            textTransform: 'unset',
                                                            '&:hover': {
                                                                textDecoration: 'underline'
                                                            } 
                                                        }}
                                                    >
                                                        Tồn kho
                                                    </Button>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title="Chỉnh sửa"arrow>
                                                    <IconButton 
                                                        color="info" 
                                                        onClick={() => {
                                                            if(checkPermission("P4_3") === true) {
                                                                navigate(`/admin/product/edit/${row._id}`)
                                                            }
                                                        }}
                                                    >
                                                        <BorderColorOutlined />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title={(row.status === true) ? "Ẩn sản phẩm" : "Hiển thị sản phẩm"} arrow>
                                                    <IconButton 
                                                        color="warning"
                                                        onClick={() => handleToggleStatus(row._id, row.status)}
                                                    >
                                                        {(row.status === true) ? <VisibilityOffOutlined /> : < VisibilityOutlined />}
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title="Xóa" arrow>
                                                    <IconButton 
                                                        color="error"
                                                        onClick={() => handleDeleteProduct(row._id)}
                                                    >
                                                        <DeleteOutlined />
                                                    </IconButton>
                                                </Tooltip>
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

            <ToastContainer />

            <Dialog 
                open={dialog.show} 
                maxWidth='xs'
                fullWidth={true}
                onClose={() => setDialog({show: false, id: ''})}
            >
                <DialogTitle>Danh sách size giày & số lượng</DialogTitle>
                <DialogContent dividers={true} sx={{p: 1}} className="custom-scrollbar">
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontSize: "16px" }}>Mã size giày</TableCell>
                                    <TableCell sx={{ fontSize: "16px" }}>Số lượng</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                { list.find((item) => item._id === dialog.id)?.sizes?.map((size, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>
                                            {SIZE_OPTION.find(item => item.value === size.code).label}
                                        </TableCell>
                                        <TableCell>{size.quantity}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialog({show: false, id: ''})}>Hoàn thành</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ProductScreen;