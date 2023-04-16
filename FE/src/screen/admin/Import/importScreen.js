import { 
    PlaylistAdd, 
    Search, 
    Speed, 
} from "@mui/icons-material";
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

import RouterBreadcrumbs from "components/ui/breadcrumbs";
import { BREADCRUMB_ADMIN_IMPORT } from "constants/breadcrumb";
import { TABLE_HEAD_IMPORT } from "constants/tableHeader";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { checkPermission } from "utils";
import axiosPrivate from "utils/axiosPrivate";
import { formatLocalDateTime, formatMoney } from "utils/formatters";
import { getComparator, stableSort } from "utils/tableSort";

function ImportScreen() {
    const employee = useSelector((state) => state.auth?.login?.data);
    const [list, setList] = useState([]);

    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('createdAt');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    var navigate = useNavigate();

    useEffect(() => {
        axiosPrivate
        .get("import/", { headers: { token: employee?.accessToken} })
        .then((res) => { setList(res) })
        .catch((err) => { console.log(err) })
    // eslint-disable-next-line
    }, [])

    console.log(list);

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
                        Danh sách phiếu nhập hàng
                    </Typography>
                    <RouterBreadcrumbs 
                        prevLink={BREADCRUMB_ADMIN_IMPORT}
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
                        if(checkPermission("P8_2") === true) {
                            navigate('/admin/import/add')
                        }
                    }}
                >
                    Thêm phiếu nhập
                </Button>
            </Box>
            <Paper sx={{ mt: 3, backgroundImage: "none" }} elevation={4}>
                <FormControl fullWidth color="btnSuccess">
                    <Input 
                        sx={{ px: 2, py: 1.5}}
                        placeholder="Tìm kiếm "
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
                                    {TABLE_HEAD_IMPORT.map((item, idx) => (
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
                                    <TableCell align="center">Tác vụ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {stableSort(list, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, idx) => {
                                    return (
                                        <TableRow hover key={idx}>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                { row.name } 
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                { row.employee.name }
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                { row.supplier }
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                { formatMoney(row.total) }
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                { formatLocalDateTime(row.createdAt) }
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                { row.warehouse }
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                               { row.description }
                                            </TableCell>
                                            <TableCell sx={{whiteSpace: 'nowrap'}}>
                                                <Button 
                                                    component={Link}
                                                    to={`/admin/import/${row._id}`}
                                                    color="btnInfo"
                                                    sx={{
                                                        whiteSpace: 'nowrap', 
                                                        textTransform: 'unset',
                                                        '&:hover': {
                                                            textDecoration: 'underline'
                                                        } 
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

export default ImportScreen;