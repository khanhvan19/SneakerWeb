import { 
    AttachFileOutlined, 
    BorderColorOutlined, 
    DeleteOutlined, 
    KeyboardArrowDown, 
    KeyboardArrowUp, 
    VisibilityOffOutlined, 
    VisibilityOutlined 
} from "@mui/icons-material";
import { 
    Box,
    Button,
    Chip,
    Collapse,
    IconButton, 
    Rating, 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableRow, 
    Tooltip,
    Typography
} from "@mui/material";
import { SquareBlock } from "assets/styles/constantsStyle";
import { useState } from "react";
import { useNavigate } from "react-router";
import { checkPermission } from "utils";
import { formatLocalDateTime, formatMoney } from "utils/formatters";

function ProductRow(props) {
    const {
        data, sizesDialogRef, detailDialogRef, setDetail, setSizes,
        onToggleStatusProduct, onDeleteProduct, onToggleStatusVersion, onDeleteVersion,
    } = props
    const [openCollapse, setOpenCollapse] = useState(false);
    const navigate = useNavigate();

    return ( 
        <> 
            <TableRow hover selected={openCollapse}>
                <TableCell>
                    <IconButton size="small" onClick={() => setOpenCollapse(!openCollapse)}>
                        {openCollapse ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell sx={{whiteSpace: 'nowrap'}}>{data.name}</TableCell>
                <TableCell sx={{whiteSpace: 'nowrap'}}>{data?.brand?.name}</TableCell>
                <TableCell sx={{whiteSpace: 'nowrap'}}>
                    {data?.category?.map((category, idx) => (
                        <Box mb={0.5} key={idx}>{category.name}</Box>
                    ))}
                </TableCell>
                <TableCell sx={{whiteSpace: 'nowrap'}}>
                    {data?.gender.map((gender, idx) => (
                        <Chip 
                            key={idx} label={gender} 
                            size="small" color="chipInfo"
                            sx={{ fontWeight: 600, mr: 1 }}
                        />
                    ))}
                </TableCell>
                <TableCell sx={{whiteSpace: 'nowrap'}}>
                    {formatLocalDateTime(data.createdAt)}
                </TableCell>
                <TableCell sx={{whiteSpace: 'nowrap'}}>
                    {formatMoney(data.price)}
                </TableCell>
                <TableCell sx={{whiteSpace: 'nowrap'}}>{data?.discount} %</TableCell>
                <TableCell sx={{whiteSpace: 'nowrap'}}>{data?.sold}</TableCell>
                <TableCell sx={{whiteSpace: 'nowrap'}}>
                    <Box className="content-left-center">
                        <Rating value={data?.star}  precision={0.1} readOnly size="small" />
                        <Box sx={{ml: 2, color: "#faaf00", fontWeight: 600}}>{data?.star}</Box>
                    </Box>
                </TableCell>
                <TableCell sx={{whiteSpace: 'nowrap'}}>
                    <Chip 
                        size="small"
                        label={(data.status === true) ? "Active" : "Hidden"} 
                        sx={{ fontWeight: 600, borderRadius: '8px' }}
                        color={(data.status === true) ? "chipSuccess" : "chipError"} 
                    />
                </TableCell>
                <TableCell>
                    <Tooltip title="Xem mô tả chi tiết" arrow>
                        <IconButton 
                            color="primary" 
                            onClick={() => {
                                setDetail(data.description);
                                detailDialogRef.current.onShowDialog();
                            }}
                        >
                            <AttachFileOutlined />
                        </IconButton>
                    </Tooltip>
                </TableCell>
                <TableCell>
                    <Tooltip title="Chỉnh sửa thông tin" arrow>
                        <IconButton 
                            color="info" 
                            onClick={() => {
                                if(checkPermission("P4_3") === true) {
                                    navigate(`/admin/product/info/edit/${data._id}`)
                                }
                            }}
                        >
                            <BorderColorOutlined />
                        </IconButton>
                    </Tooltip>
                </TableCell>
                <TableCell>
                    <Tooltip title={(data.status === true) ? "Ẩn sản phẩm" : "Hiển thị sản phẩm"} arrow>
                        <IconButton 
                            color="warning"
                            onClick={() => onToggleStatusProduct(data._id, data.status)}
                        >
                            {(data.status === true) ? <VisibilityOffOutlined /> : < VisibilityOutlined />}
                        </IconButton>
                    </Tooltip>
                </TableCell>
                <TableCell>
                    <Tooltip title="Xóa sản phẩm" arrow>
                        <IconButton 
                            color="error"
                            onClick={() => onDeleteProduct(data._id)}
                        >
                            <DeleteOutlined />
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={7} sx={{ py: 0, position: 'sticky', left: 0}}>
                    <Collapse in={openCollapse} timeout="auto" unmountOnExit>
                        <Box m={1}>
                            <Typography variant='overline'>Phiên bản sản phẩm</Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Hình ảnh</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Tên phiên bản</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Trạng thái</TableCell>
                                        <TableCell colSpan={4} align='center'>Tác vụ</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data?.versions?.map((version, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>
                                                <Box display='flex'>
                                                    {version.images.map((image, i) => (
                                                        <SquareBlock key={i} w={48} mr={0.5}>
                                                            <img src={image.link} alt='' />
                                                        </SquareBlock>
                                                    ))}
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ whiteSpace: 'nowrap' }}>{version.name}</TableCell>
                                            <TableCell>
                                                <Chip 
                                                    size="small"
                                                    label={(version.status === true) ? "Active" : "Hidden"} 
                                                    sx={{ fontWeight: 400, borderRadius: '8px' }}
                                                    color={(version.status === true) ? "chipSuccess" : "chipError"} 
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title="Xem số lượng tồn kho"arrow>
                                                    <Button 
                                                        color="btnSuccess" 
                                                        onClick={() => {
                                                            setSizes(version.sizes);
                                                            sizesDialogRef.current.onShowDialog();
                                                        }}
                                                        sx={{ 
                                                            textTransform: 'unset',
                                                            whiteSpace: 'nowrap',
                                                            '&:hover': { textDecoration: 'underline' }
                                                        }}
                                                    >
                                                        Tồn kho
                                                    </Button>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title="Chỉnh sửa phiên bản" arrow>
                                                    <IconButton 
                                                        color="info" 
                                                        onClick={() => {
                                                            if(checkPermission("P4_3") === true) {
                                                                navigate(`/admin/product/version/edit/${version._id}`)
                                                            }
                                                        }}
                                                    >
                                                        <BorderColorOutlined fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title={(version.status === true) ? "Ẩn phiên bản" : "Hiển thị phiên bản"} arrow>
                                                    <IconButton 
                                                        color="warning"
                                                        onClick={() => onToggleStatusVersion(version._id, version.status)}
                                                    >
                                                        {(version.status === true) 
                                                            ? <VisibilityOffOutlined fontSize="small"/> 
                                                            : < VisibilityOutlined fontSize="small"/>
                                                        }
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title="Xóa phiên bản" arrow>
                                                    <IconButton 
                                                        color="error"
                                                        onClick={() => onDeleteVersion(version._id)}
                                                    >
                                                        <DeleteOutlined fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

export default ProductRow;