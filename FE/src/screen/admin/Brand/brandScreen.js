import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

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

import RouterBreadcrumbs from "components/ui/breadcrumbs";
import { getComparator, stableSort } from "utils/tableSort";
import { TABLE_HEAD_BRAND } from "constants/tableHeader";
import { BREADCRUMB_ADMIN_BRAND } from "constants/breadcrumb";
import AddEditForm from "./addEditForm";
import axiosPrivate from "utils/axiosPrivate";
import { TOAST_DEFAULT_STYLE } from "assets/styles/constantsStyle";
import { checkPermission } from "utils";
import Swal from "sweetalert2";

function BrandScreen() {
    const employee = useSelector((state) => state.auth?.login?.data);
    const [list, setList] = useState([]);
    const [brand, setBrand] = useState({})

    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('createdAt');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [refresh, setRefresh] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false)
    const [openModal, setOpenModal] = useState(false);

    const initValue = (!isEditMode)
        ? { logo: '', name: '', slug: '' } 
        : { logo: brand?.logo, name: brand?.name , slug: brand?.slug };

    useEffect(() => {
        axiosPrivate
        .get("brand/", { headers: { token: employee?.accessToken} })
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
        const formData = new FormData();
        formData.append('logo', values.logo)
        formData.append('name', values.name)
        formData.append('slug', values.slug)
       
        if(!isEditMode) {
            axiosPrivate
                .post('brand/', formData, 
                    { headers: {
                        token: employee?.accessToken,
                        "Content-Type": "multipart/form-data",
                    }}
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
                .put(`brand/${brand._id}`, formData, 
                    { headers: {
                        token: employee?.accessToken,
                        "Content-Type": "multipart/form-data",
                    }}
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

    const handleAddBrand = () => {
        if(checkPermission("P2_2") === true) {
            setIsEditMode(false)
            setOpenModal(true)
        }
    }

    const handleEditBrand = (data) => {
        if(checkPermission("P2_3") === true) {
            setBrand(data)
            setIsEditMode(true)
            setOpenModal(true)
        }
    }

    const handleDeleteBrand = (id) => {
        if(checkPermission("P2_5") === true) {
            Swal.fire({
                icon: 'question',
                title: 'Bạn có chắc muốn xóa thương hiệu này?',
                confirmButtonText: 'Xác nhận',
                confirmButtonColor: '#ff5630',
                showCancelButton: true,
                cancelButtonText: 'Trở lại',
                cancelButtonColor: '#6c757d'
            }).then((result) => {
                if (result.isConfirmed) {
                    axiosPrivate
                        .delete(`brand/${id}`, 
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
            })
        }
    }

    const handleToggleStatus = (id, status) => {
        if(checkPermission("P2_4") === true) {
            Swal.fire({
                icon: 'question',
                title: `Bạn có chắc muốn ${status === true ? 'ẩn' : 'hiển thị'} thương hiệu này?`,
                confirmButtonText: 'Xác nhận',
                confirmButtonColor:  status === true ? '#ffab00' : '#00ab55',
                showCancelButton: true,
                cancelButtonText: 'Trở lại',
                cancelButtonColor: '#6c757d'
            }).then((result) => {
                if (result.isConfirmed) {
                    axiosPrivate
                        .put(`brand/hide/${id}`, { headers: { token: employee?.accessToken} })
                        .then((res) => {
                            toast.success(res.message, TOAST_DEFAULT_STYLE);
                            setRefresh((prev) => prev + 1);
                        }) 
                        .catch((err) => {
                            toast.error(err.message, TOAST_DEFAULT_STYLE);
                        })
            }})
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
                        Danh sách thương hiệu
                    </Typography>
                    <RouterBreadcrumbs 
                        prevLink={BREADCRUMB_ADMIN_BRAND}
                        currentPage="Danh sách"
                        homeIcon={<Speed />}
                    /> 
                </Box>
                <Button 
                    size="large"
                    variant="contained" 
                    color="btnSuccess" 
                    startIcon={<PlaylistAdd />}
                    onClick={handleAddBrand}
                >
                    Thêm thương hiệu
                </Button>
            </Box>
            <Paper sx={{ mt: 3, backgroundImage: "none" }} elevation={4}>
                <FormControl fullWidth color="btnSuccess">
                    <Input 
                        sx={{ px: 2, py: 1.5}}
                        placeholder="Tìm kiếm với tên thương hiệu"
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
                                    <TableCell>Logo</TableCell>
                                    {TABLE_HEAD_BRAND.map((item, idx) => (
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
                                            <TableCell>
                                                <img src={row?.logo?.link} alt={row.name} height={40} style={{ backgroundColor: '#fff' }}/>
                                            </TableCell>
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
                                                        color="info" 
                                                        onClick={() => handleEditBrand(row)}
                                                    >
                                                        <BorderColorOutlined />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title={(row.status === true) ? "Ẩn thương hiệu" : "Hiển thị thương hiệu"} arrow>
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
                                                        onClick={() => {handleDeleteBrand(row._id)}}
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
                maxWidth='xs'
                fullWidth={true}
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

export default BrandScreen;