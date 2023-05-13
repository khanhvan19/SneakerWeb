const express = require('express');
const versionController = require('../controllers/version.controller');
const router = express.Router();

const { FIELD_IMAGE } = require('../constants/product')
const { verifyAccessToken } = require('../middlewares/jwt-verify')
const { uploadCloudProduct } = require('../middlewares/uploaderImage')

router.route('/')
    // .get(verifyAccessToken, versionController.getAll)
    .post(
        uploadCloudProduct.fields(
            FIELD_IMAGE.map((item) => ({name: item, maxCount: 1}))
        ), 
        versionController.create
    );

router.route('/of-product')
    .get(versionController.getVersionsByProduct)

router.route('/:id')
    .get(versionController.getOneVersion)
    .delete(versionController.deleteOneVersion)
    .put(
        uploadCloudProduct.fields(
            FIELD_IMAGE.map((item) => ({name: item, maxCount: 1}))
        ), 
        versionController.updateOneVersion
    );

router.route('/hide/:id')
    .put(versionController.toggleStatus);

module.exports = router;
