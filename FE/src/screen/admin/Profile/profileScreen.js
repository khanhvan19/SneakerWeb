import { DriveFileRenameOutline, Speed } from "@mui/icons-material";
import { Avatar, Badge, Box, IconButton, Paper, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { IconButtonContained } from "assets/styles/constantsStyle";
import RouterBreadcrumbs from "components/ui/breadcrumbs";
import { BREADCRUMB_ADMIN_PROFILE } from "constants/breadcrumb";
import { ROLE_OPTION, SEX_OPTION } from "constants/optionSelectField";
import { useSelector } from "react-redux";
import { formatLocalDate } from "utils/formatters";

import styles from './Profile.module.scss'
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

function ProfileScreen() {
    const employee = useSelector((state) => state.auth?.login?.data);

    const findRoleEmployee = (code) => {
        const role = ROLE_OPTION.find(role => role.value === code)
        return role.label;
    }
    
    const findSexEmployee = (code) => {
        const role = SEX_OPTION.find(role => role.value === code)
        return role.label;
    }

    return (  
        <>
            <Box>
                <Typography variant="h5" gutterBottom>
                    Hồ sơ của tôi
                </Typography>
                <RouterBreadcrumbs 
                    prevLink={BREADCRUMB_ADMIN_PROFILE}
                    currentPage="Hồ sơ của tôi"
                    homeIcon={<Speed />}
                /> 
            </Box>
            <Paper className={cx('profile-banner')} sx={{ mt: 3, backgroundImage: "none"}}>
                <Box className={cx('profile-banner-content')}>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                            <IconButtonContained size="small">
                                <DriveFileRenameOutline />
                            </IconButtonContained>
                        }
                    >
                        <Avatar 
                            alt={employee?.name} 
                            src={employee?.avatar?.link} 
                            sx={{ 
                                width: 144, height: 144,
                                border: "3px solid",
                                borderColor: "text.accent",
                            }}
                        />
                    </Badge>
                    <Box ml={4}>
                        <Typography variant="h4" component="span" className={cx('editting')}>
                            {employee?.name}
                            <IconButton className={cx('btn-edit')}>
                                <DriveFileRenameOutline />
                            </IconButton> 
                        </Typography>
                        <Typography color="text.secondary" mb={1.5} mt={0.5} className={cx('editting')}>
                            {employee?.email}
                            <IconButton className={cx('btn-edit')}>
                                <DriveFileRenameOutline />
                            </IconButton> 
                        </Typography>
                        <Typography variant="h6">
                            {findRoleEmployee(employee?.role)}
                        </Typography>
                    </Box>
                </Box>
                <Box className={cx('cover-image')}>
                    <img src="" alt=""></img>
                </Box>
            </Paper>
            
            <Paper sx={{ mt: 3, p: 2, backgroundImage: "none" }}>
                <Table>
                    <TableBody>
                        <TableRow >
                            <TableCell sx={{ borderWidth: 0 }}>
                                <Typography color="text.secondary">Giới tính: </Typography>
                            </TableCell>
                            <TableCell sx={{ borderWidth: 0 }}>
                                <span className={cx('editting')}>
                                    {findSexEmployee(employee?.sex)}
                                    <IconButton className={cx('btn-edit')}>
                                        <DriveFileRenameOutline />
                                    </IconButton> 
                                </span>
                            </TableCell>
                        </TableRow>
                        <TableRow >
                            <TableCell sx={{ borderWidth: 0 }}>
                                <Typography color="text.secondary">Ngày sinh: </Typography>
                            </TableCell>
                            <TableCell sx={{ borderWidth: 0 }}>
                                <span className={cx('editting')}>
                                    {formatLocalDate(employee?.birthday)}
                                    <IconButton className={cx('btn-edit')}>
                                        <DriveFileRenameOutline />
                                    </IconButton> 
                                </span>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ borderWidth: 0 }}>
                                <Typography color="text.secondary">Số điện thoại: </Typography>
                            </TableCell>
                            <TableCell sx={{ borderWidth: 0 }}>
                                <span className={cx('editting')}>
                                    {employee?.phone}
                                    <IconButton className={cx('btn-edit')}>
                                        <DriveFileRenameOutline />
                                    </IconButton> 
                                </span>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ borderWidth: 0 }}>
                                <Typography color="text.secondary">Địa chỉ liên hệ: </Typography>
                            </TableCell>
                            <TableCell sx={{ borderWidth: 0 }}>
                                <span className={cx('editting')}>
                                    {employee?.address?.addressString}
                                    <IconButton className={cx('btn-edit')}>
                                        <DriveFileRenameOutline />
                                    </IconButton> 
                                </span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>
        </>
    );
}

export default ProfileScreen;