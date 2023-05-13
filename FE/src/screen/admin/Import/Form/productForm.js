import { Box, Button, ButtonGroup, Divider, IconButton, Typography } from "@mui/material";
import SelectField from "components/ui/FormField/selectField";
import TextField from "components/ui/FormField/textField";
import { FastField, Field, FieldArray } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosPrivate from "utils/axiosPrivate";
import Grid from '@mui/material/Unstable_Grid2';
import { Add, AddToPhotosOutlined, DeleteOutlined, Remove } from "@mui/icons-material";
import { useMemo } from "react";
import { formatMoney } from "utils/formatters";
import { SIZE_OPTION } from "constants/optionSelectField";

function ProductForm({ data, handleChange, setFieldValue }) {
    const employee = useSelector((state) => state.auth?.login?.data);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axiosPrivate
            .get("product/", { headers: { token: employee?.accessToken} })
            .then((res) => { setProducts(res) })
            .catch((err) => { console.log(err) })
    }, [employee])

    const findPrice = (productId) => {
        console.log(productId);
        const product = products.find(product => product._id === productId);
        return product.price;
    }

    const findVersions = (productId) => {
        const product = products.find(product => product._id === productId);
        return product.versions;
    }

    const findSizes = (productId) => {
        var sizes = [];
        if(products.length !== 0) {
            const product = products.find(item => item._id === productId)
            console.log(product);
            sizes = SIZE_OPTION.filter((size) => (
                size.value >= product.sizeMin && size.value <= product.sizeMax
            ))
        }
        return sizes;
    }
    
    const totalPrice = useMemo(() => {
        const result = data.reduce((result, product) => {
            return result + (product.price * product.detail.reduce((count, detail) => {
                return count + detail.quantity
            }, 0));
        }, 0)
        return result;
    }, [data])
    
    return (
        <>
            <FieldArray
                name="products"
                render={(arrayHelpers) => (
                    <>
                        <Box sx={{ textAlign: "end" }}>
                            <Button 
                                size="large" variant="outlined" color="btnSuccess"
                                startIcon={<AddToPhotosOutlined />}
                                sx={{ mb: 2, textTransform: "none" }}
                                onClick={() => arrayHelpers.push({
                                    product: '',
                                    price: '', 
                                    detail: [{ version: '', size: '', quantity: '' }], 
                                })} 
                            >
                                Thêm sản phẩm
                            </Button>
                        </Box>
                        {products && data?.map((item, index) => (
                            <Box key={index}>
                                <Grid container>
                                    <Grid xs={11} container spacing={2}>
                                        <Grid xs={6}>
                                            <Field
                                                name={`products[${index}].product`}
                                                component={SelectField}
                                                options={products}
                                                onChangeOther={(e) => {
                                                    handleChange(e);
                                                    setFieldValue(`products.${index}.price`, '');
                                                    setFieldValue(
                                                        `products.${index}.sizes`,
                                                        [{ version: '', size: '', quantity: '' }]
                                                    );
                                                }}
                                                label="Sản phẩm"
                                            />
                                        </Grid>
                                        <Grid xs={6}>
                                            <FastField
                                                name={`products[${index}].price`}
                                                component={TextField}
                                                label="Đơn giá"
                                                type="number"
                                                endLabel="VND"
                                                placeholder={item.product ? formatMoney(findPrice(item.product)) : ''}
                                            />
                                        </Grid>
                                        <Grid xs={12}>
                                            <FieldArray 
                                                name={`products[${index}].detail`}
                                                render={(childArrayHelpers) => (
                                                    <>
                                                        {item?.detail?.map((detail, idx) => (
                                                            <Grid container py={0} key={idx}>
                                                                <Grid xs={4}>
                                                                    <Field
                                                                        name={`products[${index}].detail[${idx}].version`}
                                                                        component={SelectField}
                                                                        options={item.product ? findVersions(item.product) : []}
                                                                        label="Phiên bản"
                                                                        size="small"
                                                                    />
                                                                </Grid>
                                                                <Grid xs={2}>
                                                                    <Field
                                                                        name={`products[${index}].detail[${idx}].size`}
                                                                        component={SelectField}
                                                                        options={item.product ? findSizes(item.product) : []}
                                                                        label="Size"
                                                                        size="small"
                                                                    />
                                                                </Grid>
                                                                <Grid xs={2}>
                                                                    <FastField
                                                                        name={`products[${index}].detail[${idx}].quantity`}
                                                                        component={TextField}
                                                                        label="Số lượng"
                                                                        type="number"
                                                                        size="small"
                                                                    />
                                                                </Grid>
                                                                <Grid xs={3} className="content-center">
                                                                    { formatMoney(item.price * detail.quantity) }
                                                                </Grid>
                                                                <Grid xs={1} className="content-right-center" sx={{ pr: 0 }}>
                                                                    <ButtonGroup variant="outlined">
                                                                        <Button 
                                                                            color="btnError" sx={{ px: 1 }}
                                                                            onClick={() => childArrayHelpers.remove(idx)}
                                                                        >
                                                                            <Remove />
                                                                        </Button>
                                                                        <Button
                                                                            color="btnSuccess" sx={{ px: 1 }}
                                                                            onClick={() => childArrayHelpers.push({ version: '', size: '', quantity: ''})}
                                                                        >
                                                                            <Add />
                                                                        </Button>
                                                                    </ButtonGroup>
                                                                </Grid>
                                                            </Grid>
                                                        ))}
                                                    </>
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid xs={1} className="content-top-center">
                                        <IconButton
                                            color="btnError"
                                            onClick={() => arrayHelpers.remove(index)}
                                        >
                                            <DeleteOutlined />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                {(index !== data.length - 1) && <Divider sx={{ my: 2, borderStyle: 'dashed' }} />}  
                            </Box>
                        ))}
                    </>
                )}
            />
            <Divider sx={{ my: 2, borderStyle: 'solid', borderWidth: 1 }} />
            <Box sx={{ textAlign: "end" }}>
                Tổng giá trị:
                <Typography 
                    ml={2}
                    variant="h5" 
                    component='span'
                    color="error"
                >
                    {formatMoney(totalPrice)}
                </Typography>
            </Box>
        </>
    );
}

export default ProductForm;