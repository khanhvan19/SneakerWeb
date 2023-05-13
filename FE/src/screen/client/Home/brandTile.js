import { Box, Typography } from "@mui/material";
import ProductHoverImageCard from "components/ui/Card/productHoverImageCard";
import ProductSlider from "components/ui/productSlider";
import Grid from '@mui/material/Unstable_Grid2';

function BrandTile({ video, products, title, reverse }) {
    return (
        <Grid container spacing={2} flexDirection={(reverse) ? 'row-reverse' : 'row'}>
            <Grid xs={6}>
                <Box
                    width='100%'
                    component='video'
                    controls autoPlay muted loop preload='auto'
                >
                    <source src={video} type='video/mp4' />
                </Box>
            </Grid>
            <Grid xs={6} display='flex' flexDirection='column'>
                <Typography
                    variant="h4"
                    textTransform='uppercase' lineHeight={1}
                    textAlign={(reverse ? 'end' : 'start')}
                    sx={(reverse) 
                        ? {
                            borderRight: '6px solid', 
                            borderColor: 'text.primary', 
                            pr: 1.5 
                        } 
                        : {
                            borderLeft: '6px solid', 
                            borderColor: 'text.primary', 
                            pl: 1.5 
                        }
                    }
                >
                    {title}
                </Typography>
                <Box
                    mx={-1} mt='auto'
                    sx={{
                        '& .btnCtrlProductSlider': {
                            transform: 'translateY(-100%)',
                            opacity: 0, color: 'text.secondary', bgcolor: '#00ab5532',
                        },
                        '&:hover': { '& .btnCtrlProductSlider': { opacity: 1 } },
                    }}
                >
                    <ProductSlider tile={2}>
                        {products.map((product, idx) => (
                            <Box key={idx} px={1}>
                                <ProductHoverImageCard data={product} />
                            </Box>
                        ))}
                    </ProductSlider>
                </Box>
            </Grid>
        </Grid>
    );
}

export default BrandTile;