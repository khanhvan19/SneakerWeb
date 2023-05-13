import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { 
    Box,
    Button,
    FormControl,
    Input,
    InputAdornment,
    Menu,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Typography
} from "@mui/material";
import { 
    ControlPointOutlined,
    ExpandMore, 
    PlaylistAdd, 
    Search, 
    Speed, 
} from "@mui/icons-material";
import { toast } from "react-toastify";
import RouterBreadcrumbs from "components/ui/breadcrumbs";

import { BREADCRUMB_ADMIN_PRODUCT } from "constants/breadcrumb";
import { TABLE_HEAD_PRODUCT } from "constants/tableHeader";
import { SIZE_OPTION } from "constants/optionSelectField";
import { TOAST_DEFAULT_STYLE } from "assets/styles/constantsStyle";

import axiosPrivate from "utils/axiosPrivate";
import { checkPermission } from "utils";
import { getComparator, stableSort } from "utils/tableSort";
import InfoDialog from "components/ui/Dialog/infoDialog";
import ProductRow from "./productRow";

function ProductScreen() {
    const employee = useSelector((state) => state.auth?.login?.data);
    
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('createdAt');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    
    const [list, setList] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [detail, setDetail] = useState('');
    const [refresh, setRefresh] = useState(0);
    const [menuAdd, setMenuAdd] = useState(null);

    const navigate = useNavigate();
    const detailDialogRef = useRef();
    const sizesDialogRef = useRef();

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

    const handleToggleStatusProduct = (id, status) => {
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

    const handleDeleteVersion = (id) => {
        if(checkPermission("P4_5") === true) {
            alert('Bạn có chắc muốn xóa?');
            axiosPrivate
                .delete(`version/${id}`, { headers: { token: employee?.accessToken} })
                .then((res) => {
                    toast.success(res.message, TOAST_DEFAULT_STYLE);
                    setRefresh((prev) => prev + 1);
                })
                .catch((err) => {
                    toast.error(err.message, TOAST_DEFAULT_STYLE);
                })
        }
    }

    const handleToggleStatusVersion = (id, status) => {
        if(checkPermission("P4_4") === true) {
            alert(`Bạn có chắc muốn ${status === true ? "ẩn" : "hiển thị"} phiên bản này?`);
            axiosPrivate
                .put(`version/hide/${id}`, { headers: { token: employee?.accessToken} })
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
                <Box>
                    <Button 
                        size="large" color="btnSuccess" variant="contained" 
                        startIcon={<PlaylistAdd />} endIcon={<ExpandMore />}
                        onClick={(e) => setMenuAdd(e.currentTarget)}
                    >
                        Thêm sản phẩm
                    </Button>
                    <Menu
                        anchorEl={menuAdd}
                        open={Boolean(menuAdd)}
                        onClose={() => setMenuAdd(null)}
                    >
                        <MenuItem 
                            onClick={() => {
                                setMenuAdd(null);
                                navigate('/admin/product/version/add')
                            }}
                        >
                            <ControlPointOutlined fontSize="small" sx={{mr: 1}} />
                            Thêm phiên bản
                        </MenuItem>
                        <MenuItem 
                            onClick={() => {
                                setMenuAdd(null)
                                navigate('/admin/product/info/add')
                            }}
                        >
                            <ControlPointOutlined fontSize="small" sx={{mr: 1}} /> 
                            Thêm sản phẩm mới
                        </MenuItem>
                    </Menu>
                </Box>
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
                                    <TableCell />
                                    {TABLE_HEAD_PRODUCT.map((item, idx) => (
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
                                    <TableCell colSpan={4} align="center">Tác vụ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {stableSort(list, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, idx) => {
                                    return (
                                        <ProductRow 
                                            key={idx} data={row} 
                                            setDetail={setDetail} 
                                            detailDialogRef={detailDialogRef} 
                                            setSizes={setSizes} 
                                            sizesDialogRef={sizesDialogRef} 
                                            onDeleteProduct={handleDeleteProduct}
                                            onToggleStatusProduct={handleToggleStatusProduct}
                                            onDeleteVersion={handleDeleteVersion}
                                            onToggleStatusVersion={handleToggleStatusVersion}
                                        />
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        page={page}
                        count={list.length}
                        rowsPerPage={rowsPerPage}
                        rowsPerPageOptions={[5, 10, 15]}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Box>
            </Paper>

            <InfoDialog ref={sizesDialogRef} title="Kích cỡ và số lượng còn lại">
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontSize: "16px" }}>Mã size giày</TableCell>
                                <TableCell sx={{ fontSize: "16px" }}>Số lượng</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { sizes.map((size, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>
                                        {SIZE_OPTION.find(item => item.value === size.sku).label}
                                    </TableCell>
                                    <TableCell>{size.quantity} sản phẩm</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </InfoDialog>

            <InfoDialog ref={detailDialogRef} title="Bài viết mô tả">
                {detail !== "" ? (
                    <div dangerouslySetInnerHTML={{ __html: detail }}></div>
                ) : (
                    <Box color="text.secondary">Bài viết mô tả chưa được tạo</Box>
                )}
            </InfoDialog>
        </>
    );
}

export default ProductScreen;