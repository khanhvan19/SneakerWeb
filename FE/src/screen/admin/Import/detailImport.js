import { ArrowBackOutlined } from "@mui/icons-material";
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { TableCellBorder } from "assets/styles/constantsStyle";
import { ROLE_OPTION, SIZE_OPTION } from "constants/optionSelectField";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import axiosPrivate from "utils/axiosPrivate";
import { formatMoney } from "utils/formatters";

function DetailImport() {
    var { id } = useParams();
    const [detail, setDetail] = useState({})
    var dateCreated = new Date(detail.createdAt)
    var index = 0;
    var countQuantity = 0;

    useEffect(() => {
        (id != null) && axiosPrivate
            .get(`import/${id}`)
            .then((res) => { setDetail(res) })
            .catch((err) => { console.log(err) })
    }, [id])

    console.log(detail);

    const findLabelSize = (code) => {
        const size = SIZE_OPTION.find(size => size.value === code)
        return size.label;
    }

    const findRoleEmployee = (code) => {
        const role = ROLE_OPTION.find(role => role.value === code)
        return role.label;
    }

    return (  
        <Box>
            <Box className="content-right-center">
                <Button 
                    component={Link}
                    to="/admin/import"
                    variant="contained" 
                    color="btnGray" 
                    startIcon={<ArrowBackOutlined />}
                >
                    Trở lại
                </Button>
            </Box>
            {(Object.keys(detail).length === 0)
            ? (<>loading..</>) 
            : (
                <Paper sx={{ backgroundImage: "none", mt: 2, p: 2 }} elevation={4}>
                    <Box textAlign="center">
                        <Typography variant="h5" mb={0} gutterBottom>
                            CHI TIẾT PHIẾU NHẬP
                        </Typography>
                        <Typography variant="subtitle1" component="i">
                            {"Ngày " + dateCreated.getDate() +
                            " Tháng " + (dateCreated.getMonth() + 1) +
                            " Năm " + dateCreated.getFullYear()}
                        </Typography>
                    </Box>
                    <Box mt={3}>
                        <Box display="flex" mb={0.25}>
                            <Box flex={1}>- Tiêu đề: {detail.name}</Box>
                            <Box flex={1}>
                                Nhà cung cấp: 
                                <Box textTransform="uppercase" component="span"> {detail.supplier}</Box> 
                            </Box>
                        </Box>
                        <Box display="flex" mb={0.25}>
                            <Box flex={1}>- Nhân viên nhập: {detail?.employee?.name}</Box>
                            <Box flex={1}>Chức vụ: {findRoleEmployee(detail?.employee?.role)}</Box>
                        </Box>
                        <Box>- Nhập tại kho: {detail.warehouse}</Box>
                    </Box>
                    <TableContainer sx={{mt: 2}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCellBorder align="center">STT</TableCellBorder>
                                    <TableCellBorder align="center">Tên sản phẩm</TableCellBorder>
                                    <TableCellBorder align="center">Màu sắc</TableCellBorder>
                                    <TableCellBorder align="center">Size</TableCellBorder>
                                    <TableCellBorder align="center">Số lượng</TableCellBorder>
                                    <TableCellBorder align="center">Đơn giá</TableCellBorder>
                                    <TableCellBorder align="center">Thành tiền</TableCellBorder>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {detail?.products?.map(product => 
                                    product.sizes.map((size) => {
                                        index += 1;
                                        countQuantity += size.quantity;
                                        return (
                                            <TableRow key={index}>
                                                <TableCellBorder align="center">{index}</TableCellBorder>
                                                <TableCellBorder align="left">{product?.product?.sample?.name}</TableCellBorder>
                                                <TableCellBorder align="left">{product?.product?.colorName}</TableCellBorder>
                                                <TableCellBorder align="center">{findLabelSize(size.code)}</TableCellBorder>
                                                <TableCellBorder align="center">{size.quantity}</TableCellBorder>
                                                <TableCellBorder align="right">{formatMoney(product.price)}</TableCellBorder>
                                                <TableCellBorder align="right">{formatMoney(product.price * size.quantity)}</TableCellBorder>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                            <TableFooter component={TableHead}>
                                <TableRow>
                                    <TableCellBorder align="left" colSpan={4}>Tổng cộng:</TableCellBorder>
                                    <TableCellBorder align="center">{countQuantity}</TableCellBorder>
                                    <TableCellBorder></TableCellBorder>
                                    <TableCellBorder align="right">{formatMoney(detail.total)}</TableCellBorder>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                    <Box mt={2}>- Ghi chú: {detail.description}</Box>
                </Paper>
            )}
        </Box>

    );
}

export default DetailImport;