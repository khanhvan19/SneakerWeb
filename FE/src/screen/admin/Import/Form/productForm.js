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

function ProductForm({ data, handleChange, setFieldValue }) {
    const employee = useSelector((state) => state.auth?.login?.data);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axiosPrivate
        .get("product/", { headers: { token: employee?.accessToken} })
        .then((res) => { 
            var newResult = []
            res.forEach(item => newResult.push({
                ...item, 
                name: item.sample.name + ' - ' + item.colorName
            }));
            setProducts(newResult)
        })
        .catch((err) => { console.log(err) })
    }, [employee])

    const totalPrice = useMemo(() => {
        const result = data.reduce((result, product) => {
            return result + (product.price * product.sizes.reduce((count, size) => {
                return count + size.quantity
            }, 0));
        }, 0)
        return result;
    }, [data])

    const findSizes = (id) => {
        var sizes = [];
        if(products.length !== 0) {
            const product = products.find(product => product._id === id)
            product.sizes.forEach(size => sizes.push({
                value: size.code, 
                label: size.label,
            }));
        }
        return sizes
    }

    return (
        <>
            <FieldArray
                name="products"
                render={(arrayHelpers) => (
                    <>
                        <Box sx={{ textAlign: "end" }}>
                            <Button 
                                size="large"
                                variant="outlined"
                                color="btnSuccess"
                                startIcon={<AddToPhotosOutlined />}
                                sx={{ mb: 2, textTransform: "none" }}
                                onClick={() => arrayHelpers.push({
                                    product: '',
                                    price: '', 
                                    sizes: [{ code: '', quantity: '' }], 
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
                                                    setFieldValue(`products.${index}.sizes`, [{ code: '', quantity: '' }]);
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
                                            />
                                        </Grid>
                                        <Grid xs={12}>
                                            <FieldArray 
                                                name={`products[${index}].sizes`}
                                                render={(childArrayHelpers) => (
                                                    <>
                                                        {item?.sizes?.map((size, idx) => (
                                                            <Grid container py={0} key={idx}>
                                                                <Grid xs={3}>
                                                                    <Field
                                                                        name={`products[${index}].sizes[${idx}].code`}
                                                                        component={SelectField}
                                                                        options={item.product ? findSizes(item.product) : []}
                                                                        label="Size"
                                                                        size="small"
                                                                    />
                                                                </Grid>
                                                                <Grid xs={3}>
                                                                    <FastField
                                                                        name={`products[${index}].sizes[${idx}].quantity`}
                                                                        component={TextField}
                                                                        label="Số lượng"
                                                                        type="number"
                                                                        endLabel="SP"
                                                                        size="small"
                                                                    />
                                                                </Grid>
                                                                <Grid xs={4} className="content-right-center">
                                                                    { formatMoney(item.price * size.quantity) }
                                                                </Grid>
                                                                <Grid xs={2} className="content-right-center" sx={{ pr: 0 }}>
                                                                    <ButtonGroup variant="outlined">
                                                                        <Button 
                                                                            color="btnError" sx={{ px: 1 }}
                                                                            onClick={() => childArrayHelpers.remove(idx)}
                                                                        >
                                                                            <Remove />
                                                                        </Button>
                                                                        <Button
                                                                            color="btnSuccess" sx={{ px: 1 }}
                                                                            onClick={() => childArrayHelpers.push({code: '', quantity: ''})}
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