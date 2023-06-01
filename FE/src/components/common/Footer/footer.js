import { Box, Container, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";

import Grid from '@mui/material/Unstable_Grid2';
import * as image from 'assets/images'
import queryString from "query-string";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosPublic from "utils/axiosPublic";

const linkContact = [
    {label: 'Về TheSneak', link: ''},
    {label: 'Cửa hàng', link: ''},
    {label: 'Trợ giúp', link: ''},
    {label: 'Hợp tác', link: ''},
] 

function Footer() {    
    const [brand, setBrands] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        axiosPublic
            .get("brand/public")
            .then((res) => { setBrands(res) })
            .catch((err) => { console.log(err) });
    }, [])

    return (
        <Container sx={{ bgcolor: 'text.primary', pt: 4, mt: 2 }} maxWidth='xl'>
            <Grid container spacing={4}>
                <Grid xs={4}>
                    <Box component='img' src={image.logoDark} height={60} mb={1} />
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        pl: 0, py: 0.25,
                                        fontSize: 16, fontWeight: 600,
                                        borderWidth: 0, verticalAlign: 'text-top',
                                        color: 'background.paper'
                                    }}
                                >Địa chỉ: </TableCell>
                                <TableCell
                                    sx={{
                                        pl: 0, py: 0.25,
                                        fontSize: 16, borderWidth: 0,
                                        color: 'background.paper'
                                    }}
                                >đường 3/2, phường Xuân Khánh, quận Ninh Kiều, Tp.Cần Thơ</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        pl: 0, py: 0.25,
                                        fontSize: 16, fontWeight: 600,
                                        borderWidth: 0, color: 'background.paper'
                                    }}
                                >E-mail: </TableCell>
                                <TableCell
                                    sx={{
                                        pl: 0, py: 0.25,
                                        fontSize: 16, borderWidth: 0,
                                        color: 'background.paper'
                                    }}
                                >support@thesneak.com.vn</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        pl: 0, py: 0.25,
                                        fontSize: 16, fontWeight: 600,
                                        borderWidth: 0, color: 'background.paper'
                                    }}
                                >Hotline: </TableCell>
                                <TableCell
                                    sx={{
                                        pl: 0, py: 0.25,
                                        fontSize: 16, borderWidth: 0,
                                        color: 'background.paper'
                                    }}
                                >0789 111 222</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Box mt={1}>
                        <Link to=''><img src={image.linkFB} alt="" /></Link>
                        <Link to=''><img src={image.linkIT} alt="" /></Link>
                        <Link to=''><img src={image.linkPR} alt="" /></Link>
                        <Link to=''><img src={image.linkTT} alt="" /></Link>
                        <Link to=''><img src={image.linkYB} alt="" /></Link>
                    </Box>
                </Grid>
                <Grid xs={4}>
                    <Box>
                        <Grid container spacing={2}>
                            <Grid xs={6}>
                                <Typography variant="h6" color='background.paper' mb={2}>Thương hiệu</Typography>
                                {brand.length !== 0 && brand.map((item, idx) => (
                                    <Box 
                                        key={idx}
                                        color='background.paper' 
                                        mb={(idx !== brand.length - 1) ? 1 : 0}
                                        sx={{ 
                                            textTransform: 'uppercase',
                                            '&:hover': {
                                                color: 'text.accent',
                                                textDecoration: 'underline',
                                                cursor: 'pointer'
                                            }
                                        }}
                                        onClick={() => {
                                             navigate({
                                                pathname: '/product/',
                                                search: queryString.stringify({ brand: item._id })
                                            })}
                                        }
                                    >
                                        {item.name}
                                    </Box >
                                ))}
                            </Grid>
                            <Grid xs={6}>
                                <Typography variant="h6" color='background.paper' mb={2}>Thông tin</Typography>
                                {linkContact.length !== 0 && linkContact.map((item, idx) => (
                                    <Box 
                                        key={idx}
                                        component={Link} to={item.link}
                                        mb={(idx !== linkContact.length - 1) ? 1 : 0}
                                        color='background.paper' 
                                        display='block'
                                        sx={{ 
                                            '&:hover': {
                                                color: 'text.accent',
                                                textDecoration: 'underline',
                                                cursor: 'pointer'
                                            }
                                        }}
                                    >
                                        {item.label}
                                    </Box >
                                ))}
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid xs={4}>
                    <Box
                        component='iframe' title="ggmap"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.8415184425503!2d105.76803500911835!3d10.029933690035614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0895a51d60719%3A0x9d76b0035f6d53d0!2zxJDhuqFpIGjhu41jIEPhuqduIFRoxqE!5e0!3m2!1svi!2s!4v1685109587446!5m2!1svi!2s" 
                        loading="lazy" 
                        sx={{ width: '100%', height: '100%' }}
                    />
                </Grid>
            </Grid>
        </Container>
    );
}

export default Footer;