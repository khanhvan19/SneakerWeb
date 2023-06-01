import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosClientPrivate from "utils/axiosClientPrivate";
import Grid from '@mui/material/Unstable_Grid2';
import ProductCard from "components/ui/Card/productCard";

function FavoriteScreen() {
    const isLogin = useSelector((state) => state.client?.login?.data);
    const [favorite, setFavorites] = useState([])

    useEffect(() => {
        axiosClientPrivate
            .get('/favorite/', {
                params: { customer: isLogin?._id }, 
                headers: { token: isLogin?.accessToken }
            })

            .then((res) => setFavorites(res))
            .catch((err) => console.log(err))
    }, [isLogin])

    console.log(favorite);

    return (  
        <Box flex={1}>
            <Typography variant='h5' mb={2}>Sản phẩm yêu thích</Typography>
            <Grid container spacing={2}>
                {favorite && favorite.map((item, idx) => (
                    <Grid xs={4} key={idx}>
                        <ProductCard data={item} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default FavoriteScreen;