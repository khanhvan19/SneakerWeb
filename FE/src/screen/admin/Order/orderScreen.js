import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { 
    Box,  
    Button,  
    FormControl,  
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
    Typography 
} from "@mui/material";
import { 
    Search,
    Speed 
} from "@mui/icons-material";

import axiosPrivate from "utils/axiosPrivate";
import { getComparator, stableSort } from "utils/tableSort"
import { TABLE_HEAD_ORDER } from "constants/tableHeader";
import { BREADCRUMB_ADMIN_ORDER } from "constants/breadcrumb";
import RouterBreadcrumbs from "components/ui/breadcrumbs";
import { renderOrderStatus } from "utils";
import { formatLocalDateTime, formatMoney } from "utils/formatters";
import { PAYMENT_METHOD } from "constants/optionSelectField";

function OrderScreen() {
    const employee = useSelector((state) => state.auth?.login?.data);
    const [list, setList] = useState([]);

    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('createdAt');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    
    useEffect(() => {
        axiosPrivate
        .get("order/", { headers: { token: employee?.accessToken} })
        .then((res) => { setList(res) })
        .catch((err) => { console.log(err)})
    // eslint-disable-next-line
    }, [])

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
                    Danh sách đơn hàng
                </Typography>
                <RouterBreadcrumbs 
                    prevLink={BREADCRUMB_ADMIN_ORDER}
                    currentPage="Danh sách"
                    homeIcon={<Speed />}
                /> 
            </Box>
            <Paper sx={{ mt: 3, backgroundImage: "none" }} elevation={4}>
                <FormControl fullWidth color="btnSuccess">
                    <Input 
                        sx={{ px: 2, py: 1.5}}
                        placeholder="Tìm kiếm với mã đơn hàng"
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
                                    {TABLE_HEAD_ORDER.map((item, idx) => (
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
                                        <TableRow hover key={idx}>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                <Typography textTransform='uppercase'>{row._id}</Typography>
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                {formatLocalDateTime(row.createdAt)}
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                {row.address.name}
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                {row.address.phone}
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                {row.deliveryMethod}
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                {PAYMENT_METHOD.find(e => e.value === row.paymentMethod).label}
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                {renderOrderStatus(row.status, 'medium')}
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                {formatMoney(row.total)}
                                            </TableCell>
                                            <TableCell>
                                                <Button 
                                                    color="success"
                                                    component={Link} to={`/admin/order-detail/${row._id}`} 
                                                    sx={{ 
                                                        whiteSpace: 'nowrap', fontWeight: 600, textTransform: 'unset',
                                                        '&:hover': { textDecoration: 'underline' } 
                                                    }}
                                                >
                                                    Xem chi tiết
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
        </>
    );
}

export default OrderScreen;