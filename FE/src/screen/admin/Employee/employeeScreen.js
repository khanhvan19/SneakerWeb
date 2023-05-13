import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AgeFromDateString } from "age-calculator";
import { toast } from 'react-toastify';

import { 
    Avatar,
    Box,  
    Button, 
    Chip, 
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
    LockOpenOutlined,
    LockPersonOutlined,
    PlaylistAdd,
    Search,
    Speed 
} from "@mui/icons-material";

import axiosPrivate from "utils/axiosPrivate";
import { getComparator, stableSort } from "utils/tableSort"
import { TABLE_HEAD_EMPLOYEE } from "constants/tableHeader";
import { ROLE_OPTION, SEX_OPTION } from 'constants/optionSelectField';
import { BREADCRUMB_ADMIN_EMPLOYEE } from "constants/breadcrumb";
import RouterBreadcrumbs from "components/ui/breadcrumbs";
import { TOAST_DEFAULT_STYLE } from "assets/styles/constantsStyle";
import { checkPermission } from "utils";

function Employee() {
    const employee = useSelector((state) => state.auth?.login?.data);
    const [list, setList] = useState([]);
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('createdAt');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [refresh, setRefresh] = useState(0);
    const navigate = useNavigate();
    
    useEffect(() => {
        axiosPrivate
        .get("employee/", { headers: { token: employee?.accessToken} })
        .then((res) => {
            setList(res);
        })
        .catch((err) => {
            console.log(err);
        })
    // eslint-disable-next-line
    }, [refresh])

    const handleDeleteEmployee = (id) => {
        if(checkPermission("P7_6") === true) {
            alert('Bạn có chắc muốn xóa?');
            axiosPrivate
                .delete(`employee/${id}`, { headers: { token: employee?.accessToken} })
                .then((res) => {
                    toast.success(res.message, TOAST_DEFAULT_STYLE);
                    setRefresh((prev) => prev + 1);
                })
                .catch((err) => {
                    toast.error(err.message, TOAST_DEFAULT_STYLE);
                })
        }
    }

    const handleToggleLockAccount = (id, status) => {
        if(checkPermission("P7_4") === true || employee._id === id) {
            alert(`Bạn có chắc muốn ${status === true ? "khóa" : "mở khóa"} tài khoản nhân viên này?`);
            axiosPrivate
                .put(`employee/lock/${id}`, { headers: { token: employee?.accessToken} })
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
                        Danh sách nhân viên
                    </Typography>
                    <RouterBreadcrumbs 
                        prevLink={BREADCRUMB_ADMIN_EMPLOYEE}
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
                        if(checkPermission("P7_2") === true) {
                            navigate('/admin/employee/add')
                        }
                    }}
                >
                    Thêm nhân viên
                </Button>
            </Box>
            <Paper sx={{ mt: 3, backgroundImage: "none" }} elevation={4}>
                <FormControl fullWidth color="btnSuccess">
                    <Input 
                        sx={{ px: 2, py: 1.5}}
                        placeholder="Tìm kiếm với tên nhân viên"
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
                                    {TABLE_HEAD_EMPLOYEE.map((item, idx) => (
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
                                                <div className="content-left-center">
                                                    <Avatar 
                                                        src={row?.avatar?.link || "/"} alt={row.name} 
                                                        sx={{ border: '1px solid', borderColor: 'text.accent'}}
                                                    />
                                                    <Box component="span" sx={{ ml: 1.5 }}>{row.name}</Box>
                                                </div>
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                {ROLE_OPTION.find((item) => item.value === row.role).label}
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                {row.email}
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                {new Date(Date.parse(row.createdAt)).toLocaleString()}
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                <Chip 
                                                    size="small"
                                                    label={(row.status === true) ? "Active" : "Banned"} 
                                                    sx={{ fontWeight: 600, borderRadius: '8px' }}
                                                    color={(row.status === true) ? "chipSuccess" : "chipError"} 
                                                />
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                {SEX_OPTION.find((item) => item.value === row.sex).label}
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                {new AgeFromDateString((row.birthday)).age}
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                {row.phone}
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                {row.addressString}
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title="Chỉnh sửa quyền nhân viên" arrow>
                                                    <Button 
                                                        color="success"
                                                        onClick={() => {
                                                            if(checkPermission("P7_5") === true) {
                                                                navigate(`/admin/employee/permission/${row._id}`)
                                                            }
                                                        }}
                                                        sx={{
                                                            whiteSpace: 'nowrap', 
                                                            fontWeight: 600, 
                                                            textTransform: 'unset',
                                                            '&:hover': {
                                                                textDecoration: 'underline'
                                                            } 
                                                        }}
                                                    >
                                                        Phân quyền
                                                    </Button>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title="Chỉnh sửa"arrow>
                                                    <IconButton 
                                                        color="info" 
                                                        onClick={() => {
                                                            if(checkPermission("P7_3") === true || employee._id === row._id) {
                                                                navigate(`/admin/employee/edit/${row._id}`)
                                                            }
                                                        }}
                                                    >
                                                        <BorderColorOutlined />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title={(row.status === true) ? "Khóa tài khoản" : "Mở khóa tài khoản"} arrow>
                                                    <IconButton 
                                                        color="warning"
                                                        onClick={() => handleToggleLockAccount(row._id, row.status)}
                                                    >
                                                        {(row.status === true) ? <LockPersonOutlined /> : < LockOpenOutlined/>}  
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title="Xóa" arrow>
                                                    <IconButton 
                                                        color="error"
                                                        onClick={() => handleDeleteEmployee(row._id)}
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
        </>
    );
}

export default Employee;