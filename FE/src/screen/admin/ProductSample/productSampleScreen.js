import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { 
    AttachFileOutlined,
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

import { BREADCRUMB_ADMIN_PRODUCT_SAMPLE } from "constants/breadcrumb";
import { TABLE_HEAD_PRODUCT_SAMPLE } from "constants/tableHeader";

import RouterBreadcrumbs from "components/ui/breadcrumbs";
import { getComparator, stableSort } from "utils/tableSort";
import { formatLocalDateTime} from "utils/formatters";
import axiosPrivate from "utils/axiosPrivate";
import { TOAST_DEFAULT_STYLE } from "assets/styles/constantsStyle";
import { checkPermission } from "utils";

function ProductSampleScreen() {
    const employee = useSelector((state) => state.auth?.login?.data);
    const [list, setList] = useState([]);

    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('createdAt');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [refresh, setRefresh] = useState(0);
    const [dialog, setDialog] = useState({show: false, content: ''});
    const navigate = useNavigate();

    useEffect(() => {
        axiosPrivate
        .get("sample/", { headers: { token: employee?.accessToken} })
        .then((res) => { setList(res) })
        .catch((err) => { console.log(err) })
    // eslint-disable-next-line
    }, [refresh])

    const handleDeleteSample = (id) => {
        if(checkPermission("P3_5") === true) {
            alert('Bạn có chắc muốn xóa?');
            axiosPrivate
                .delete(`sample/${id}`, { headers: { token: employee?.accessToken} })
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
        if(checkPermission("P3_4") === true) {
            alert(`Bạn có chắc muốn ${status === true ? "ẩn" : "hiển thị"} mẫu sản phẩm này?`);
            axiosPrivate
                .put(`sample/hide/${id}`, { headers: { token: employee?.accessToken} })
                .then((res) => {
                    toast.success(res.message, TOAST_DEFAULT_STYLE);
                    setRefresh((prev) => prev + 1);
                }) 
                .catch((err) => {
                    toast.error(err.message, TOAST_DEFAULT_STYLE);
                })
        }
    }

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

    return (  
        <>
            <Box className='content-center-between'>
                <Box>
                    <Typography variant="h5" gutterBottom>
                        Danh sách mẫu sản phẩm
                    </Typography>
                    <RouterBreadcrumbs 
                        prevLink={BREADCRUMB_ADMIN_PRODUCT_SAMPLE}
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
                        if(checkPermission("P3_4") === true) {
                            navigate('/admin/product-sample/add')
                        }
                    }}
                >
                    Thêm mẫu sản phẩm
                </Button>
            </Box>
            <Paper sx={{ mt: 3, backgroundImage: "none" }} elevation={4}>
                <FormControl fullWidth color="btnSuccess">
                    <Input 
                        sx={{ px: 2, py: 1.5}}
                        placeholder="Tìm kiếm với tên mẫu sản phẩm"
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
                                    {TABLE_HEAD_PRODUCT_SAMPLE.map((item, idx) => (
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
                                               {row.name}
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                {formatLocalDateTime(row.createdAt)}
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                {row?.brand?.name}
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                {row?.category.map((item, idx) => (
                                                    <Box mb={0.5} key={idx}>{item.name}</Box>
                                                ))}
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                {row?.gender.map((item, idx) => (
                                                    <Chip 
                                                        key={idx}
                                                        label={item} 
                                                        size="small"
                                                        color="chipInfo"
                                                        sx={{ fontWeight: 600, mr: 1 }}
                                                    />
                                                ))}
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                <Chip 
                                                    size="small"
                                                    label={(row.status === true) ? "Active" : "Hidden"} 
                                                    sx={{ fontWeight: 600, borderRadius: '8px' }}
                                                    color={(row.status === true) ? "chipSuccess" : "chipError"} 
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title="Xem mô tả chi tiết" arrow>
                                                    <IconButton 
                                                        color="primary" 
                                                        onClick={() => setDialog({show: true, content: row.description})}
                                                    >
                                                        <AttachFileOutlined />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title="Chỉnh sửa"arrow>
                                                    <IconButton 
                                                        color="info" 
                                                        onClick={() => {
                                                            if(checkPermission("P3_3") === true) {
                                                                navigate(`/admin/product-sample/edit/${row._id}`)
                                                            }
                                                        }}
                                                    >
                                                        <BorderColorOutlined />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title={(row.status === true) ? "Ẩn mẫu sản phẩm" : "Hiển thị mẩu sản phẩm"} arrow>
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
                                                        onClick={() => handleDeleteSample(row._id)}
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
                onClose={() => setDialog({show: false, content: ''})}
            >
                <DialogTitle>Bài viết mô tả</DialogTitle>
                <DialogContent dividers>
                    {dialog.content !== "" ? (
                        <div dangerouslySetInnerHTML={{ __html: dialog.content }}></div>
                    ) : (
                        <Box color="text.secondary">Bài viết mô tả chưa được tạo</Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialog({show: false, content: ''})}>Hoàn thành</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ProductSampleScreen;