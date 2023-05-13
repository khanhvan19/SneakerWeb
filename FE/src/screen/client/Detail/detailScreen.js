import { CottageOutlined } from "@mui/icons-material";
import { Box } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import { SquareBlock } from "assets/styles/constantsStyle";
import RouterBreadcrumbs from "components/ui/breadcrumbs";
import { BREADCRUMB_CUSTOMER_PRODUCT } from "constants/breadcrumb";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axiosPublic from "utils/axiosPublic";
import RightAction from "./rightAction";
import SimilarSlider from "./similarSlider";
import ProductReviews from "./productReviews";

function ProductDetail() {
    const { productId, versionId } = useParams();
    const [versions, setVersions] = useState([]);
    const [version, setVersion] = useState({});

    useEffect(() => {
        axiosPublic
            .get('/version/of-product', {
                params: { product: productId }
            })
            .then((res) => {
                setVersions(res)
                setVersion(res.find(version => version._id === versionId))
            })
            .catch((err) => console.log(err))
    }, [productId, versionId])

    return (  
        <>
            <Box>
                <RouterBreadcrumbs 
                    prevLink={BREADCRUMB_CUSTOMER_PRODUCT}
                    homeIcon={<CottageOutlined />}
                    currentPage={version?.product?.name}
                /> 
            </Box>
            <Grid container mt={3}>
                <Grid xs={8}>
                    <Box>
                        <Grid container spacing={1}>
                            {version?.images?.map((image, idx) => (
                                <Grid xs={6} key={idx}>
                                    <SquareBlock w='100%'>
                                        <img src={image.link} alt="" />
                                    </SquareBlock>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>   
                    <Box>
                        <ProductReviews 
                            productId={productId} 
                            version={version} 
                        />
                    </Box>
                </Grid>
                <Grid xs={4}>
                    <Box position='sticky' top={24} pl={3.5}>
                        <RightAction 
                            versionId={versionId} 
                            version={version} 
                            versions={versions} 
                        />
                    </Box>
                </Grid>
            </Grid>
            <Box mt={6}>
                <SimilarSlider 
                    brand={version?.product?.brand?._id} 
                    productId={version?.product?._id}
                />
            </Box>
        </>
    );
}

export default ProductDetail;