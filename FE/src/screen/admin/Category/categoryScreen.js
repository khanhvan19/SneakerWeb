import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { 
    Box, 
    Button, 
    Chip, 
    Dialog, 
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
import { 
    BorderColorOutlined, 
    DeleteOutlined, 
    PlaylistAdd, 
    Search, 
    Speed, 
    VisibilityOffOutlined, 
    VisibilityOutlined 
} from "@mui/icons-material";
import { toast } from "react-toastify";

import { TABLE_HEAD_CATEGORY } from "constants/tableHeader";
import { BREADCRUMB_ADMIN_CATEGORY } from "constants/breadcrumb";
import { TOAST_DEFAULT_STYLE } from "assets/styles/constantsStyle";

import axiosPrivate from "utils/axiosPrivate";
import { getComparator, stableSort } from "utils/tableSort";

import RouterBreadcrumbs from "components/ui/breadcrumbs";
import AddEditForm from "./addEditForm";
import { checkPermission } from "utils";

function CategoryScreen() {
    const employee = useSelector((state) => state.auth?.login?.data);
    const [list, setList] = useState([]);
    const [category, setCategory] = useState({})

    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('createdAt');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [refresh, setRefresh] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false)
    const [openModal, setOpenModal] = useState(false);

    const initValue = (!isEditMode)
        ? { name: '', slug: '' } 
        : { name: category?.name , slug: category?.slug };

    useEffect(() => {
        axiosPrivate
        .get("category/", { headers: { token: employee?.accessToken} })
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

    const handleSubmit = (values, {resetForm}) => {       
        if(!isEditMode) {
            axiosPrivate
                .post('category/', values, 
                    { headers: { token: employee?.accessToken }}
                )
                .then((res) => {
                    resetForm();
                    toast.success(res.message, TOAST_DEFAULT_STYLE);
                    handleCloseModal()
                    setRefresh((prev) => prev + 1)
                })
                .catch((err) => {
                    toast.error(err.message, TOAST_DEFAULT_STYLE);
                })
        } else {
            axiosPrivate
                .put(`category/${category._id}`, values, 
                    { headers: { token: employee?.accessToken }}
                )
                .then((res) => {
                    resetForm();
                    toast.success(res.message, TOAST_DEFAULT_STYLE);
                    handleCloseModal()
                    setRefresh((prev) => prev + 1)
                })
                .catch((err) => {
                    toast.error(err.message, TOAST_DEFAULT_STYLE);
                })
        }
    }

    const handleAddCategory = () => {
        if(checkPermission("P1_2") === true) {
            setIsEditMode(false)
            setOpenModal(true)
        }
    }

    const handleEditCategory = (data) => {
        if(checkPermission("P1_3") === true) {
            setCategory(data)
            setIsEditMode(true)
            setOpenModal(true)
        }
    }

    const handleDeleteCategory = (id) => {
        if(checkPermission("P1_5") === true) {
            alert('Bạn có chắc muốn xóa?');
            axiosPrivate
                .delete(`category/${id}`, 
                    { headers: { token: employee?.accessToken} }
                )
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
        if(checkPermission("P1_4") === true) {
            alert(`Bạn có chắc muốn ${status === true ? "ẩn" : "hiển thị"} danh mục này?`);
            axiosPrivate
                .put(`category/hide/${id}`, { headers: { token: employee?.accessToken} })
                .then((res) => {
                    toast.success(res.message, TOAST_DEFAULT_STYLE);
                    setRefresh((prev) => prev + 1);
                }) 
                .catch((err) => {
                    toast.error(err.message, TOAST_DEFAULT_STYLE);
                })
        }
    }

    const handleCloseModal = (event, reason) => {
        if (reason !== 'backdropClick') {
            setOpenModal(false)
        }
    }

    return (  
        <>
            <Box className='content-center-between'>
                <Box>
                    <Typography variant="h5" gutterBottom>
                        Danh sách danh mục
                    </Typography>
                    <RouterBreadcrumbs 
                        prevLink={BREADCRUMB_ADMIN_CATEGORY}
                        currentPage="Danh sách"
                        homeIcon={<Speed />}
                    /> 
                </Box>
                <Button 
                    size="large"
                    variant="contained" 
                    color="btnSuccess" 
                    startIcon={<PlaylistAdd />}
                    onClick={handleAddCategory}
                >
                    Thêm danh mục
                </Button>
            </Box>
            <Paper sx={{ mt: 3, backgroundImage: "none" }} elevation={4}>
                <FormControl fullWidth color="btnSuccess">
                    <Input 
                        sx={{ px: 2, py: 1.5}}
                        placeholder="Tìm kiếm với tên danh mục"
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
                                    {TABLE_HEAD_CATEGORY.map((item, idx) => (
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
                                    <TableCell colSpan={3} align="center">Tác vụ</TableCell>
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
                                                {row.slug}
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                {new Date(Date.parse(row.createdAt)).toLocaleString()}
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
                                                <Tooltip title="Chỉnh sửa"arrow>
                                                    <IconButton 
                                                        color="primary" 
                                                        onClick={() => handleEditCategory(row)}
                                                    >
                                                        <BorderColorOutlined />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title={(row.status === true) ? "Ẩn danh mục" : "Hiển thị danh mục"} arrow>
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
                                                        onClick={() => {handleDeleteCategory(row._id)}}
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

            <Dialog 
                open={openModal} 
                onClose={handleCloseModal}
            >
                <AddEditForm
                    onCancel={handleCloseModal}
                    isEditMode={isEditMode}
                    initValue={initValue}
                    onSubmit={handleSubmit}
                />
            </Dialog>

        </>
    );
}

export default CategoryScreen;