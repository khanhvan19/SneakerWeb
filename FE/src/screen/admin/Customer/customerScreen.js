import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AgeFromDateString } from "age-calculator";
import { toast } from 'react-toastify';

import Grid from '@mui/material/Unstable_Grid2';
import { 
    Avatar,
    Box,  
    Button, 
    Chip, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    Divider, 
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
    LockOpenOutlined,
    LockPersonOutlined,
    Search,
    Speed 
} from "@mui/icons-material";

import axiosPrivate from "utils/axiosPrivate";
import { getComparator, stableSort } from "utils/tableSort"
import { TABLE_HEAD_CUSTOMER } from "constants/tableHeader";
import { SEX_OPTION } from 'constants/optionSelectField';
import { BREADCRUMB_ADMIN_CUSTOMER } from "constants/breadcrumb";
import RouterBreadcrumbs from "components/ui/breadcrumbs";
import { TOAST_DEFAULT_STYLE } from "assets/styles/constantsStyle";
import { checkPermission } from "utils";

function CustomerScreen() {
    const employee = useSelector((state) => state.auth?.login?.data);
    const [list, setList] = useState([]);

    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('createdAt');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    
    const [dialog, setDialog] = useState({show: false, content: []});
    const [refresh, setRefresh] = useState(0);
    const navigate = useNavigate();
    
    useEffect(() => {
        axiosPrivate
        .get("customer/", { headers: { token: employee?.accessToken} })
        .then((res) => { setList(res) })
        .catch((err) => { console.log(err)})
    // eslint-disable-next-line
    }, [refresh])

    const handleToggleLockAccount = (id, status) => {
        if(checkPermission("P6_3") === true) {
            alert(`Bạn có chắc muốn ${status === true ? "khóa" : "mở khóa"} tài khoản khách hàng này?`);
            axiosPrivate
                .put(`customer/lock/${id}`, { headers: { token: employee?.accessToken} })
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
            <Box>
                <Typography variant="h5" gutterBottom>
                    Danh sách khách hàng
                </Typography>
                <RouterBreadcrumbs 
                    prevLink={BREADCRUMB_ADMIN_CUSTOMER}
                    currentPage="Danh sách"
                    homeIcon={<Speed />}
                /> 
            </Box>
            <Paper sx={{ mt: 3, backgroundImage: "none" }} elevation={4}>
                <FormControl fullWidth color="btnSuccess">
                    <Input 
                        sx={{ px: 2, py: 1.5}}
                        placeholder="Tìm kiếm với tên khách hàng"
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
                                    {TABLE_HEAD_CUSTOMER.map((item, idx) => (
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
                                                    <Box component="span" sx={{ ml: 1.5 }}>
                                                        {row.name ? row.name : `User_${row?.email?.split("@")[0]}`}
                                                    </Box>
                                                </div>
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
                                                {
                                                    row.sex 
                                                    ? SEX_OPTION.find((item) => item.value === row.sex).label 
                                                    : <Box color="text.secondary">Chưa thiết lập</Box>
                                                }
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                {
                                                    row.birthday 
                                                    ? new AgeFromDateString((row.birthday)).age 
                                                    : <Box color="text.secondary">Chưa thiết lập</Box>
                                                }
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                {
                                                    row.phone 
                                                    ? row.phone 
                                                    : <Box color="text.secondary">Chưa thiết lập</Box>
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title="Danh sách địa chỉ" arrow>
                                                    <Button 
                                                        color="success"
                                                        onClick={() => setDialog({show: true, content: row.address})}
                                                        sx={{
                                                            whiteSpace: 'nowrap', 
                                                            fontWeight: 600, 
                                                            textTransform: 'unset',
                                                            '&:hover': {
                                                                textDecoration: 'underline'
                                                            } 
                                                        }}
                                                    >
                                                        Sổ địa chỉ
                                                    </Button>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title="Chỉnh sửa"arrow>
                                                    <IconButton 
                                                        color="info" 
                                                        onClick={() => {
                                                            if(checkPermission("P6_2") === true) {
                                                                navigate(`/admin/customer/edit/${row._id}`)
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
                open={dialog.show} 
                maxWidth='xs'
                fullWidth={true}
                onClose={() => setDialog({show: false, content: ''})}
            >
                <DialogTitle>Danh sách địa chỉ</DialogTitle>
                <DialogContent dividers>
                    {
                        dialog?.content?.length !== 0 
                        ? dialog?.content?.map((item, idx) => (
                            <Box key={idx} mb={2}>
                                <Divider textAlign="left" >
                                    Địa chỉ {idx + 1}
                                    {item.isPrimary && (
                                        <Chip
                                            label="Mặc định" 
                                            size="small" color="chipSuccess"
                                            sx={{ ml: 1, fontWeight: 600, borderRadius: '8px' }}
                                        />
                                    )}
                                </Divider>
                                <Grid container fontSize="14px" spacing={1} mt={0.5}>
                                    <Grid xs={4} color="text.secondary">- Người nhận:</Grid>        
                                    <Grid xs={8}>{item.name}</Grid>        
                                    <Grid xs={4} color="text.secondary">- Số điện thoại:</Grid>        
                                    <Grid xs={8}>{item.phone}</Grid>        
                                    <Grid xs={4} color="text.secondary">- Địa chỉ:</Grid>        
                                    <Grid xs={8}>{item.addressString}</Grid>        
                                </Grid>
                            </Box>
                        )) 
                        : (
                            <Box color="text.secondary">Khách hàng chưa thiết lập địa chỉ</Box>
                        )
                    }                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialog({show: false, content: ''})}>Hoàn thành</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default CustomerScreen;