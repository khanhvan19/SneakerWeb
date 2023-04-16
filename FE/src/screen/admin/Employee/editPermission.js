import { Link, useNavigate, useParams } from "react-router-dom";

import { 
    Avatar,
    Box, 
    Button, 
    List, 
    ListItem, 
    ListItemSecondaryAction, 
    ListItemText, 
    Paper, 
    Switch, 
    Typography
} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import { 
    Speed, 
    ArrowBackOutlined,
    DriveFileRenameOutlineOutlined,
    ArrowRightOutlined,
} from "@mui/icons-material";

import RouterBreadcrumbs from "components/ui/breadcrumbs";
import { PERMISSION } from "constants/permission";
import { BREADCRUMB_ADMIN_EMPLOYEE } from "constants/breadcrumb";
import { useEffect, useState } from "react";
import axiosPrivate from "utils/axiosPrivate";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { TOAST_DEFAULT_STYLE } from "assets/styles/constantsStyle";
import { ROLE_OPTION } from "constants/optionSelectField";

function EditPermission() {
    const employeeLogin = useSelector((state) => state.auth?.login?.data);
    const { id } = useParams();
    var navigate = useNavigate();
    const [employee, setEmployee] = useState({});
    const [permission, setPermission] = useState({});
    const [backupPermision, setBackupPermision] = useState({});
    const [showAction, setShowAction] = useState(false);

    useEffect(() => {
        axiosPrivate
        .get(`employee/${id}`, { headers: { token: employeeLogin?.accessToken} })
        .then((res) => {
            setEmployee(res)
            setPermission(res.permissions || {});
            setBackupPermision(res.permissions || {});
        })
        .catch((err) => {
            console.log(err);
        })
    }, [id, employeeLogin])

    const handleChangeOnePermision = (e) => {
        if(showAction === false) setShowAction(true);
        setPermission((prev) => ({
            ...prev, 
            [e.target.name]: !permission[e.target.name]
        }))
    };

    const handleSubmit = (e) => {
        axiosPrivate
            .put(`employee/permission/${id}`, permission,
                { headers: { token: employeeLogin?.accessToken }}
            )
            .then((res) => {
                toast.success(res.message, {...TOAST_DEFAULT_STYLE, autoClose: 1500});
                setTimeout(() => {
                    navigate('/admin/employee', { replace: true })
                }, 2000)
            })
            .catch((err) => {
                toast.error(err.message, TOAST_DEFAULT_STYLE);
            })
    }
    
    return ( 
        <>
            <Box className='content-center-between'>
                <Box>
                    <Typography variant="h5" gutterBottom>
                        Phân quyền nhân viên
                    </Typography>
                    <RouterBreadcrumbs 
                        prevLink={BREADCRUMB_ADMIN_EMPLOYEE}
                        currentPage="Phân quyền nhân viên"
                        homeIcon={<Speed />}
                    /> 
                </Box>
                <Button 
                    component={Link}
                    to="/admin/employee"
                    size="large"
                    variant="contained" 
                    color="btnGray" 
                    startIcon={<ArrowBackOutlined  />}
                >
                    Trở lại
                </Button>
            </Box>
            <Paper sx={{ p: 2, mt: 3 }} >
                <Box display="flex" alignItems="flex-end">
                    <Avatar 
                        src={employee?.avatar?.link} 
                        alt={employee?.avatar?.path}
                        sx={{
                            width: "60px", height: "60px",
                            border: "2px solid",
                            borderColor: "text.accent", 
                        }}
                    />
                    <Box ml={2}>
                        <Typography textTransform="uppercase">{employee.name}</Typography>
                        <Typography color="text.secondary">
                            {employee.role && ROLE_OPTION.find((item) => item.value === employee.role).label}
                        </Typography>
                    </Box>
                </Box>
            </Paper>
            <Box mt={3}>
                <Grid container spacing={4}>
                    {PERMISSION.map((item, idx) => (
                        <Grid xs={4} key={idx}>
                            <Typography className="content-left-center">
                                <DriveFileRenameOutlineOutlined sx={{ mr: 1, fontSize: '1.625rem'}}/>
                                {item.label}
                            </Typography>
                            <List>
                                {item.child.map((childItem, i) => (
                                    <ListItem sx={{ pb: 0 }} key={i}>
                                        <ArrowRightOutlined sx={{ mr: 1 }} />
                                        <Box fontSize={14}>{childItem.label}</Box> 
                                        <ListItemSecondaryAction>
                                            <Switch 
                                                size="small"
                                                color="btnSuccess" 
                                                name={childItem.id}
                                                value={childItem.id}
                                                checked={permission[childItem.id] || false}
                                                onChange={handleChangeOnePermision}
                                            />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                    ))}
                </Grid>  
            </Box>
            
            {showAction && (
                <Box mt={3}>
                    <Grid xs={4} xsOffset={8} spacing={2} container>
                        <Grid xs={6}>
                            <Button
                                fullWidth variant="contained" 
                                size="large" color="btnGray"
                                onClick={() => {
                                    setPermission(backupPermision);
                                    setShowAction(false)
                                }} 
                            >
                                Tạo lại
                            </Button>
                        </Grid>
                        <Grid xs={6}>
                            <Button
                                fullWidth variant="contained"
                                size="large" color="btnSuccess"
                                onClick={handleSubmit}
                            >
                                Lưu chỉnh sửa 
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            )}
            <ToastContainer />
        </>
    );
}

export default EditPermission;