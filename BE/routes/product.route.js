const express = require('express');
const productController = require('../controllers/product.controller');
const router = express.Router();

const { FIELD_IMAGE } = require('../constants/product')
const { verifyAccessToken } = require('../middlewares/jwt-verify')
const { uploadCloudProduct } = require('../middlewares/uploaderImage')

router.route('/')
    .get(verifyAccessToken, productController.getAll)
    .post(
        uploadCloudProduct.fields(
            FIELD_IMAGE.map((item) => ({name: item, maxCount: 1}))
        ), 
        productController.create
    );

router.route('/:id')
    .get(productController.getOneProduct)
    .delete(productController.deleteOneProduct)
    .put(
        uploadCloudProduct.fields(
            FIELD_IMAGE.map((item) => ({name: item, maxCount: 1}))
        ), 
        productController.updateOneProduct
    );

router.route('/hide/:id')
    .put(productController.toggleStatus);

module.exports = router;
